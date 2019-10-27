'use strict';

import React from 'react';
import {
  Text,
  View,
  SafeAreaView,
  PermissionsAndroid,
  Platform
} from 'react-native';
import CallButton from '../components/CallButton';
import CallManager from '../manager/CallManager';
import { Voximplant } from 'react-native-voximplant';
import COLOR from '../styles/Color';
import styles from '../styles/Styles';
import { Actions } from 'react-native-router-flux';

export default class IncomingCallScreen extends React.Component {
  constructor(props) {
    super(props);

    const callId = this.props.callId;
    this.isVideoCall = this.props.isVideo;
    this.displayName = this.props.from;
    this.call = CallManager.getInstance().getCallById(callId);

    this.state = {
      displayName: null
    };
  }

  componentDidMount() {
    if (this.call) {
      Object.keys(Voximplant.CallEvents).forEach(eventName => {
        const callbackName = `_onCall${eventName}`;
        if (typeof this[callbackName] !== 'undefined') {
          this.call.on(eventName, this[callbackName]);
        }
      });
    }
  }

  componentWillUnmount() {
    if (this.call) {
      Object.keys(Voximplant.CallEvents).forEach(eventName => {
        const callbackName = `_onCall${eventName}`;
        if (typeof this[callbackName] !== 'undefined') {
          this.call.off(eventName, this[callbackName]);
        }
      });
      this.call = null;
    }
  }

  async answerCall(withVideo) {
    try {
      if (Platform.OS === 'android') {
        let permissions = [PermissionsAndroid.PERMISSIONS.RECORD_AUDIO];
        if (withVideo) {
          permissions.push(PermissionsAndroid.PERMISSIONS.CAMERA);
        }
        const granted = await PermissionsAndroid.requestMultiple(permissions);
        const recordAudioGranted =
          granted['android.permission.RECORD_AUDIO'] === 'granted';
        const cameraGranted =
          granted['android.permission.CAMERA'] === 'granted';
        if (recordAudioGranted) {
          if (withVideo && !cameraGranted) {
            console.warn(
              'IncomingCallScreen: answerCall: camera permission is not granted'
            );
            return;
          }
        } else {
          console.warn(
            'IncomingCallScreen: answerCall: record audio permission is not granted'
          );
          return;
        }
      }
    } catch (e) {
      console.warn('IncomingCallScreen: asnwerCall:' + e);
      return;
    }
    Actions.Call({
      callId: this.call.callId,
      isVideo: withVideo,
      isIncoming: true
    });
  }

  declineCall() {
    this.call.decline();
  }

  _onCallDisconnected = event => {
    CallManager.getInstance().removeCall(event.call);
    Actions.main();
  };

  _onCallEndpointAdded = event => {
    console.log(
      'IncomingCallScreen: _onCallEndpointAdded: callid: ' +
        this.call.callId +
        ' endpoint id: ' +
        event.endpoint.id
    );
    this.setState({ displayName: event.endpoint.displayName });
  };

  render() {
    return (
      <SafeAreaView style={[styles.safearea, styles.aligncenter]}>
        <Text style={styles.incoming_call}>Incoming call from:</Text>
        <Text style={styles.incoming_call}>{this.state.displayName}</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            height: 90
          }}
        >
          <CallButton
            icon_name="call"
            color={COLOR.ACCENT}
            buttonPressed={() => this.answerCall(false)}
          />
          <CallButton
            icon_name="videocam"
            color={COLOR.ACCENT}
            buttonPressed={() => this.answerCall(true)}
          />
          <CallButton
            icon_name="call-end"
            color={COLOR.RED}
            buttonPressed={() => this.declineCall()}
          />
        </View>
      </SafeAreaView>
    );
  }
}
