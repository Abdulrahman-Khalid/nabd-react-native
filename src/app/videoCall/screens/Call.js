'use strict';

import React from 'react';
import { View, Platform, PermissionsAndroid } from 'react-native';

import { Voximplant } from 'react-native-voximplant';
import CallManager from '../manager/CallManager';
import VIForegroundService from '@voximplant/react-native-foreground-service';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  decCallingCounter,
  setLocalVideoStreamId,
  setRemoteVideoStreamId
} from '../../../actions';

const CALL_STATES = {
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  CONNECTED: 'connected'
};
class Call extends React.Component {
  constructor(props) {
    super(props);

    this.callId = this.props.callId;
    this.isVideoCall = this.props.isVideo;
    this.isIncoming = this.props.isIncoming;
    this.callState = CALL_STATES.DISCONNECTED;

    this.state = {
      audioDeviceSelectionVisible: false,
      audioDevices: [],
      audioDeviceIcon: 'hearing'
    };

    this.call = CallManager.getInstance().getCallById(this.callId);

    console.log(
      'CallScreen: ctr: callid: ' +
        this.callId +
        ', isVideoCall: ' +
        this.isVideoCall +
        ', isIncoming:  ' +
        this.isIncoming +
        ', callState: ' +
        this.callState
    );
  }

  componentDidMount() {
    if (this.call) {
      Object.keys(Voximplant.CallEvents).forEach(eventName => {
        const callbackName = `_onCall${eventName}`;
        if (typeof this[callbackName] !== 'undefined') {
          this.call.on(eventName, this[callbackName]);
        }
      });
      if (this.isIncoming) {
        this.call.getEndpoints().forEach(endpoint => {
          this._setupEndpointListeners(endpoint, true);
        });
      }
    }
    Object.keys(Voximplant.Hardware.AudioDeviceEvents).forEach(eventName => {
      const callbackName = `_onAudio${eventName}`;
      if (typeof this[callbackName] !== 'undefined') {
        Voximplant.Hardware.AudioDeviceManager.getInstance().on(
          eventName,
          this[callbackName]
        );
      }
    });

    if (this.isIncoming) {
      const callSettings = {
        video: {
          sendVideo: this.props.isVideoSent,
          receiveVideo: this.props.isVideoSent
        }
      };
      this.call.answer(callSettings);
    }
    this.callState = CALL_STATES.CONNECTING;

    (async () => {
      let currentAudioDevice = await Voximplant.Hardware.AudioDeviceManager.getInstance().getActiveDevice();
      switch (currentAudioDevice) {
        case Voximplant.Hardware.AudioDevice.BLUETOOTH:
          this.setState({ audioDeviceIcon: 'bluetooth-audio' });
          break;
        case Voximplant.Hardware.AudioDevice.SPEAKER:
          this.setState({ audioDeviceIcon: 'volume-up' });
          break;
        case Voximplant.Hardware.AudioDevice.WIRED_HEADSET:
          this.setState({ audioDeviceIcon: 'headset' });
          break;
        case Voximplant.Hardware.AudioDevice.EARPIECE:
        default:
          this.setState({ audioDeviceIcon: 'hearing' });
          break;
      }
    })();
  }

  componentWillUnmount() {
    console.log('CallScreen: componentWillUnmount ' + this.call.callId);
    if (this.call) {
      Object.keys(Voximplant.CallEvents).forEach(eventName => {
        const callbackName = `_onCall${eventName}`;
        if (typeof this[callbackName] !== 'undefined') {
          this.call.off(eventName, this[callbackName]);
        }
      });
    }
    Object.keys(Voximplant.Hardware.AudioDeviceEvents).forEach(eventName => {
      const callbackName = `_onAudio${eventName}`;
      if (typeof this[callbackName] !== 'undefined') {
        Voximplant.Hardware.AudioDeviceManager.getInstance().off(
          eventName,
          this[callbackName]
        );
      }
    });
  }

  shouldComponentUpdate() {
    // this.call.sendAudio(this.props.isAudioMuted);
    // async(()=>{await this.call.sendVideo(this.props.isVideoSent);});
  }

  async hold(doHold) {
    console.log('CallScreen[' + this.callId + '] hold: ' + doHold);
    try {
      await this.call.hold(doHold);
    } catch (e) {
      console.warn(
        'Failed to hold(' + doHold + ') due to ' + e.code + ' ' + e.message
      );
    }
  }

  async receiveVideo() {
    console.log('CallScreen[' + this.callId + '] receiveVideo');
    try {
      await this.call.receiveVideo();
    } catch (e) {
      console.warn('Failed to receiveVideo due to ' + e.code + ' ' + e.message);
    }
  }

  endCall() {
    console.log('CallScreen[' + this.callId + '] endCall');
    this.call.getEndpoints().forEach(endpoint => {
      this._setupEndpointListeners(endpoint, false);
    });
    this.call.hangup();
  }

  async switchAudioDevice() {
    console.log('CallScreen[' + this.callId + '] switchAudioDevice');
    let devices = await Voximplant.Hardware.AudioDeviceManager.getInstance().getAudioDevices();
    this.setState({ audioDevices: devices, audioDeviceSelectionVisible: true });
  }

  selectAudioDevice(device) {
    console.log('CallScreen[' + this.callId + '] selectAudioDevice: ' + device);
    Voximplant.Hardware.AudioDeviceManager.getInstance().selectAudioDevice(
      device
    );
    this.setState({ audioDeviceSelectionVisible: false });
  }

  _keypadPressed(value) {
    console.log('CallScreen[' + this.callId + '] _keypadPressed(: ' + value);
    this.call.sendTone(value);
  }

