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
  NativeModules
} from 'react-native';
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
import { Action } from 'rxjs/internal/scheduler/Action';

class LanguageSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      switchText1: this.props.language.lang === 'en' ? 'English' : 'العربية',
      switchText2: this.props.language.lang === 'ar' ? 'English' : 'العربية'
    };
  }

  _handlePress = lang => {
    console.log('iam here nigga2');
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
    const isRtl = this.props.language.lang === 'ar' ? 'rtl' : 'ltr';
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
            switchdirection={isRtl}
          />
        </View>
        <FAB
          style={styles.nextButton}
          icon={isRtl === 'ltr' ? 'chevron-right' : 'chevron-left'}
          onPress={() => {
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
    fontFamily: 'IstokWeb-Regular',
    marginLeft: theme.SIZES.BASE * 2,
    marginRight: theme.SIZES.BASE * 2
  },
  description: {
    fontSize: 15,
    color: 'gray',
    textAlign: 'center',
    fontFamily: 'IstokWeb-Regular',
    marginLeft: theme.SIZES.BASE * 2,
    marginRight: theme.SIZES.BASE * 2
  },
  switch: {
    flex: 1
  },
  nextButton: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.APP
  }
});

const mapStateToProps = state => ({ language: state.language });

export default connect(
  mapStateToProps,
  { switchLanguage }
)(LanguageSelection);
