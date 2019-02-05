import React, { Component } from 'react';
import { IconButton } from '@material-ui/core';
import { NotInterested, Favorite, SupervisedUserCircle } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  button: {
    padding: theme.spacing.unit / 3,
  },
});


class SkillWishes extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div>
        <IconButton className={classes.button} aria-label="J'adore">
          <Favorite fontSize="small" />
        </IconButton>
        <IconButton className={classes.button} aria-label="J'adore">
          <SupervisedUserCircle fontSize="small" />
        </IconButton>
        <IconButton className={classes.button} aria-label="Je ne suis plus intéressé">
          <NotInterested fontSize="small" />
        </IconButton>
      </div>
    )
  }
}

export default withStyles(styles)(SkillWishes);
