import React, { Component } from 'react';
import { Mutation, withApollo } from 'react-apollo';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Button, Paper, Typography, TextField, FormHelperText, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { profileStyles } from '../styles/Wetheme';

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
      user {
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
  }
`;

class Profile extends Component {
  constructor(props) {
    super();
    this.state = {
      loading: true,
      me: {},
      errorMsg: ''
    };
    this.fetchData(props);
  }

  async fetchData(props) {
    const { client } = props;
    const result = await client.query({
      query: ME_QUERY
    });

    this.setState({
      me: result.data.me,
      loading: false,
    });
  }

  handleError = error => {
    if (error.graphQLErrors[0]) {
      this.setState({ errorMsg: error.graphQLErrors[0].message});
    } else {
      this.setState({ errorMsg: 'Enregistrement impossible'});
    }
  };

  render() {
    const { me, loading, errorMsg } = this.state;
    const { classes } = this.props;

    return (
      <div>
        {loading? (
          <FormHelperText>Chargement...</FormHelperText>
        ) : (
        <Paper className={classes.paper}>
          <Typography variant="h6" gutterBottom className={classes.paperTitle}>
            Votre profil
          </Typography>
          <Mutation
                mutation={UPDATEME_MUTATION}
                variables={{ 'id': me.id, 'input': { email: me.email, firstName: me.firstName, lastName: me.lastName, password: me.password }}}
                onCompleted={data => this._confirm(data)}
                onError={error => this.handleError(error)}
          >
            {mutation => (
            <form className={classes.form} onSubmit={e => {e.preventDefault(); mutation()}}>
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
                {errorMsg && (
                  <FormHelperText className={classes.errorMsg}>{errorMsg}</FormHelperText>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  className={classes.submit}>
                    S'enregistrer
                </Button>
              </Grid>
            </form>
            )}
          </Mutation>
        </Paper>
        )}
      </div>
    );
  }
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(profileStyles)(withApollo(Profile));
