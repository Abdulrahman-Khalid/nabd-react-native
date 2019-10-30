import React, { Component } from 'react';
import {
  ScrollView,
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

  isChemicalPoisoning = data[this.props.injury].value === 'chemical_poisoning';

  render() {
    const { scrollOffset } = this.state;
    return (
      <View style={{ flex: 1 }}>
        {/* <Animated.View
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
          <Animated.View
            style={{
              width: scrollOffset.interpolate({
                inputRange: [0, 200],
                outputRange: [width * 0.9 - this.state.titleWidth, 0],
                extrapolate: 'clamp'
              })
            }}
          />
        </Animated.View> */}
        <ScrollView
        // contentContainerStyle={{
        //   paddingTop: theme.SIZES.BASE,
        //   zIndex: 2
        // }}
        // onScroll={({ nativeEvent }) => {
        //   const scrollSensitivity = 4 / 3;
        //   const offset = nativeEvent.contentOffset.y / scrollSensitivity;
        //   this.state.scrollOffset.setValue(offset);
        // }}
        // showsVerticalScrollIndicator={false}
        // scrollEventThrottle={20}
        >
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
                  <Text style={styles.text}>
                    {t.ChemicalPoisoning_Inhaling}
                  </Text>
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
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // header: {
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   paddingTop: isIphoneX() ? 44 : 0
  // },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
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
