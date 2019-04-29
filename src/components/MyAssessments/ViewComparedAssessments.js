import React, { Component } from 'react';
import { Typography, Paper, FormHelperText, Divider } from '@material-ui/core';
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

const ASSESSMENT_SOFTSKILLS_RATES_QUERY = gql`
  query assessmentSoftSkillsRates($id: ID!){
    assessmentSoftSkillsRates(id: $id) {
      skillName
      skillRate
    }
  }
`;

class ViewComparedAssessments extends Component {
  constructor(props) {
    super();
    this.state = {
      loadingQuery: true,
      hardAxesNames: [],
      softAxesNames: [],
      firstHardAxesValues: [],
      secondHardAxesValues: [],
      firstSoftAxesValues: [],
      secondSoftAxesValues: [],
      openJobDialog: false,
    };

    this.fetchFirstHardAssessment(props);
    this.fetchSecondHardAssessment(props);
    this.fetchFirstSoftSkills(props);
    this.fetchSecondSoftSkills(props);
  };

  fetchFirstHardAssessment = async (props) => {
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
      hardAxesNames: names,
      firstHardAxesValues: values,
      loadingQuery: false,
    });
  };

  fetchSecondHardAssessment = async (props) => {
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

  fetchFirstSoftSkills = async (props) => {
    const { client, firstId } = props;
    const { data } = await client.query({
      query: ASSESSMENT_SOFTSKILLS_RATES_QUERY,
      variables: { "id": firstId },
      fetchPolicy: "no-cache"
    });

    var names = [];
    var values = [];

    data.assessmentSoftSkillsRates.forEach(rate => {
      names.push(rate.skillName);
      values.push(rate.skillRate);
    });

    this.setState({
      softAxesNames: names,
      firstSoftAxesValues: values,
      loadingQuery: false,
    });
  };

  fetchSecondSoftSkills = async (props) => {
    const { client, secondId } = props;
    const { data } = await client.query({
      query: ASSESSMENT_SOFTSKILLS_RATES_QUERY,
      variables: { "id": secondId },
      fetchPolicy: "no-cache"
    });

    var values = [];

    data.assessmentSoftSkillsRates.forEach(rate => {
      values.push(rate.skillRate);
    });

    this.setState({
      secondSoftAxesValues: values,
      loadingQuery: false,
    });
  };

  render() {
    const { classes } = this.props;
    const { hardAxesNames, softAxesNames, firstHardAxesValues, secondHardAxesValues, firstSoftAxesValues, secondSoftAxesValues, loadingQuery } = this.state;

    const hardData = {
      labels: hardAxesNames,
      datasets: [
        {
          label: "Assessment initial",
          backgroundColor: fade(theme.palette.primary.main, 0.2),
          borderColor: theme.palette.primary.main,
          pointBackgroundColor: theme.palette.primary.main,
          pointBorderColor: theme.palette.primary.light,
          pointHoverBackgroundColor: theme.palette.primary.dark,
          pointHoverBorderColor: theme.palette.primary.light,
          data: firstHardAxesValues
        },
        {
          label: "Second Assessment",
          backgroundColor: fade(theme.palette.secondary.main, 0.2),
          borderColor: theme.palette.secondary.main,
          pointBackgroundColor: theme.palette.secondary.main,
          pointBorderColor: theme.palette.secondary.light,
          pointHoverBackgroundColor: theme.palette.secondary.dark,
          pointHoverBorderColor: theme.palette.secondary.light,
          data: secondHardAxesValues,
        }
      ]
    };

    const hardOptions = {
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

    const softData = {
      labels: softAxesNames,
      datasets: [
        {
          label: "Assessment initial",
          backgroundColor: fade(theme.palette.primary.main, 0.2),
          borderColor: theme.palette.primary.main,
          pointBackgroundColor: theme.palette.primary.main,
          pointBorderColor: theme.palette.primary.light,
          pointHoverBackgroundColor: theme.palette.primary.dark,
          pointHoverBorderColor: theme.palette.primary.light,
          data: firstSoftAxesValues,
          lineTension: 0.5
        },
        {
          label: "Second Assessment",
          backgroundColor: fade(theme.palette.secondary.main, 0.2),
          borderColor: theme.palette.secondary.main,
          pointBackgroundColor: theme.palette.secondary.main,
          pointBorderColor: theme.palette.secondary.light,
          pointHoverBackgroundColor: theme.palette.secondary.dark,
          pointHoverBorderColor: theme.palette.secondary.light,
          data: secondSoftAxesValues,
          lineTension: 0.5
        }
      ]
    };

    const softOptions = {
      responsive: true,
      legend: {
        display: false,
      },
      scale: {
        gridLines: {
          circular: true,
        },
        angleLines: {
          "color": "white",
        },
        ticks: {
          beginAtZero: true,
          stepSize: 1,
          max: 5,
          display: false,
        },
        pointLabels: {
          display: false
        }
      },
      maintainAspectRatio: false,
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            var amount = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            return " " + amount + " / 5";
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
            <div className={classes.skillTitle}>
                <Typography variant="h6" component="h4" className={classes.skillType}>
                  Hard Skills
                </Typography>
              </div>
              <div className={classes.canvasContainer}>
                <Radar data={hardData} options={hardOptions} />
              </div>
              <Divider />
              <div className={classes.skillTitle}>
                <Typography variant="h6" component="h4" className={classes.skillType}>
                  Soft Skills
                </Typography>
              </div>
              <div className={classes.canvasContainer}>
                <Radar data={softData} options={softOptions} />
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