import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import myAssessmentStyles from './MyAssessments.styles';
import { AUTH_USERID, AUTH_TOKEN } from '../../constants';
import { Button, Typography, Grid, Card, CardContent, CardActions } from '@material-ui/core';
import gql from 'graphql-tag';
import classNames from 'classnames';
import { withSnackbar } from 'notistack';
import { withApollo } from 'react-apollo';

const MY_ASSESSMENTS_QUERY = gql`
  query assessmentsByUser($userId: ID!, $limit: Float){
    assessmentsByUser(userId: $userId, limit: $limit) {
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
      assessments: [],
    };

    this.fetchMyAssessments(props);
  };

  async fetchMyAssessments(props) {
    if (sessionStorage.getItem(AUTH_TOKEN)) {
      const { client } = props;
      const { data } = await client.query({
        query: MY_ASSESSMENTS_QUERY,
        variables: { "userId": sessionStorage.getItem(AUTH_USERID), "limit": 3 },
        fetchPolicy: "no-cache"
      });

      this.setState({
        assessments: data.assessmentsByUser,
        loadingQuery: false,
      });
    }
  };

  render() {
    const { classes } = this.props;
    const { assessments } = this.state;

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
        <div className={classNames(classes.layout, classes.cardGrid)}>
          <Grid container spacing={40}>
            {assessments.map(assessment => {
              let date = new Date(assessment.createdAt);
              let formattedDate = date.toLocaleDateString("fr-FR");
              let hourMinutes = `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;

              return (
              <Grid item key={assessment.id} sm={6}>
                <Card className={classes.card}>
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Assessment de {assessment.job.name}
                    </Typography>
                    <Typography>
                      Le {formattedDate} à {hourMinutes}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary" variant="contained" component={({...props}) => <Link to={"/viewassessment/" + assessment.id} {...props} />}>
                      Afficher
                    </Button>
                    <Button size="small" variant="contained" component={({...props}) => <Link to={"/editassessment/" + assessment.id} {...props} />}>
                      Éditer
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              )
            })}
          </Grid>
        </div>
      </>
    );
  }
}

export default withStyles(myAssessmentStyles)(withSnackbar(withApollo(MyAssessments)));
