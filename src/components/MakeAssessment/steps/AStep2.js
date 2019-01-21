import React, { Component } from 'react';
import { Button, Typography, FormHelperText, Grid, Paper, List, ListItem } from '@material-ui/core';
import sizeMe from 'react-sizeme';
import StackGrid from 'react-stack-grid';
import { Mutation, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import ReactStars from 'react-stars';
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';
import { theme } from '../..';
import assessmentStyles from '../MakeAssessment.styles';
import { AUTH_USERID } from '../../../constants';

const JOB_QUERY = gql`
  query job($id: ID!){
    job(id: $id) {
      id
      name
      axes {
        id
        name
        skills {
          id
          name
        }
      }
    }
  }
`;

const CREATE_ASSESSMENT_MUTATION = gql`
  mutation createAssessment($input: CreateAssessmentInput!) {
    createAssessment(input: $input) {
      id
    }
  }
`;

class AStep2 extends Component {
  constructor(props) {
    super();
    this.state = {
      loadingQuery: true,
      job: {},
      axes: [],
      userId: ""
    };

    this.fetchJob(props);
  };

  async fetchJob(props) {
    const { client, job } = props;
    const { data } = await client.query({
      query: JOB_QUERY,
      variables: { 'id': job }
    });

    // Construct final response squelette
    const axes = [];
    data.job.axes.forEach(axe => {
      const skills = [];
      axe.skills.forEach(skill => {
        skills.push({
          "skillId": skill.id,
          "skillRate": 0
        });
      });

      axes.push({
        "axeId": axe.id,
        "skills": skills
      });
    });

    this.setState({
      job: data.job,
      loadingQuery: false,
      axes: axes
    });
  };

  handleRating = (rating, skillId, axeId) => {
    const { axes } = this.state;
    const axe = axes.find(function(o){return o.axeId === axeId;} );
    const skill = axe.skills.find(function(o){return o.skillId === skillId;} );
    skill.skillRate = rating;
  };

  skillValue = (skillId, axeId) => {
    const axe = this.state.axes.find(function(o){return o.axeId === axeId;} );
    const skill = axe.skills.find(function(o){return o.skillId === skillId;} );

    return skill.skillRate;
  };

  handleComplete = data => {
    this.props.handleAssessment(data.createAssessment.id);
    this.props.handleComplete();
    this.props.handleNext();
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
    const { job, axes, loadingQuery } = this.state;

    return (
      <div>
      {loadingQuery? (
        <FormHelperText>Chargement...</FormHelperText>
      ) : (
        <div className={classes.root}>
          <Typography variant="h5" component="h3" className={classes.jobTitle}>
            Évaluer votre niveau de {job.name}
          </Typography>
          <StackGrid gutterWidth={24} columnWidth={width <= 768 ? '100%' : '50%'}>
          {job.axes.map(axe => (
            <div className={classes.gridItems} key={axe.id}>
              <Paper className={classes.paper}>
              <Typography variant="subtitle2" gutterBottom>Sur la partie: {axe.name}</Typography>
                <List>
                  {axe.skills.map(skill => (
                    <ListItem className={classes.listItem} key={skill.id}>
                      <Grid container spacing={8}>
                        <Grid item xs={8}>
                          <Typography component="p" className={classes.pskill}>{skill.name}:</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <ReactStars
                            count={4}
                            size={18}
                            half={false}
                            color2={theme.palette.secondary.main}
                            onChange={ratingChanged => {this.handleRating(ratingChanged, skill.id, axe.id)}}
                            value={this.skillValue(skill.id, axe.id)}
                          />
                        </Grid>
                      </Grid>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </div>
          ))}
          </StackGrid>
          <Mutation
            mutation={CREATE_ASSESSMENT_MUTATION}
            variables={{ 'input': { userId: sessionStorage.getItem(AUTH_USERID), axes: axes }}}
            onCompleted={data => this.handleComplete(data)}
            onError={error => this.handleError(error)}
          >
            {mutation => (
              <Button color="primary" variant="contained" onClick={e => {mutation()}}>
                Enregister & voir mes résultats
              </Button>
            )}
          </Mutation>
        </div>
      )}
      </div>
    );
  }
}

export default sizeMe()(withStyles(assessmentStyles)(withSnackbar(withApollo(AStep2))));
