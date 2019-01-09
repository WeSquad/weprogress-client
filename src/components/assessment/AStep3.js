import React, { Component } from 'react';
import { Button, Typography, FormHelperText, Grid, Paper, List, ListItem } from '@material-ui/core';
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';
import { assessmentStyles } from '../../styles/Wetheme';
import { Radar } from 'react-chartjs';

class AStep3 extends Component {
  constructor(props) {
    super();

    this.handleComplete(props);
  }

  async handleComplete(props) {
    props.handleComplete();
  }

  handleError = error => {
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

    var data = {
      labels: ["Les bases du PO", "Product Growth", "Product UX", "Product Strategist", "Product Mobile", "Agiliste Wemanity", "Frameworks Agile", "Les savoirs être Wemanity"],
      datasets: [
        {
          label: "Mon Assessment",
          fillColor: "rgba(245,0,87,0.2)",
          strokeColor: "rgba(245,0,87,1)",
          pointColor: "rgba(179,0,64,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(245,0,87,1)",
          data: [90, 40, 40, 40, 80, 85, 60, 90]
        }
      ]
    };

    return (
      <div>
        <>
          <Typography variant="h5" component="h3" className={classes.jobTitle}>
            Vos Résultats!
          </Typography>
          <Paper className={classes.paper}>
            <Radar data={data} width="800" height="506" />
          </Paper>
        </>
      </div>
    );
  }
}

export default withStyles(assessmentStyles)(withSnackbar(AStep3));
