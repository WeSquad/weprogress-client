import React, { Component } from 'react';

class User extends Component {
  render() {
    return (
      <div>
        <div>
          {this.props.user.firstName} {this.props.user.lastName}
        </div>
      </div>
    )
  }
}

export default User;
