import React, { Component } from 'react';
import { Linking } from 'react-native';

import ReactNativeSettingsPage, {
  SectionRow,
  NavigateRow,
  CheckRow,
  SwitchRow,
  SliderRow
} from 'react-native-settings-page';

class UserSettings extends Component {
  // TODO: implement your navigationOptions
  state = {
    check: false,
    switch: false,
    value: 40
  };
  // _navigateToScreen = () => {
  //   // ()=> Linking.openURL('https://reactnativecode.com')
  // Linking.openURL('https://reactnativecode.com')
  // };
  render() {
    return (
      <ReactNativeSettingsPage>
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

export default UserSettings;

// <SectionRow text="Usage">
// <NavigateRow
//   text="Navigate Row"
//   iconName="your-icon-name"
//   onPressCallback={() =>
//     Linking.openURL('https://facebook.com')
//   }
// />
// <SwitchRow
//   text="Switch Row"
//   iconName="your-icon-name"
//   _value={this.state.switch}
//   _onValueChange={() => {
//     this.setState({ switch: !this.state.switch });
//   }}
// />
// <CheckRow
//   text="Check Row"
//   iconName="your-icon-name"
//   _color="#000"
//   _value={this.state.check}
//   _onValueChange={() => {
//     this.setState({ check: !this.state.check });
//   }}
// />
// <SliderRow
//   text="Slider Row"
//   iconName="your-icon-name"
//   _color="#000"
//   _min={0}
//   _max={100}
//   _value={this.state.value}
//   _onValueChange={value => {
//     this.setState({ value });
//   }}
// />
// </SectionRow>

// // import { connect } from 'react-redux';
// // import RNRestart from 'react-native-restart';
// // import { argonTheme } from '../../constants';
// // import { switchLanguage } from '../../actions';
// // import { Icon } from '../../components';
// // import t from '../../I18n';
// // import { Actions } from 'react-native-router-flux';

// class UserSettings extends Component {
//   langSelection = () => {
//     const { switchLanguage, language } = this.props;
//     const { selectedOption } = this.state;
//     if (selectedOption !== language.lang) {
//       const isRtl = selectedOption === 'ar';
//       NativeModules.I18nManager.forceRTL(isRtl);
//       switchLanguage({
//         lang: this.state.selectedOption
//       });
//       setTimeout(() => {
//         RNRestart.Restart();
//       }, 500);
//       return;
//     }
//     Actions.typeSelection();
//   };
// }
// const mapStateToProps = state => ({ language: state.language });

// export default connect(
//   mapStateToProps,
//   { switchLanguage }
// )(LanguageSelection);
