import { theme } from '..';

const assessmentStyles = {
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 3,
    [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
      padding: theme.spacing.unit * 3,
    },
    position: 'relative',
  },
  fab: {
    position: 'absolute',
    top: -18,
    right: 20,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
  },
  formControl: {
    marginTop: theme.spacing.unit * 2,
    minWidth: 120,
  },
  stepper: {
    padding: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 5}px`,
    background: 'transparent',
  },
  gridItems: {
    marginBottom: 5,
  },
  jobTitle: {
    paddingBottom: theme.spacing.unit * 3,
  },
  listItem: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  pskill: {
    paddingTop: 5,
  },
  canvasContainer: {
    height: "40vh",
    [theme.breakpoints.up('sm')]: {
      height: "70vh",
    }
  }
};

export default assessmentStyles;
