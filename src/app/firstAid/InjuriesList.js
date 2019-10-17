import React, { Component } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { InjuryButtonPressed } from '../../actions';
import InjuryButton from './InjuryButton';
import data from './metadata.json';
import { Colors } from '../../constants';

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
    const { INJURY_BUTTON, INJURY_BUTTON_TWO } = Colors;
    return (
      <ScrollView>
        <TouchableOpacity onPress={this.onButtonPress.bind(this, 'cpr')}>
          <InjuryButton
            src={'cpr'}
            backgroundClr={INJURY_BUTTON}
            txt={data.cpr.arValue}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onButtonPress.bind(this, 'bleeding')}>
          <InjuryButton
            src={'bleeding'}
            backgroundClr={INJURY_BUTTON_TWO}
            txt={data.bleeding.arValue}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onButtonPress.bind(this, 'cuts')}>
          <InjuryButton
            src={'cuts'}
            backgroundClr={INJURY_BUTTON}
            txt={data.cuts.arValue}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.onButtonPress.bind(this, 'head_injury')}
        >
          <InjuryButton
            src={'head_injury'}
            backgroundClr={INJURY_BUTTON_TWO}
            txt={data.head_injury.arValue}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onButtonPress.bind(this, 'burns')}>
          <InjuryButton
            src={'burns'}
            backgroundClr={INJURY_BUTTON}
            txt={data.burns.arValue}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.onButtonPress_.bind(this, 'eye_injury')}
        >
          <InjuryButton
            src={'eye_injury'}
            backgroundClr={INJURY_BUTTON_TWO}
            txt={data.eye_injury.arValue}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onButtonPress.bind(this, 'fractures')}>
          <InjuryButton
            src={'fractures'}
            backgroundClr={INJURY_BUTTON}
            txt={data.fractures.arValue}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.onButtonPress.bind(this, 'tooth_injury')}
        >
          <InjuryButton
            src={'tooth_injury'}
            backgroundClr={INJURY_BUTTON_TWO}
            txt={data.tooth_injury.arValue}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.onButtonPress.bind(this, 'nosebleeding')}
        >
          <InjuryButton
            src={'nosebleeding'}
            backgroundClr={INJURY_BUTTON}
            txt={data.nosebleeding.arValue}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onButtonPress.bind(this, 'seizure')}>
          <InjuryButton
            src={'seizure'}
            backgroundClr={INJURY_BUTTON_TWO}
            txt={data.seizure.arValue}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.onButtonPress_.bind(this, 'chemical_poisoning')}
        >
          <InjuryButton
            src={'chemical_poisoning'}
            backgroundClr={INJURY_BUTTON}
            txt={data.chemical_poisoning.arValue}
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
