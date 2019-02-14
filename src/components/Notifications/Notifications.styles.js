import { theme } from '..';

const notificationsStyles = {
  notificationContainer: {
    margin: `${theme.spacing.unit * 2}px 0`,
    padding: theme.spacing.unit * 2,
    display: "flex",
  },
  notificationText: {
    alignSelf: "start",
    paddingLeft: 10
  },
  notificationNewText: {
    alignSelf: "start"
  }
};

export default notificationsStyles;
