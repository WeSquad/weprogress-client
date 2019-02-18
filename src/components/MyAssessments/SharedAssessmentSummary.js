import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Typography, Paper, Button, Avatar } from '@material-ui/core';
import FaceIcon from '@material-ui/icons/Face';
import { Link } from 'react-router-dom';

const styles = theme => ({
  root: {
    marginBottom: theme.spacing.unit * 3,
  },
  paper: {
    padding: theme.spacing.unit * 3,
    textAlign: 'left',
    color: theme.palette.text.secondary
  },
  avatar: {
    margin: theme.spacing.unit * 2,
    backgroundColor: theme.palette.grey['200'],
    color: theme.palette.text.primary,
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing.unit
    }
  },
  itemContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }
  },
  baseline: {
    alignSelf: 'baseline',
    marginLeft: theme.spacing.unit * 4,
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'center',
      alignItems: 'center',
      width: '100%',
      marginTop: theme.spacing.unit * 2,
      marginBottom: theme.spacing.unit * 2,
      marginLeft: 0
    }
  },
  inline: {
    display: 'inline-block',
    marginLeft: theme.spacing.unit * 4,
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0
    }
  },
  inlineRight: {
    marginLeft: "auto",
  },
  secondary: {
    marginLeft: theme.spacing.unit * 2
  }
})

class SharedAssessmentSummary extends Component {

  render() {
    const { classes, shared } = this.props;

    let date = new Date(shared.assessment.createdAt);
    let formattedDate = date.toLocaleDateString("fr-FR");
    let hourMinutes = `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <div className={classes.itemContainer}>
            <div className={classes.avatarContainer}>
              {shared.from.picture? (
                <Avatar className={classes.avatar} src={shared.from.picture}/>
              ) : (
                <Avatar className={classes.avatar}>
                  <FaceIcon />
                </Avatar>
              )}
            </div>
            <div className={classes.baseline}>
              <div className={classes.inline}>
                <Typography style={{ textTransform: 'uppercase' }} color='primary' gutterBottom>
                  Métier
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {shared.assessment.job.name}
                </Typography>
              </div>
              <div className={classes.inline}>
                <Typography style={{ textTransform: 'uppercase' }} color='primary' gutterBottom>
                  Partagé par
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {shared.from.fullName}
                </Typography>
              </div>
              <div className={classes.inline}>
                <Typography style={{ textTransform: 'uppercase' }} color='primary' gutterBottom>
                  Date
                </Typography>
                <Typography variant="h6" gutterBottom>
                Le {formattedDate} à {hourMinutes}
                </Typography>
              </div>
            </div>
            <div className={classes.inlineRight}>
              <div>
                <Button className={classes.primary} component={({...props}) => <Link to={"/viewsharedassessment/" + shared.assessment.id} {...props} />}>
                  Afficher
                </Button>
              </div>
            </div>
          </div>
        </Paper>
      </div>
    )
  }
}

export default withStyles(styles)(SharedAssessmentSummary);
