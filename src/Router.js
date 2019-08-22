import React, { Component } from 'react';
import { Scene, Router } from 'react-native-router-flux';
import WhoAmI from './app/welcome/WhoAmI';
import IamDoctor from './app/welcome/IamDoctor';
import IamAmbulance from './app/welcome/IamAmbulance';
import IamUser from './app/welcome/IamUser';
import IamParamedic from './app/welcome/IamParamedic';
import Register from './app/welcome/Register';
class RouterComponent extends Component {
  onAddEmployeeClicked() {
    this.props.employeeFormReset();
    Actions.employeeCreate();
  }

  render() {
    return (
      <Router
        // navigationBarStyle={{
        //   bacIamDoctorkgroundColor: '#EF171D'
        // }}
        titleStyle={{
          fontWeight: 'bold',
          color: '#000'
        }}
        tintColor="#EF171D"
      >
        {/* <Scene key="root"> */}
        <Scene key="welcome" intial headerLayoutPreset="center">
          <Scene key="whoRU" component={WhoAmI} title="Nabd" initial />
          <Scene key="iUser" component={IamUser} title="User" />
          <Scene key="iDoctor" component={IamDoctor} title="Doctor" />
          <Scene key="iParamedic" component={IamParamedic} title="Paramedic" />
          <Scene key="iAmbulance" component={IamAmbulance} title="Ambulance" />
          <Scene key="signup" component={Register} title="Sign up" />
        </Scene>
        {/* </Scene> */}
      </Router>
    );
  }
}

export default RouterComponent;
