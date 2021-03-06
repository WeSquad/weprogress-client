import React, { Component } from 'react';
import { Button, Typography, FormHelperText, Paper, List } from '@material-ui/core';
import sizeMe from 'react-sizeme';
import StackGrid from 'react-stack-grid';
import { Mutation, withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';
import { SkillSet, SkillLegend } from '..';
import editAssessmentStyles from './EditAssessment.styles';
import { AUTH_USERID } from '../../constants';

const ASSESSMENT_QUERY = gql`
  query assessment($id: ID!){
    assessment(id: $id) {
      id
      createdAt
      user {
        fullName
      }
      job {
        id
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
    }
  }
`;

const UPDATE_ASSESSMENT_MUTATION = gql`
  mutation updateAssessment($id: ID!, $input: CreateAssessmentInput!) {
    updateAssessment(id: $id, input: $input) {
      id
      createdAt
      user {
        fullName
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
    }
  }
`;

class EditAssessment extends Component {
  constructor(props) {
    super();
    this.state = {
      loadingQuery: true,
      job: {},
      axes: [],
      updatedAssessment: {}
    };

    this.fetchAssessment(props);
  };

  fetchAssessment = async (props) => {
    const { client, id } = props;
    const { data } = await client.query({
      query: ASSESSMENT_QUERY,
      variables: { 'id': id },
    });

    this.setState({
      job: data.assessment.job,
      axes: data.assessment.axes,
      loadingQuery: false,
    });

    this.createInitialAxes();
  };

  createInitialAxes = () => {
    const { job, axes, updatedAssessment } = this.state;

    const newAxes = [];
    axes.forEach(axe => {
      const {axeName, axeType, ...newAxe} = axe;
      const newSkills = [];
      axe.skills.forEach(oldSkill => {
        const {skillName, ...newSkill} = oldSkill;
        newSkills.push(newSkill);
      });
      newAxe.skills = newSkills;
      newAxes.push(newAxe);
    });

    updatedAssessment.userId = sessionStorage.getItem(AUTH_USERID);
    updatedAssessment.jobId = job.id;
    updatedAssessment.axes = newAxes;
  }

  handleRating = (rating, skillId, axeId) => {
    const { axes } = this.state;
    const axe = axes.find(function(o){return o.axeId === axeId;} );
    const skill = axe.skills.find(function(o){return o.skillId === skillId;} );
    skill.skillRate = rating;

    this.createInitialAxes();
  };

  handleWishes = (wishes, skillId, axeId) => {
    const { axes } = this.state;
    const axe = axes.find(function(o){return o.axeId === axeId;} );
    const skill = axe.skills.find(function(o){return o.skillId === skillId;} );

    skill.wishes = wishes;
  };

  skillValue = (skillId, axeId) => {
    const axe = this.state.axes.find(function(o){return o.axeId === axeId;} );
    const skill = axe.skills.find(function(o){return o.skillId === skillId;} );

    return skill.skillRate;
  };

  handleComplete = () => {
    this.props.enqueueSnackbar("Édition réussie.", {
      variant: 'success',
    });
    this.props.history.push(`/viewassessment/${this.props.id}`);
  };

  handleError = error => {
    if (error.graphQLErrors[0]) {
      this.props.enqueueSnackbar(error.graphQLErrors[0].message, {
        variant: 'error',
      });

      return <FormHelperText>Action impossible</FormHelperText>;
    } else {
      this.props.enqueueSnackbar('Problème technique', {
        variant: 'error',
      });

      return <FormHelperText>Action impossible</FormHelperText>;
    }
  };

  render() {
    const { classes, size: {width}} = this.props;
    const { axes, updatedAssessment, loadingQuery } = this.state;

    return (
      <div>
      {loadingQuery? (
        <FormHelperText>Chargement...</FormHelperText>
      ) : (
        <div className={classes.root}>
          <Typography variant="h5" component="h3" className={classes.jobTitle}>
            Editer votre auto-évaluation
          </Typography>

          <SkillLegend />

          <Typography variant="h5" component="h3" gutterBottom>Hard Skills</Typography>
          <StackGrid gutterWidth={24} columnWidth={width <= 768 ? '100%' : '50%'}>
          {axes.map(axe => (
            axe.axeType === "hardSkills" && (
              <div className={classes.gridItems} key={axe.axeId}>
                <Paper className={classes.paper}>
                  <Typography variant="subtitle2" gutterBottom>Sur la partie: {axe.axeName}</Typography>
                  <List>
                    {axe.skills.map(skill => (
                      <SkillSet soft={false} key={skill.skillId} axeId={axe.axeId} skillId={skill.skillId} skillName={skill.skillName} skillValue={this.skillValue} skillWishes={skill.wishes} handleRating={this.handleRating} handleWishes={this.handleWishes} />
                    ))}
                  </List>
                </Paper>
              </div>
            )
          ))}
          </StackGrid>

          <Typography variant="h5" component="h3" gutterBottom>Soft Skills</Typography>
          <StackGrid gutterWidth={24} columnWidth={width <= 768 ? '100%' : '50%'}>
          {axes.map(axe => (
            axe.axeType === "softSkills" && (
              <div className={classes.gridItems} key={axe.axeId}>
                <Paper className={classes.paper}>
                  <Typography variant="subtitle2" gutterBottom>Sur la partie: {axe.axeName}</Typography>
                  <List>
                    {axe.skills.map(skill => (
                      <SkillSet soft={true} key={skill.skillId} axeId={axe.axeId} skillId={skill.skillId} skillName={skill.skillName} skillValue={this.skillValue} skillWishes={skill.wishes} handleRating={this.handleRating} handleWishes={this.handleWishes} />
                    ))}
                  </List>
                </Paper>
              </div>
            )
          ))}
          </StackGrid>
          <Mutation
            mutation={UPDATE_ASSESSMENT_MUTATION}
            variables={{ 'id': this.props.id, 'input': updatedAssessment}}
            onCompleted={data => this.handleComplete()}
            onError={error => this.handleError(error)}
          >
            {mutation => (
              <Button color="primary" variant="contained" onClick={e => {mutation()}}>
                Modifier mon évaluation
              </Button>
            )}
          </Mutation>
        </div>
      )}
      </div>
    );
  }
}

export default sizeMe()(withStyles(editAssessmentStyles)(withSnackbar(withApollo(withRouter(EditAssessment)))));
