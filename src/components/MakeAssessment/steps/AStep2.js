import React, { Component } from 'react';
import { Button, Typography, FormHelperText, Grid, Paper, List, ListItem } from '@material-ui/core';
import sizeMe from 'react-sizeme';
import StackGrid from 'react-stack-grid';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import ReactStars from 'react-stars';
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';
import { theme } from '../..';
import assessmentStyles from '../MakeAssessment.styles';

const JOB_QUERY = gql`
  query job($id: ID!){
    job(id: $id) {
      id
      name
      axes {
        id
        name
        skills {
          id
          name
        }
      }
    }
  }
`;

class AStep2 extends Component {
  handleError = error => {
    if (error.graphQLErrors[0]) {
      this.props.enqueueSnackbar(error.graphQLErrors[0].message, {
        variant: 'error',
      });
    } else {
      this.props.enqueueSnackbar('Problème technique', {
        variant: 'error',
      });
    }
  };

  handleRating = rate => {
  }

  handleComplete = () => {
    this.props.handleComplete();
    this.props.handleNext();
  }

  render() {
    const { classes, size: {width}} = this.props;

    return (
      <div>
        <Query query={JOB_QUERY} onError={error => this.handleError(error)} variables={{'id': this.props.job}}>
          {({ loading, _, data }) => {
            if (loading) return <FormHelperText>Chargement...</FormHelperText>;

            return (
              <div className={classes.root}>
                <Typography variant="h5" component="h3" className={classes.jobTitle}>
                  Évaluer votre niveau de {data.job.name}
                </Typography>
                <StackGrid gutterWidth={24} columnWidth={width <= 768 ? '100%' : '50%'}>
                {data.job.axes.map(axe => (
                  <div className={classes.gridItems} key={axe.id}>
                    <Paper className={classes.paper}>
                    <Typography variant="subtitle2" gutterBottom>Sur la partie: {axe.name}</Typography>
                      <List>
                        {axe.skills.map(skill => (
                          <ListItem className={classes.listItem} key={skill.id}>
                            <Grid container spacing={8}>
                              <Grid item xs={8}>
                                <Typography component="p" className={classes.pskill}>{skill.name}:</Typography>
                              </Grid>
                              <Grid item xs={4}>
                                <ReactStars
                                  count={4}
                                  size={18}
                                  half={false}
                                  color2={theme.palette.secondary.main}
                                />
                              </Grid>
                            </Grid>
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  </div>
                ))}
                </StackGrid>
                <Button color="primary" variant="contained" onClick={e => {this.handleComplete();}}>
                  Enregister & voir mes résultats
                </Button>
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default sizeMe()(withStyles(assessmentStyles)(withSnackbar(AStep2)));
