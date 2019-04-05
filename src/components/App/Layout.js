import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Menu, MenuItem, IconButton, Typography, Drawer, Hidden, CssBaseline, Badge } from '@material-ui/core';
import { Menu as MenuIcon, AccountCircle, Notifications as NotificationsIcon } from '@material-ui/icons';

import { Dashboard, MakeAssessment, MyAssessments, SharedAssessments, ViewAssessment, ViewSharedAssessment, EditAssessment, SignIn, Profile, Notifications } from '..';
import InsideDrawer from './InsideDrawer';
import layoutStyles from './Layout.styles';
import { AUTH_TOKEN } from '../../constants';

const UNREAD_NOTIFICATIONS_QUERY = gql`
  {
    unReadNotifications {
      id
      message
    }
  }
`;

class Layout extends Component {
  componentDidMount = () => {
    if (!window.gapi || window.gapi.client){
      console.log("Pas de réseau")
    } else {
      window.gapi.load('auth2', function() {
        window.gapi.auth2.init();
      });
    }

    if (sessionStorage.getItem(AUTH_TOKEN)) {
      this.fetchNotifications();
    }
  }

  state = {
    mobileOpen: false,
    anchorEl: null,
    notificationCount: 0,
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  handleLogout = () => {
    this.logout();
    this.setState({ anchorEl: null });
  };

  handleSignin = () => {
    this.props.history.push('/signin');
    this.setState({ anchorEl: null });
  }

  handleProfile = () => {
    this.props.history.push('/profile');
    this.setState({ anchorEl: null });
  }

  handleNotifications = () => {
    this.props.history.push('/notifications');
  }

  handleNotificationsRead = () => {
    const { client } = this.props;
    const data = client.cache.readQuery({ query: UNREAD_NOTIFICATIONS_QUERY });
    data.unReadNotifications = [];
    client.cache.writeQuery({ query: UNREAD_NOTIFICATIONS_QUERY, data });
    this.setState({"notificationCount": 0});
  }

  fetchNotifications = () => {
    const { client } = this.props;
    const watchedUnreadNotifications = client.watchQuery({
      query: UNREAD_NOTIFICATIONS_QUERY,
    });

    watchedUnreadNotifications.startPolling(10000);

    watchedUnreadNotifications.subscribe(({data}) => {
      const { unReadNotifications } = data;
      this.setState({"notificationCount": unReadNotifications.length});
    });
  }

  logout = async () => {
    const auth2 = await window.gapi.auth2.getAuthInstance();
    if (auth2 != null) {
      auth2.signOut().then(() => {
        sessionStorage.clear();
        this.props.client.clearStore();
        this.props.client.resetStore();

        this.props.history.push('/');
      });
    }
  }

  render() {
    const { classes } = this.props;
    const { mobileOpen, anchorEl, notificationCount } = this.state;
    const authToken = sessionStorage.getItem(AUTH_TOKEN);
    const openProfil = Boolean(anchorEl);

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              Weprogress
            </Typography>
            {authToken && (
            <IconButton color="inherit" onClick={this.handleNotifications}>
            {notificationCount && notificationCount > 0 ? (
              <Badge badgeContent={notificationCount} color="secondary">
                <NotificationsIcon />
              </Badge>
            ): (
              <NotificationsIcon />
            ) }
            </IconButton>
            )}
            <IconButton
                  aria-owns="menu-appbar"
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
            </IconButton>
            {authToken? (
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={openProfil}
                onClose={this.handleClose}
              >
                <MenuItem onClick={this.handleProfile} className={classes.menuItem}>Mon compte</MenuItem>
                <MenuItem onClick={this.handleLogout} className={classes.menuItem}>Déconnexion</MenuItem>
              </Menu>) : (
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={openProfil}
                onClose={this.handleClose}
              >
                <MenuItem className={classes.menuItem} onClick={this.handleSignin}>S'identifier</MenuItem>
              </Menu>
              )
            }
          </Toolbar>
        </AppBar>
        {authToken &&  (
        <nav className={classes.drawer}>
          <Hidden smUp implementation="css">
            <Drawer
              variant="temporary"
              anchor="left"
              open={mobileOpen}
              onClose={this.handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              <InsideDrawer />
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant="permanent"
              open
            >
              <InsideDrawer />
            </Drawer>
          </Hidden>
        </nav>
        )}
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Switch>
            <Route exact path="/" render={() => (
              authToken? (
                <Dashboard />
              ) : (
                <Redirect to="/signin"/>
              )
            )} />
            <Route exact path="/signin" render={() => (
              !authToken? (
                <SignIn />
              ) : (
                <Redirect to="/"/>
              )
            )} />
            <Route exact path="/myassessments" render={() => (
              authToken? (
                <MyAssessments />
              ) : (
                <Redirect to="/signin"/>
              )
            )} />
            <Route exact path="/sharedassessments" render={() => (
              authToken? (
                <SharedAssessments />
              ) : (
                <Redirect to="/signin"/>
              )
            )} />
            <Route exact path="/viewassessment/:id" render={({ match }) => (
              authToken? (
                <ViewAssessment key={match.params.id} id={match.params.id} shared={false} />
              ) : (
                <Redirect to="/signin"/>
              )
            )} />
            <Route exact path="/viewsharedassessment/:id" render={({ match }) => (
              authToken? (
                <ViewSharedAssessment key={match.params.id} id={match.params.id} />
              ) : (
                <Redirect to="/signin"/>
              )
            )} />
            <Route exact path="/makeassessment" render={() => (
              authToken? (
                <MakeAssessment />
              ) : (
                <Redirect to="/signin"/>
              )
            )} />
            <Route exact path="/editassessment/:id" render={({ match }) => (
              authToken? (
                <EditAssessment key={match.params.id} id={match.params.id} />
              ) : (
                <Redirect to="/signin"/>
              )
            )} />
            <Route exact path="/profile" render={() => (
              authToken? (
                <Profile />
              ) : (
                <Redirect to="/signin"/>
              )
            )} />
            <Route exact path="/notifications" render={() => (
              authToken? (
                <Notifications handleNotificationsRead={this.handleNotificationsRead} newNotifs={notificationCount > 0 ? true : false} />
              ) : (
                <Redirect to="/signin"/>
              )
            )} />
          </Switch>
        </main>
      </div>
    );
  }
}

Layout.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(layoutStyles)(withApollo(Layout)));
