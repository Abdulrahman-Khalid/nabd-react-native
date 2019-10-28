import React, { Component } from 'react';
import { Image, TouchableOpacity, Text } from 'react-native';
import { Button, Icon } from '../../components';
import { theme } from 'galio-framework';
import { Actions } from 'react-native-router-flux';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Colors, Images } from '../../constants';
import { connect } from 'react-redux';
import { setUserType, getWelcomeInfo } from '../../actions';
import axios from 'axios';
import t from '../../I18n';

const { width, height } = Dimensions.get('screen');
class WhoAmI extends Component {
  componentDidMount() {
    if (this.props.token) {
      console.log('token:', this.props.token);
      axios.defaults.headers.common['TOKEN'] = this.props.token;
      Actions.home();
    } else {
      console.log('No token');
      this.props.getWelcomeInfo();
    }
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
      <View style={styles.mainContainer}>
        <Image
          style={styles.image}
          source={Images.accountType}
          resizeMode="contain"
        />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{t.AccountType}</Text>
        </View>
        <View style={styles.switch}></View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={this.user.bind(this)}
          >
            <View style={styles.button}>
              <Text style={{ color: Colors.WHITE, fontFamily: 'Manjari-Bold' }}>
                {t.User}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={this.doctor.bind(this)}
          >
            <View style={styles.button}>
              <Text style={{ color: Colors.WHITE, fontFamily: 'Manjari-Bold' }}>
                {t.Doctor}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={this.paramedic.bind(this)}
          >
            <View style={styles.button}>
              <Text style={{ color: Colors.WHITE, fontFamily: 'Manjari-Bold' }}>
                {t.Paramedic}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={this.ambulance.bind(this)}
          >
            <View style={styles.button}>
              <Text style={{ color: Colors.WHITE, fontFamily: 'Manjari-Bold' }}>
                {t.AmbulanceDriver}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: 200,
    height: 200,
    margin: 12,
    flex: 1
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    fontFamily: 'Manjari-Regular',
    marginLeft: theme.SIZES.BASE * 2,
    marginRight: theme.SIZES.BASE * 2
  },
  description: {
    fontSize: 15,
    color: 'gray',
    textAlign: 'center',
    fontFamily: 'Manjari-Regular',
    marginLeft: theme.SIZES.BASE * 2,
    marginRight: theme.SIZES.BASE * 2
  },
  buttonsContainer: {
    flex: 1.2,
    flexDirection: 'column',
    margin: 10,
    width: '100%'
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  button: {
    width: '100%',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    flexDirection: 'row',
    backgroundColor: Colors.APP
  }
});

const mapStateToProps = state => ({
  numberUsers: state.openApp.numberUsers,
  numberParamedics: state.openApp.numberParamedics,
  numberAmbulance: state.openApp.numberAmbulance,
  numberDoctors: state.openApp.numberDoctors
});

export default connect(
  mapStateToProps,
  { setUserType, getWelcomeInfo }
)(WhoAmI);
