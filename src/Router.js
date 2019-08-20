import React, { Component } from 'react';
import { Scene, Router } from 'react-native-router-flux';

class RouterComponent extends Component {
  onAddEmployeeClicked() {
    this.props.employeeFormReset();
    Actions.employeeCreate();
  }

  render() {
    return (
      <Router>
        <Scene key="root" hideNavBar />
      </Router>
    );
  }
}

export default RouterComponent;
