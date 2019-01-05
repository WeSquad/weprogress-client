import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const JOBS_QUERY = gql`
  {
    jobs {
      id
      name
    }
  }
`;

class ListJobsSelect extends Component {
  saveAndContinue = (e) => {
    e.preventDefault();
    this.props.nextStep();
  }

  render() {
    const { values } = this.props;

    return (
      <Query query={JOBS_QUERY}>
      {({ loading, error, data }) => {
        if (loading) return "Chargement...";
        if (error) return `Error! ${error.message}`;

        return (
          <div>
            <select name="jobs" value={values.job} onChange={this.props.handleChange('job')}>
              {data.jobs.map(job => (
                <option key={job.id} value={job.id}>
                  {job.name}
                </option>
              ))}
            </select>

            <button onClick={this.saveAndContinue}>Save And Continue</button>
          </div>
        );
      }}
    </Query>
    );
  }
}

export default ListJobsSelect;
