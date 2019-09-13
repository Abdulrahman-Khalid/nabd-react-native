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
import { argonTheme } from '../../constants';
import { switchLanguage } from '../../actions';
import { Icon } from '../../components';
import t from '../../I18n';
import { Actions } from 'react-native-router-flux';
import { Button } from '../../components';

class LanguageSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: this.props.language.lang
    };
  }
  _renderDoneButton = () => {
    return (
      <View style={styles.buttonContainer}>
        <Button
          color='white'
          textStyle={{ color: argonTheme.COLORS.BLACK }}
          onPress={this._handlePress}
        >
          {t.GetStarted}
        </Button>
      </View>
    );
  };

  _handlePress = () => {
    const { switchLanguage, language } = this.props;
    const { selectedOption } = this.state;
    if (selectedOption !== language.lang) {
      const isRtl = selectedOption === 'ar';
      NativeModules.I18nManager.forceRTL(isRtl);
      switchLanguage({
        lang: this.state.selectedOption
      });
      setTimeout(() => {
        RNRestart.Restart();
      }, 500);
      return;
    }
    Actions.typeSelection();
  };

  render() {
    return (
      <View style={styles.mainContent}>
        <Image
          source={require('../../assets/imgs/white-logo.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>{t.LanguageScreenTitle}</Text>
        <View style={{ flex: 1 }}>
          <Picker
            selectedValue={this.state.selectedOption}
            style={styles.languagePicker}
            mode="dropdown"
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ selectedOption: itemValue })
            }
          >
            <Picker.Item label="🇪🇬 العربية" value="ar" />
            <Picker.Item label="🇬🇧 English" value="en" />
          </Picker>
        </View>
        {this._renderDoneButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: argonTheme.COLORS.APP
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingHorizontal: 16
  },
  title: {
    fontSize: 20,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 30
  },
  buttonContainer: {
    flex: 0.375,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 15
  },
  languagePicker: {
    marginTop: 30,
    width: 150,
    backgroundColor: '#FFFF'
  }
});

const mapStateToProps = state => ({ language: state.language });

export default connect(
  mapStateToProps,
  { switchLanguage }
)(LanguageSelection);
