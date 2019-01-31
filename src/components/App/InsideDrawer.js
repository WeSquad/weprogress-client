import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Divider, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Dashboard, BarChart, Layers, PersonAdd }  from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { withApollo } from 'react-apollo';
import drawerStyles from './InsideDrawer.styles';
import { AUTH_TOKEN } from '../../constants';

class InsideDrawer extends Component {
  render() {
    const { classes } = this.props;
    const authToken = sessionStorage.getItem(AUTH_TOKEN);

    return (
      <div>
        <Divider />
        {authToken ? (
        <>
          <List>
            <Link to="/" className={classes.menuLink}>
              <ListItem button>
                <ListItemIcon>
                  <Dashboard />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItem>
            </Link>
            <Link to="/myassessments" className={classes.menuLink}>
              <ListItem button>
                <ListItemIcon>
                  <BarChart />
                </ListItemIcon>
                <ListItemText primary="Mes évaluations" />
              </ListItem>
            </Link>
            <Link to="/makeassessment" className={classes.menuLink}>
              <ListItem button>
                <ListItemIcon>
                  <Layers />
                </ListItemIcon>
                <ListItemText primary="M'évaluer" />
              </ListItem>
            </Link>
          </List>
        </>
        ) : (
        <List>
          <Link to="/register" className={classes.menuLink}>
            <ListItem button>
              <ListItemIcon>
                <PersonAdd />
              </ListItemIcon>
              <ListItemText primary="M'enregister" />
            </ListItem>
          </Link>
        </List>
        )}
      </div>
    );
  }
}

export default withStyles(drawerStyles)(withApollo(InsideDrawer));
