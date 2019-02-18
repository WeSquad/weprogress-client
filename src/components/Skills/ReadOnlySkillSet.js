import React, { Component } from 'react';
import { ListItem, Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import ReactStars from 'react-stars';
import ReadOnlySkillWishes from './ReadOnlySkillWishes';

const styles = theme => ({
  listItem: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  pskill: {
    paddingTop: 5,
  },
});

class ReadOnlySkillSet extends Component {
  render() {
    const { classes, skillId, skillName, skillValue, skillWishes, soft } = this.props;

    return (
      <ListItem className={classes.listItem} key={skillId}>
        <Grid container spacing={8}>
          <Grid item xs={7}>
            <Typography component="p" className={classes.pskill}>{skillName}:</Typography>
          </Grid>
          <Grid item xs={3}>
            <ReactStars
              count={soft? 5 : 4}
              size={18}
              half={false}
              color2="#fbc02d"
              value={skillValue}
              edit={false}
            />
          </Grid>
          {soft === false && (
          <Grid item xs={2}>
            <ReadOnlySkillWishes skillId={skillId} wishes={skillWishes} />
          </Grid>
          )}
        </Grid>
      </ListItem>
    );
  }
}

export default withStyles(styles)(ReadOnlySkillSet);
