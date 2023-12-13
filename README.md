# Running Backend APIs

To run the GraphQL server APIs, follow these steps:

```bash
# Navigate to the `apis` directory
cd apis

# Install the required dependencies
npm install

# Start the API server
node index.js

The GraphQL server APIs will run on http://localhost:4000.

# Running UI

# Navigate to the `ui-app` directory
cd ui-app

# Install the required dependencies
npm install

# Open `src/App.js` and ensure that the ApolloClient is configured correctly
const client = new ApolloClient({
  uri: 'http://localhost:4000/', // Replace with your GraphQL endpoint
  cache: new InMemoryCache(),
});

# Start the UI application
npm start

The app will be accessible at http://localhost:3000.

