import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, Button, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
  },
  formControl: {
    minWidth: 280,
  },
  marginControl: {
    marginTop: theme.spacing.unit * 3,
    minWidth: 280,
  },
  errorMsg: {
    color: "red"
  }
});

class CompareAssessmentsDialog extends Component {
  constructor(props) {
    super();

    this.state = {
      initialAssessments: props.assessments,
      firstAssessments: props.assessments,
      secondAssessments: props.assessments,
      firstAssessmentId: "",
      secondAssessmentId: "",
      errorMsg: "",
      cantCompare: true
    };
  };

  handleClose = () => {
    this.props.handleClose();
  }

  handleFirstSelected = async event => {
    await this.setState({ firstAssessmentId: event.target.value });
    const filteredItems = this.state.initialAssessments.filter(item => item.id !== event.target.value);
    this.setState({ secondAssessments: filteredItems });
    this.checkFields();
  }

  handleSecondSelected = async event => {
    await this.setState({ secondAssessmentId: event.target.value });
    const filteredItems = this.state.initialAssessments.filter(item => item.id !== event.target.value);
    this.setState({ firstAssessments: filteredItems });
    this.checkFields();
  }

  checkFields = () => {
    if (this.state.firstAssessmentId === "" || this.state.secondAssessmentId === "") {
      this.setState({"errorMsg": "Merci de sélectionner les deux assessments."});
      this.setState({"cantCompare": true});
    } else {
      let first = this.state.firstAssessmentId;
      let second = this.state.secondAssessmentId;
      let firstAssessment = this.props.assessments.find(function(o){return o.id === first;} );
      let secondAssessment = this.props.assessments.find(function(o){return o.id === second;} );

      if (firstAssessment.job.name !== secondAssessment.job.name) {
        this.setState({"errorMsg": "Vous ne pouvez pas comparer deux métiers différents."});
        this.setState({"cantCompare": true});
      } else {
        this.setState({"errorMsg": ""});
        this.setState({"cantCompare": false});
      }
    }
  }

  render() {
    const { classes } = this.props;
    const { firstAssessments, secondAssessments, firstAssessmentId, secondAssessmentId, errorMsg, cantCompare } = this.state;

    return (
      <Dialog
        open={this.props.opened}
        onClose={this.handleClose}
        aria-labelledby="compareassessments-dialog-title"
      >
      <form className={classes.form} onSubmit={e => {e.preventDefault()}}>
        <DialogTitle id="compareassessments-dialog-title">Sélectionnez deux assessments à comparer!</DialogTitle>
        <DialogContent>
          {errorMsg !== "" && (
            <Typography className={classes.errorMsg}>{errorMsg}</Typography>
          )}
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="firstassessment" shrink={firstAssessmentId? true:false}>Premier Assessment</InputLabel>
            <Select
              inputProps={{
                name: 'firstassessment',
                id: 'firstassessment',
              }}
              onChange={this.handleFirstSelected}
              value={firstAssessmentId}
              required
            >
              {firstAssessments.map(assessment => {
                let date = new Date(assessment.createdAt);
                let formattedDate = date.toLocaleDateString("fr-FR");
                let hourMinutes = `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;

                return (<MenuItem value={assessment.id} key={assessment.id}>{assessment.job.name} - {formattedDate} à {hourMinutes}</MenuItem>);
              })}
            </Select>
          </FormControl>

          <FormControl className={classes.marginControl}>
            <InputLabel htmlFor="secondassessment" shrink={secondAssessmentId? true:false}>Deuxième Assessment</InputLabel>
            <Select
              inputProps={{
                name: 'secondassessment',
                id: 'secondassessment',
              }}
              onChange={this.handleSecondSelected}
              value={secondAssessmentId}
              required
            >
              {secondAssessments.map(assessment => {
                let date = new Date(assessment.createdAt);
                let formattedDate = date.toLocaleDateString("fr-FR");
                let hourMinutes = `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;

                return (<MenuItem value={assessment.id} key={assessment.id}>{assessment.job.name} - {formattedDate} à {hourMinutes}</MenuItem>);
              })}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary" disabled={cantCompare}>
            Comparer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
    );
  }
}

export default withStyles(styles)(CompareAssessmentsDialog);