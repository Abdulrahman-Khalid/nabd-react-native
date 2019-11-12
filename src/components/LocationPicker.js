import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  NativeModules
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { connect } from 'react-redux';
import { Images, Colors } from '../constants';
import MapSearch from './MapSearch';
import { FAB, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import mapStyle from '../config/GoogleMapsCustomStyle';

const deviceLanguage =
  Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale.substring(0, 1)
    : NativeModules.I18nManager.localeIdentifier.substring(0, 1);

class LocationPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: this.props.position.coords.latitude,
        longitude: this.props.position.coords.longitude,
        latitudeDelta: 0.004,
        longitudeDelta: 0.004
      },
      mapMarginBottom: 1
    };
  }

  static propTypes = {
    onValueChange: PropTypes.func
  };

  static defaultProps = {
    onValueChange: () => null
  };

  onRegionChange = region => {
    const { onValueChange, disabled } = this.props;
    this.setState(
      {
        region
      },
      () => onValueChange(this.state.region)
    );
  };

  moveToUserLocation() {
    const userRegion = {
      latitude: this.props.position.coords.latitude,
      longitude: this.props.position.coords.longitude,
      latitudeDelta: 0.004,
      longitudeDelta: 0.004
    };
    this.mapView.animateToRegion(userRegion, 1000);
  }

  handleSearchedLocationSelected = (data, { geometry }) => {
    console.log(data)
    console.log(geometry)
    this.setState({
      region: {
        latitude: geometry.location.lat,
        longitude: geometry.location.lng
      }
    });
    this.mapView.animateToRegion({
      latitude: this.state.region.latitude,
      longitude: this.state.region.longitude,
      latitudeDelta: 0.004,
      longitudeDelta: 0.004
    }, 1000);
  };

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
        />
        <MapSearch onLocationSelected={this.handleSearchedLocationSelected} />
        <View style={styles.markerFixed}>
          <Image style={styles.marker} source={Images.locationMarker} />
        </View>
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
          onPress={() => this.moveToUserLocation()}
        />
        <FAB
          style={styles.submit}
          icon={() => (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {this.props.loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Icon
                  name="check"
                  size={25}
                  color="white"
                  style={{ alignSelf: 'center' }}
                />
              )}
            </View>
          )}
          onPress={this.props.onPressSubmit}
        />
        <TouchableOpacity
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: 60,
            width: 60,
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onPress={this.props.cancelOnPress}
        >
          <Icon
            name={
              deviceLanguage == 'ar'
                ? this.props.language.lang === 'ar'
                  ? 'chevron-left'
                  : 'chevron-right'
                : this.props.language.lang === 'ar'
                ? 'chevron-right'
                : 'chevron-left'
            }
            size={25}
            color="white"
            style={{ alignSelf: 'center' }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  markerFixed: {
    left: '50%',
    marginLeft: -24,
    marginTop: -48,
    position: 'absolute',
    top: '50%'
  },
  marker: {
    height: 48,
    width: 48
  },
  fab: {
    position: 'absolute',
    margin: 16,
    marginBottom: 30,
    right: 0,
    bottom: 0,
    backgroundColor: 'white'
  },
  buttonsContainer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    margin: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  linearGradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: 80
  },
  submit: {
    position: 'absolute',
    margin: 16,
    marginBottom: 100,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.APP
  }
});

const mapStateToProps = state => ({
  position: state.location.position,
  language: state.language
});

export default connect(
  mapStateToProps,
  null
)(LocationPicker);
