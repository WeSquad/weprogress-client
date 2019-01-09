import { createMuiTheme } from '@material-ui/core/styles';
import indigo from '@material-ui/core/colors/indigo';
import pink from '@material-ui/core/colors/pink';

const drawerWidth = 240;

export const theme = createMuiTheme({
  palette: {
    primary: indigo, // Purple and green play nicely together.
    secondary: pink, // This is just green.A700 as hex.
  },
  typography: { useNextVariants: true },
});

export const layoutStyles = {
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    [theme.breakpoints.up('sm')]: {
      width: '100%',
    },
  },
  menuButton: {
    marginRight: 20,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  title: {
    flexGrow: 1,
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up('sm')]: {
      marginTop: 64
    }
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
  menuItem: {
    color: 'black',
  }
};

export const drawerStyles = {
  menuLink: {
    textDecoration: 'none'
  }
};

export const authStyles = {
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
  errorMsg: {
    color: 'red'
  },
  createAccount: {
    marginTop: theme.spacing.unit * 2,
    '& a': {
      color: theme.palette.primary.main,
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline'
      }
    }
  }
};

export const profileStyles = {
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

export const assessmentStyles = {
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
};

