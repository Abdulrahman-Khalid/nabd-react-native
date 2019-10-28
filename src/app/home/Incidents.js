import React, { Component } from 'react';
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
  Text,
  Animated
} from 'react-native';
import IncidentCard from '../../components/IncidentCard';
import { Colors, Images } from '../../constants';
import { theme, Block } from 'galio-framework';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { FAB } from 'react-native-paper';
import { SkeletonCard, Icon as CustomIcon } from '../../components';
import { isIphoneX } from 'react-native-iphone-x-helper';
import axios from 'axios';
import { addedNewIncident } from '../../actions';

const { width, height } = Dimensions.get('screen');

const incidentsDummyData = [
  {
    userID: '01001796904',
    description: 'Accident on ElSahrawy road',
    date: new Date(+new Date() - Math.floor(Math.random() * 10000000000)),
    image: Images.aideCard,
    location: {
      latitude: 30.027757,
      longitude: 31.200701
    },
    numberToCall: null
  },
  {
    userID: '01001796905',
    description: 'انفجار مغسلة في حي المعادي',
    date: new Date(+new Date() - Math.floor(Math.random() * 10000000000)),
    image: null,
    location: {
      latitude: -33.8600024,
      longitude: 18.697459
    },
    numberToCall: '01001796904'
  },
  {
    userID: '01001796906',
    description: 'طلب كيس دم ضروري في مستشفي الدفاع الجوي التخصصي',
    date: new Date(+new Date() - Math.floor(Math.random() * 10000000000)),
    image: Images.ambulanceCard,
    location: {
      latitude: -33.8600024,
      longitude: 18.697459
    },
    numberToCall: '01001796904'
  },
  {
    userID: '01001796906',
    description: 'طلب كيس دم ضروري في مستشفي الدفاع الجوي التخصصي',
    date: new Date(+new Date() - Math.floor(Math.random() * 10000000000)),
    image: Images.ambulanceCard,
    location: {
      latitude: -33.8600024,
      longitude: 18.697459
    },
    numberToCall: '01001796904'
  },
  {
    userID: '01001796906',
    description: 'طلب كيس دم ضروري في مستشفي الدفاع الجوي التخصصي',
    date: new Date(+new Date() - Math.floor(Math.random() * 10000000000)),
    image: Images.ambulanceCard,
    location: {
      latitude: -33.8600024,
      longitude: 18.697459
    },
    numberToCall: '01001796904'
  }
];

export class Incidents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      IncidentCards: [],
      // IncidentCards: incidentsDummyData,
      userID: '201140028533',
      refreshing: false,
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

  componentDidMount() {
    this.state.scrollOffset.addListener(({ value }) => (this.offset = value));
    this.pullRefresh();
  }

  componentDidUpdate() {
    if (this.props.addedNewIncidentFlag) {
      this.pullRefresh();
      this.props.addedNewIncident();
    }
  }

  /**
   * Pull to refresh functionality
   */
  pullRefresh = () => {
    this.setState({
      refreshing: true,
      IncidentCards: []
    });
    this.updateIncidentCards();
  };

  moreIncidentCards = ({ layoutMeasurement, contentOffset, contentSize }) => {
    if (
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 1 &&
      this.state.refreshing !== true
    ) {
      this.setState({
        refreshing: true
      });
      this.updateIncidentCards(
        this.state.IncidentCards[this.state.IncidentCards.length - 1]._id
      );
    }
  };

  updateIncidentCards(id = null, username = null) {
    axios
      .get('/incident/', {
        params: {
          incidentId: id
        }
      })
      .then(response => {
        if (!id) {
          this.setState({
            IncidentCards: response.data
          });
        } else {
          this.setState(prevState => ({
            IncidentCards: prevState.IncidentCards.concat(response.data)
          }));
        }
        this.setState({ refreshing: false });
      })
      .catch(() => {
        console.log('catch');
      })
      .then(() => {});
  }

  async videoCall() {
    try {
      let s = await client.getClientState();
      if (s === Voximplant.ClientState.DISCONNECTED) {
        await client.connect();
      }
      let authResult = await this.state.client.login('412412', info.userPass);
      // Alert.alert('Selected Item', authResult);
    } catch (e) {
      console.log(e.name + e.message);
    }
  }

  render() {
    const { scrollOffset } = this.state;
    if (this.props.location.position) {
      return (
        <View style={styles.mainContainer}>
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
            z
          >
            <Animated.Text
              onLayout={e => {
                if (this.offset === 0 && this.state.titleWidth === 0) {
                  const titleWidth = e.nativeEvent.layout.width;
                  this.setState({ titleWidth });
                }
              }}
              style={{
                fontWeight: 'bold',
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
              Incidents
            </Animated.Text>
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
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.pullRefresh}
              />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.buttons}
            style={{ flex: 1 }}
            onScroll={({ nativeEvent }) => {
              const scrollSensitivity = 4 / 3;
              const offset = nativeEvent.contentOffset.y / scrollSensitivity;
              this.state.scrollOffset.setValue(offset);
              this.moreIncidentCards(nativeEvent);
            }}
            scrollEventThrottle={20}
          >
            {this.state.IncidentCards.map((item, index) => (
              <IncidentCard
                key={index}
                item={item}
                onPressRemove={() => {
                  console.log('Remove Pressed');
                }}
                renderRemove={this.state.userID === item.userID}
                style={styles.incidents}
              />
            ))}
          </ScrollView>
          <FAB
            style={styles.addIncidentButton}
            icon="add"
            onPress={() => Actions.AddIncident()}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.skeletonCardsContainer}>
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
                fontWeight: 'bold',
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
              Incidents
            </Animated.Text>
            <TouchableOpacity
              onPress={() => Actions.UserSettings()}
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
          <SkeletonCard />
          <SkeletonCard />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  incidents: {
    width: width - theme.SIZES.BASE * 2,
    marginBottom: theme.SIZES.BASE
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  addIncidentButton: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.APP
  },
  skeletonCardsContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: isIphoneX() ? 44 : 0
  }
});

const mapStateToProps = state => ({
  location: state.location,
  addedNewIncidentFlag: state.incidents.addedNewIncidentFlag
});

export default connect(
  mapStateToProps,
  { addedNewIncident }
)(Incidents);
