import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Typography, FormHelperText } from '@material-ui/core';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import myAssessmentStyles from './MyAssessments.styles';
import AssessmentSummary from './AssessmentSummary';

const MY_ASSESSMENTS_QUERY = gql`
  query myAssessments($limit: Float){
    myAssessments(limit: $limit) {
      id
      createdAt
      job {
        name
      }
    }
  }
`;

class MyAssessments extends Component {
  handleError = error => {
    console.log(error);
    return <FormHelperText>Action impossible</FormHelperText>;
  };

  render() {
    const { classes } = this.props;

    return (
      <>
        <div className={classes.heroUnit}>
          <div className={classes.heroContent}>
            <Typography component="h1" variant="h3" align="center" color="textPrimary" gutterBottom>
              Mes auto-évaluations
            </Typography>
            <Typography variant="subtitle2" align="center" color="textSecondary" paragraph>
              Vous trouvez dans cet espace vos anciennes auto-évaluation. Vous pouvez les éditer en cas d'erreur
              mais pour mesure une progression nous vous conseiller d'en réaliser une nouvelle tous les 6 mois.
            </Typography>
          </div>
        </div>
        <Query query={MY_ASSESSMENTS_QUERY} variables={{"limit" : 5}} fetchPolicy="no-cache" partialRefetch="true">
          {({ loading, error, data }) => {
            if (error) {
              return this.handleError(error);
            }
            if (loading) return <FormHelperText>Chargement...</FormHelperText>;

            return (
              <div className={classes.layout}>
              {data.myAssessments.map(assessment => {
                return <AssessmentSummary assessment={assessment} key={assessment.id} />
              })}
              </div>
            );
          }}
        </Query>
      </>
    );
  }
}

export default withStyles(myAssessmentStyles)(MyAssessments);
