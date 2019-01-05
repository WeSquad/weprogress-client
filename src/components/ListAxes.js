import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const AXES_QUERY = gql`
  query Job($id: ID!) {
    job(id: $id) {
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

class ListAxes extends Component {
  back  = (e) => {
    e.preventDefault();
    this.props.prevStep();
  }

  render() {
    return (
      <Query query={AXES_QUERY} variables={{id: this.props.jobid}}>
      {({ loading, error, data }) => {
        if (loading) return "Chargement...";
        if (error) return `Error! ${error.message}`;

        return (
          <div>
            <div id="jobs">
              {data.job.axes.map(axe => (
                <div className="job" key={axe.id}>
                  <h2>{axe.name}</h2>
                  {axe.skills.map(skill => (
                    <p key={skill.id}>{skill.name}</p>
                  ))}
                </div>
              ))}
            </div>
            <button onClick={this.back}>Back</button>
          </div>
        );
      }}
    </Query>
    );
  }
}

export default ListAxes;
