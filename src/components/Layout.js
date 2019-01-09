import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { withApollo } from 'react-apollo';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { AppBar, Toolbar, Menu, MenuItem, IconButton, Typography, Drawer, Hidden } from '@material-ui/core';
import { Menu as MenuIcon, AccountCircle } from '@material-ui/icons';

import Dashboard from './Dashboard';
import MakeAssessment from './MakeAssessment';
import MyOldAssessments from './MyOldAssessments';
import SignIn from './SignIn';
import Register from './Register';
import InsideDrawer from './InsideDrawer';
import Profile from './Profile';
import { layoutStyles } from '../styles/Wetheme';
import { AUTH_TOKEN } from '../constants';

class Layout extends Component {
  state = {
    mobileOpen: false,
    anchorEl: null,
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

  logout = () => {
    this.props.history.push('/');
    sessionStorage.clear();
    this.props.client.resetStore();
  }

  render() {
    const { classes } = this.props;
    const { mobileOpen, anchorEl } = this.state;
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
            <Route exact path='/register' render={() => (
              !authToken? (
                <Register />
              ) : (
                <Redirect to="/"/>
              )
            )} />
            <Route exact path="/myoldassessments" render={() => (
              authToken? (
                <MyOldAssessments />
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
            <Route exact path="/profile" render={() => (
              authToken? (
                <Profile />
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
