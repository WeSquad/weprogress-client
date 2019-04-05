import React, { Component } from 'react';
import { Typography, Paper, List, Grid, FormHelperText, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import assessmentStyles from '../MakeAssessment/MakeAssessment.styles';
import { ReadOnlySkillSet, ViewAssessment} from '..';

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

    this.fetchDetails(props);
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
    const { assessment, expanded, loadingQuery } = this.state;

    return (
      <div>
        {loadingQuery? (
          <FormHelperText>Chargement...</FormHelperText>
        ) : (
          <div className={classes.root}>
            <Typography variant="h5" component="h3" className={classes.jobTitle}>
              Auto-Assessment de {assessment.user.fullName} sur le métier de {assessment.job.name}
            </Typography>
            <ViewAssessment id={assessment.id} shared={true} />
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
