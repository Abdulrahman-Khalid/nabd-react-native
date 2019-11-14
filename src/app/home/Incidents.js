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
import t from '../../I18n';

const { width, height } = Dimensions.get('screen');

const incidentsDummyData = [
  {
    userID: '01001796904',
    description: 'حادثة علي الدائري مطلوب مساعدة',
    date: new Date(+new Date() - Math.floor(Math.random() * 10000000000)),
    image:
      'https://www.europarl.europa.eu/resources/library/images/20190308PHT30931/20190308PHT30931_original.jpg',
    location: {
      latitude: 30.027757,
      longitude: 31.200701
    },
    numberToCall: '5641561'
  },
  {
    userID: '01001796906',
    description: 'انفجار في حي المعادي',
    date: new Date(+new Date() - Math.floor(Math.random() * 10000000000)),
    image: null,
    location: {
      latitude: 30.057757,
      longitude: 31.100701
    },
    numberToCall: null
  },
  {
    userID: '201001796904',
    description: 'طلب كيس دم ضروري في مستشفي الدفاع الجوي التخصصي',
    date: new Date(+new Date() - Math.floor(Math.random() * 10000000000)),
    image:
      'https://www.usnews.com/dims4/USNEWS/c490d87/2147483647/thumbnail/1280x853/quality/85/?url=http%3A%2F%2Fcom-usnews-beam-media.s3.amazonaws.com%2Fd3%2F23%2Fdfb649b847439f73d4c8c72739e1%2F141024-eicupatient-stock.jpg',
    location: {
      latitude: 30.057757,
      longitude: 30.100701
    },
    numberToCall: '01001796904'
  },
  {
    userID: '01001796906',
    description: 'الكاوتش نام مني علي الصحراوي. مطلوب مساعدة',
    date: new Date(+new Date() - Math.floor(Math.random() * 10000000000)),
    image:
      'https://static.carsdn.co/cldstatic/wp-content/uploads/img1745547593-1466620128965.jpg',
    location: {
      latitude: 31.057757,
      longitude: 30.100701
    },
    numberToCall: '01001796904'
  }
];

export class Incidents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      IncidentCards: [],
      refreshing: false,
      scrollOffset: new Animated.Value(0),
      titleWidth: 0,
      empty: true
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
        if (response.status != 404) {
          if (!id) {
            this.setState({
              IncidentCards: response.data,
              empty: false,
              refreshing: false
            });
          } else {
            this.setState(prevState => ({
              IncidentCards: prevState.IncidentCards.concat(response.data),
              refreshing: false
            }));
          }
        }
      })
      .catch(error => {
        console.log(error);
      })
      .then(() => {});
  }

  removeIncident(id) {
    axios
      .delete('/incident/', {
        params: {
          incidentId: id
        }
      })
      .then(response => {
        this.pullRefresh();
      })
      .catch(error => {
      })
      .then(() => {});
  }

  render() {
    const { scrollOffset } = this.state;
    if (this.props.location.position || this.state.refreshing) {
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
                fontFamily:
                  this.props.language.lang == 'en'
                    ? 'Quicksand-SemiBold'
                    : 'Tajawal-Medium',
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
              {t.Incidents}
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
          {!(this.state.IncidentCards.length == 0) ? (
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
                    this.removeIncident(item._id);
                  }}
                  renderRemove={this.props.userID === item.userID}
                  style={styles.incidents}
                />
              ))}
            </ScrollView>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Image
                source={Images.noIncidents}
                style={{ height: 150, width: 150, marginBottom: 20 }}
                resizeMode="contain"
              />
              <Text style={{ fontSize: 25, marginBottom: 20 }}>
                {t.AllFine}
              </Text>
              <TouchableOpacity
                style={styles.emptyScreenButtonContainer}
                onPress={this.updateIncidentCards}
              >
                <Text
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    textAlign: 'center',
                    fontFamily:
                      this.props.language.lang == 'en'
                        ? 'Quicksand-SemiBold'
                        : 'Tajawal-Medium'
                  }}
                >
                  {t.Refresh}
                </Text>
              </TouchableOpacity>
            </View>
          )}
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
              {t.Incidents}
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
  },
  emptyScreenButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: Colors.APP,
    height: 50,
    borderRadius: 30,
    width: 130
  },
  emptyScreenButton: {
    padding: 20,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30
  }
});

const mapStateToProps = state => ({
  location: state.location,
  addedNewIncidentFlag: state.incidents.addedNewIncidentFlag,
  userID: state.signin.phone.substring(1),
  language: state.language
});

export default connect(mapStateToProps, { addedNewIncident })(Incidents);
