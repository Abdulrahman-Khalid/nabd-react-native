import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Dimensions,
  Image,
  View,
  TouchableOpacity,
  Alert,
  Share
} from 'react-native';
import { Block, Text, theme } from 'galio-framework';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { Colors } from '../constants';
import getDirections from 'react-native-google-maps-directions';
import { Linking } from 'react-native';
import { getDistance, convertDistance } from 'geolib';
import { connect } from 'react-redux';
import Menu, { MenuItem } from 'react-native-material-menu';
import CustomIcon from './Icon';
import LinearGradient from 'react-native-linear-gradient';
import { Images } from '../constants';

const { width, height } = Dimensions.get('screen');

class IncidentCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      distanceFromUser: '-'
    };
  }

  setMenuRef = ref => {
    this._menu = ref;
  };

  openMenu = () => this._menu.show();

  closeMenu = () => this._menu.hide();

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.location.position.coords.latitude !==
        this.props.location.position.coords.latitude ||
      prevProps.location.position.coords.longitude !==
        this.props.location.position.coords.longitude
    ) {
      this.caclulateDistance();
    }
  }

  componentDidMount() {
    if (this.props.location.position !== null) {
      this.caclulateDistance();
    }
  }

  handleGetDirections = () => {
    const directionsData = {
      source: {
        latitude: this.props.location.position.coords.latitude,
        longitude: this.props.location.position.coords.longitude
      },
      destination: this.props.item.location,
      params: [
        {
          key: 'travelmode',
          value: 'driving' // may be "walking", "bicycling" or "transit" as well
        },
        {
          key: 'dir_action',
          value: 'navigate' // this instantly initializes navigation using the given travel mode
        }
      ]
    };
    getDirections(directionsData);
  };

  calculateDateAndTime = () => {
    const now = new Date();
    const months = [
      ' Jan',
      ' Feb',
      ' Mar',
      ' Apr',
      ' May',
      ' Jun',
      ' Jul',
      ' Aug',
      ' Sep',
      ' Oct',
      ' Nov',
      ' Dec'
    ];
    const dateTime = new Date(this.props.item.date);
    const day = dateTime.getDate();
    const year = dateTime.getFullYear();
    const month = dateTime.getMonth();
    const hour = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    if (
      now.getFullYear() === year &&
      now.getMonth() === month &&
      now.getDate() === day &&
      now.getHours() === hour
    ) {
      return (now.getMinutes() - minutes).toString().concat('m');
    }
    if (
      now.getFullYear() === year &&
      now.getMonth() === month &&
      now.getDate() === day
    ) {
      return (now.getHours() - hour).toString().concat('h');
    }
    if (
      now.getFullYear() === year &&
      now.getMonth() === month &&
      now.getDate() - day <= 6
    ) {
      return (now.getDate() - day).toString().concat('d');
    }
    if (now.getFullYear() === year) {
      return day.toString().concat(months[month]);
    }
    return months[month].concat(' ').concat(year.toString());
  };

  caclulateDistance() {
    const distance = convertDistance(
      getDistance(
        this.props.location.position.coords,
        this.props.item.location
      ),
      'km'
    );
    this.setState({
      distanceFromUser: distance > 1 ? Math.round(distance) : distance
    });
  }

  render() {
    const { item, style, onPressRemove, renderRemove } = this.props;
    const cardContainer = [styles.card, styles.shadow, style];

    return (
      <View style={cardContainer}>
        <LinearGradient
          start={{ x: 0.95, y: 0.7 }}
          end={{ x: 1.0, y: 0.0 }}
          locations={[0.3, 1]}
          colors={['transparent', 'rgba(0, 0, 0, 0.3)']}
          style={styles.linearGradient}
        />
        <View style={{ zIndex: 100, position: 'absolute', right: 0 }}>
          <Menu
            style={{ borderTopRightRadius: 30 }}
            ref={this.setMenuRef}
            button={
              <TouchableOpacity
                style={styles.menuButton}
                onPress={this.openMenu}
              >
                <Icon
                  name="dots-vertical"
                  size={30}
                  style={styles.menuButtonIcon}
                  color="white"
                />
              </TouchableOpacity>
            }
          >
            <MenuItem
              onPress={() => {
                Share.share(
                  {
                    message:
                      item.description +
                      `${
                        item.numberToCall
                          ? '\n' + 'Number to call: ' + item.numberToCall + ','
                          : ''
                      }` +
                      '\n' +
                      'https://www.google.com/maps/search/?api=1&query=' +
                      this.props.item.location.latitude +
                      ',' +
                      this.props.item.location.longitude +
                      '\n' +
                      'Shared via Nabd.'
                  },
                  {}
                );
              }}
            >
              <CustomIcon family="flaticon" name="share" size={17}>
                {' '}
                Share
              </CustomIcon>
            </MenuItem>
            {renderRemove ? (
              <MenuItem onPress={onPressRemove}>
                <CustomIcon name="garbage" family="flaticon" size={17}>
                  {' '}
                  Remove
                </CustomIcon>
              </MenuItem>
            ) : null}
          </Menu>
        </View>
        <View>
          <View style={styles.imageContainer}>
            {item.image ? (
              <View>
                <Image
                  source={item.image}
                  style={styles.fullImage}
                  resizeMode="cover"
                />
              </View>
            ) : (
              <View style={styles.noImage} />
            )}
          </View>
        </View>

        <View>
          <Block flex style={styles.cardDescription}>
            <Text size={18} style={styles.cardTitle}>
              {item.description}
            </Text>
          </Block>
        </View>
        <Text style={styles.dateAndDistance}>
          {this.calculateDateAndTime() +
            ' • ' +
            this.state.distanceFromUser +
            ' km away'}
        </Text>
        <View style={styles.hr} />
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={this.handleGetDirections}
          >
            <View
              style={[
                styles.button,
                {
                  backgroundColor: '#f6f6f4'
                }
              ]}
            >
              <CustomIcon
                name="paper-plane"
                family="flaticon"
                style={{ marginRight: 5 }}
                color="#b3b3b2"
                size={17}
              />
              <Text style={{ color: '#b3b3b2', fontFamily: 'Manjari-Bold' }}>
                Get Directions
              </Text>
            </View>
          </TouchableOpacity>
          {item.numberToCall ? (
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => {
                Linking.openURL(`tel:${item.numberToCall}`);
              }}
            >
              <View
                style={[
                  styles.button,
                  {
                    backgroundColor: '#fdeaec'
                  }
                ]}
              >
                <CustomIcon
                  name="phone-call"
                  family="flaticon"
                  style={{ marginRight: 5 }}
                  color="#d76674"
                  size={17}
                />
                <Text style={{ color: '#d76674', fontFamily: 'Manjari-Bold' }}>
                  Call
                </Text>
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }
}

IncidentCard.propTypes = {
  item: PropTypes.object
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.COLORS.WHITE,
    marginTop: theme.SIZES.BASE,
    borderWidth: 0,
    minHeight: 114,
    borderRadius: 30
  },
  cardDescription: {
    paddingTop: theme.SIZES.BASE,
    paddingLeft: theme.SIZES.BASE,
    paddingRight: theme.SIZES.BASE,
    paddingBottom: theme.SIZES.BASE / 2
  },
  imageContainer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    zIndex: 3
  },
  fullImage: {
    height: 200,
    width: width - theme.SIZES.BASE * 2
  },
  noImage: {
    height: 10
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2
  },
  hr: {
    borderBottomColor: 'gray',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginLeft: 20,
    marginRight: 20
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: 'row',
    margin: 10
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
  button: {
    width: '100%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    flexDirection: 'row'
  },
  menuButton: {
    width: 40,
    height: 40,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  menuButtonIcon: {
    textAlign: 'center'
  },
  dateAndDistance: {
    color: 'gray',
    marginLeft: theme.SIZES.BASE,
    marginBottom: theme.SIZES.BASE
  },
  linearGradient: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 30,
    zIndex: 98
  }
});

const mapStateToProps = state => ({ location: state.location });

export default connect(
  mapStateToProps,
  null
)(IncidentCard);
