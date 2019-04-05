import React, { Component } from 'react';
import { Typography, Paper, FormHelperText, Button, Divider } from '@material-ui/core';
import { Share as ShareIcon, Edit as EditIcon } from '@material-ui/icons';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { Link } from 'react-router-dom';
import { Radar} from 'react-chartjs-2';
import { withStyles } from '@material-ui/core/styles';
import { withApollo } from 'react-apollo';
import { withSnackbar } from 'notistack';
import gql from 'graphql-tag';
import assessmentStyles from '../MakeAssessment/MakeAssessment.styles';
import { theme } from '..';
import ShareAssessment from './ShareAssessment';

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

class ViewAssessment extends Component {
  constructor(props) {
    super();
    this.state = {
      loadingQuery: true,
      hardAxesNames: [],
      hardAxesValues: [],
      softAxesNames: [],
      softAxesValues: [],
      openJobDialog: false,
    };

    this.fetchRates(props);
    this.fetchSoftSkills(props);
  };

  fetchRates = async (props) => {
    const { client, id } = props;
    const { data } = await client.query({
      query: ASSESSMENT_RATES_QUERY,
      variables: { "id": id },
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
      hardAxesValues: values,
      loadingQuery: false,
    });
  };

  fetchSoftSkills = async (props) => {
    const { client, id } = props;
    const { data } = await client.query({
      query: ASSESSMENT_SOFTSKILLS_RATES_QUERY,
      variables: { "id": id },
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
      softAxesValues: values,
      loadingQuery: false,
    });
  };

  handleDialogOpen = () => {
    this.setState({"openJobDialog": true});
  }

  handleDialogClose = () => {
    this.setState({"openJobDialog": false});
  }

  handleDialogSend = () => {
    this.props.enqueueSnackbar('Assessment partagé', {variant: 'success'});
    this.setState({"openJobDialog": false});
  }

  handleDialogError = (error) => {
    if (error.graphQLErrors[0]) {
      this.props.enqueueSnackbar(error.graphQLErrors[0].message, {
        variant: 'error',
      });
    } else {
      this.props.enqueueSnackbar('Problème technique', {
        variant: 'error',
      });
    }
  };

  render() {
    const { classes } = this.props;
    const { hardAxesNames, hardAxesValues, softAxesNames, softAxesValues, loadingQuery } = this.state;

    const hardData = {
      labels: hardAxesNames,
      datasets: [
        {
          label: "Hard skills",
          backgroundColor: fade(theme.palette.secondary.main, 0.2),
          borderColor: theme.palette.secondary.main,
          pointBackgroundColor: theme.palette.secondary.main,
          pointBorderColor: theme.palette.secondary.light,
          pointHoverBackgroundColor: theme.palette.secondary.dark,
          pointHoverBorderColor: theme.palette.secondary.light,
          data: hardAxesValues
        }
      ]
    };


    const softData = {
      labels: softAxesNames,
      datasets: [
        {
          label: "Soft skills",
          backgroundColor: fade(theme.palette.primary.main, 0.2),
          borderColor: theme.palette.primary.main,
          pointBackgroundColor: theme.palette.primary.main,
          pointBorderColor: theme.palette.primary.light,
          pointHoverBackgroundColor: theme.palette.primary.dark,
          pointHoverBorderColor: theme.palette.primary.light,
          data: softAxesValues,
          lineTension: 0.5
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
              Mon assessment
            </Typography>
            <Paper className={classes.paper}>
              <div className={classes.actionsContainer}>
                <Button color="secondary" variant="contained" className={classes.actionsButton} component={({...props}) => <Link to={"/editassessment/" + this.props.id} {...props} />}>
                  <EditIcon /> Editer l'assessment
                </Button>
                <Button color="primary" variant="contained" className={classes.actionsButton} onClick={this.handleDialogOpen}>
                  <ShareIcon /> Partager l'assessment
                </Button>
                <ShareAssessment open={this.state.openJobDialog} handleClose={this.handleDialogClose} handleSend={this.handleDialogSend} handleDialogError={this.handleDialogError} assessmentId={this.props.id} />
              </div>
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

export default withSnackbar(withStyles(assessmentStyles)(withApollo(ViewAssessment)));
