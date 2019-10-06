'use strict';

import React from 'react';
import {
  Text,
  View,
  Modal,
  TouchableHighlight,
  Platform,
  SafeAreaView,
  StatusBar,
  FlatList,
  PermissionsAndroid
} from 'react-native';
import { connect } from 'react-redux';
import {
  toggleAudioState,
  toggleVideoState,
  resetCallOptions
} from '../../../actions';
import { Voximplant } from 'react-native-voximplant';
import CallButton from '../components/CallButton';
import COLOR_SCHEME from '../styles/ColorScheme';
import COLOR from '../styles/Color';
import CallManager from '../manager/CallManager';
import styles from '../styles/Styles';
import { Actions } from 'react-native-router-flux';
import Call from './Call';

class OutGoingCallScreen extends React.Component {
  constructor(props) {
    super(props);

    this.props.calls.forEach(call => {
      // new Call({
      //   callId: call.callId,
      //   isVideo: this.props.isVideo,
      //   isIncoming: this.props.isIncoming
      // });
    });

    this.state = {
      isModalOpen: false,
      modalText: '',
      audioDeviceSelectionVisible: false,
      audioDevices: [],
      audioDeviceIcon: 'hearing'
    };

    this.calls = [];
    this.props.calls.forEach(call => {
      this.calls.push(CallManager.getInstance().getCallById(call.callId));
    });
  }

  componentDidMount() {
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
    this.calls.forEach(call => {
      if (call) {
        Object.keys(Voximplant.CallEvents).forEach(eventName => {
          const callbackName = `_onCall${eventName}`;
          if (typeof this[callbackName] !== 'undefined') {
            call.off(eventName, this[callbackName]);
          }
        });
      }
    });
    Object.keys(Voximplant.Hardware.AudioDeviceEvents).forEach(eventName => {
      const callbackName = `_onAudio${eventName}`;
      if (typeof this[callbackName] !== 'undefined') {
        Voximplant.Hardware.AudioDeviceManager.getInstance().off(
          eventName,
          this[callbackName]
        );
      }
    });
    this.props.resetCallOptions();
  }

  muteAudio() {
    this.props.toggleAudioState();
  }

  async sendVideo(doSend) {
    try {
      if (doSend && Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          return;
        }
      }
      this.props.toggleVideoState();
    } catch (e) {
      console.warn(
        `Failed to sendVideo(${doSend}) due to ${e.code} ${e.message}`
      );
    }
  }

  async hold(doHold) {
    try {
      this.calls.forEach(async call => {
        await call.hold(doHold);
      });
    } catch (e) {
      console.warn(
        'Failed to hold(' + doHold + ') due to ' + e.code + ' ' + e.message
      );
    }
  }

  async receiveVideo() {
    try {
      this.calls.forEach(async call => {
        await call.receiveVideo();
      });
    } catch (e) {
      console.warn('Failed to receiveVideo due to ' + e.code + ' ' + e.message);
    }
  }

  endCall() {
    console.log('CallScreen[' + this.callId + '] endCall');
    this.calls.forEach(call => {
      call.getEndpoints().forEach(endpoint => {
        this._setupEndpointListeners(endpoint, false);
      });
      call.hangup();
    });
  }

  async switchAudioDevice() {
    let devices = await Voximplant.Hardware.AudioDeviceManager.getInstance().getAudioDevices();
    this.setState({ audioDevices: devices, audioDeviceSelectionVisible: true });
  }

  selectAudioDevice(device) {
    Voximplant.Hardware.AudioDeviceManager.getInstance().selectAudioDevice(
      device
    );
    this.setState({ audioDeviceSelectionVisible: false });
  }

  _closeModal() {
    this.setState({ isModalOpen: false, modalText: '' });
    Actions.main();
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
    return (
      <SafeAreaView style={styles.safearea}>
        <StatusBar
          barStyle={
            Platform.OS === 'ios' ? COLOR_SCHEME.DARK : COLOR_SCHEME.LIGHT
          }
          backgroundColor={COLOR.PRIMARY_DARK}
        />
        <View style={styles.useragent}>
          <View style={styles.videoPanel}>
            <Voximplant.VideoView
              style={styles.remotevideo}
              videoStreamId={this.props.remoteVideoStreamId}
              scaleType={Voximplant.RenderScaleType.SCALE_FIT}
            />
            {this.props.isVideoSent ? (
              <Voximplant.VideoView
                style={styles.selfview}
                videoStreamId={this.props.localVideoStreamId}
                scaleType={Voximplant.RenderScaleType.SCALE_FIT}
                showOnTop={true}
              />
            ) : null}
          </View>

          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.call_connecting_label}>
              {this.state.callState}
            </Text>
          </View>

          <View style={styles.call_controls}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                backgroundColor: 'transparent'
              }}
            >
              {this.props.isAudioMuted ? (
                <CallButton
                  icon_name="mic"
                  color={COLOR.ACCENT}
                  buttonPressed={() => this.muteAudio()}
                />
              ) : (
                <CallButton
                  icon_name="mic-off"
                  color={COLOR.ACCENT}
                  buttonPressed={() => this.muteAudio()}
                />
              )}
              <CallButton
                icon_name={this.state.audioDeviceIcon}
                color={COLOR.ACCENT}
                buttonPressed={() => this.switchAudioDevice()}
              />
              {this.props.isVideoSent ? (
                <CallButton
                  icon_name="videocam-off"
                  color={COLOR.ACCENT}
                  buttonPressed={() => this.sendVideo(false)}
                />
              ) : (
                <CallButton
                  icon_name="video-call"
                  color={COLOR.ACCENT}
                  buttonPressed={() => this.sendVideo(true)}
                />
              )}
              <CallButton
                icon_name="call-end"
                color={COLOR.RED}
                buttonPressed={() => this.endCall()}
              />
            </View>
          </View>

          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.audioDeviceSelectionVisible}
            onRequestClose={() => {}}
          >
            <TouchableHighlight
              onPress={() => {
                this.setState({ audioDeviceSelectionVisible: false });
              }}
              style={styles.container}
            >
              <View style={[styles.container, styles.modalBackground]}>
                <View
                  style={[
                    styles.innerContainer,
                    styles.innerContainerTransparent
                  ]}
                >
                  <FlatList
                    data={this.state.audioDevices}
                    keyExtractor={(item, index) => item}
                    ItemSeparatorComponent={this.flatListItemSeparator}
                    renderItem={({ item }) => (
                      <Text
                        onPress={() => {
                          this.selectAudioDevice(item);
                        }}
                      >
                        {' '}
                        {item}{' '}
                      </Text>
                    )}
                  />
                </View>
              </View>
            </TouchableHighlight>
          </Modal>

          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.isModalOpen}
            onRequestClose={() => {}}
          >
            <TouchableHighlight
              onPress={e => this._closeModal()}
              style={styles.container}
            >
              <View style={[styles.container, styles.modalBackground]}>
                <View
                  style={[
                    styles.innerContainer,
                    styles.innerContainerTransparent
                  ]}
                >
                  <Text>{this.state.modalText}</Text>
                </View>
              </View>
            </TouchableHighlight>
          </Modal>
        </View>
      </SafeAreaView>
    );
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
  { toggleAudioState, toggleVideoState, resetCallOptions }
)(OutGoingCallScreen);
