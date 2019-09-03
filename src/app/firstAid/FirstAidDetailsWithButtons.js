import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { InjuryButtonPressed } from '../../actions';
import data from './metadata.json';
import StepIndicator from './StepIndicator';

class FirstAidDetailsWithButtons extends Component {
  onButtonPress(text) {
    const { injury } = this.props;
    this.props.InjuryButtonPressed(text);
    Actions.FirstAidDetails();
  }
  isChemicalPoisoning = data[this.props.injury].value === 'chemicalPoisoning';
  render() {
    return (
      <View>
        {this.isChemicalPoisoning ? (
          <View>
            <TouchableOpacity
              //style={styles.button}
              onPress={this.onButtonPress.bind(
                this,
                'chemicalPoisoning_swallowing'
              )}
            >
              <Text> swallowing </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.onButtonPress.bind(
                this,
                'chemicalPoisoning_inhaling'
              )}
            >
              <Text> inhaling </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <TouchableOpacity
              //style={styles.button}
              onPress={this.onButtonPress.bind(this, 'eyeInjury_puncture')}
            >
              <Text> puncture </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.onButtonPress.bind(this, 'eyeInjury_scratch')}
            >
              <Text> scratch </Text>
            </TouchableOpacity>
          </View>
        )}
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
)(FirstAidDetailsWithButtons);
