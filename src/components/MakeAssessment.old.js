import React, { Component } from 'react';
import ListJobsSelect from './ListJobsSelect';
import ListAxes from './ListAxes';

class MakeAssessmentOld extends Component {
  state = {
    step: 1,
    job: ''
  };

  nextStep = () => {
    const { step } = this.state
    this.setState({
        step : step + 1
    })
  }

  prevStep = () => {
    const { step } = this.state
    this.setState({
        step : step - 1
    })
  }

  handleChange = input => event => {
    this.setState({ [input] : event.target.value })
  }

  render() {
    const { step } = this.state;
    const { job } = this.state;
    const values = { job };
    console.log(values.job);

    switch(step) {
      case 1:
        return <ListJobsSelect
          nextStep={this.nextStep}
          handleChange = {this.handleChange}
          values={values}
        />
      case 2:
        return <ListAxes
          prevStep={this.prevStep}
          jobid={this.state.job}
        />
      default:
        return <ListJobsSelect
          nextStep={this.nextStep}
          handleChange = {this.handleChange}
          values={values}
        />
    }
  }
}

export default MakeAssessmentOld;
