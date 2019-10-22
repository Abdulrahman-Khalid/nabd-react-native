import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { InjuryButtonPressed } from '../../actions';
import InjuryButton from './InjuryButton';
import data from './metadata.json';
import { Colors } from '../../constants';
import { theme } from 'galio-framework';

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
      <ScrollView contentContainerStyle={{ paddingTop: theme.SIZES.BASE }}>
        <View>
          <InjuryButton
            src={'cpr'}
            backgroundClr="#63B8B1"
            txt={data.cpr.arValue}
            onPress={this.onButtonPress.bind(this, 'cpr')}
          />
        </View>

        <View>
          <InjuryButton
            src={'bleeding'}
            backgroundClr="#FFE0B2"
            txt={data.bleeding.arValue}
            onPress={this.onButtonPress.bind(this, 'bleeding')}
          />
        </View>

        <View>
          <InjuryButton
            src={'cuts'}
            backgroundClr="#B9917C"
            txt={data.cuts.arValue}
            onPress={this.onButtonPress.bind(this, 'cuts')}
          />
        </View>

        <View>
          <InjuryButton
            src={'head_injury'}
            backgroundClr="#E5C7BD"
            txt={data.head_injury.arValue}
            onPress={this.onButtonPress.bind(this, 'head_injury')}
          />
        </View>

        <View>
          <InjuryButton
            src={'burns'}
            backgroundClr="#F66775"
            txt={data.burns.arValue}
            onPress={this.onButtonPress.bind(this, 'burns')}
          />
        </View>

        <View>
          <InjuryButton
            src={'eye_injury'}
            backgroundClr="#CCCBCB"
            txt={data.eye_injury.arValue}
            onPress={this.onButtonPress_.bind(this, 'eye_injury')}
          />
        </View>

        <View>
          <InjuryButton
            src={'fractures'}
            backgroundClr="#FAEBC7"
            txt={data.fractures.arValue}
            onPress={this.onButtonPress.bind(this, 'fractures')}
          />
        </View>

        <View>
          <InjuryButton
            src={'tooth_injury'}
            backgroundClr="#DB527D"
            txt={data.tooth_injury.arValue}
            onPress={this.onButtonPress.bind(this, 'tooth_injury')}
          />
        </View>

        <View>
          <InjuryButton
            src={'nosebleeding'}
            backgroundClr="#FFE0B2"
            txt={data.nosebleeding.arValue}
            onPress={this.onButtonPress.bind(this, 'nosebleeding')}
          />
        </View>

        <View>
          <InjuryButton
            src={'seizure'}
            backgroundClr="#F6494C"
            txt={data.seizure.arValue}
            onPress={this.onButtonPress.bind(this, 'seizure')}
          />
        </View>

        <View>
          <InjuryButton
            src={'chemical_poisoning'}
            backgroundClr="#B289C9"
            txt={data.chemical_poisoning.arValue}
            onPress={this.onButtonPress_.bind(this, 'chemical_poisoning')}
          />
        </View>
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
