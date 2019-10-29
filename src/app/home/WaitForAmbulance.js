import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getLocation } from '../../actions';
import { connect } from 'react-redux';
import { Images } from '../../constants';
import { FAB, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import { Icon as CustomIcon } from '../../components';
import io from 'socket.io-client';
import axios from 'axios';

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
      mapMarginBottom: 1
    };
    this.socket = io(
      axios.defaults.baseURL.substring(0, axios.defaults.baseURL.length - 4)
    );
  }

  componentDidMount() {
    this.socket.on('ambulanceRequestUserEnd', data => {
      this.setState({
        ambulanceLocation: data
      });
    });
  }

  moveToUserLocation() {
    const userRegion = {
      latitude: this.props.position.coords.latitude,
      longitude: this.props.position.coords.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005
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
        >
          {this.state.ambulanceLocation != null ? (
            <Marker.Animated
              ref={marker => {
                this.marker = marker;
              }}
              coordinate={this.state.ambulanceLocation}
            />
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
          onPress={() => this.moveToUserLocation()}
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

const mapStateToProps = state => ({ position: state.location.position });

export default connect(
  mapStateToProps,
  { getLocation }
)(WaitForAmbulance);
