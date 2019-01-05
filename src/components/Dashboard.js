import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';

class Dashboard extends Component {
  render() {

    return (
      <>
        <Typography variant="h4" gutterBottom component="h2">
          Orders
        </Typography>
        <Typography component="div">
          pwet
        </Typography>
        <Typography variant="h4" gutterBottom component="h2">
          Products
        </Typography>
        <div>
          pwet 2 <Checkbox defaultChecked color="secondary" />
        </div>
      </>
    );
  }
}

export default Dashboard;
