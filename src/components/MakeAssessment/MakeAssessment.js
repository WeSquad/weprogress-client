import React, { Component } from 'react';
import { Typography, Stepper, Step, StepButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import assessmentStyles from './MakeAssessment.styles';
import AStep1 from './steps/AStep1';
import AStep2 from './steps/AStep2';
import AStep3 from './steps/AStep3';

class MakeAssessment extends Component {
  state = {
    step: 0,
    jobId: '',
    assessmentId: '',
    completed: {},
  };

  handleAssessment = assessmentId => {
    this.setState({ assessmentId: assessmentId });
  }

  handleNext = jobId => {
    this.setState({ step: this.state.step + 1});
    if (jobId) this.setState({ jobId: jobId});
  };

  handleBack = () => {
    this.setState({ step: this.state.step - 1});
  };

  handleStep = step => () => {
    if (step < this.state.step) {
      this.setState({
        step: step,
      });
    }
  };

  handleComplete = () => {
    const { completed } = this.state;
    completed[this.state.step] = true;
    this.setState({
      completed,
    });
  };

  render() {
    const { step, jobId, assessmentId, completed } = this.state;
    const { classes } = this.props;
    const steps = ['Choix du métier', 'Assessment', 'Résultats'];

    const getStepContent = step => {
      switch (step) {
        case 0:
          return <AStep1 handleNext={this.handleNext} handleComplete={this.handleComplete} />;
        case 1:
          return <AStep2 job={jobId} handleAssessment={this.handleAssessment} handleNext={this.handleNext} handleBack={this.handleBack} handleComplete={this.handleComplete} />;
        case 2:
          return <AStep3 assessmentId={assessmentId} handleBack={this.handleBack} handleComplete={this.handleComplete} />;
        default:
          throw new Error('Unknown step');
      }
    }

    return (
      <div>
        <Typography variant="h4" gutterBottom component="h2">
          M'auto-évaluer
        </Typography>
        <Stepper activeStep={step} className={classes.stepper}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepButton onClick={this.handleStep(index)} completed={completed[index]}>{label}</StepButton>
            </Step>
          ))}
        </Stepper>
        {getStepContent(step)}
      </div>
    );
  }
}

export default withStyles(assessmentStyles)(MakeAssessment);
