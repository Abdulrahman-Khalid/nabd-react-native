import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { connect } from 'react-redux';
import { Images } from '../constants';
import { MapSearch } from './MapSearch';
import { FAB, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';

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

  onRegionChange = region => {
    this.setState({
      region
    });
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
          <Button
            mode="contained"
            onPress={() => {
              console.log('submit pressed');
            }}
            color="#ffff"
            style={{ borderRadius: 30, flex: 1, marginRight: 10 }}
            touchableStyle={{ borderRadius: 30 }}
          >
            <Text style={{ color: '#b3b3b2', fontFamily: 'Manjari-Bold' }}>
              Submit
            </Text>
          </Button>
          <Button
            mode="contained"
            onPress={this.props.cancelOnPress}
            color="#fdeaec"
            style={{ borderRadius: 30, flex: 1, marginLeft: 10 }}
            touchableStyle={{ borderRadius: 30 }}
          >
            <Text style={{ color: '#d76674', fontFamily: 'Manjari-Bold' }}>
              Cancel
            </Text>
          </Button>
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
    justifyContent: 'space-between'
  }
});

const mapStateToProps = state => ({ position: state.location.position });

export default connect(
  mapStateToProps,
  null
)(LocationPicker);
