"use strict";

import React from "react";
import {
  Text,
  View,
  Alert,
  Modal,
  TouchableHighlight,
  Platform,
  SafeAreaView,
  StatusBar,
  FlatList,
  PermissionsAndroid
} from "react-native";
import { connect } from "react-redux";
import {
  toggleAudioState,
  toggleVideoState,
  resetCallOptions,
  setCallingCounter,
  setLocalVideoStreamId,
  setRemoteVideoStreamId
} from "../../../actions";
import { Voximplant } from "react-native-voximplant";
import CallButton from "../components/CallButton";
import COLOR_SCHEME from "../styles/ColorScheme";
import COLOR from "../styles/Color";
import CallManager from "../manager/CallManager";
import styles from "../styles/Styles";
import { Actions } from "react-native-router-flux";
// import Call from './Call';

const CALL_STATES = {
  DISCONNECTED: "disconnected",
  CONNECTING: "connecting",
  CONNECTED: "connected"
};

class OutGoingCallScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      modalText: "",
      audioDeviceSelectionVisible: false,
      audioDevices: [],
      audioDeviceIcon: "hearing"
    };

    this.calls = [];
    this.callState = CALL_STATES.DISCONNECTED;
    this.props.calls.forEach(call => {
      let c = CallManager.getInstance().getCallById(call.callId);
      this.calls.push(c);
    });
    Alert.alert("calls counter", JSON.stringify(this.calls[0].callId));
  }

  componentDidMount() {
    this.calls.forEach(call => {
      if (call) {
        Object.keys(Voximplant.CallEvents).forEach(eventName => {
          const callbackName = `_onCall${eventName}`;
          if (typeof this[callbackName] !== "undefined") {
            call.on(eventName, this[callbackName]);
          }
        });
      } else {
        var index = this.calls.indexOf(call);
        if (index > -1) {
          this.calls.splice(index, 1);
        }
      }
    });

    Object.keys(Voximplant.Hardware.AudioDeviceEvents).forEach(eventName => {
      const callbackName = `_onAudio${eventName}`;
      if (typeof this[callbackName] !== "undefined") {
        Voximplant.Hardware.AudioDeviceManager.getInstance().on(
          eventName,
          this[callbackName]
        );
      }
    });

    this.props.setCallingCounter(this.props.calls.length);
    this.callState = CALL_STATES.CONNECTING;

    (async () => {
      let currentAudioDevice = await Voximplant.Hardware.AudioDeviceManager.getInstance().getActiveDevice();
      switch (currentAudioDevice) {
        case Voximplant.Hardware.AudioDevice.BLUETOOTH:
          this.setState({ audioDeviceIcon: "bluetooth-audio" });
          break;
        case Voximplant.Hardware.AudioDevice.SPEAKER:
          this.setState({ audioDeviceIcon: "volume-up" });
          break;
        case Voximplant.Hardware.AudioDevice.WIRED_HEADSET:
          this.setState({ audioDeviceIcon: "headset" });
          break;
        case Voximplant.Hardware.AudioDevice.EARPIECE:
        default:
          this.setState({ audioDeviceIcon: "hearing" });
          break;
      }
    })();
  }

  componentWillUnmount() {
    this.calls.forEach(call => {
      if (call) {
        Object.keys(Voximplant.CallEvents).forEach(eventName => {
          const callbackName = `_onCall${eventName}`;
          if (typeof this[callbackName] !== "undefined") {
            call.off(eventName, this[callbackName]);
          }
        });
      } else {
        var index = this.calls.indexOf(call);
        if (index > -1) {
          this.calls.splice(index, 1);
        }
      }
    });
    Object.keys(Voximplant.Hardware.AudioDeviceEvents).forEach(eventName => {
      const callbackName = `_onAudio${eventName}`;
      if (typeof this[callbackName] !== "undefined") {
        Voximplant.Hardware.AudioDeviceManager.getInstance().off(
          eventName,
          this[callbackName]
        );
      }
    });
    this.props.resetCallOptions();
  }

  shouldComponentUpdate() {
    if (this.props.callingCounter == 0) {
      this.setState({
        isModalOpen: true,
        modalText: "Called users couldnot answer now, try again later"
      });
    }
  }

  async sendVideo(doSend) {
    try {
      if (doSend && Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          return;
        }
      }
      this.calls.forEach(async call => {
        if (call) {
          await call.sendVideo(doSend);
        } else {
          var index = this.calls.indexOf(call);
          if (index > -1) {
            this.calls.splice(index, 1);
          }
        }
      });
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
        "Failed to hold(" + doHold + ") due to " + e.code + " " + e.message
      );
    }
  }

  async receiveVideo() {
    try {
      this.calls.forEach(async call => {
        if (call) {
          await call.receiveVideo();
        } else {
          var index = this.calls.indexOf(call);
          if (index > -1) {
            this.calls.splice(index, 1);
          }
        }
      });
    } catch (e) {
      console.warn("Failed to receiveVideo due to " + e.code + " " + e.message);
    }
  }

  endCall() {
    this.calls.forEach(call => {
      if (call) {
        call.getEndpoints().forEach(endpoint => {
          this._setupEndpointListeners(endpoint, false);
          call.hangup();
        });
      } else {
        var index = this.calls.indexOf(call);
        if (index > -1) {
          this.calls.splice(index, 1);
        }
      }
    });
    this.props.resetCallOptions();
    Actions.main();
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
    this.setState({ isModalOpen: false, modalText: "" });
  }

  _onCallFailed = event => {
    Alert.alert("muted", JSON.stringify(event.call));
    var index = this.calls.indexOf(event.call);
    if (index > -1) {
      this.calls.splice(index, 1);
    }
    CallManager.getInstance().removeCall(event.call);
    if (this.calls.length < 1) {
      this.callState = CALL_STATES.DISCONNECTED;
      Actions.main();
    }
    this.props.setCallingCounter(this.props.callingCounter - 1);
  };

  _onCallDisconnected = event => {
    Alert.alert("muted", JSON.stringify(event.call));
    // console.log('CallScreen: _onCallDisconnected: ' + event.call.callId);
    CallManager.getInstance().removeCall(event.call);
    var index = this.calls.indexOf(event.call);
    if (index > -1) {
      this.calls.splice(index, 1);
    }
    if (
      Platform.OS === "android" &&
      Platform.Version >= 26 &&
      this.callState === CALL_STATES.CONNECTED
    ) {
      (async () => {
        await VIForegroundService.stopService();
      })();
    }
    if (this.props.callingCounter === 1) {
      this.callState = CALL_STATES.DISCONNECTED;
      Actions.main();
    }
    this.props.setCallingCounter(this.props.callingCounter - 1);
    // this.props.navigation.navigate('App');
  };

  _onCallConnected = event => {
    // console.log('CallScreen: _onCallConnected: ' + this.call.callId);
    // this.call.sendMessage('Test message');
    // this.call.sendInfo('rn/info', 'test info');
    var index = this.calls.indexOf(event.call);
    if (index > -1) {
      this.calls.splice(index, 1);
    }
    this.calls.forEach(call => {
      CallManager.getInstance().removeCall(call);
    });
    this.calls = [event.call];
    this.callState = CALL_STATES.CONNECTED;
    this.props.setCallingCounter(1);
    if (Platform.OS === "android" && Platform.Version >= 26) {
      const channelConfig = {
        id: "ForegroundServiceChannel",
        name: "In progress calls",
        description: "Notify the call is in progress",
        enableVibration: true
      };
      const notificationConfig = {
        channelId: "ForegroundServiceChannel",
        id: 3456,
        title: "Nabd",
        text: "Someone needs yout help",
        icon: "ic_vox_notification"
      };
      (async () => {
        await VIForegroundService.createNotificationChannel(channelConfig);
        await VIForegroundService.startService(notificationConfig);
      })();
    }
  };

  _onCallLocalVideoStreamAdded = event => {
    this.props.setLocalVideoStreamId(event.videoStream.id);
  };

  _onCallLocalVideoStreamRemoved = event => {
    this.props.setLocalVideoStreamId(null);
  };

  _onCallEndpointAdded = event => {
    this._setupEndpointListeners(event.endpoint, true);
  };

  _onEndpointRemoteVideoStreamAdded = event => {
    this.props.setRemoteVideoStreamId(event.videoStream.id);
  };

  _onEndpointRemoteVideoStreamRemoved = event => {
    if (this.props.remoteVideoStreamId === event.videoStream.id) {
      this.props.setRemoteVideoStreamId(null);
    }
  };

  _onEndpointRemoved = event => {
    this._setupEndpointListeners(event.endpoint, false);
  };

  _onEndpointInfoUpdated = event => {};

  _setupEndpointListeners(endpoint, on) {
    Object.keys(Voximplant.EndpointEvents).forEach(eventName => {
      const callbackName = `_onEndpoint${eventName}`;
      if (typeof this[callbackName] !== "undefined") {
        endpoint[on ? "on" : "off"](eventName, this[callbackName]);
      }
    });
  }

  muteAudio() {
    const isMuted = this.props.isAudioMuted;
    this.calls.forEach(call => {
      if (call) {
        call.sendAudio(isMuted);
      } else {
        var index = this.calls.indexOf(call);
        if (index > -1) {
          this.calls.splice(index, 1);
        }
      }
    });
    this.props.toggleAudioState();
  }

  _onAudioDeviceChanged = event => {
    console.log("CallScreen: _onAudioDeviceChanged:" + event.currentDevice);
    switch (event.currentDevice) {
      case Voximplant.Hardware.AudioDevice.BLUETOOTH:
        this.setState({ audioDeviceIcon: "bluetooth-audio" });
        break;
      case Voximplant.Hardware.AudioDevice.SPEAKER:
        this.setState({ audioDeviceIcon: "volume-up" });
        break;
      case Voximplant.Hardware.AudioDevice.WIRED_HEADSET:
        this.setState({ audioDeviceIcon: "headset" });
        break;
      case Voximplant.Hardware.AudioDevice.EARPIECE:
      default:
        this.setState({ audioDeviceIcon: "hearing" });
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
          width: "100%",
          backgroundColor: "#607D8B",
          marginTop: 10,
          marginBottom: 10
        }}
      />
    );
  };

  isIconMuted() {
    if (this.props.isAudioMuted) {
      Alert.alert("muted", JSON.stringify(this.props.isAudioMuted));
      return (
        <CallButton
          icon_name="videocam-off"
          color={COLOR.ACCENT}
          buttonPressed={() => this.muteAudio()}
        />
      );
    }
    return (
      <CallButton
        icon_name="mic-off"
        color={COLOR.ACCENT}
        buttonPressed={() => this.muteAudio()}
      />
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.safearea}>
        {/* <FlatList
          data={this.props.calls}
          keyExtractor={call => call.callId}
          renderItem={({ item }) => (
            <Call
              callId={item.callId}
              isVideo={this.props.isVideo}
              isIncoming={this.props.isIncoming}
            />
          )}
        /> */}
        <StatusBar
          barStyle={
            Platform.OS === "ios" ? COLOR_SCHEME.DARK : COLOR_SCHEME.LIGHT
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

          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Text style={styles.call_connecting_label}>
              {this.state.callState}
            </Text>
          </View>

          <View style={styles.call_controls}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                backgroundColor: "transparent"
              }}
            >
              {this.isIconMuted()}
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
                        {" "}
                        {item}{" "}
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
  var {
    isAudioMuted,
    isVideoSent,
    localVideoStreamId,
    remoteVideoStreamId,
    callingCounter
  } = state.call;
  return {
    callingCounter,
    isAudioMuted,
    isVideoSent,
    localVideoStreamId,
    remoteVideoStreamId
  };
};

export default connect(
  mapStateToProps,
  {
    setCallingCounter,
    toggleAudioState,
    toggleVideoState,
    resetCallOptions,
    setRemoteVideoStreamId,
    setLocalVideoStreamId
  }
)(OutGoingCallScreen);
