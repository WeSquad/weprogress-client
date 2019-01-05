import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const ME_QUERY = gql`
  {
    me {
      id
      jobs {
        id
        name
      }
    }
  }
`;


class MakeAssessment extends Component {
  render() {
    return (
      <Query query={ME_QUERY}>
        {({ loading, error, data }) => {
          if (loading) return "Chargement...";
          if (error) return `Error! ${error.message}`;

          if (data.me.job === null) {
            return (
              <div>Aucun job détecté. Merci de remplir votre profil</div>
            );
          }

          return (
            <div>Votre job: {data.me.jobs[0].name}</div>
          );
        }}
      </Query>
    );
  }
}

export default MakeAssessment;
