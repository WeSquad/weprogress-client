import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Divider, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from '@material-ui/core';
import { Dashboard, BarChart, Layers, Assignment, PersonAdd }  from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { drawerStyles } from '../styles/Wetheme';
import { AUTH_TOKEN } from '../constants';

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
            <Link to="/" className={classes.menuLink}>
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
          <Divider />
          <List>
            <ListSubheader inset>Mes Assessments</ListSubheader>
            <ListItem button>
              <ListItemIcon>
                <Assignment />
              </ListItemIcon>
              <ListItemText primary="10/12/2018" />
            </ListItem>
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

export default withStyles(drawerStyles)(InsideDrawer);
