import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Avatar, Button, Paper, Typography, TextField, FormHelperText } from '@material-ui/core';
import { Fingerprint } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { AUTH_TOKEN, AUTH_USERID, AUTH_USERNAME } from '../../constants';
import registerStyles from './Register.styles';

const REGISTER_MUTATION = gql`
  mutation register($input: RegisterUserInput!) {
    register(input: $input) {
      token
      user {
        id
        fullName
      }
    }
  }
`;

class Register extends Component {
  state = {
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    errorMsg: '',
  };

  render() {
    const { email, firstName, lastName, password, errorMsg } = this.state;
    const { classes } = this.props;

    const handleError = error => {
      if (error.graphQLErrors[0]) {
        this.setState({ errorMsg: error.graphQLErrors[0].message});
      } else {
        this.setState({ errorMsg: 'Enregistrement impossible'});
      }
    };

    return (
      <main className={classes.main}>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <Fingerprint />
          </Avatar>
          <Typography component="h1" variant="h5">
            S'enregistrer
          </Typography>
            <Mutation
                mutation={REGISTER_MUTATION}
                variables={{ 'input': { email, firstName, lastName, password }}}
                onCompleted={data => this._confirm(data)}
                onError={error => handleError(error)}
            >
            {mutation => (
            <form className={classes.form} onSubmit={e => {e.preventDefault(); mutation()}}>
              <TextField
                id="firstName"
                name="firstName"
                label="Nom"
                value={firstName}
                onChange={e => this.setState({ firstName: e.target.value })}
                margin="normal"
                required
                fullWidth
              />
              <TextField
                id="lastName"
                name="lastName"
                label="Prénom"
                value={lastName}
                onChange={e => this.setState({ lastName: e.target.value })}
                margin="normal"
                required
                fullWidth
              />
              <TextField
                id="email"
                name="email"
                label="Votre adresse email"
                value={email}
                onChange={e => this.setState({ email: e.target.value })}
                margin="normal"
                required
                fullWidth
              />
              <TextField
                id="password"
                name="password"
                type="password"
                label="Mot de passe"
                value={password}
                onChange={e => this.setState({ password: e.target.value })}
                margin="normal"
                required
                fullWidth
              />
              {errorMsg && (
                <FormHelperText className={classes.errorMsg}>{errorMsg}</FormHelperText>
              )}
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                className={classes.submit}>
                  S'enregistrer
              </Button>
            </form>
            )}
          </Mutation>
        </Paper>
        <div>
          <Typography variant="subtitle2" gutterBottom align="center" className={classes.createAccount}>
            Vous avez déjà un compte? <Link to="/signin">Connectez-vous ici.</Link>
          </Typography>
        </div>
      </main>
    );
  }

  _confirm = async data => {
    const { register } = data;
    this._saveUserData(register);
    this.props.history.push(`/`);
  }

  _saveUserData = register => {
    sessionStorage.setItem(AUTH_TOKEN, register.token);
    sessionStorage.setItem(AUTH_USERID, register.user.id);
    sessionStorage.setItem(AUTH_USERNAME, register.user.fullName);
  }
}

Register.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withStyles(registerStyles)(withRouter(Register));
