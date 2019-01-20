import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Typography, FormHelperText, Paper, Fab, Button, DialogActions } from '@material-ui/core';
import { Dialog, DialogTitle, DialogContent, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { Query } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';
import assessmentStyles from '../MakeAssessment.styles';

const ME_QUERY = gql`
  {
    me {
      id
      jobs {
        id
        name
      }
    }
  }
`;

class AStep1 extends Component {
  state = {
    chosenJobId: '',
    openJobDialog: false,
  };

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

  handleClickOpen = () => {
    this.setState({ openJobDialog: true });
  };

  handleClose = () => {
    this.setState({ openJobDialog: false });
    if (this.state.chosenJobId !== '') {
      this.props.handleComplete();
      this.props.handleNext(this.state.chosenJobId);
    }
  };

  handleJobChangeSelect = event => {
    this.setState({ chosenJobId: event.target.value });
  };

  render() {
    const { chosenJobId, openJobDialog } = this.state;
    const { classes } = this.props;

    return (
      <div>
        <Query query={ME_QUERY} onError={error => this.handleError(error)}>
          {({ loading, _, data }) => {
            if (loading) return <FormHelperText>Chargement...</FormHelperText>;

            return (
              <Paper className={classes.paper}>
                {data.me.jobs.length ? (
                  <>
                    <Fab className={classes.fab} color={'secondary'} size={'small' } onClick={this.handleClickOpen}><Add /></Fab>
                    <Typography>C'est parti pour votre assessment, choisissez un job à évaluer.</Typography>

                    <Dialog
                      open={openJobDialog}
                      onClose={this.handleClose}
                      aria-labelledby="choosejob-dialog-title"
                    >
                      <form className={classes.form} onSubmit={e => {e.preventDefault()}}>
                        <DialogTitle id="choosejob-dialog-title">Sélectionnez votre job</DialogTitle>
                        <DialogContent>

                            <FormControl className={classes.formControl}>
                              <InputLabel htmlFor="selectedjob">Métier</InputLabel>
                              <Select
                                inputProps={{
                                  name: 'selectedjob',
                                  id: 'selectedjob',
                                }}
                                onChange={this.handleJobChangeSelect}
                                value={chosenJobId}
                                required
                              >
                                {data.me.jobs.map(job => (
                                  <MenuItem value={job.id} key={job.id}>{job.name}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                        </DialogContent>
                        <DialogActions>
                          <Button onClick={this.handleClose} color="primary" disabled={chosenJobId === ''}>
                            Suivant
                          </Button>
                        </DialogActions>
                      </form>
                    </Dialog>
                  </>
                ) : (
                  <Typography>Merci d'ajouter <b>au moins un métier</b> à votre profil. Vous pouvez le faire depuis "Mon compte".</Typography>
                ) }
              </Paper>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default withStyles(assessmentStyles)(withSnackbar(AStep1));
