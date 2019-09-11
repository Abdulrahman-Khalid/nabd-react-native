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
import { argonTheme, Images } from '../../constants';

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
    const { INJURY_BUTTON, INJURY_BUTTON_TWO } = argonTheme.COLORS;
    return (
      <ScrollView>
        <TouchableOpacity onPress={this.onButtonPress.bind(this, 'cpr')}>
          <InjuryButton
            imageSource={cpr}
            backgroundClr={INJURY_BUTTON}
            imageText={data.cpr.arValue}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onButtonPress.bind(this, 'bleeding')}>
          <InjuryButton
            imageSource={bleeding}
            backgroundClr={INJURY_BUTTON_TWO}
            imageText={data.bleeding.arValue}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onButtonPress.bind(this, 'cuts')}>
          <InjuryButton
            imageSource={cuts}
            backgroundClr={INJURY_BUTTON}
            imageText={data.cuts.arValue}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.onButtonPress.bind(this, 'head_injury')}
        >
          <InjuryButton
            imageSource={head_injury}
            backgroundClr={INJURY_BUTTON_TWO}
            imageText={data.head_injury.arValue}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onButtonPress.bind(this, 'burns')}>
          <InjuryButton
            imageSource={burns}
            backgroundClr={INJURY_BUTTON}
            imageText={data.burns.arValue}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.onButtonPress_.bind(this, 'eye_injury')}
        >
          <InjuryButton
            imageSource={eye_injury}
            backgroundClr={INJURY_BUTTON_TWO}
            imageText={data.eye_injury.arValue}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onButtonPress.bind(this, 'fractures')}>
          <InjuryButton
            imageSource={fractures}
            backgroundClr={INJURY_BUTTON}
            imageText={data.fractures.arValue}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.onButtonPress.bind(this, 'tooth_injury')}
        >
          <InjuryButton
            imageSource={tooth_injury}
            backgroundClr={INJURY_BUTTON_TWO}
            imageText={data.tooth_injury.arValue}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.onButtonPress.bind(this, 'nosebleeding')}
        >
          <InjuryButton
            imageSource={nosebleeding}
            backgroundClr={INJURY_BUTTON}
            imageText={data.nosebleeding.arValue}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onButtonPress.bind(this, 'seizure')}>
          <InjuryButton
            imageSource={seizure}
            backgroundClr={INJURY_BUTTON_TWO}
            imageText={data.seizure.arValue}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.onButtonPress_.bind(this, 'chemical_poisoning')}
        >
          <InjuryButton
            imageSource={chemical_poisoning}
            backgroundClr={INJURY_BUTTON}
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
