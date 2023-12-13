// src/components/Detail.js
import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';

const GET_REPOSITORY_DETAILS = gql`
  query GetRepositoryDetails($repoName: String!) {
    getRepositoryDetails(repoName: $repoName) {
      name
      size
      owner
      private
      numFiles
      yamlFileContent 
      activeWebhooks
    }
  }
`;

function Detail() {
  const { repoName } = useParams();
  const { loading, error, data } = useQuery(GET_REPOSITORY_DETAILS, {
    variables: { repoName },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const repository = data.getRepositoryDetails;

  return (
    <div>
      <h2>Repository Detail</h2>
      <p>Name: {repository.name}</p>
      <p>Size: {repository.size}</p>
      <p>Owner: {repository.owner}</p>
      <p>Private: {repository.private ? 'Yes' : 'No'}</p>
      <p>Number of Files: {repository.numFiles}</p>
      <p>Active Webhooks: {repository.activeWebhooks}</p>

      <h3>YAML File Content:</h3>
      <pre>{JSON.stringify(repository.yamlFileContent, null, 2)}</pre>
    </div>
  );
}

export default Detail;
