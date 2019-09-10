import React, { Component } from 'react';
import { Scene, Router } from 'react-native-router-flux';
import WhoAmI from './app/welcome/WhoAmI';
import IamDoctor from './app/welcome/IamDoctor';
import IamAmbulance from './app/welcome/IamAmbulance';
import IamUser from './app/welcome/IamUser';
import IamParamedic from './app/welcome/IamParamedic';
import Register from './app/welcome/Register';
import VerifySignup from './app/welcome/PhoneVerification/Animated';
import SignIn from './app/welcome/SignIn';
import UserAndDoctorHome from './app/home/UserAndDoctorHome';
import ParamedicHome from './app/home/ParamedicHome';
import AmbulanceHome from './app/home/AmbulanceHome';
import { argonTheme } from './constants';
import InjuriesList from './app/firstAid/InjuriesList';
import FirstAidDetails from './app/firstAid/FirstAidDetails';
import FirstAidDetailsWithButtons from './app/firstAid/FirstAidDetailsWithButtons';
class RouterComponent extends Component {
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
        tintColor={argonTheme.COLORS.APP}
      >
        <Scene key="root" hideNavBar initial>
          <Scene key="welcome" headerLayoutPreset="center">
            <Scene key="whoRU" component={WhoAmI} title="Nabd" initial />
            <Scene key="iUser" component={IamUser} title="User" />
            <Scene key="iDoctor" component={IamDoctor} title="Doctor" />
            <Scene
              key="iParamedic"
              component={IamParamedic}
              title="Paramedic"
            />
            <Scene
              key="iAmbulance"
              component={IamAmbulance}
              title="Ambulance"
            />
            <Scene key="signup" component={Register} title="Sign up" />
            <Scene key="signin" component={SignIn} title="Sign in" />
            <Scene key="verifySignup" component={VerifySignup} title="Verify" />
          </Scene>

          <Scene key="home" headerLayoutPreset="center">
            <Scene
              key="userAndDoctorHome"
              component={UserAndDoctorHome}
              title="Home"
            />
            <Scene key="paramedicHome" component={ParamedicHome} title="Home" />
            <Scene key="ambulanceHome" component={AmbulanceHome} title="Home" />
          </Scene>

          <Scene key="FirstAid" headerLayoutPreset="center">
            <Scene key="InjuriesList" component={InjuriesList} hideNavBar />
            <Scene key="FirstAidDetails" component={FirstAidDetails} />
            <Scene
              key="FirstAidDetailsWithButtons"
              component={FirstAidDetailsWithButtons}
            />
          </Scene>
        </Scene>
      </Router>
    );
  }
}

export default RouterComponent;
