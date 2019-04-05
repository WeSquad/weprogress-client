import React, { Component } from 'react';
import { ViewAssessment } from '../..';

class AStep3 extends Component {

  render() {
    const { assessmentId } = this.props;

    return (
      <ViewAssessment id={assessmentId} shared={false} />
    );
  }
}

export default AStep3;
