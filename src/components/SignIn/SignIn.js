import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Avatar, Paper, Typography, FormHelperText } from '@material-ui/core';
import { LockOutlined as LockIcon } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { withApollo } from 'react-apollo';
import { withSnackbar } from 'notistack';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

import { AUTH_TOKEN, AUTH_USERID, AUTH_USERNAME } from '../../constants';
import signInStyles from './SignIn.styles';
import { GoogleSignIn } from '..';

const GLOGIN_MUTATION = gql`
  mutation glogin($token: String!) {
    glogin(token: $token) {
      token
      user {
        id
        fullName
      }
    }
  }
`;

class SignIn extends Component {
  handleAuthenticate = async (token) => {
    const { client } = this.props;
    client.mutate({
      mutation: GLOGIN_MUTATION,
      variables: { 'token': token },
    }).then(async ({data}) => {
      const { glogin } = await data;
      this._confirm(glogin);
    }).catch((error) => {
      this.handleError(error);
      const auth2 = window.gapi.auth2.getAuthInstance();
      if (auth2 != null) {
        auth2.signOut();
      }
    });
  };

  handleError = (error) => {
    console.log(error);
    if (error.error && error.error.msg) {
      this.props.enqueueSnackbar(error.error.msg, {
        variant: 'error',
      });
    } else if (error.error && error.error === "popup_closed_by_user") {
      console.log("google popup closed")
    } else if (error.graphQLErrors && error.graphQLErrors[0]) {
      this.props.enqueueSnackbar(error.graphQLErrors[0].message, {
        variant: 'error',
      });
    } else {
      this.props.enqueueSnackbar('Problème technique', {
        variant: 'error',
      });
      console.log(error);
    }

    return <FormHelperText>Action impossible</FormHelperText>;
  };

  _confirm = (glogin) => {
    sessionStorage.setItem(AUTH_TOKEN, glogin.token);
    sessionStorage.setItem(AUTH_USERID, glogin.user.id);
    sessionStorage.setItem(AUTH_USERNAME, glogin.user.fullName);
    this.props.history.push(`/`);
  }

  render() {
    const { classes } = this.props;

    return (
      <main className={classes.main}>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            S'identifier
          </Typography>
          <Typography variant="body2" align="center" className={classes.introduction}>
            Nous utilisons votre accès Wemanity pour vous identifier ou vous enregistrer sur la plateforme.
          </Typography>
          <GoogleSignIn handleAuthenticate={this.handleAuthenticate} handleError={this.handleError} />
        </Paper>
      </main>
    );
  }
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withStyles(signInStyles)(withRouter(withSnackbar(withApollo(SignIn))));
