import React, { Component } from 'react';
import { Typography, Paper, FormHelperText, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { Link } from 'react-router-dom';
import { Radar } from 'react-chartjs-2';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import assessmentStyles from '../MakeAssessment/MakeAssessment.styles';
import { theme } from '..';

const ASSESSMENT_RATES_QUERY = gql`
  query assessmentRates($id: ID!){
    assessmentRates(id: $id) {
      name
      skillsTotal
      skillsCount
      axePourcent
    }
  }
`;

class ViewAssessment extends Component {
  constructor(props) {
    super();
    this.state = {
      loadingQuery: true,
      axesNames: [],
      axesValues: []
    };

    this.fetchRates(props);
  };

  async fetchRates(props) {
    const { client, id } = props;
    const { data } = await client.query({
      query: ASSESSMENT_RATES_QUERY,
      variables: { "id": id },
      fetchPolicy: "no-cache"
    });

    var names = [];
    var values = [];

    data.assessmentRates.forEach(rate => {
      names.push(rate.name);
      values.push(rate.axePourcent.toFixed(1));
    });

    this.setState({
      axesNames: names,
      axesValues: values,
      loadingQuery: false,
    });
  };

  render() {
    const { classes } = this.props;
    const { axesNames, axesValues, loadingQuery } = this.state;

    const data = {
      labels: axesNames,
      datasets: [
        {
          label: "Mon Assessment",
          backgroundColor: fade(theme.palette.secondary.main, 0.2),
          borderColor: theme.palette.secondary.main,
          pointBackgroundColor: theme.palette.secondary.main,
          pointBorderColor: theme.palette.secondary.light,
          pointHoverBackgroundColor: theme.palette.secondary.dark,
          pointHoverBorderColor: theme.palette.secondary.light,
          data: axesValues
        }
      ]
    };

    const options = {
      responsive: true,
      legend: {
        position: 'bottom',
      },
      scale: {
        ticks: {
          beginAtZero: true,
          max: 100
        }
      },
      maintainAspectRatio: false
    };

    return (
      <div>
        {loadingQuery? (
          <FormHelperText>Chargement...</FormHelperText>
        ) : (
          <div>
            <Typography variant="h5" component="h3" className={classes.jobTitle}>
              Vos Résultats!
            </Typography>
            <Paper className={classes.paper}>
              <div className={classes.canvasContainer}>
                <Button color="secondary" variant="contained" component={({...props}) => <Link to={"/editassessment/" + this.props.id} {...props} />}>
                  Editer cet auto-évaluation
                </Button>
                <Radar data={data} options={options} />
              </div>
            </Paper>
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(assessmentStyles)(withApollo(ViewAssessment));
