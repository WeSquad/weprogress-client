import { theme } from '..';

const profileStyles = {
  paper: {
    padding: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 3,
    [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
      padding: theme.spacing.unit * 3,
    },
  },
  paperTitle: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    paddingBottom: theme.spacing.unit
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  gridItems: {
    marginBottom: 5,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
  formHelper: {
    marginTop: theme.spacing.unit * 2,
  }
};

export default profileStyles;
