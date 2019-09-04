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

        <TouchableOpacity onPress={this.onButtonPress.bind(this, 'headInjury')}>
          <InjuryButton
            imageSource={'headInjury'}
            backgroundClr="#f6edcf"
            imageText={data.headInjury.arValue}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onButtonPress.bind(this, 'burns')}>
          <InjuryButton
            imageSource={'burns'}
            backgroundClr="#f0dab1"
            imageText={data.burns.arValue}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onButtonPress_.bind(this, 'eyeInjury')}>
          <InjuryButton
            imageSource={'eyeInjury'}
            backgroundClr="#daf1f9"
            imageText={data.eyeInjury.arValue}
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
          onPress={this.onButtonPress.bind(this, 'toothInjury')}
        >
          <InjuryButton
            imageSource={'toothInjury'}
            backgroundClr="#f0dab1"
            imageText={data.toothInjury.arValue}
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
          onPress={this.onButtonPress_.bind(this, 'chemicalPoisoning')}
        >
          <InjuryButton
            imageSource={'chemicalPoisoning'}
            backgroundClr="#f6edcf"
            imageText={data.chemicalPoisoning.arValue}
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
