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

const { width, height } = Dimensions.get('screen');

class IncidentCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      distanceFromUser: '-'
    };
  }

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
    const imgContainer = [styles.imageContainer, styles.horizontalStyles];

    return (
      <Block row card flex style={cardContainer}>
        {item.numberToCall ? (
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(`tel:${item.numberToCall}`);
            }}
            style={styles.callButton}
          >
            <Icon
              size={17}
              color="white"
              name="phone"
              style={styles.callButtonIcon}
            />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
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
          style={styles.shareButton}
        >
          <Icon
            size={17}
            color="white"
            name="share-variant"
            style={styles.shareButtonIcon}
          />
        </TouchableOpacity>
        <View>
          <View>
            <Block flex style={imgContainer}>
              {item.image ? (
                <Image source={item.image} style={styles.fullImage} />
              ) : (
                <View style={styles.noImage}>
                  <Icon name="image-off" size={100} />
                </View>
              )}
            </Block>
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
                <Text style={{ color: '#b3b3b2', fontFamily: 'Manjari-Bold' }}>
                  Get Directions
                </Text>
              </View>
            </TouchableOpacity>
            {renderRemove ? (
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={onPressRemove}
              >
                <View
                  style={[
                    styles.button,
                    {
                      backgroundColor: '#fdeaec'
                    }
                  ]}
                >
                  <Text
                    style={{ color: '#d76674', fontFamily: 'Manjari-Bold' }}
                  >
                    Remove
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </Block>
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
    minHeight: 114
  },
  cardDescription: {
    paddingTop: theme.SIZES.BASE / 2,
    paddingLeft: theme.SIZES.BASE / 2,
    paddingRight: theme.SIZES.BASE / 2
  },
  imageContainer: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    overflow: 'hidden'
  },
  fullImage: {
    height: 200,
    width: width - theme.SIZES.BASE * 2
  },
  noImage: {
    height: 200,
    width: width - theme.SIZES.BASE * 2,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
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
    borderRadius: 30
  },
  shareButton: {
    position: 'absolute',
    margin: 7,
    right: 0,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50
  },
  shareButtonIcon: {
    textAlign: 'center',
    padding: 10
  },
  callButton: {
    position: 'absolute',
    margin: 7,
    right: 45,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50
  },
  callButtonIcon: {
    textAlign: 'center',
    padding: 10
  },
  dateAndDistance: {
    color: 'gray',
    marginLeft: theme.SIZES.BASE / 2,
    marginBottom: theme.SIZES.BASE / 2
  }
});

const mapStateToProps = state => ({ location: state.location });

export default connect(
  mapStateToProps,
  null
)(IncidentCard);
