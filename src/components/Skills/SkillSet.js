import React, { Component } from 'react';
import { ListItem, Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import ReactStars from 'react-stars';
import SkillWishes from './SkillWishes';

const styles = theme => ({
  listItem: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  pskill: {
    paddingTop: 5,
  },
});

class SkillSet extends Component {
  render() {
    const { classes, skillId, skillName, axeId } = this.props;

    return (
      <ListItem className={classes.listItem} key={skillId}>
        <Grid container spacing={8}>
          <Grid item xs={7}>
            <Typography component="p" className={classes.pskill}>{skillName}:</Typography>
          </Grid>
          <Grid item xs={3}>
            <ReactStars
              count={4}
              size={18}
              half={false}
              color2="#fbc02d"
              onChange={ratingChanged => {this.props.handleRating(ratingChanged, skillId, axeId)}}
              value={this.props.skillValue(skillId, axeId)}
            />
          </Grid>
          <Grid item xs={2}>
            <SkillWishes handleWishes={this.props.handleWishes} skillId={skillId} axeId={axeId} wishes={this.props.skillWishes} />
          </Grid>
        </Grid>
      </ListItem>
    );
  }
}

export default withStyles(styles)(SkillSet);
