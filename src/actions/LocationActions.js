import { GET_LOCATION, REQUEST_LOCATION_PERMISSION, UPDATE_LOCATION } from './types';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Platform, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export const updateLocation = (position) => {
  return {
    type: UPDATE_LOCATION,
    payload: position
  };
};

export const getLocation = () => {
  return async dispatch => {
    Geolocation.setRNConfiguration({ skipPermissionRequests: false, authorizationLevel: 'always' });
    Geolocation.requestAuthorization();
    await Geolocation.getCurrentPosition(
      position => {
        dispatch({ type: GET_LOCATION, payload: position });
      },
      error => {
        switch (error.code) {
          case 1:
            Alert.alert('Error', 'Location permission is not granted');
            break;
          case 2:
            Alert.alert('Error', 'Location provider not available');
            break;
          case 3:
            Alert.alert('Error', 'Location request timed out');
            break;
          case 4:
            Alert.alert(
              'Error',
              'Google play service is not installed or has an older version'
            );
            break;
          case 5:
            Alert.alert(
              'Error',
              'Location service is not enabled or location mode is not appropriate for the current request'
            );
            break;
          default:
            Alert.alert('Error', 'Please try again');
            break;
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
    );
  };
};

export const requestLocationPermission = () => {
  var flag;
  console.log('requesting location permission');
  return async dispatch => {
    if (Platform.OS === 'ios') {
      console.log('requesting location on ios');
      await request(PERMISSIONS.IOS.LOCATION_ALWAYS)
        .then(result => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              console.log(
                'This feature is not available (on this device / in this context)'
              );
              dispatch({ type: REQUEST_LOCATION_PERMISSION, payload: false });
              break;
            case RESULTS.DENIED:
              console.log(
                'The permission has not been requested / is denied but requestable'
              );
              dispatch({ type: REQUEST_LOCATION_PERMISSION, payload: false });
              break;
            case RESULTS.GRANTED:
              console.log('The permission is granted');
              dispatch({ type: REQUEST_LOCATION_PERMISSION, payload: true });
              break;
            case RESULTS.BLOCKED:
              console.log(
                'The permission is denied and not requestable anymore'
              );
              dispatch({ type: REQUEST_LOCATION_PERMISSION, payload: false });
              break;
          }
        })
        .catch(error => {
          console.log('Error requesting location permission');
        });
    } else {
      console.log('requesting location on android');
      await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
        .then(result => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              console.log(
                'This feature is not available (on this device / in this context)'
              );
              flag = false;
              break;
            case RESULTS.DENIED:
              console.log(
                'The permission has not been requested / is denied but requestable'
              );
              flag = false;
              break;
            case RESULTS.GRANTED:
              console.log('The permission is granted');
              flag = true;
              break;
            case RESULTS.BLOCKED:
              console.log(
                'The permission is denied and not requestable anymore'
              );
              flag = false;
              break;
          }
        })
        .catch(error => {
          console.log('Error requesting location permission');
        });
      await request(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION)
        .then(result => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              console.log(
                'This feature is not available (on this device / in this context)'
              );
              dispatch({ type: REQUEST_LOCATION_PERMISSION, payload: false });
              break;
            case RESULTS.DENIED:
              console.log(
                'The permission has not been requested / is denied but requestable'
              );
              dispatch({ type: REQUEST_LOCATION_PERMISSION, payload: false });
              break;
            case RESULTS.GRANTED:
              console.log('The permission is granted');
              dispatch({
                type: REQUEST_LOCATION_PERMISSION,
                payload: true && flag
              });
              break;
            case RESULTS.BLOCKED:
              console.log(
                'The permission is denied and not requestable anymore'
              );
              dispatch({ type: REQUEST_LOCATION_PERMISSION, payload: false });
              break;
          }
        })
        .catch(error => {
          console.log('Error requesting location permission');
        });
    }
  };
};
