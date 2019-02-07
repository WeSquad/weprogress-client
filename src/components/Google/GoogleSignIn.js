import React, { Component } from 'react';
import PropTypes from 'prop-types';

const GOOGLE_BUTTON_ID = 'google-sign-in-button';

class GoogleSignIn extends Component {
  componentDidMount() {
    if (!window.gapi || window.gapi.client){
      this.props.handleError({"error": {"msg": "Pas de connexion."}})
    } else {
      window.gapi.signin2.render(
        GOOGLE_BUTTON_ID,
        {
          width: this.props.width,
          height: this.props.height,
          onsuccess: this.onSuccess,
          onfailure: this.onFailure,
          theme: this.props.theme,
        },
      );
    }
  }

  onSuccess = async (googleUser) => {
    const token = await googleUser.getAuthResponse().id_token;
    this.props.handleAuthenticate(token);
  }

  onFailure = (error) => {
    this.props.handleError(error);
  }

  render() {
    return (
      <div id={GOOGLE_BUTTON_ID}/>
    );
  }
}

GoogleSignIn.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  longTitle: PropTypes.bool,
  theme: PropTypes.oneOf(['light', 'dark']),
}

GoogleSignIn.defaultProps = {
  width: 200,
  height: 50,
  longTitle: false,
  theme: 'dark',
}

export default GoogleSignIn;
