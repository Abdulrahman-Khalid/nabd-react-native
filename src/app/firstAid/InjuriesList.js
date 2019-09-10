import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { InjuryButtonPressed } from '../../actions';
import InjuryButton from './InjuryButton';
import data from './metadata.json';
// import {argonTheme} from '../../constants';
//'argonTheme.COLORS.whatever'

class InjuriesList extends Component {
  onButtonPress(text) {
    const { injury } = this.props;
    this.props.InjuryButtonPressed(text);
    Actions.FirstAidDetails();
  }
  onButtonPress_(text) {
    const { injury } = this.props;
    this.props.InjuryButtonPressed(text);
    Actions.FirstAidDetailsWithButtons();
  }
  render() {
    return (
      <ScrollView>
        <TouchableOpacity onPress={this.onButtonPress.bind(this, 'cpr')}>
          <InjuryButton
            imageSource={'cpr'}
            backgroundClr="#f6edcf"
            imageText={data.cpr.arValue}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onButtonPress.bind(this, 'bleeding')}>
          <InjuryButton
            imageSource={'bleeding'}
            backgroundClr="#f0dab1"
            imageText={data.bleeding.arValue}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onButtonPress.bind(this, 'cuts')}>
          <InjuryButton
            imageSource={'cuts'}
            backgroundClr="#daf1f9"
            imageText={data.cuts.arValue}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.onButtonPress.bind(this, 'head_injury')}
        >
          <InjuryButton
            imageSource={'head_injury'}
            backgroundClr="#f6edcf"
            imageText={data.head_injury.arValue}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onButtonPress.bind(this, 'burns')}>
          <InjuryButton
            imageSource={'burns'}
            backgroundClr="#f0dab1"
            imageText={data.burns.arValue}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.onButtonPress_.bind(this, 'eye_injury')}
        >
          <InjuryButton
            imageSource={'eye_injury'}
            backgroundClr="#daf1f9"
            imageText={data.eye_injury.arValue}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onButtonPress.bind(this, 'fractures')}>
          <InjuryButton
            imageSource={'fractures'}
            backgroundClr="#f6edcf"
            imageText={data.fractures.arValue}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.onButtonPress.bind(this, 'tooth_injury')}
        >
          <InjuryButton
            imageSource={'tooth_injury'}
            backgroundClr="#f0dab1"
            imageText={data.tooth_injury.arValue}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.onButtonPress.bind(this, 'nosebleeding')}
        >
          <InjuryButton
            imageSource={'nosebleeding'}
            backgroundClr="#daf1f9"
            imageText={data.nosebleeding.arValue}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onButtonPress.bind(this, 'seizure')}>
          <InjuryButton
            imageSource={'seizure'}
            backgroundClr="#a4d7e1"
            imageText={data.seizure.arValue}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.onButtonPress_.bind(this, 'chemical_poisoning')}
        >
          <InjuryButton
            imageSource={'chemical_poisoning'}
            backgroundClr="#f6edcf"
            imageText={data.chemical_poisoning.arValue}
          />
        </TouchableOpacity>
      </ScrollView>
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
)(InjuriesList);
