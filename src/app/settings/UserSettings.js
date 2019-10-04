import React, { Component } from 'react';
import { Linking, Share } from 'react-native';
import ReactNativeSettingsPage, {
  SectionRow,
  NavigateRow
} from 'react-native-settings-page';
import { connect } from 'react-redux';
import RNRestart from 'react-native-restart';
import { switchLanguage } from '../../actions';
import { Actions } from 'react-native-router-flux';
import TextDisplay from './TextDisplay';
import { View, Picker } from 'react-native';

import email from 'react-native-email';

class UserSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: this.props.language.lang
    };
  }

  // langSelection = () => {
  //   const { switchLanguage, language } = this.props;
  //   const { selectedOption } = this.state;
  //   if (selectedOption !== language.lang) {
  //     const isRtl = selectedOption === 'ar';
  //     NativeModules.I18nManager.forceRTL(isRtl);
  //     switchLanguage({
  //       lang: this.state.selectedOption
  //     });
  //     setTimeout(() => {
  //       RNRestart.Restart();
  //     }, 500);
  //     return;
  //   }
  // };

  render() {
    return (
      <ReactNativeSettingsPage>
        <SectionRow text="Profile">
          <TextDisplay iconName="user" text="Username" value="value" />
          <TextDisplay iconName="lock" text="Password" value="value" />
          <TextDisplay iconName="phone" text="Phone Number" value="value" />
        </SectionRow>
        <SectionRow text="Language">
          <View style={{ flex: 1 }}>
            <Picker
              selectedValue={this.state.selectedOption}
              // style={styles.languagePicker}
              // mode="dialog"
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ selectedOption: itemValue })
              }
            >
              <Picker.Item label="🇪🇬 العربية" value="ar" />
              <Picker.Item label="🇬🇧 English" value="en" />
            </Picker>
          </View>
        </SectionRow>

        <SectionRow text="Connect With Us">
          <NavigateRow
            text="Facebook"
            iconName="facebook"
            onPressCallback={() => Linking.openURL('https://facebook.com')}
          />
          <NavigateRow
            text="Twitter"
            iconName="twitter"
            onPressCallback={() => Linking.openURL('https://twitter.com')}
          />
        </SectionRow>
        <SectionRow text="Help us grow">
          <NavigateRow
            text="Send us feedback"
            iconName="envelope"
            onPressCallback={() => {
              const to = ['nadaashraf11@icloud.com'];
              email(to, {
                subject: 'Nabd app feedback'
              }).catch(console.error);
            }}
          />
          <NavigateRow
            text="Share Nabd"
            iconName="share-square"
            onPressCallback={() => {
              Share.share({
                message: 'Help people in emergencies with #Nabd app'
              });
            }}
          />
        </SectionRow>
      </ReactNativeSettingsPage>
    );
  }
}

const mapStateToProps = state => ({ language: state.language });

export default connect(
  mapStateToProps,
  { switchLanguage }
)(UserSettings);
