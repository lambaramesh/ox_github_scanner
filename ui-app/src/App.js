// src/App.js
import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Routes instead of Switch
import List from './components/List';
import Detail from './components/Detail';

const client = new ApolloClient({
  uri: 'http://localhost:4000/', // Replace with your GraphQL endpoint
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/" element={<List />} />
          <Route path="/detail/:repoName" element={<Detail />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;
