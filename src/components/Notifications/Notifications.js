import React, { Component } from 'react';
import { Typography, Paper, FormHelperText } from '@material-ui/core';
import { FiberNew } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';
import notificationsStyles from './Notifications.styles';
import gql from 'graphql-tag';
import { Query, withApollo } from 'react-apollo';

const NOTIFICATIONS_QUERY = gql`
  {
    notifications {
      id
      message
      read
    }
  }
`;

const READ_NOTIFICATIONS_MUTATION = gql`
  mutation readNotification($ids: [ID]!) {
    readNotification(ids: $ids) {
      id
      message
      read
    }
  }
`;

class Notifications extends Component {
  state = {
    notificationsIds: []
  }

  componentWillUnmount = () => {
    const { client } = this.props;

    if (this.state.notificationsIds.length > 0) {
      client.mutate({
        mutation: READ_NOTIFICATIONS_MUTATION,
        variables: { ids: this.state.notificationsIds }
      }).then(() => {
        this.props.handleNotificationsRead();
      }).catch((error) => {
        console.log(error);
      });
    }
  }

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
    const { classes, newNotifs } = this.props;
    const { notificationsIds } = this.state;

    return (
      <div>
        <Typography variant="h4" gutterBottom component="h2">
          Mes notifications
        </Typography>
        <Query query={NOTIFICATIONS_QUERY}>
          {({ loading, error, data, refetch }) => {
            if (error) {
              return this.handleError(error);
            }
            if (loading) return <FormHelperText>Chargement...</FormHelperText>;

            const { notifications } = data;

            if (newNotifs === true) {
              refetch();
            }

            return (
              notifications.map(notification => {
                if (notification.read === false) {
                  notificationsIds.push(notification.id);
                }

                return (
                  <Paper key={notification.id} className={classes.notificationContainer}>
                    {notification.read === false && (<FiberNew className={classes.notificationNewText} color="secondary" />)}
                    <Typography className={classes.notificationText}>{notification.message}</Typography>
                  </Paper>
                )
              })
            )
          }}
        </Query>
      </div>
    );
  }
}

export default withStyles(notificationsStyles)(withSnackbar(withApollo(Notifications)));
