import React, { Component } from 'react';
import { Typography, Paper, List, Grid, FormHelperText, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { Radar } from 'react-chartjs-2';
import { withStyles } from '@material-ui/core/styles';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import assessmentStyles from '../MakeAssessment/MakeAssessment.styles';
import { theme, ReadOnlySkillSet } from '..';

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

const ASSESSMENT_DATAILS_QUERY = gql`
  query assessment($id: ID!){
    assessment(id: $id) {
      id
      job {
        name
      }
      axes {
        axeId
        axeName
        axeType
        skills {
          skillId
          skillName
          skillRate
          wishes {
            training
            interest
            noMore
          }
        }
      }
      user {
        fullName
      }
    }
  }
`;

class ViewSharedAssessment extends Component {
  constructor(props) {
    super();
    this.state = {
      loadingQuery: true,
      axesNames: [],
      axesValues: [],
      assessment: {},
      expanded: null
    };

    this.fetchRates(props);
    this.fetchDetails(props);
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
      axesValues: values
    });
  };

  fetchDetails = async (props) => {
    const { client, id } = props;
    const { data } = await client.query({
      query: ASSESSMENT_DATAILS_QUERY,
      variables: { "id": id },
      fetchPolicy: "no-cache"
    });

    this.setState({
      assessment: data.assessment,
      loadingQuery: false,
    });
  };

  handleChange = panel => (e, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  render() {
    const { classes } = this.props;
    const { axesNames, axesValues, assessment, expanded, loadingQuery } = this.state;

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
          <div className={classes.root}>
            <Typography variant="h5" component="h3" className={classes.jobTitle}>
              Auto-Assessment de {assessment.user.fullName} sur le métier de {assessment.job.name}
            </Typography>
            <Paper className={classes.paper}>
              <div className={classes.canvasContainer}>
                <Radar data={data} options={options} />
              </div>
            </Paper>
            <Typography variant="h5" component="h3" className={classes.jobTitle}>
              En détails:
            </Typography>
            <Paper>
              {assessment.axes.map(axe => {
                return (
                  <ExpansionPanel expanded={expanded === axe.axeId} onChange={this.handleChange(axe.axeId)} key={axe.axeId}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>{axe.axeName}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <List>
                        <Grid container spacing={16}>
                          {axe.skills.map(skill => (
                            <Grid item sm={6} xs={12} key={skill.skillId}>
                              <ReadOnlySkillSet soft={axe.axeType === "hardSkills" ? false : true} axeId={axe.axeId} skillId={skill.skillId} skillName={skill.skillName} skillValue={skill.skillRate} skillWishes={skill.wishes} />
                            </Grid>
                          ))}
                        </Grid>
                      </List>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                );
              })}
            </Paper>
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(assessmentStyles)(withApollo(ViewSharedAssessment));
