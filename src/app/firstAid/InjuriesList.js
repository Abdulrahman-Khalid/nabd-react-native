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
// import {argonTheme} from '../../constants';
//'argonTheme.COLORS.whatever'

class InjuriesList extends Component {
  onButtonPress(text) {
    const { injury } = this.props;
    this.props.InjuryButtonPressed(text);
    Actions.FirstAidDetails();
  }
  render() {
    return (
      <ScrollView>
        <TouchableOpacity onPress={this.onButtonPress.bind(this, 'cpr')}>
          <InjuryButton
            imageSource={'cpr'}
            backgroundClr="#f6edcf"
            imageText="cpr"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onButtonPress.bind(this, 'bleeding')}>
          <InjuryButton
            imageSource={'bleeding'}
            backgroundClr="#f0dab1"
            imageText="bleeding"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onButtonPress.bind(this, 'cuts')}>
          <InjuryButton
            imageSource={'cuts'}
            backgroundClr="#daf1f9"
            imageText="cuts"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onButtonPress.bind(this, 'sunStroke')}>
          <InjuryButton
            imageSource={'sunStroke'}
            backgroundClr="#a4d7e1"
            imageText="sun stroke"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onButtonPress.bind(this, 'headInjury')}>
          <InjuryButton
            imageSource={'headInjury'}
            backgroundClr="#f6edcf"
            imageText="head injury"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onButtonPress.bind(this, 'burns')}>
          <InjuryButton
            imageSource={'burns'}
            backgroundClr="#f0dab1"
            imageText="burns"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onButtonPress.bind(this, 'eyeInjury')}>
          <InjuryButton
            imageSource={'eyeInjury'}
            backgroundClr="#daf1f9"
            imageText="eye injury"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onButtonPress.bind(this, 'splinting')}>
          <InjuryButton
            imageSource={'splinting'}
            backgroundClr="#a4d7e1"
            imageText="splinting"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onButtonPress.bind(this, 'fractures')}>
          <InjuryButton
            imageSource={'fractures'}
            backgroundClr="#f6edcf"
            imageText="fractures"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.onButtonPress.bind(this, 'toothInjury')}
        >
          <InjuryButton
            imageSource={'toothInjury'}
            backgroundClr="#f0dab1"
            imageText="tooth injury"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.onButtonPress.bind(this, 'nosebleeding')}
        >
          <InjuryButton
            imageSource={'nosebleeding'}
            backgroundClr="#daf1f9"
            imageText="nosebleeding"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onButtonPress.bind(this, 'seizure')}>
          <InjuryButton
            imageSource={'seizure'}
            backgroundClr="#a4d7e1"
            imageText="seizure"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.onButtonPress.bind(this, 'chemicalPoisoning')}
        >
          <InjuryButton
            imageSource={'chemicalPoisoning'}
            backgroundClr="#f6edcf"
            imageText="chemical poisoning"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onButtonPress.bind(this, 'backInjury')}>
          <InjuryButton
            imageSource={'backInjury'}
            backgroundClr="#f0dab1"
            imageText="back injury"
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