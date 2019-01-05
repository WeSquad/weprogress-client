import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Avatar, Button, FormControlLabel, Checkbox, Paper, Typography, TextField, FormHelperText } from '@material-ui/core';
import { LockOutlined as LockIcon } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { AUTH_TOKEN, AUTH_USERID, AUTH_USERNAME } from '../constants';
import { authStyles } from '../styles/Wetheme';

const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!, $rememberme: Boolean) {
    login(email: $email, password: $password, rememberme: $rememberme) {
      token
      user {
        id
        fullName
      }
    }
  }
`;

class SignIn extends Component {
  state = {
    email: '',
    password: '',
    rememberme: false,
    errorMsg: '',
  };

  render() {
    const { email, password, rememberme, errorMsg } = this.state;
    const { classes } = this.props;

    const handleError = error => {
      this.setState({ errorMsg: error.graphQLErrors[0].message});
    };

    return (
      <main className={classes.main}>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            S'identifier
          </Typography>
            <Mutation
                mutation={LOGIN_MUTATION}
                variables={{ email, password, rememberme }}
                onCompleted={data => this._confirm(data)}
                onError={error => handleError(error)}
            >
            {mutation => (
            <form className={classes.form} onSubmit={e => {e.preventDefault(); mutation()}}>
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
              <FormControlLabel
                control={<Checkbox name="rememberme" checked={rememberme} onChange={e => this.setState({ rememberme: e.target.checked })} color="primary" />}
                label="Se souvenir de moi"
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
                  Connexion
              </Button>
            </form>
            )}
          </Mutation>
        </Paper>
        <div>
          <Typography variant="subtitle2" gutterBottom align="center" className={classes.createAccount}>
            Vous n'avez pas compte? <Link to="/register">Enregistrez-vous ici.</Link>
          </Typography>
        </div>
      </main>
    );
  }

  _confirm = async data => {
    const { login } = data;
    this._saveUserData(login);
    this.props.history.push(`/`);
  }

  _saveUserData = login => {
    sessionStorage.setItem(AUTH_TOKEN, login.token);
    sessionStorage.setItem(AUTH_USERID, login.user.id);
    sessionStorage.setItem(AUTH_USERNAME, login.user.fullName);
  }
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withStyles(authStyles)(withRouter(SignIn));
