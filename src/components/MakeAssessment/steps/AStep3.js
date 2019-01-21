import React, { Component } from 'react';
import { Typography, Paper, FormHelperText } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Radar } from 'react-chartjs-2';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import assessmentStyles from '../MakeAssessment.styles';
import { theme } from '../..';
import { fade } from '@material-ui/core/styles/colorManipulator';

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

class AStep3 extends Component {
  constructor(props) {
    super();
    this.state = {
      loadingQuery: true,
      axesNames: [],
      axesValues: []
    };

    this.fetchRates(props);
    this.handleComplete(props);
  };

  async fetchRates(props) {
    const { assessmentId, client } = props;
    const { data } = await client.query({
      query: ASSESSMENT_RATES_QUERY,
      variables: { 'id': assessmentId }
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

  async handleComplete(props) {
    props.handleComplete();
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
              <div class={classes.canvasContainer}>
                <Radar data={data} options={options} />
              </div>
            </Paper>
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(assessmentStyles)(withApollo(AStep3));
