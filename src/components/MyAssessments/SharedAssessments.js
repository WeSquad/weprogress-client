import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import myAssessmentStyles from './MyAssessments.styles';
import { Typography} from '@material-ui/core';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';

import SharedAssessmentSummary from './SharedAssessmentSummary';

const MY_SHARED_ASSESSMENTS_QUERY = gql`
  {
    sharedAssessmentsTo {
      id
      from {
        id
        fullName
        email
        picture
      }
      assessment {
        id
        createdAt
        job {
          name
        }
      }
    }
  }
`;


class SharedAssessments extends Component {
  constructor(props) {
    super();
    this.state = {
      loadingQuery: true,
      sharedAssessments: [],
    };

    this.fetchSharedAssessments(props);
  };

  async fetchSharedAssessments(props) {
    const { client } = props;
    const { data } = await client.query({
      query: MY_SHARED_ASSESSMENTS_QUERY,
      fetchPolicy: "no-cache"
    });

    this.setState({
      sharedAssessments: data.sharedAssessmentsTo,
      loadingQuery: false,
    });
  };

  render() {
    const { classes } = this.props;
    const { sharedAssessments } = this.state;

    return (
      <>
        <div className={classes.heroUnit}>
          <div className={classes.heroContent}>
            <Typography component="h1" variant="h3" align="center" color="textPrimary" gutterBottom>
              Les assessment partagés
            </Typography>
            <Typography variant="subtitle2" align="center" color="textSecondary" paragraph>
              Vous trouvez dans cet espace les auto-évaluations que des membres ont souhaités vous partager.
              Le but est de les relire / challenger et commenter les éléments nécessaires.
            </Typography>
          </div>
        </div>
        <div className={classes.layout}>
          {sharedAssessments.map(shared => {
            return <SharedAssessmentSummary shared={shared} key={shared.id} />
          })}
        </div>
      </>
    );
  }
}

export default withStyles(myAssessmentStyles)(withApollo(SharedAssessments));
