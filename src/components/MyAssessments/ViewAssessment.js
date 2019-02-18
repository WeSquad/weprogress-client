import React, { Component } from 'react';
import { Typography, Paper, FormHelperText, Button } from '@material-ui/core';
import { Share as ShareIcon, Edit as EditIcon } from '@material-ui/icons';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { Link } from 'react-router-dom';
import { Radar } from 'react-chartjs-2';
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
    }
  }
`;

class ViewAssessment extends Component {
  constructor(props) {
    super();
    this.state = {
      loadingQuery: true,
      axesNames: [],
      axesValues: [],
      openJobDialog: false,
    };

    this.fetchRates(props);
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
      names.push(rate.name);
      values.push(rate.axePourcent.toFixed(1));
    });

    this.setState({
      axesNames: names,
      axesValues: values,
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
                <div className={classes.actionsContainer}>
                  <Button color="secondary" variant="contained" className={classes.actionsButton} component={({...props}) => <Link to={"/editassessment/" + this.props.id} {...props} />}>
                    <EditIcon /> Editer l'assessment
                  </Button>
                  <Button color="primary" variant="contained" className={classes.actionsButton} onClick={this.handleDialogOpen}>
                    <ShareIcon /> Partager l'assessment
                  </Button>
                  <ShareAssessment open={this.state.openJobDialog} handleClose={this.handleDialogClose} handleSend={this.handleDialogSend} handleDialogError={this.handleDialogError} assessmentId={this.props.id} />
                </div>
                <Radar data={data} options={options} />
              </div>
            </Paper>
          </div>
        )}
      </div>
    );
  }
}

export default withSnackbar(withStyles(assessmentStyles)(withApollo(ViewAssessment)));
