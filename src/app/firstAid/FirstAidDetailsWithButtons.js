import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { InjuryButtonPressed } from '../../actions';
import data from './metadata.json';
import StepIndicator from './StepIndicator';
import data_ from './data';

class FirstAidDetailsWithButtons extends Component {
  renderSwitch(param) {
    switch (param) {
      case 'Burns':
        return this.burnsButtons;
      default:
        return this.chemicalPoisoning;
    }
  }

  burnsButtons = data_.buttons.map(b => {
    return <Button key={b.text} title={b.text} onPress={b.action} />;
  });
  chemicalPoisoning = data_.buttons_.map(b => {
    return <Button key={b.text} title={b.text} onPress={b.action} />;
  });
  //   renderElement() {
  //     if (data[this.props.injury].value === 'Burns') return this.burnsButtons;
  //     else if (data[this.props.injury].value === 'chemicalPoisoning')
  //       return this.chemicalPoisoning;
  //   }

  // if (data[this.props.injury].value === 'Burns') return <Text> Test 1</Text>;
  // else if (data[this.props.injury].value === 'chemicalPoisoning')
  //   return <Text> Test 2</Text>;
  // else
  //  }
  render() {
    return <View>{this.renderSwitch.bind(this, this.props.injury)}</View>;
  }
}
const mapStateToProps = ({ firstAid }) => {
  const { injury } = firstAid;
  return {
    injury
  };
};

export default connect(
  mapStateToProps,
  { InjuryButtonPressed }
)(FirstAidDetailsWithButtons);
