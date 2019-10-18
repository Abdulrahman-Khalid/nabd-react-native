import React from 'react';
import { Switch, Platform } from 'react-native';

import { Colors } from '../constants';

class MkSwitch extends React.Component {
  render() {
    const { value, ...props } = this.props;
    const thumbColor = Platform.OS === 'ios' ? null :
      Platform.OS === 'android' && value ? Colors.SWITCH_ON : Colors.SWITCH_OFF;

    return (
      <Switch
        value={value}
        thumbColor={thumbColor}
        ios_backgroundColor={Colors.SWITCH_OFF}
        trackColor={{ false: Colors.SWITCH_ON, true: Colors.SWITCH_ON }}
        {...props}
      />
    );
  }
}

export default MkSwitch;