  _onCallFailed = event => {
    this.callState = CALL_STATES.DISCONNECTED;
    CallManager.getInstance().removeCall(this.call);
    this.props.decCallingCounter();
  };

  _onCallDisconnected = event => {
    console.log('CallScreen: _onCallDisconnected: ' + event.call.callId);
    this.props.decCallingCounter();
    CallManager.getInstance().removeCall(this.call);
    if (
      Platform.OS === 'android' &&
      Platform.Version >= 26 &&
      this.callState === CALL_STATES.CONNECTED
    ) {
      (async () => {
        await VIForegroundService.stopService();
      })();
    }
    this.callState = CALL_STATES.DISCONNECTED;
    Actions.main();
  };

  _onCallConnected = event => {
    console.log('CallScreen: _onCallConnected: ' + this.call.callId);
    // this.call.sendMessage('Test message');
    // this.call.sendInfo('rn/info', 'test info');
    this.callState = CALL_STATES.CONNECTED;
    if (Platform.OS === 'android' && Platform.Version >= 26) {
      const channelConfig = {
        id: 'ForegroundServiceChannel',
        name: 'In progress calls',
        description: 'Notify the call is in progress',
        enableVibration: false
      };
      const notificationConfig = {
        channelId: 'ForegroundServiceChannel',
        id: 3456,
        title: 'Voximplant',
        text: 'Call in progress',
        icon: 'ic_vox_notification'
      };
      (async () => {
        await VIForegroundService.createNotificationChannel(channelConfig);
        await VIForegroundService.startService(notificationConfig);
      })();
    }
  };

  _onCallLocalVideoStreamAdded = event => {
    console.log(
      'CallScreen: _onCallLocalVideoStreamAdded: ' +
        this.call.callId +
        ', video stream id: ' +
        event.videoStream.id
    );
    this.props.setLocalVideoStreamId(event.videoStream.id);
  };

  _onCallLocalVideoStreamRemoved = event => {
    console.log(
      'CallScreen: _onCallLocalVideoStreamRemoved: ' + this.call.callId
    );
    // this.props.setLocalVideoStreamId(null);
  };

  _onCallEndpointAdded = event => {
    console.log(
      'CallScreen: _onCallEndpointAdded: callid: ' +
        this.call.callId +
        ' endpoint id: ' +
        event.endpoint.id
    );
    this._setupEndpointListeners(event.endpoint, true);
  };

  _onEndpointRemoteVideoStreamAdded = event => {
    console.log(
      'CallScreen: _onEndpointRemoteVideoStreamAdded: callid: ' +
        this.call.callId +
        ' endpoint id: ' +
        event.endpoint.id +
        ', video stream id: ' +
        event.videoStream.id
    );
    this.props.setRemoteVideoStreamId(event.videoStream.id);
  };

  _onEndpointRemoteVideoStreamRemoved = event => {
    console.log(
      'CallScreen: _onEndpointRemoteVideoStreamRemoved: callid: ' +
        this.call.callId +
        ' endpoint id: ' +
        event.endpoint.id +
        ', video stream id: ' +
        event.videoStream.id
    );
    if (this.props.remoteVideoStreamId === event.videoStream.id) {
      // this.props.setRemoteVideoStreamId(null);
    }
  };

  _onEndpointRemoved = event => {
    console.log(
      'CallScreen: _onEndpointRemoved: callid: ' +
        this.call.callId +
        ' endpoint id: ' +
        event.endpoint.id
    );
    this._setupEndpointListeners(event.endpoint, false);
  };

  _onEndpointInfoUpdated = event => {
    console.log(
      'CallScreen: _onEndpointInfoUpdated: callid: ' +
        this.call.callId +
        ' endpoint id: ' +
        event.endpoint.id
    );
  };

  _setupEndpointListeners(endpoint, on) {
    Object.keys(Voximplant.EndpointEvents).forEach(eventName => {
      const callbackName = `_onEndpoint${eventName}`;
      if (typeof this[callbackName] !== 'undefined') {
        endpoint[on ? 'on' : 'off'](eventName, this[callbackName]);
      }
    });
  }

  _onAudioDeviceChanged = event => {
    console.log('CallScreen: _onAudioDeviceChanged:' + event.currentDevice);
    switch (event.currentDevice) {
      case Voximplant.Hardware.AudioDevice.BLUETOOTH:
        this.setState({ audioDeviceIcon: 'bluetooth-audio' });
        break;
      case Voximplant.Hardware.AudioDevice.SPEAKER:
        this.setState({ audioDeviceIcon: 'volume-up' });
        break;
      case Voximplant.Hardware.AudioDevice.WIRED_HEADSET:
        this.setState({ audioDeviceIcon: 'headset' });
        break;
      case Voximplant.Hardware.AudioDevice.EARPIECE:
      default:
        this.setState({ audioDeviceIcon: 'hearing' });
        break;
    }
  };

  _onAudioDeviceListChanged = event => {
    (async () => {
      let device = await Voximplant.Hardware.AudioDeviceManager.getInstance().getActiveDevice();
      console.log(device);
    })();
    this.setState({ audioDevices: event.newDeviceList });
  };

  flatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#607D8B',
          marginTop: 10,
          marginBottom: 10
        }}
      />
    );
  };

  render() {
    return <View></View>;
  }
}

const mapStateToProps = state => {
  const {
    isAudioMuted,
    isVideoSent,
    localVideoStreamId,
    remoteVideoStreamId
  } = state.call;
  return { isAudioMuted, isVideoSent, localVideoStreamId, remoteVideoStreamId };
};

export default connect(
  mapStateToProps,
  { decCallingCounter, setLocalVideoStreamId, setRemoteVideoStreamId }
)(Call);
