import React, { Component } from 'react';
import { Linking, Share,I18nManager } from 'react-native';
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
import t from '../../I18n';
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
      <ReactNativeSettingsPage >
        <SectionRow text={t.Profile}>
          <TextDisplay iconName="user" text={t.Username} />
          <TextDisplay iconName="lock" text={t.Password}  />
          <TextDisplay iconName="phone" text={t.PhoneNumber}  />
        </SectionRow>
        <SectionRow text={t.Language}>
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

        <SectionRow text={t.ContactWithUs}>
          <NavigateRow
            text={t.Facebook}
            iconName="facebook"
            onPressCallback={() =>
              Linking.openURL(
                'https://www.facebook.com/تطبيق-نبض-Nabd-App-108933110525150/'
              )
            }
          />
          <NavigateRow
            text={t.Twitter}
            iconName="twitter"
            onPressCallback={() =>
              Linking.openURL('https://twitter.com/NabdEmergApp')
            }
          />
        </SectionRow>
        <SectionRow text={t.HelpUs}>
          <NavigateRow
            text={t.SendUsFeedback}
            iconName="envelope"
            onPressCallback={() => {
              const to = ['nabd_app@hotmail.com'];
              email(to, {
                subject: t.EmailTitle
              }).catch(console.error);
            }}
          />
          <NavigateRow
            text={t.ShareNabd}
            iconName="share-square"
            onPressCallback={() => {
              Share.share({
                message: t.ShareMsg
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
