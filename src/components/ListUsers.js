import React, { Component } from 'react';
import User from './User';
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const FEED_QUERY = gql`
  {
    users {
      id
      firstName
      lastName
      jobs {
        id
        name
      }
    }
  }
`

class ListUsers extends Component {
  render() {
    return (
      <Query query={FEED_QUERY}>
        {({ loading, error, data }) => {
          if (loading) return <div>Fetching</div>
          if (error) return <div>Error</div>

          const usersToRender = data.users

          return (
            <div>
              {usersToRender.map(user => <User key={user.id} user={user} />)}
            </div>
          )
        }}
      </Query>
    )
  }
}

export default ListUsers;
