import React, { Component } from 'react';
import {
  ScrollView,
  View,
  Animated,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { InjuryButtonPressed } from '../../actions';
import InjuryButton from './InjuryButton';
import t from '../../I18n';
import data from './metadata.json';
import { Colors } from '../../constants';
import { theme } from 'galio-framework';
import { Icon as CustomIcon } from '../../components';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { isIphoneX } from 'react-native-iphone-x-helper';

const { width, height } = Dimensions.get('screen');

class InjuriesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollOffset: new Animated.Value(0),
      titleWidth: 0
    };
    this.offset = 0;
  }

  onScroll = e => {
    const scrollSensitivity = 4 / 3;
    const offset = e.nativeEvent.contentOffset.y / scrollSensitivity;
    this.state.scrollOffset.setValue(offset);
  };

  onButtonPress(text) {
    const { injury } = this.props;
    this.props.InjuryButtonPressed(text);
    Actions.FirstAidDetails({ hideNavBar: false });
  }
  onButtonPress_(text) {
    const { injury } = this.props;
    this.props.InjuryButtonPressed(text);
    Actions.FirstAidDetailsWithButtons({ hideNavBar: false });
  }

  renderNavbarButton(scrollOffset) {
    if (this.props.quickAccess) {
      return (
        <TouchableOpacity
          onPress={() => Actions.pop()}
          style={{
            position: 'absolute',
            right: 0,
            marginRight: 20
          }}
        >
          <CustomIcon
            name="back"
            family="animatedFlaticon"
            size={25}
            style={{
              color: scrollOffset.interpolate({
                inputRange: [0, 200],
                outputRange: ['black', 'white'],
                extrapolate: 'clamp'
              }),
              fontSize: scrollOffset.interpolate({
                inputRange: [0, 200],
                outputRange: [25, 20],
                extrapolate: 'clamp'
              })
            }}
          />
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        onPress={() => Actions.settings()}
        style={{
          position: 'absolute',
          right: 0,
          marginRight: 20
        }}
      >
        <CustomIcon
          name="gear-option"
          family="animatedFlaticon"
          size={25}
          style={{
            color: scrollOffset.interpolate({
              inputRange: [0, 200],
              outputRange: ['black', 'white'],
              extrapolate: 'clamp'
            }),
            fontSize: scrollOffset.interpolate({
              inputRange: [0, 200],
              outputRange: [25, 20],
              extrapolate: 'clamp'
            })
          }}
        />
      </TouchableOpacity>
    );
  }
  render() {
    const { scrollOffset } = this.state;
    const { INJURY_BUTTON, INJURY_BUTTON_TWO } = Colors;
    return (
      <View style={{ flex: 1 }}>
        <Animated.View
          style={[
            styles.header,
            {
              paddingHorizontal: width * 0.05,
              width: width,
              height: isIphoneX()
                ? scrollOffset.interpolate({
                    inputRange: [0, 200],
                    outputRange: [124, 104],
                    extrapolate: 'clamp'
                  })
                : scrollOffset.interpolate({
                    inputRange: [0, 200],
                    outputRange: [80, 60],
                    extrapolate: 'clamp'
                  }),
              backgroundColor: scrollOffset.interpolate({
                inputRange: [0, 200],
                outputRange: ['#E9E9EF', Colors.APP],
                extrapolate: 'clamp'
              }),
              borderBottomLeftRadius: scrollOffset.interpolate({
                inputRange: [0, 200],
                outputRange: [0, 30],
                extrapolate: 'clamp'
              }),
              borderBottomRightRadius: scrollOffset.interpolate({
                inputRange: [0, 200],
                outputRange: [0, 30],
                extrapolate: 'clamp'
              })
            }
          ]}
        >
          <Animated.Text
            onLayout={e => {
              if (this.offset === 0 && this.state.titleWidth === 0) {
                const titleWidth = e.nativeEvent.layout.width;
                this.setState({ titleWidth });
              }
            }}
            style={{
              fontFamily: this.props.language.lang == 'en' ? 'Quicksand-SemiBold' : 'Tajawal-Medium',
              fontSize: scrollOffset.interpolate({
                inputRange: [0, 200],
                outputRange: [26, 20],
                extrapolate: 'clamp'
              }),
              color: scrollOffset.interpolate({
                inputRange: [0, 200],
                outputRange: ['black', 'white'],
                extrapolate: 'clamp'
              })
            }}
          >
            {t.FirstAid}
          </Animated.Text>
          {this.renderNavbarButton(scrollOffset)}
          <Animated.View
            style={{
              width: scrollOffset.interpolate({
                inputRange: [0, 200],
                outputRange: [width * 0.9 - this.state.titleWidth, 0],
                extrapolate: 'clamp'
              })
            }}
          />
        </Animated.View>
        <ScrollView
          contentContainerStyle={{
            paddingTop: theme.SIZES.BASE,
            zIndex: 2
          }}
          onScroll={({ nativeEvent }) => {
            const scrollSensitivity = 4 / 3;
            const offset = nativeEvent.contentOffset.y / scrollSensitivity;
            this.state.scrollOffset.setValue(offset);
          }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={20}
        >
          <View>
            <InjuryButton
              src={'cpr'}
              backgroundClr="#63B8B1"
              txt={t.CPR}
              onPress={this.onButtonPress.bind(this, 'cpr')}
            />
          </View>

          <View>
            <InjuryButton
              src={'bleeding'}
              backgroundClr="#FFE0B2"
              txt={t.Bleeding}
              onPress={this.onButtonPress.bind(this, 'bleeding')}
            />
          </View>

          <View>
            <InjuryButton
              src={'cuts'}
              backgroundClr="#B9917C"
              txt={t.Cuts}
              onPress={this.onButtonPress.bind(this, 'cuts')}
            />
          </View>

          <View>
            <InjuryButton
              src={'head_injury'}
              backgroundClr="#E5C7BD"
              txt={t.HeadInjury}
              onPress={this.onButtonPress.bind(this, 'head_injury')}
            />
          </View>

          <View>
            <InjuryButton
              src={'burns'}
              backgroundClr="#F66775"
              txt={t.Burns}
              onPress={this.onButtonPress.bind(this, 'burns')}
            />
          </View>

          <View>
            <InjuryButton
              src={'eye_injury'}
              backgroundClr="#CCCBCB"
              txt={t.EyeInjury}
              onPress={this.onButtonPress_.bind(this, 'eye_injury')}
            />
          </View>

          <View>
            <InjuryButton
              src={'fractures'}
              backgroundClr="#FAEBC7"
              txt={t.Fractures}
              onPress={this.onButtonPress.bind(this, 'fractures')}
            />
          </View>

          <View>
            <InjuryButton
              src={'tooth_injury'}
              backgroundClr="#DB527D"
              txt={t.ToothInjury}
              onPress={this.onButtonPress.bind(this, 'tooth_injury')}
            />
          </View>

          <View>
            <InjuryButton
              src={'nosebleeding'}
              backgroundClr="#FFE0B2"
              txt={t.Nosebleed}
              onPress={this.onButtonPress.bind(this, 'nosebleed')}
            />
          </View>

          <View>
            <InjuryButton
              src={'seizure'}
              backgroundClr="#F6494C"
              txt={t.Seizure}
              onPress={this.onButtonPress.bind(this, 'seizure')}
            />
          </View>

          <View>
            <InjuryButton
              src={'chemical_poisoning'}
              backgroundClr="#B289C9"
              txt={t.ChemicalPoisoning}
              onPress={this.onButtonPress_.bind(this, 'chemical_poisoning')}
            />
          </View>
          {/* <View style={{ marginBottom: 60 }}></View> */}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: isIphoneX() ? 44 : 0
  }
});

const mapStateToProps = ({ firstAid, language }) => {
  const { injury } = firstAid;
  return {
    injury,
    language
  };
};

export default connect(
  mapStateToProps,
  { InjuryButtonPressed }
)(InjuriesList);
