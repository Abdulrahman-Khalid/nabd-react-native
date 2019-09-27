import React, { Component } from 'react';
import { Linking } from 'react-native';
import ReactNativeSettingsPage, {
  SectionRow,
  NavigateRow,
  CheckRow,
  SwitchRow,
  SliderRow
} from 'react-native-settings-page';

import { connect } from 'react-redux';
import RNRestart from 'react-native-restart';
import { argonTheme } from '../../constants';
import { switchLanguage } from '../../actions';
import { Icon } from '../../components';
import t from '../../I18n';
import { Actions } from 'react-native-router-flux';

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

class UserSettings extends Component {
  state = {
    check: false,
    switch: false,
    value: 40
  };

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
          <Text>Name</Text>
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
      </ReactNativeSettingsPage>
    );
  }
}

const mapStateToProps = state => ({ language: state.language });

export default connect(
  mapStateToProps,
  { switchLanguage }
)(UserSettings);

{
  /* <SectionRow text="Usage">
<NavigateRow
  text="Navigate Row"
  iconName="your-icon-name"
  onPressCallback={() =>
    Linking.openURL('https://facebook.com')
  }
/>
<SwitchRow
  text="Switch Row"
  iconName="your-icon-name"
  _value={this.state.switch}
  _onValueChange={() => {
    this.setState({ switch: !this.state.switch });
  }}
/>
<CheckRow
  text="Check Row"
  iconName="your-icon-name"
  _color="#000"
  _value={this.state.check}
  _onValueChange={() => {
    this.setState({ check: !this.state.check });
  }}
/>
<SliderRow
  text="Slider Row"
  iconName="your-icon-name"
  _color="#000"
  _min={0}
  _max={100}
  _value={this.state.value}
  _onValueChange={value => {
    this.setState({ value });
  }}
/>
</SectionRow> */
}
