import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Typography, FormHelperText } from '@material-ui/core';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';

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

const DELETE_ASSESSMENT = gql`
  mutation deleteAssessment($id: ID!){
    deleteAssessment(id: $id) {
      id
      createdAt
      job {
        name
      }
    }
  }
`;

class MyAssessments extends Component {
  constructor(props) {
    super();
    this.state = {
      loadingQuery: true,
      myAssessments: [],
    };

    this.fetchMyAssessments(props);
  };

  async fetchMyAssessments(props) {
    const { client } = props;
    const { data } = await client.query({
      query: MY_ASSESSMENTS_QUERY,
      variables: {"limit" : 5},
      fetchPolicy: "no-cache"
    });

    this.setState({
      myAssessments: data.myAssessments,
      loadingQuery: false,
    });
  };

  handleError = error => {
    console.log(error);
    return <FormHelperText>Action impossible</FormHelperText>;
  };

  handleRemove = (id) => {
    const { client } = this.props;

    client.mutate({
      mutation: DELETE_ASSESSMENT,
      variables: { id : id }
    }).then(() => {
      this.fetchMyAssessments(this.props);
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    const { classes } = this.props;
    const { myAssessments, loadingQuery } = this.state;

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
        {loadingQuery && (
          <FormHelperText>Chargement...</FormHelperText>
        )}
        {myAssessments && (
          <div className={classes.layout}>
            {myAssessments.map(assessment => {
              return <AssessmentSummary assessment={assessment} key={assessment.id} handleRemove={this.handleRemove} />
            })}
          </div>
        )}
      </>
    );
  }
}

export default withStyles(myAssessmentStyles)(withApollo(MyAssessments));
