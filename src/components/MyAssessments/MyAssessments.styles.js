import { theme } from '..';

const myAssessmentStyles = {
  heroUnit: {
    backgroundColor: theme.palette.background.paper,
    margin: -24,
  },
  heroContent: {
    maxWidth: 400,
    margin: '0 auto',
    padding: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 2}px`,
    [theme.breakpoints.up(700)]: {
      maxWidth: 700,
    },
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  cardGrid: {
    padding: `${theme.spacing.unit * 8}px 0`,
  },
};

export default myAssessmentStyles;
