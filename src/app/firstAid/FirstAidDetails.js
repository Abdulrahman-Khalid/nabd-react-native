import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { InjuryButtonPressed } from '../../actions';
import data from './FirstAidData.json';

class FirstAidDetails extends Component {
  extractValue(key) {
    return data[key].value;
  }

  render() {
    return (
      <View>
        <Text>{this.extractValue(this.props.injury)}</Text>
      </View>
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