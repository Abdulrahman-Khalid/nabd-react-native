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
import UserHome from './app/home/UserHome';
import WaitForAmbulance from './app/home/WaitForAmbulance';
import ParamedicHome from './app/home/ParamedicHome';
import AmbulanceHome from './app/home/AmbulanceHome';
import MainScreen from './app/videoCall/screens/MainScreen';
import UserSettings from './app/settings/UserSettings';
import AddIncident from './app/home/AddIncident';
import { Colors } from './constants';
import InjuriesList from './app/firstAid/InjuriesList';
import FirstAidDetails from './app/firstAid/FirstAidDetails';
import FirstAidDetailsWithButtons from './app/firstAid/FirstAidDetailsWithButtons';
import Incidents from './app/home/Incidents';
import { connect } from 'react-redux';
import { resetSignInReducerState, resetSignUpReducerState } from './actions';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { TouchableOpacity, Text } from 'react-native';
import { TabBar, Icon as CustomIcon } from './components';
import t from './I18n';
import IncomingCallScreen from './app/videoCall/screens/IncomingCallScreen';
import CallScreen from './app/videoCall/screens/CallScreen';
import Call from './app/videoCall/screens/Call';
import OutGoingCallScreen from './app/videoCall/screens/OutGoingCallScreen';

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

    _renderFirstAidButton() {
    return (
      <TouchableOpacity
        onPress={() => Actions.FirstAid_()}
        style={{ marginRight: 20 }}
      >
        <CustomIcon
          name="hospital"
          family="flaticon"
          size={25}
          style={{
            color: 'white'
          }}
        />
      </TouchableOpacity>
    );
  }

  _renderBackButton() {
    return (
      <TouchableOpacity
        onPress={() => Actions.pop()}
        style={{ marginLeft: 10 }}
      >
        <Icon name="arrow-left" color={Colors.WHITE} size={25} />
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
            <Scene
              key="whoRU"
              component={WhoAmI}
              title="Nabd"
              hideNavBar={false}
              renderRightButton={this._renderFirstAidButton}
            />
            <Scene
              key="FirstAid_"
              title={t.FirstAid}
            >
                <Scene hideNavBar key="InjuriesList" component={InjuriesList} />
                <Scene key="FirstAidDetails" component={FirstAidDetails} hideNavBar />
                <Scene
                  key="FirstAidDetailsWithButtons"
                  component={FirstAidDetailsWithButtons}
                />
              </Scene>
            <Scene key="iUser" component={IamUser} title={t.User} />
            <Scene key="iDoctor" component={IamDoctor} title={t.Doctor} />
            <Scene
              key="iParamedic"
              component={IamParamedic}
              title={t.Paramedic}
            />
            <Scene
              key="iAmbulance"
              component={IamAmbulance}
              title={t.Ambulance}
            />
            <Scene
              key="signup"
              component={Register}
              onExit={() => {
                this.props.resetSignUpReducerState();
              }}
              title={t.SignUp}
            />
            <Scene
              key="signin"
              component={SignIn}
              onExit={() => {
                this.props.resetSignInReducerState();
              }}
              title={t.SignIn}
            />
            <Scene
              key="verifySignup"
              component={VerifySignup}
              title={t.Verify}
            />

          </Scene>
          <Scene key="userHome" hideNavBar={true}>
            <Tabs
              key="tabBar"
              initial
              lazy={true}
              tabBarComponent={TabBar}
              renderRightButton={this._renderSettingsButton}
            >
              <Scene
                key="Home"
                component={UserHome}
                title={t.Home}
                icon={() => <Icon name="home" size={25} />}
              />
              <Scene
                key="Incidents"
                component={Incidents}
                title={t.Incidents}
                hideNavBar
                icon={() => <Icon name="lifebuoy" size={25} />}
              />
              <Scene
                key="FirstAid"
                title={t.FirstAid}
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
              key="waitForAmbulance"
              component={WaitForAmbulance}
              title="Choose Pickup Location"
              hideNavBar={false}
            />
            <Scene
              key="UserSettings"
              component={UserSettings}
              title={t.Settings}
              renderLeftButton={this._renderBackButton}
              title={t.Settings}
              hideNavBar={false}
            />
            <Scene
              key="AddIncident"
              component={AddIncident}
              title={t.AddIncident}
              hideNavBar={false}
            />
          </Scene>
          <Scene
            key="main"
            component={MainScreen}
            title="Incidents"
            icon={() => <Icon name="lifebuoy" size={25} />}
          />
          <Scene key="paramedicHome" component={ParamedicHome} title={t.Home} />
          <Scene key="ambulanceHome" component={AmbulanceHome} title={t.Home} />
          <Scene key="CallScreen" component={CallScreen} hideNavBar={true} />
          {/* <Scene key="Call" component={Call} hideNavBar={true} /> */}
          {/* <Scene
            key="OutGoingCall"
            component={OutGoingCallScreen}
          /> */}

          <Scene
            key="IncomingCall"
            component={IncomingCallScreen}
            hideNavBar={true}
          />
        </Scene>
      </Router>
    );
  }
}

export default connect(
  null,
  { resetSignUpReducerState, resetSignInReducerState }
)(RouterComponent);
