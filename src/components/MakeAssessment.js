import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Typography } from '@material-ui/core';
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
  state = {
    chosenJobId: 0,
  };

  render() {
    const { chosenJobId } = this.state;

    return (
      <div>
        <Typography variant="h4" gutterBottom component="h2">
          M'auto-évaluer
        </Typography>
        <Query query={ME_QUERY}>
          {({ loading, error, data }) => {
            if (loading) return "Chargement...";
            if (error) return `Error! ${error.message}`;

            return (
                <div>Aucun job défini. Merci de remplir votre profil et préciser quel job vous voulez évaluer.</div>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default MakeAssessment;
