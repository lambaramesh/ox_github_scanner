const { ApolloServer, gql } = require('apollo-server');
const { Octokit } = require('@octokit/rest');
const YAML = require('js-yaml');
const fetch = require('node-fetch');


const octokit = new Octokit({
    auth: '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',
    request: { fetch },
});


const OWNER = 'lambaramesh';


const typeDefs = gql`
scalar JSON

  type Repository {
    name: String
    size: Int
    owner: String
    private: Boolean
  }

  type RepositoryDetail {
    name: String
    size: Int
    owner: String
    private: Boolean
    numFiles: Int
    yamlFileContent: JSON
    activeWebhooks: Int
  }

  type RepositoryYmlContent {
    repoName: String
    ymlContent: String
  }

  type Query {
    listRepositories: [Repository]
    getRepositoryDetails(repoName: String!): RepositoryDetail
    getRepositoryYmlContent(repoName: String!): RepositoryYmlContent
  }
`;

const resolvers = {
    Query: {
        listRepositories: async () => {
            try {
                const response = await octokit.repos.listForUser({
                    username: OWNER
                });
                return response.data.map(repo => ({
                    name: repo.name,
                    size: repo.size,
                    owner: repo.owner.login,
                    private: repo.private,
                }));
            } catch (error) {
                console.error('Error fetching repositories:', error.response?.data || error.message);
                throw new Error('Failed to fetch repositories');
            }
        },
        getRepositoryDetails: async (_, { repoName }) => {
            try {
                const repoResponse = await octokit.repos.get({
                    owner: OWNER,
                    repo: repoName,
                });

                const contentResponse = await octokit.repos.getContent({
                    owner: OWNER,
                    repo: repoName,
                    path: '',
                });

                const numFiles = contentResponse?.data?.length;

                const activeWebhooks = await octokit.repos.listWebhooks({
                    owner: OWNER,
                    repo: repoName,
                });

                const yamlFileContent = await scanRepoForYamlFiles(repoName);

                console.log('yamlFileContent ------ ', yamlFileContent);

                return {
                    name: repoResponse.data.name,
                    size: repoResponse.data.size,
                    owner: repoResponse.data.owner.login,
                    private: repoResponse.data.private,
                    numFiles,
                    yamlFileContent,
                    activeWebhooks: activeWebhooks.data.length,
                };
            } catch (error) {
                console.error('Error fetching repository details:', error.response?.data || error.message);
                throw new Error('Failed to fetch repository details', error.response?.data || error.message);
            }
        },
    },
};

async function scanRepoForYamlFiles(repo, path = '') {
    try {
        const { data: contents } = await octokit.repos.getContent({
            owner: OWNER,
            repo,
            path,
        });

        for (const item of contents) {
            if (item.type === 'file' && item.name.endsWith('.yml')) {
                console.log(`YAML File found in ${OWNER}/${repo}/${path}: ${item.path}`);
                const yamlData = await processYamlFile(repo, item.path);
                return yamlData;
            } else if (item.type === 'dir') {
                console.log(`Entering directory: ${item.path}`);
                const nestedYamlData = await scanRepoForYamlFiles(repo, `${path}/${item.name}`);
                if (nestedYamlData.length > 0) {
                    return nestedYamlData; // Return if YAML file is found in the nested directory
                }
            }
        }

        return []; // Return an empty array if no YAML file is found in the current directory

    } catch (error) {
        console.error(`Error fetching repository contents for ${OWNER}/${repo}/${path}:`, error.message);
        return []; // Return an empty array in case of an error
    }
}


async function processYamlFile(repo, path) {
    try {
        const { data: fileContent } = await octokit.repos.getContent({
            owner: OWNER,
            repo,
            path,
        });

        const decodedContent = Buffer.from(fileContent.content, 'base64').toString('utf-8');
        const yamlData = YAML.load(decodedContent);

        // Process the YAML data here
        console.log(`  YAML Content of ${OWNER}/${repo}/${path}:`, yamlData);

        return [{
            file: `${OWNER}/${repo}/${path}`,
            file_content: yamlData
        }];

    } catch (error) {
        console.error(`Error fetching YAML file content for ${OWNER}/${repo}/${path}:`, error.message);
    }
}


const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});
