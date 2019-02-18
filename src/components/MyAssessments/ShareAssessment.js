import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogContent, FormControl, TextField, Paper, MenuItem, DialogActions, Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { withStyles } from '@material-ui/core/styles';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import assessmentStyles from '../MakeAssessment/MakeAssessment.styles';
import { AUTH_USERNAME, AUTH_USERID } from '../../constants';

const USERS_QUERY = gql`
  {
    users {
      id
      fullName
      email
    }
  }
`;

const CREATE_SHAREDASSESSMENT_MUTATION = gql`
  mutation createSharedAssessment($input: CreateSharedAssessmentInput!) {
    createSharedAssessment(input: $input) {
      createdAt
    }
  }
`;

const CREATE_NOTIFICATION_MUTATION = gql`
  mutation createNotification($input: CreateNotificationInput!) {
    createNotification(input: $input) {
      id
    }
  }
`;

function renderInputComponent(inputProps) {
  const { classes, inputRef = () => {}, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
        classes: {
          input: classes.input,
        },
      }}
      {...other}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.fullName, query);
  const parts = parse(suggestion.fullName, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) =>
          part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{ fontWeight: 300 }}>
              {part.text}
            </strong>
          ),
        )}
      </div>
    </MenuItem>
  );
}

function getSuggestionValue(suggestion) {
  return suggestion.fullName;
}

class ShareAssessment extends Component {
  constructor(props) {
    super();

    this.state = {
      single: '',
      selectUserId: '',
      users: [],
      suggestions: [],
    };

    this.fetchUsers(props);
  };

  fetchUsers = async (props) => {
    const { client } = props;
    const { data } = await client.query({
      query: USERS_QUERY,
      fetchPolicy: "no-cache"
    });

    this.setState({
      users: data.users,
    });
  };

  getSuggestions(value) {
    const inputValue = value.trim();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0
      ? []
      : this.state.users.filter(suggestion => {
          const keep =
            count < 5 && (suggestion.fullName.includes(inputValue) || suggestion.fullName.toLowerCase().includes(inputValue.toLowerCase()))

          if (keep) {
            count += 1;
          }

          return keep;
        });
  }

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value),
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  handleChange = (event, { newValue }) => {
    this.setState({
      "single": newValue,
    });

    const user = this.state.users.find(function(o){return o.fullName === newValue;} );
    if (user) {
      this.setState({"selectUserId": user.id});
    } else {
      this.setState({"selectUserId": ""});
    }
  };

  handleSend = () => {
    const { client, assessmentId, handleDialogError } = this.props;

    client.mutate({
      mutation: CREATE_SHAREDASSESSMENT_MUTATION,
      variables: { input: {"fromId": sessionStorage.getItem(AUTH_USERID), "toId": this.state.selectUserId, "assessmentId": assessmentId} }
    }).then(() => {
      client.mutate({
        mutation: CREATE_NOTIFICATION_MUTATION,
        variables: { input: {"userId": this.state.selectUserId, "message": `${sessionStorage.getItem(AUTH_USERNAME)} vous partage son Assessment, allez y jeter un coup d'oeil dans la section dédiée.`} }
      }).then(() => {
        this.setState({"selectUserId": ""});
        this.props.handleSend();
      }).catch((error) => {
        handleDialogError(error);
      });
    }).catch((error) => {
      handleDialogError(error);
    });
  }

  handleClose = () => {
    this.setState({"single": ""});
    this.props.handleClose();
  }

  render() {
    const { classes } = this.props;
    const autosuggestProps = {
      renderInputComponent,
      suggestions: this.state.suggestions,
      onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
      getSuggestionValue,
      renderSuggestion,
    };

    return (
      <Dialog
        open={this.props.open}
        onClose={this.handleClose}
        aria-labelledby="chooseuser-dialog-title"
        className={classes.dialog}
      >
        <form className={classes.form} onSubmit={e => {e.preventDefault()}}>
          <DialogTitle id="chooseuser-dialog-title">A qui souhaitez vous le partager?</DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <FormControl className={classes.formControl}>
              <Autosuggest
              {...autosuggestProps}
              inputProps={{
                classes,
                placeholder: 'Rechercher un membre',
                value: this.state.single,
                onChange: this.handleChange,
              }}
              theme={{
                container: classes.container,
                suggestionsContainerOpen: classes.suggestionsContainerOpen,
                suggestionsList: classes.suggestionsList,
                suggestion: classes.suggestion,
              }}
              renderSuggestionsContainer={options => (
                <Paper {...options.containerProps} square>
                  {options.children}
                </Paper>
              )}
            />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleSend} color="primary" disabled={this.state.selectUserId === ''}>
              Envoyer
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
}

ShareAssessment.propTypes = {
  classes: PropTypes.object.isRequired,
  assessmentId: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSend: PropTypes.func.isRequired,
};

export default withStyles(assessmentStyles)(withApollo(ShareAssessment));
