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
      <View style={styles.container}>
        {this.isChemicalPoisoning ? (
          <View>
            <TouchableOpacity
              style={styles.button}
              onPress={this.onButtonPress.bind(
                this,
                'chemicalPoisoning_swallowing'
              )}
            >
              <Text style={styles.text}>
                {data.chemicalPoisoning_swallowing.arValue}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={this.onButtonPress.bind(
                this,
                'chemicalPoisoning_inhaling'
              )}
            >
              <Text style={styles.text}>
                {data.chemicalPoisoning_inhaling.arValue}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <View>
              <TouchableOpacity
                style={styles.button}
                onPress={this.onButtonPress.bind(this, 'eyeInjury_puncture')}
              >
                <Text style={styles.text}>
                  {data.eyeInjury_puncture.arValue}
                </Text>
              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity
                style={styles.button}
                onPress={this.onButtonPress.bind(this, 'eyeInjury_scratch')}
              >
                <Text style={styles.text}>
                  {data.eyeInjury_scratch.arValue}
                </Text>
              </TouchableOpacity>
            </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  button: {
    marginBottom: 30,
    width: 260,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff5768',
    borderRadius: 15
  },
  text: {
    fontSize: 20,
    color: 'white'
  }
});
