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
      latitudeDelta: 0.005,
      longitudeDelta: 0.005
    };
    this.mapView.animateToRegion(userRegion, 1000);
  }

  sendRequest() {
    console.log("send Request")
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
        <View style={styles.markerFixed}/>
        {/* <Pulse size={100} color="#52AB42" /> */}
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
          style={styles.sendButton}
          icon={() => (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <CustomIcon
                name="next-1"
                size={25}
                color="gray"
                style={{ alignSelf: 'center' }}
              />
            </View>
          )}
          onPress={() => this.sendRequest()}
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
  },
  markerFixed: {
    left: "49.15%",
    position: 'absolute',
    top: "47.15%",
    backgroundColor: 'black',
    height: 7,
    width: 7,
    borderRadius: 14
  },
});

const mapStateToProps = state => ({ position: state.location.position });

export default connect(
  mapStateToProps,
  { getLocation }
)(WaitForAmbulance);
