import React, { Component } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { Button } from '../../components';
import { Block, Text, Button as GaButton, theme } from 'galio-framework';
import { Actions } from 'react-native-router-flux';
import { StyleSheet, Dimensions } from 'react-native';
import { argonTheme } from '../../constants';
import { connect } from 'react-redux';
import { setUserType, getWelcomeInfo } from '../../actions';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import SplashScreen from 'react-native-splash-screen';

const { width, height } = Dimensions.get('screen');

class WhoAmI extends Component {
  componentDidMount() {
    SplashScreen.hide();
    (async () => {
      await AsyncStorage.getItem('@app:session')
        .then(token => {
          console.log('check token');
          if (token) {
            console.log('token:', token);
            axios.defaults.headers.common['TOKEN'] = token;
            Actions.home();
          } else {
            console.log('No token');
            this.props.getWelcomeInfo();
          }
        })
        .catch(error => {
          console.log(error);
          this.props.getWelcomeInfo();
        });
    })();
  }

  ambulance() {
    this.props.setUserType('ambulance');
    Actions.iAmbulance();
  }

  doctor() {
    this.props.setUserType('doctor');
    Actions.iDoctor();
  }

  user() {
    this.props.setUserType('user');
    Actions.iUser();
  }

  paramedic() {
    this.props.setUserType('paramedic');
    Actions.iParamedic();
  }

  render() {
    return (
      <Block flex style={{ backgroundColor: '#ffffff' }}>
        <Block>
          <Block>
            <Block
              style={{
                flexWrap: 'wrap',
                left: 15,
                top: 15
              }}
            >
              <Block>
                <Block center style={{ marginBottom: 4 }}>
                  <Text style={styles.numberText}>
                    {this.props.numberUsers}
                  </Text>
                  <Text style={styles.textStyle}>Users</Text>
                </Block>
              </Block>
              <Block>
                <Block center>
                  <Text style={styles.numberText}>
                    {this.props.numberDoctors}
                  </Text>
                  <Text style={styles.textStyle}>Doctors</Text>
                </Block>
              </Block>
            </Block>
            <Block style={{ position: 'absolute', right: 15, top: 15 }}>
              <Block>
                <Block center tyle={{ marginBottom: 4 }}>
                  <Text style={styles.numberText}>
                    {this.props.numberParamedics}
                  </Text>
                  <Text style={styles.textStyle}>paramedic</Text>
                </Block>
              </Block>
              <Block>
                <Block center>
                  <Text style={styles.numberText}>
                    {this.props.numberAmbulance}
                  </Text>
                  <Text style={styles.textStyle}>Ambulance</Text>
                </Block>
              </Block>
            </Block>
          </Block>
        </Block>
        <Block style={{ alignIems: 'center', justifyContent: 'flex-end' }}>
          <Block center>
            <Image
              style={styles.image}
              source={require('../../assets/imgs/ancient_egypt.jpg')}
            />
          </Block>
          {/* <Block center style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: '700' }}>Nabd Egypt</Text>
          </Block> */}
        </Block>
        <Block center style={{ position: 'absolute', bottom: 10 }}>
          <Button
            color="warning"
            style={styles.button}
            textStyle={styles.buttonText}
            onPress={this.user.bind(this)}
          >
            I am a user
          </Button>
          <Button
            color="warning"
            style={styles.button}
            textStyle={styles.buttonText}
            onPress={this.doctor.bind(this)}
          >
            I am a doctor
          </Button>
          <Button
            color="warning"
            style={styles.button}
            textStyle={styles.buttonText}
            onPress={this.paramedic.bind(this)}
          >
            I am a paramedic
          </Button>
          <Button
            color="warning"
            style={styles.button}
            textStyle={styles.buttonText}
            onPress={this.ambulance.bind(this)}
          >
            Ambulance
          </Button>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    marginBottom: theme.SIZES.BASE,
    width: width - theme.SIZES.BASE * 2,
    height: height / 15,
    backgroundColor: argonTheme.COLORS.APP,
    borderRadius: 5
  },
  buttonText: { fontSize: 20, fontWeight: '700' },
  numberText: { fontSize: 20, color: '#000' },
  typeText: { fontSize: 18, color: '#A9A9A9' },
  image: {
    width: 200,
    height: 200,
    borderRadius: 200 / 2,
    marginBottom: 10
  },
  textStyle: {
    color: '#484848'
  }
});

const mapStateToProps = state => {
  return ({
    numberUsers,
    numberParamedics,
    numberAmbulance,
    numberDoctors
  } = state.openApp);
};
export default connect(
  mapStateToProps,
  { setUserType, getWelcomeInfo }
)(WhoAmI);
