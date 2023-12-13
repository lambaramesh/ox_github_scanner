// src/components/List.js
import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';

const LIST_REPOSITORIES = gql`
  query ListRepositories {
    listRepositories {
      name
      size
      owner
      private
    }
  }
`;

function List() {
  const { loading, error, data } = useQuery(LIST_REPOSITORIES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const repositories = data.listRepositories;

  return (
    <div>
      <h2>Repository List</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Size</th>
            <th>Owner</th>
            <th>Private</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {repositories.map((repository) => (
            <tr key={repository.name}>
              <td>{repository.name}</td>
              <td>{repository.size}</td>
              <td>{repository.owner}</td>
              <td>{repository.private ? 'Yes' : 'No'}</td>
              <td>
                <Link to={`/detail/${repository.name}`}>View Details</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default List;
