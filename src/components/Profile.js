import React, { Component } from 'react';
import { Mutation, withApollo } from 'react-apollo';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Button, Paper, Typography, TextField, FormHelperText, Grid, FormControlLabel, Checkbox } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { profileStyles } from '../styles/Wetheme';
import { withSnackbar } from 'notistack';

const ME_QUERY = gql`
  {
    me {
      id
      firstName
      lastName
      email
      mentors {
        id
        fullName
      }
      mentees {
        id
        fullName
      }
      jobs {
        id
        name
      }
    }
  }
`;

const UPDATEME_MUTATION = gql`
  mutation updateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      firstName
      lastName
      email
      mentors {
        id
        fullName
      }
      mentees {
        id
        fullName
      }
      jobs {
        id
        name
      }
    }
  }
`;

const JOBS_QUERY = gql`
  {
    jobs {
      id
      name
    }
  }
`;

const SETJOBS_MUTATION = gql`
  mutation setJobs($id: ID!, $jobsIds: [ID]) {
    setJobs(id: $id, jobsIds: $jobsIds) {
      jobs {
        id
        name
      }
    }
  }
`;

class Profile extends Component {
  constructor(props) {
    super();
    this.state = {
      loadingQuery: true,
      me: {},
      jobs: {},
      myjobs: []
    };

    this.fetchData(props);
  }

  async fetchData(props) {
    const { client } = props;
    const meResult = await client.query({
      query: ME_QUERY
    });

    const jobsResult = await client.query({
      query: JOBS_QUERY
    });

    this.setState({
      me: meResult.data.me,
      jobs: jobsResult.data.jobs,
      myjobs: meResult.data.me.jobs.map(a => a.id),
      loadingQuery: false,
    });
  }

  handleError = error => {
    if (error.graphQLErrors[0]) {
      this.setState({ errorMsg: error.graphQLErrors[0].message});
    } else {
      this.setState({ errorMsg: 'Enregistrement impossible'});
      this.props.enqueueSnackbar('Enregistrement impossible', {
        variant: 'error',
      });
    }
  };

  handleSubmit = data => {
    this.setState({loading: false});
    this.props.enqueueSnackbar('Profil mis à jour', {variant: 'success'});
  };

  handleJobCheck = (e, checked) => {
    let id = e.target.id;
    if (checked) {
      var newjobs = this.state.myjobs;
      this.setState({myjobs: newjobs.concat([id])});
    } else {
      this.setState({myjobs: this.state.myjobs.filter(el => el !== String(id))});
    }
  }

  render() {
    const { me, jobs, myjobs, loadingQuery } = this.state;
    const { classes } = this.props;

    return (
      <div>
        {loadingQuery? (
          <FormHelperText>Chargement...</FormHelperText>
        ) : (
        <Paper className={classes.paper}>
          <Mutation
            mutation={UPDATEME_MUTATION}
            variables={{ 'id': me.id, 'input': { email: me.email, firstName: me.firstName, lastName: me.lastName, password: me.password }}}
            onError={error => this.handleError(error)}
            onCompleted={data => this.handleSubmit(data)}
          >
          {mutation => (
            <form className={classes.form} onSubmit={e => {e.preventDefault(); mutation()}}>
              <Typography variant="h6" gutterBottom className={classes.paperTitle}>
                Votre profil
              </Typography>
              <Grid container spacing={0}>
                <Grid item xs={12} sm={5} className={classes.gridItems}>
                  <TextField
                    id="email"
                    name="email"
                    label="Votre adresse email"
                    value={me && me.email}
                    onChange={e => this.setState({ me: {...me, email: e.target.value }})}
                    margin="normal"
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={false} sm={7} className={classes.gridItems}></Grid>
                <Grid item xs={12} sm={5} className={classes.gridItems}>
                  <TextField
                    id="firstName"
                    name="firstName"
                    label="Nom"
                    value={me && me.firstName}
                    onChange={e => this.setState({ me: {...me, firstName: e.target.value }})}
                    margin="normal"
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={false} sm={7} className={classes.gridItems}></Grid>
                <Grid item xs={12} sm={5} className={classes.gridItems}>
                  <TextField
                    id="lastName"
                    name="lastName"
                    label="Prénom"
                    value={me && me.lastName}
                    onChange={e => this.setState({ me: {...me, lastName: e.target.value }})}
                    margin="normal"
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={false} sm={7} className={classes.gridItems}></Grid>
                <Grid item xs={12} sm={4} className={classes.gridItems}>
                  <TextField
                    id="password"
                    name="password"
                    type="password"
                    label="Mot de passe"
                    onChange={e => this.setState({ me: {...me, password: e.target.value }})}
                    margin="normal"
                    fullWidth
                    helperText="Laisser vide pour ne pas changer de mot de passe."
                  />
                </Grid>
                <Grid item xs={false} sm={8} className={classes.gridItems}></Grid>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  className={classes.submit}>
                    Mettre à jour
                </Button>
              </Grid>
            </form>
          )}
          </Mutation>
        </Paper>
        )}

        <Paper className={classes.paper}>
          <Typography variant="h6" gutterBottom className={classes.paperTitle}>
            Votre travail
          </Typography>
          {loadingQuery? (
            <FormHelperText>Chargement...</FormHelperText>
          ) : (
            <div>
              <FormHelperText className={classes.formHelper}>Sélectionnez un ou plusieurs travails:</FormHelperText>
              <Mutation
                mutation={SETJOBS_MUTATION}
                variables={{ 'id': me.id, 'jobsIds': myjobs }}
                onError={error => this.handleError(error)}
                onCompleted={data => this.handleSubmit(data)}
              >
                {jobsMutation => (
                  <form className={classes.form} onSubmit={e => {e.preventDefault(); jobsMutation()}}>
                    {jobs.map(job => (
                      <FormControlLabel
                        control={<Checkbox name={`job-`+job.id} color="primary" id={job.id} checked={myjobs.includes(String(job.id))} onChange={this.handleJobCheck} />}
                        label={job.name}
                        key={job.id}
                      />
                    ))}
                    <div>
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        className={classes.submit}>
                          Mettre à jour
                      </Button>
                    </div>
                  </form>
                )}
              </Mutation>
            </div>
          )}
        </Paper>
      </div>
    );
  }
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withSnackbar(withStyles(profileStyles)(withApollo(Profile)));
