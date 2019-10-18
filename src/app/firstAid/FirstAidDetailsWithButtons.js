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
import { argonTheme } from '../../constants';
import t from '../../I18n';
import { Colors } from '../../constants';

class FirstAidDetailsWithButtons extends Component {
  onButtonPress(text) {
    this.props.InjuryButtonPressed(text);
    Actions.FirstAidDetails();
  }
  isChemicalPoisoning = data[this.props.injury].value === 'chemical_poisoning';
  render() {
    return (
      <View style={styles.container}>
        {this.isChemicalPoisoning ? (
          <View>
            <TouchableOpacity
              style={styles.button}
              onPress={this.onButtonPress.bind(
                this,
                'chemical_poisoning_swallowing'
              )}
            >
              <Text style={styles.text}>{t.ChemicalPoisoning_Swallowing}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={this.onButtonPress.bind(
                this,
                'chemical_poisoning_inhaling'
              )}
            >
              <Text style={styles.text}>{t.ChemicalPoisoning_Inhaling}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <View>
              <TouchableOpacity
                style={styles.button}
                onPress={this.onButtonPress.bind(this, 'eye_injury_puncture')}
              >
                <Text style={styles.text}>{t.EyeInjury_Puncture}</Text>
              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity
                style={styles.button}
                onPress={this.onButtonPress.bind(this, 'eye_injury_scratch')}
              >
                <Text style={styles.text}>{t.EyeInjury_scratch}</Text>
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
    justifyContent: 'space-around',
    backgroundColor: Colors.BACKGROUND
  },
  button: {
    marginBottom: 30,
    width: 260,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.APP,
    borderRadius: 15
  },
  text: {
    fontSize: 20,
    color: Colors.WHITE
  }
});
