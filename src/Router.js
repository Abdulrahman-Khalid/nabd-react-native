import React, { Component } from 'react';
import { Scene, Router } from 'react-native-router-flux';
import WelcomeScreen from './app/welcome/WelcomeScreen';

class RouterComponent extends Component {
  onAddEmployeeClicked() {
    this.props.employeeFormReset();
    Actions.employeeCreate();
  }

  render() {
    return (
      <Router
        navigationBarStyle={{
          backgroundColor: '#EF171D'
        }}
        titleStyle={{ fontWeight: 'bold', color: '#fff' }}
      >
        <Scene key="root">
          <Scene key="welcome" component={WelcomeScreen} title="Nabd" initial />
        </Scene>
      </Router>
    );
  }
}

export default RouterComponent;
