import { createMuiTheme } from '@material-ui/core/styles';
import indigo from '@material-ui/core/colors/indigo';
import pink from '@material-ui/core/colors/pink';
import red from '@material-ui/core/colors/red';

const theme = createMuiTheme({
  palette: {
    primary: indigo, // Purple and green play nicely together.
    secondary: pink, // This is just green.A700 as hex.
    error: red,
  },
  typography: { useNextVariants: true },
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: "0.8em",
        color: "white",
        backgroundColor: "black",
        opacity: "0.5"
      }
    }
  }
});

export default theme;
