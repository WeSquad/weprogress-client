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
    paddingBottom: theme.spacing.unit * 5,
    height: "40vh",
    [theme.breakpoints.up('sm')]: {
      height: "70vh",
    }
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 3
  },
  actionsButton: {
    marginRight: theme.spacing.unit * 3
  },
  dialog: {
    '& div': {
      overflowY: 'visible'
    }
  },
  dialogContent: {
    overflowY: 'visible'
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  }
};

export default assessmentStyles;
