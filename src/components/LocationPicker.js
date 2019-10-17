import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getLocation } from '../actions';
import { connect } from 'react-redux';
import { Images } from '../constants';
import { MapSearch } from './MapSearch';
import { FAB } from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';

class LocationPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 30.005026,
        longitude: 31.312718,
        latitudeDelta: 0.004,
        longitudeDelta: 0.004
      },
      mapMarginBottom: 1
    };
  }

  // componentDidMount() {
  //   this.setState({
  //     region: {
  //       latitude: this.props.position.latitude,
  //       longitude: this.props.position.longitude
  //     }
  //   });
  // }

  onRegionChange = region => {
    this.setState({
      region
    });
  };

  moveToUserLocation() {
    const userRegion = {
      latitude: 30.005026,
      longitude: 31.312718,
      latitudeDelta: 0.004,
      longitudeDelta: 0.004
    };
    this.mapView.animateToRegion(userRegion, 1000);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1, marginBottom: this.state.mapMarginBottom }}
          initialRegion={this.state.region}
          onRegionChangeComplete={this.onRegionChange}
          provider={MapView.PROVIDER_GOOGLE}
          showsUserLocation
          showsMyLocationButton={false}
          onMapReady={() => this.setState({ mapMarginBottom: 0 })}
          ref={ref => (this.mapView = ref)}
        />
        {/* <MapSearch onLocationSelected={this.handleSearchedLocationSelected} /> */}
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
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => {
              console.log('submit pressed');
            }}
          >
            <View
              style={[
                styles.button,
                {
                  backgroundColor: '#ffff'
                }
              ]}
            >
              <Text style={{ color: '#b3b3b2', fontFamily: 'Manjari-Bold' }}>
                Submit
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={this.props.cancelOnPress}
          >
            <View
              style={[
                styles.button,
                {
                  backgroundColor: '#fdeaec'
                }
              ]}
            >
              <Text style={{ color: '#d76674', fontFamily: 'Manjari-Bold' }}>
                Cancel
              </Text>
            </View>
          </TouchableOpacity>
        </View>
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
    marginBottom: 75,
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
    justifyContent: 'center'
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
  }
});

const mapStateToProps = state => ({ position: state.location.position });

export default connect(
  mapStateToProps,
  { getLocation }
)(LocationPicker);
