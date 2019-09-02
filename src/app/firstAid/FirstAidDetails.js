import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { InjuryButtonPressed } from '../../actions';
import data from './metadata.json';
import StepIndicator from './StepIndicator';
class FirstAidDetails extends Component {
  extractValue(key) {
    return data[key].value; // change it
  }

  render() {
    return (
      // <View>{/* <Text>{this.extractValue(this.props.injury)}</Text> */}</View>
      <StepIndicator injury={this.extractValue(this.props.injury)} />
    );
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
)(FirstAidDetails);
