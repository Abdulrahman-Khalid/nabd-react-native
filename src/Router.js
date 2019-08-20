import React, { Component } from 'react';
import { Scene, Router } from 'react-native-router-flux';
import WelcomeScreen from './components/app/welcome/WelcomeScreen';
class RouterComponent extends Component {
  onAddEmployeeClicked() {
    this.props.employeeFormReset();
    Actions.employeeCreate();
  }

  render() {
    return (
      <Router>
        <Scene key="root">
          <Scene key="welcome" component={WelcomeScreen} title="Nabd" initial />
        </Scene>
      </Router>
    );
  }
}

export default RouterComponent;
