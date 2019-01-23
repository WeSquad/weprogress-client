import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Divider, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from '@material-ui/core';
import { Dashboard, BarChart, Layers, Assignment, PersonAdd }  from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import drawerStyles from './InsideDrawer.styles';
import { AUTH_TOKEN, AUTH_USERID } from '../../constants';

const MY_ASSESSMENTS_QUERY = gql`
  query assessmentsByUser($userId: ID!, $limit: Float){
    assessmentsByUser(userId: $userId, limit: $limit) {
      id
      createdAt
    }
  }
`;

class InsideDrawer extends Component {
  constructor(props) {
    super();
    this.state = {
      loadingQuery: true,
      assessments: [],
    };

    this.fetchMyAssessments(props);
  };

  async fetchMyAssessments(props) {
    if (sessionStorage.getItem(AUTH_TOKEN)) {
      const { client } = props;
      const { data } = await client.query({
        query: MY_ASSESSMENTS_QUERY,
        variables: { "userId": sessionStorage.getItem(AUTH_USERID), "limit": 3 }
      });

      this.setState({
        assessments: data.assessmentsByUser,
        loadingQuery: false,
      });
    }
  };

  render() {
    const { classes } = this.props;
    const { assessments, loadingQuery } = this.state;
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
            <ListSubheader>Mes 3 derniers Assessments</ListSubheader>
            {assessments.map(assessment => {
              let date = new Date(assessment.createdAt);
              let formattedDate = date.toLocaleDateString("fr-FR");
              let hourMinutes = `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
              return(
                <Link to={"/myoldassessments/" + assessment.id} className={classes.menuLink} key={assessment.id}>
                  <ListItem button>
                    <ListItemIcon>
                      <Assignment />
                    </ListItemIcon>
                    <ListItemText primary={formattedDate} secondary={hourMinutes} />
                  </ListItem>
                </Link>
              );
            })}
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
