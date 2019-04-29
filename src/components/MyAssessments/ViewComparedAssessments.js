import React, { Component } from 'react';
import { Typography, Paper, FormHelperText } from '@material-ui/core';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { Radar} from 'react-chartjs-2';
import { withStyles } from '@material-ui/core/styles';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import assessmentStyles from '../MakeAssessment/MakeAssessment.styles';
import { theme } from '..';
import PropTypes from 'prop-types';

const ASSESSMENT_RATES_QUERY = gql`
  query assessmentRates($id: ID!){
    assessmentRates(id: $id) {
      name
      skillsTotal
      skillsCount
      axePourcent
      type
    }
  }
`;

class ViewComparedAssessments extends Component {
  constructor(props) {
    super();
    this.state = {
      loadingQuery: true,
      axesNames: [],
      firstHardAxesValues: [],
      secondHardAxesValues: [],
      openJobDialog: false,
    };

    this.fetchFirstAssessment(props);
    this.fetchSecondAssessment(props);
  };

  fetchFirstAssessment = async (props) => {
    const { client, firstId } = props;
    const { data } = await client.query({
      query: ASSESSMENT_RATES_QUERY,
      variables: { "id": firstId },
      fetchPolicy: "no-cache"
    });

    var names = [];
    var values = [];

    data.assessmentRates.forEach(rate => {
      if (rate.type === "hardSkills") {
        names.push(rate.name);
        values.push(rate.axePourcent.toFixed(1));
      }
    });

    this.setState({
      axesNames: names,
      firstHardAxesValues: values,
      loadingQuery: false,
    });
  };

  fetchSecondAssessment = async (props) => {
    const { client, secondId } = props;
    const { data } = await client.query({
      query: ASSESSMENT_RATES_QUERY,
      variables: { "id": secondId },
      fetchPolicy: "no-cache"
    });

    var values = [];

    data.assessmentRates.forEach(rate => {
      if (rate.type === "hardSkills") {
        values.push(rate.axePourcent.toFixed(1));
      }
    });

    this.setState({
      secondHardAxesValues: values,
      loadingQuery: false,
    });
  };

  render() {
    const { classes } = this.props;
    const { axesNames, firstHardAxesValues, secondHardAxesValues, loadingQuery } = this.state;

    const data = {
      labels: axesNames,
      datasets: [
        {
          label: "Assessment initial",
          backgroundColor: fade(theme.palette.secondary.main, 0.2),
          borderColor: theme.palette.secondary.main,
          pointBackgroundColor: theme.palette.secondary.main,
          pointBorderColor: theme.palette.secondary.light,
          pointHoverBackgroundColor: theme.palette.secondary.dark,
          pointHoverBorderColor: theme.palette.secondary.light,
          data: firstHardAxesValues
        },
        {
          label: "Second Assessment",
          backgroundColor: fade(theme.palette.primary.main, 0.2),
          borderColor: theme.palette.primary.main,
          pointBackgroundColor: theme.palette.primary.main,
          pointBorderColor: theme.palette.primary.light,
          pointHoverBackgroundColor: theme.palette.primary.dark,
          pointHoverBorderColor: theme.palette.primary.light,
          data: secondHardAxesValues,
        }
      ]
    };

    const options = {
      responsive: true,
      legend: {
        display: false,
      },
      scale: {
        ticks: {
          beginAtZero: true,
          max: 100
        },
        pointLabels: {
          fontSize: 14,
          fontStyle: "bold"
        }
      },
      maintainAspectRatio: false,
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            var amount = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            return " " + amount + "%";
          }
        }
      }
    };

    return (
      <div>
        {loadingQuery? (
          <FormHelperText>Chargement...</FormHelperText>
        ) : (
          <div>
            <Typography variant="h5" component="h3" className={classes.jobTitle}>
              Comparatif de mes assessments
            </Typography>
            <Paper className={classes.paper}>
              <div className={classes.canvasContainer}>
                <Radar data={data} options={options} />
              </div>
            </Paper>
          </div>
        )}
      </div>
    );
  }
}

ViewComparedAssessments.propTypes = {
  firstId: PropTypes.string,
  secondId: PropTypes.string,
}

export default withStyles(assessmentStyles)(withApollo(ViewComparedAssessments));