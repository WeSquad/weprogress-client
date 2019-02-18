import React, { Component } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { NotInterested, Favorite, School } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { lightGreen } from '@material-ui/core/colors';

const styles = theme => ({
  button: {
    padding: theme.spacing.unit / 3,
  },
});

class ReadOnlySkillWishes extends Component {
  state = {
    interest: this.props.wishes.interest,
    training: this.props.wishes.training,
    noMore: this.props.wishes.noMore
  };

  render() {
    const { classes } = this.props;
    const { interest, training, noMore } = this.state;

    return (
      <div>
        <Tooltip title="J'adore ça" aria-label="J'adore ça" placement="top">
          <IconButton className={classes.button}>
            <Favorite fontSize="small" color={interest? "primary" : "inherit"} />
          </IconButton>
        </Tooltip>
        <Tooltip title="J'ai besoin de training" aria-label="J'ai besoin de training" placement="top">
          <IconButton className={classes.button}>
            <School fontSize="small" nativeColor={training? lightGreen[700] : ''} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Je ne veux plus pratiquer" aria-label="Je ne veux plus pratiquer" placement="top">
          <IconButton className={classes.button} aria-label="Je ne suis plus intéressé">
            <NotInterested fontSize="small" color={noMore? "secondary" : "inherit"} />
          </IconButton>
        </Tooltip>
      </div>
    )
  }
}

export default withStyles(styles)(ReadOnlySkillWishes);
