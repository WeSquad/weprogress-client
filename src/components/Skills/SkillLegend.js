import React, { Component } from 'react';
import { Card, Typography, List, ListItem, Grid } from '@material-ui/core';
import { StarRate } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    margin: `0 0 ${theme.spacing.unit * 2}px 0`,
    padding: theme.spacing.unit * 2,
  },
  listItems: {

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
          <Grid container spacing={16}>
            <Grid item sm={7} xs={12}>
              <Card className={classes.root}>
                <Typography variant="subtitle2" gutterBottom>En terme de Hard skills</Typography>
                <List className={classes.listItems}>
                  <ListItem className={classes.listItem}>
                    <Typography>Rien : Je ne connais pas.</Typography>
                  </ListItem>
                  <ListItem className={classes.listItem}>
                    <StarRate fontSize="small" className={classes.starSvg} />
                    <Typography>: J’ai entendu parler mais je serais incapable d’en parler.</Typography>
                  </ListItem>
                  <ListItem className={classes.listItem}>
                    <StarRate fontSize="small" className={classes.starSvg} />
                    <StarRate fontSize="small" className={classes.starSvg} />
                    <Typography>: Je connais et je sais répondre à des question dessus (Niveau Requis entretien Client).</Typography>
                  </ListItem>
                  <ListItem className={classes.listItem} >
                    <StarRate fontSize="small" className={classes.starSvg} />
                    <StarRate fontSize="small" className={classes.starSvg} />
                    <StarRate fontSize="small" className={classes.starSvg} />
                    <Typography>: Je connais et je maîtrise ( J’ai déjà mis en application ).</Typography>
                  </ListItem>
                  <ListItem className={classes.listItem}>
                    <StarRate fontSize="small" className={classes.starSvg} />
                    <StarRate fontSize="small" className={classes.starSvg} />
                    <StarRate fontSize="small" className={classes.starSvg} />
                    <StarRate fontSize="small" className={classes.starSvg} />
                    <Typography>: Je peux transmettre mon savoir.</Typography>
                  </ListItem>
                </List>
              </Card>
            </Grid>
            <Grid item sm={5} xs={12}>
              <Card className={classes.root}>
                  <Typography variant="subtitle2" gutterBottom>En terme de Soft skills</Typography>
                  <List className={classes.listItems}>
                    <ListItem className={classes.listItem}>
                      <StarRate fontSize="small" className={classes.starSvg} />
                      <Typography>: Niveau 1</Typography>
                    </ListItem>
                    <ListItem className={classes.listItem}>
                      <StarRate fontSize="small" className={classes.starSvg} />
                      <StarRate fontSize="small" className={classes.starSvg} />
                      <Typography>: Niveau 2</Typography>
                    </ListItem>
                    <ListItem className={classes.listItem} >
                      <StarRate fontSize="small" className={classes.starSvg} />
                      <StarRate fontSize="small" className={classes.starSvg} />
                      <StarRate fontSize="small" className={classes.starSvg} />
                      <Typography>: Niveau 3</Typography>
                    </ListItem>
                    <ListItem className={classes.listItem}>
                      <StarRate fontSize="small" className={classes.starSvg} />
                      <StarRate fontSize="small" className={classes.starSvg} />
                      <StarRate fontSize="small" className={classes.starSvg} />
                      <StarRate fontSize="small" className={classes.starSvg} />
                      <Typography>: Niveau 4</Typography>
                    </ListItem>
                    <ListItem className={classes.listItem}>
                      <StarRate fontSize="small" className={classes.starSvg} />
                      <StarRate fontSize="small" className={classes.starSvg} />
                      <StarRate fontSize="small" className={classes.starSvg} />
                      <StarRate fontSize="small" className={classes.starSvg} />
                      <StarRate fontSize="small" className={classes.starSvg} />
                      <Typography>: Niveau 5</Typography>
                    </ListItem>
                  </List>
                </Card>
            </Grid>
          </Grid>
        );
    }
}

export default withStyles(styles)(SkillLegend);
