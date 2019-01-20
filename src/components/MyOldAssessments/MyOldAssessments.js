import React, { Component } from 'react';
import { Typography, Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Radar } from 'react-chartjs-2';
import assessmentStyles from '../MakeAssessment/MakeAssessment.styles';
import { theme } from '..';
import { fade } from '@material-ui/core/styles/colorManipulator';

class MyOldAssessments extends Component {
  render() {
    const { classes } = this.props;

    const data = {
      labels: ["Les bases du PO", "Product Growth", "Product UX", "Product Strategist", "Product Mobile", "Agiliste Wemanity", "Frameworks Agile", "Les savoirs être Wemanity"],
      datasets: [
        {
          label: "Mon Assessment",
          backgroundColor: fade(theme.palette.secondary.main, 0.2),
          borderColor: theme.palette.secondary.main,
          pointBackgroundColor: theme.palette.secondary.main,
          pointBorderColor: theme.palette.secondary.light,
          pointHoverBackgroundColor: theme.palette.secondary.dark,
          pointHoverBorderColor: theme.palette.secondary.light,
          pointStyle: "rectRounded",
          pointRadius: 5,
          data: [90, 40, 40, 40, 80, 85, 60, 90]
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
        <>
          <Typography variant="h5" component="h3" className={classes.jobTitle}>
            Vos Résultats!
          </Typography>
          <Paper className={classes.paper}>
            <div className={classes.canvasContainer}>
              <Radar data={data} options={options} />
            </div>
          </Paper>
        </>
      </div>
    );
  }
}

export default withStyles(assessmentStyles)(MyOldAssessments);
