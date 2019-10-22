import React, { Component } from 'react';
import { Scene, Router, Actions, Tabs } from 'react-native-router-flux';
import WhoAmI from './app/welcome/WhoAmI';
import IamDoctor from './app/welcome/IamDoctor';
import IamAmbulance from './app/welcome/IamAmbulance';
import IamUser from './app/welcome/IamUser';
import IamParamedic from './app/welcome/IamParamedic';
import Register from './app/welcome/Register';
import VerifySignup from './app/welcome/PhoneVerification/Animated';
import SignIn from './app/welcome/SignIn';
import LanguageSelection from './app/welcome/LanguageSelection';
import UserAndDoctorHome from './app/home/UserAndDoctorHome';
import ParamedicHome from './app/home/ParamedicHome';
import AmbulanceHome from './app/home/AmbulanceHome';
import Incidents from './app/home/Incidents';
import UserSettings from './app/settings/UserSettings';
import AddIncident from './app/home/AddIncident';
import { Colors } from './constants';
import InjuriesList from './app/firstAid/InjuriesList';
import FirstAidDetails from './app/firstAid/FirstAidDetails';
import FirstAidDetailsWithButtons from './app/firstAid/FirstAidDetailsWithButtons';
import { connect } from 'react-redux';
import { resetSignInReducerState, resetSignUpReducerState } from './actions';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { TouchableOpacity, Text } from 'react-native';
import { TabBar, Icon as CustomIcon } from './components';

class RouterComponent extends Component {
  _renderSettingsButton() {
    return (
      <TouchableOpacity
        onPress={() => Actions.UserSettings()}
        style={{ marginRight: 20 }}
      >
        <CustomIcon
          name="gear-option"
          family="flaticon"
          size={20}
          style={{
            color: 'white'
          }}
        />
      </TouchableOpacity>
    );
  }
  render() {
    return (
      <Router
        titleStyle={{
          fontWeight: 'bold',
          fontSize: 20,
          color: 'white'
        }}
        tintColor="white"
      >
        <Scene
          key="root"
          hideNavBar
          initial
          headerLayoutPreset="center"
          navigationBarStyle={{
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            height: 60,
            backgroundColor: Colors.APP,
            color: 'white'
          }}
        >
          <Scene key="welcome" initial>
            <Scene
              key="languageSelection"
              component={LanguageSelection}
              hideNavBar={true}
            />
          </Scene>
          <Scene key="typeSelection">
            <Scene key="whoRU" component={WhoAmI} hideNavBar={true} />
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
            <Scene
              key="signup"
              component={Register}
              onExit={() => {
                this.props.resetSignUpReducerState();
              }}
              title="Sign up"
            />
            <Scene
              key="signin"
              component={SignIn}
              onExit={() => {
                this.props.resetSignInReducerState();
              }}
              title="Sign in"
            />
            <Scene key="verifySignup" component={VerifySignup} title="Verify" />
          </Scene>
          <Scene key="userAndDoctor" initial hideNavBar={true}>
            <Tabs
              key="tabBar"
              // headerLayoutPreset="left"
              initial
              lazy={true}
              tabBarComponent={TabBar}
              renderRightButton={this._renderSettingsButton}
            >
              <Scene
                key="Home"
                component={UserAndDoctorHome}
                title="Home"
                icon={() => <Icon name="home" size={25} />}
              />
              <Scene
                key="Incidents"
                component={Incidents}
                title="Incidents"
                hideNavBar
                icon={() => <Icon name="lifebuoy" size={25} />}
              />
              <Scene
                key="FirstAid"
                title="First Aid"
                icon={() => <Icon name="hospital" size={25} />}
              >
                <Scene hideNavBar key="InjuriesList" component={InjuriesList} />
                <Scene key="FirstAidDetails" component={FirstAidDetails} />
                <Scene
                  key="FirstAidDetailsWithButtons"
                  component={FirstAidDetailsWithButtons}
                />
              </Scene>
            </Tabs>
            <Scene
              key="UserSettings"
              component={UserSettings}
              title="Settings"
              hideNavBar={false}
            />
            <Scene
              key="AddIncident"
              component={AddIncident}
              title="Add Incident"
              hideNavBar={false}
            />
          </Scene>
          <Scene key="paramedicHome" component={ParamedicHome} title="Home" />
          <Scene key="ambulanceHome" component={AmbulanceHome} title="Home" />
        </Scene>
      </Router>
    );
  }
}

export default connect(
  null,
  { resetSignUpReducerState, resetSignInReducerState }
)(RouterComponent);
