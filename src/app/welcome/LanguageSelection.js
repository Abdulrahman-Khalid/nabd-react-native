import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  I18nManager,
  Picker,
  TouchableOpacity,
  TouchableNativeFeedback,
  NativeModules,
  ActivityIndicator,
  Platform
} from 'react-native';
import axios from 'axios';
import { connect } from 'react-redux';
import RNRestart from 'react-native-restart';
import { Colors, Images } from '../../constants';
import { switchLanguage } from '../../actions';
import { Icon } from '../../components';
import t from '../../I18n';
import { Actions } from 'react-native-router-flux';
import { Button, SwitchButton } from '../../components';
import { theme } from 'galio-framework';
import { FAB } from 'react-native-paper';

const deviceLanguage =
  Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale.substring(0, 2)
    : NativeModules.I18nManager.localeIdentifier.substring(0, 2);

class LanguageSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRtl:
        deviceLanguage == 'ar'
          ? 'rtl'
          : this.props.language.lang === 'ar'
          ? 'rtl'
          : 'ltr',
      switchText1: this.props.language.lang === 'en' ? 'English' : 'العربية',
      switchText2: this.props.language.lang === 'ar' ? 'English' : 'العربية',
      loading: true
    };
  }

  componentDidMount() {
    setTimeout(() => {
      if (this.props.token) {
        axios.defaults.headers.common['TOKEN'] = this.props.token;
        switch (this.props.userType) {
          case 'user':
            Actions.reset('userHome');
            break;
          case 'doctor':
            Actions.reset('paramedicHome');
            break;
          case 'paramedic':
            Actions.reset('paramedicHome');
            break;
          case 'ambulance':
            Actions.reset('ambulanceHome');
            break;
        }
      } else {
        console.log('No token');
        this.setState({
          loading: false
        });
      }
    }, 0);
  }

  _handlePress = lang => {
    console.log('lang: ', lang);
    if (lang !== this.props.language.lang) {
      const isRtl = lang === 'ar';
      NativeModules.I18nManager.forceRTL(isRtl);
      this.props.switchLanguage({
        lang
      });
      setTimeout(() => {
        RNRestart.Restart();
      }, 500);
    }
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffff" />
        </View>
      );
    }
    return (
      <View style={styles.mainContainer}>
        <Image
          style={styles.image}
          source={Images.language}
          resizeMode="contain"
        />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{t.LanguageScreenTitle}</Text>
          <Text style={styles.description}>{t.LangNote}</Text>
        </View>
        <View style={styles.switch}>
          <SwitchButton
            text1={this.state.switchText1}
            text2={this.state.switchText2}
            onValueChange={val => {
              const lang = this.props.language.lang === 'en' ? 'ar' : 'en';
              console.log('selected Lang: ', lang);
              this._handlePress(lang);
            }}
            fontColor="#817d84"
            activeFontColor="black"
            switchdirection={this.state.isRtl}
            intro={true}
          />
        </View>
        <FAB
          style={
            deviceLanguage == 'ar'
              ? this.props.language.lang === 'ar'
                ? styles.nextButtonAr
                : styles.nextButtonEn
              : styles.nextButtonEn
          }
          icon={
            deviceLanguage == 'ar'
              ? this.props.language.lang === 'ar'
                ? 'chevron-right'
                : 'chevron-left'
              : this.props.language.lang === 'ar'
              ? 'chevron-left'
              : 'chevron-right'
          }
          onPress={() => {
            console.log('here');
            Actions.whoRU();
          }}
        />
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
    flex: 0.5,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    marginLeft: theme.SIZES.BASE * 2,
    marginRight: theme.SIZES.BASE * 2
  },
  description: {
    fontSize: 15,
    color: 'gray',
    textAlign: 'center',
    marginLeft: theme.SIZES.BASE * 2,
    marginRight: theme.SIZES.BASE * 2
  },
  switch: {
    flex: 1
  },
  nextButtonEn: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.APP
  },
  nextButtonAr: {
    position: 'absolute',
    margin: 16,
    left: 0,
    bottom: 0,
    backgroundColor: Colors.APP
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.APP,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  }
});

const mapStateToProps = state => ({
  language: state.language,
  userType: state.signin.userType,
  token: state.signin.token
});

export default connect(mapStateToProps, { switchLanguage })(LanguageSelection);
