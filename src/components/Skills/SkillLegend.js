import React, { Component } from 'react';
import { Card, Typography, List, ListItem } from '@material-ui/core';
import { StarRate } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    margin: `0 0 ${theme.spacing.unit * 2}px 0`,
  },
  listItems: {
    padding: theme.spacing.unit * 2,
  },
  listItem: {
    padding: 0
  },
  starSvg: {
    color: '#fbc02d'
  }
});

class SkillLegend extends Component {
    render() {
        const { classes } = this.props;

        return (
            <Card className={classes.root}>
              <List className={classes.listItems}>
                <ListItem className={classes.listItem}>
                  <Typography>Rien : Je ne connais pas du tout cette compétence.</Typography>
                </ListItem>
                <ListItem className={classes.listItem}>
                  <StarRate fontSize="small" className={classes.starSvg} />
                  <Typography>: J'en ai entendu parlé</Typography>
                </ListItem>
                <ListItem className={classes.listItem}>
                  <StarRate fontSize="small" className={classes.starSvg} />
                  <StarRate fontSize="small" className={classes.starSvg} />
                  <Typography>: J'ai étudié le sujet et je peux répondre à des questions théoriques.</Typography>
                </ListItem>
                <ListItem className={classes.listItem} >
                  <StarRate fontSize="small" className={classes.starSvg} />
                  <StarRate fontSize="small" className={classes.starSvg} />
                  <StarRate fontSize="small" className={classes.starSvg} />
                  <Typography>: J'ai déjà pratiqué. J'ai de l'expérience.</Typography>
                </ListItem>
                <ListItem className={classes.listItem}>
                  <StarRate fontSize="small" className={classes.starSvg} />
                  <StarRate fontSize="small" className={classes.starSvg} />
                  <StarRate fontSize="small" className={classes.starSvg} />
                  <StarRate fontSize="small" className={classes.starSvg} />
                  <Typography>: Je maitrise ce sujet et je peux former des gens dessus. Je peux transmettre mon savoir.</Typography>
                </ListItem>
              </List>
            </Card>
        );
    }
}

export default withStyles(styles)(SkillLegend);
