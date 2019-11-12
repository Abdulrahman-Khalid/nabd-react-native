import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  BackHandler,
  Alert
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getLocation, updateAmbulanceNumber } from '../../actions';
import { connect } from 'react-redux';
import { Images } from '../../constants';
import { FAB, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import { Icon as CustomIcon } from '../../components';
import io from 'socket.io-client';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import t from '../../I18n';
import Config from 'react-native-config';
import mapStyle from '../../config/GoogleMapsCustomStyle';

class WaitForAmbulance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: this.props.position.coords.latitude,
        longitude: this.props.position.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005
      },
      ambulanceLocation: null,
      mapMarginBottom: 1,
      calibratedOnce: false
    };
    this.socket = io(
      axios.defaults.baseURL.substring(0, axios.defaults.baseURL.length - 4) +
        'track/ambulance'
    );
    this.socket.on('location', data => {
      this.setState({
        ambulanceLocation: data
      });
    });
  }

  componentDidMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.onBackPress.bind(this)
    );
    console.log('ambulance phone number' + this.props.ambulancePhoneNumber);
    this.socket.emit('track location', {
      ambulancePhoneNumber: this.props.ambulancePhoneNumber
    });
    this.socket.on('disconnect', reason => {
      if (reason != 'io client disconnect') {
        this.props.updateAmbulanceNumber(null);
        Alert.alert('', t.AmbulanceArrived, [
          {
            text: t.OK
          }
        ]);
        setTimeout(() => {
          switch (this.props.userType) {
            case 'user':
              Actions.reset('userHome');
              break;
            case 'doctor':
              Actions.reset('paramedicHome');
              break;
            case 'paramedic':
              Actions.reset('paramedicHome');
              break;
            case 'ambulance':
              Actions.reset('ambulanceHome');
              break;
          }
        }, 500);
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.ambulanceLocation != this.state.ambulanceLocation &&
      !this.state.calibratedOnce
    ) {
      this.mapView.fitToCoordinates(
        [
          {
            latitude: this.props.position.coords.latitude,
            longitude: this.props.position.coords.longitude
          },
          {
            latitude: this.state.ambulanceLocation.latitude,
            longitude: this.state.ambulanceLocation.longitude
          }
        ],
        {
          edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
          animated: true
        }
      );
      this.setState({
        calibratedOnce: true
      });
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.onBackPress.bind(this)
    );
  }

  onBackPress() {
    return true;
  }

  calibrateView() {
    if (this.state.ambulanceLocation) {
      this.mapView.fitToCoordinates(
        [
          {
            latitude: this.props.position.coords.latitude,
            longitude: this.props.position.coords.longitude
          },
          {
            latitude: this.state.ambulanceLocation.latitude,
            longitude: this.state.ambulanceLocation.longitude
          }
        ],
        {
          edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
          animated: true
        }
      );
    } else {
      const userRegion = {
        latitude: this.props.position.coords.latitude,
        longitude: this.props.position.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005
      };
      this.mapView.animateToRegion(userRegion, 1000);
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1, marginBottom: this.state.mapMarginBottom }}
          customMapStyle={mapStyle}
          initialRegion={this.state.region}
          onRegionChangeComplete={this.onRegionChange}
          provider={MapView.PROVIDER_GOOGLE}
          showsUserLocation
          showsMyLocationButton={false}
          onMapReady={() => this.setState({ mapMarginBottom: 0 })}
          ref={ref => (this.mapView = ref)}
          onLayout={() => {
            if (this.state.ambulanceLocation) {
              this.mapView.fitToCoordinates(
                [
                  {
                    latitude: this.props.position.coords.latitude,
                    longitude: this.props.position.coords.longitude
                  },
                  {
                    latitude: this.state.ambulanceLocation.latitude,
                    longitude: this.state.ambulanceLocation.longitude
                  }
                ],
                {
                  edgePadding: { top: 20, right: 20, bottom: 20, left: 20 },
                  animated: true
                }
              );
            }
          }}
        >
          {this.state.ambulanceLocation ? (
            <Marker.Animated
              ref={marker => {
                this.marker = marker;
              }}
              coordinate={{
                latitude: this.state.ambulanceLocation.latitude,
                longitude: this.state.ambulanceLocation.longitude
              }}
              rotation={this.state.ambulanceLocation.heading - 70}
            >
              <Image
                source={Images.ambulanceTopView}
                style={{ width: 60, height: 60, margin: 30 }}
                resizeMode="contain"
              />
            </Marker.Animated>
          ) : null}
        </MapView>
        <FAB
          style={styles.fab}
          icon={() => (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Icon
                name="crosshairs-gps"
                size={25}
                color="gray"
                style={{ alignSelf: 'center' }}
              />
            </View>
          )}
          onPress={() => this.calibrateView()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    marginBottom: 75,
    right: 0,
    bottom: 0,
    backgroundColor: 'white'
  },
  sendButton: {
    position: 'absolute',
    margin: 16,
    marginBottom: 75,
    right: 0,
    bottom: 70,
    backgroundColor: 'white'
  }
});

const mapStateToProps = state => ({
  position: state.location.position,
  ambulancePhoneNumber: state.ambulanceRequest.ambulancePhoneNumber,
  userType: state.signin.userType
});

export default connect(
  mapStateToProps,
  { getLocation, updateAmbulanceNumber }
)(WaitForAmbulance);
