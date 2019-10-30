import React, { Component } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { InjuryButtonPressed } from '../../actions';
import t from '../../I18n';
import data from './metadata.json';
import { Colors } from '../../constants';
import { theme } from 'galio-framework';
import { isIphoneX } from 'react-native-iphone-x-helper';

const { width, height } = Dimensions.get('screen');

class FirstAidDetailsWithButtons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollOffset: new Animated.Value(0),
      titleWidth: 0
    };
    this.offset = 0;
  }

  onButtonPress(text) {
    const { injury } = this.props;
    this.props.InjuryButtonPressed(text);
    Actions.FirstAidDetails({ hideNavBar: false });
  }

  isChemicalPoisoning = data[this.props.injury].value === 'chemical_poisoning';

  render() {
    const { scrollOffset } = this.state;
    return (
      <View style={{ flex: 1 }}>
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
                <Text style={styles.text}>
                  {t.ChemicalPoisoning_Swallowing}
                </Text>
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
            <View style={styles.container}>
              <TouchableOpacity
                style={styles.button}
                onPress={this.onButtonPress.bind(this, 'eye_injury_puncture')}
              >
                <Text style={styles.text}>{t.EyeInjury_Puncture}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={this.onButtonPress.bind(this, 'eye_injury_scratch')}
              >
                <Text style={styles.text}>{t.EyeInjury_Scratch}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    marginBottom: 30,
    width: 260,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: Colors.APP
  },
  text: {
    fontSize: 20,
    color: Colors.WHITE
  }
});

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
