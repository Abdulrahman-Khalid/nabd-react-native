import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  ToastAndroid,
  Modal,
  KeyboardAvoidingView
} from 'react-native';
import axios from 'axios';
import ImagePicker from 'react-native-image-picker';
import { Actions } from 'react-native-router-flux';
import { TextInput, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import ActionSheet from 'react-native-action-sheet';
import { LocationPicker } from '../../components';

const actionSheetButtons = [
  'Take a picture',
  'Choose a picture from my gallery'
];

export default class AddIncident extends Component {
  state = {
    text: '',
    numberToCall: null,
    photo: null,
    media: null,
    modalVisible: false
  };

  /**
   * open gallery to upload photo
   */
  handleChoosePhoto = () => {
    const options = {
      noData: true
    };
    ImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        this.setState({ photo: response });
        console.log(this.state.photo.uri);
        console.log(this.state.photo.fileName);
        console.log(this.state.photo.type);
      }
    });
  };

  /**
   * open camera to take photo
   */
  handleCam = () => {
    const options = {
      noData: true
    };
    ImagePicker.launchCamera(options, response => {
      if (response.uri) {
        this.setState({ photo: response });
        console.log(this.state.photo.uri);
        console.log(this.state.photo.fileName);
        console.log(this.state.photo.type);
      }
    });
  };

  /**
   * Handle submitting an incident
   */
  submitIncident() {
    if (this.state.photo !== null) {
      const formData = new FormData();
      formData.append('file', {
        name: this.state.photo.fileName,
        type: this.state.photo.type,
        uri: this.state.photo.uri
      });
      axios({
        method: 'post',
        url: 'media/',
        data: formData,
        config: { headers: { 'Content-Type': 'multipart/form-data' } }
      })
        .then(response => {
          console.log(response.status);
          console.log(response.data.media_id);
          this.setState({ media: response.data.media_id });
        })

        .catch(err => {
          // handle error
          let error = JSON.stringify(err);
          error = JSON.parse(error);
          console.log(error);
          console.log(error.response.status);
        })
        .then(() => {
          // always executed
          axios
            .post('kweeks/', {
              text: this.state.text,
              media_id: this.state.media
            })
            .then(response => {
              console.log(response.status);
              console.log(kweekId);
              //this.props.navigation.navigate('Home');
            })
            .catch(err => {
              // handle error
              let error = JSON.stringify(err);
              error = JSON.parse(error);
              console.log(error);
              console.log(error.response.status);
            })
            .then(() => {
              Actions.Incidents();
            });
        });
      ToastAndroid.show('Loading', ToastAndroid.LONG);
    }
    if (this.state.photo === null) {
      axios
        .post('kweeks/', {
          text: this.state.text,
          reply_to: kweekId === null ? null : kweekId,
          media_id: null
        })
        .then(response => {
          console.log(response.status);
          console.log(kweekId);
          //this.props.navigation.navigate('Home');
        })
        .catch(err => {
          // handle error
          let error = JSON.stringify(err);
          error = JSON.parse(error);
          console.log(error);
          console.log(error.response.status);
        })
        .then(() => {
          Actions.Incidents();
        });
    }
    ToastAndroid.show('Loading', ToastAndroid.SHORT);
  }

  modalCancelOnPress = () => {
    this.setState({
      modalVisible: false
    });
  };

  render() {
    const maxLength = 240;
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
        <Modal
          visible={this.state.modalVisible}
          onRequestClose={this.modalCancelOnPress}
        >
          <LocationPicker cancelOnPress={this.modalCancelOnPress} />
        </Modal>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'stretch',
            padding: 20
          }}
        >
          <TouchableOpacity
            style={
              this.state.photo === null
                ? styles.imageInputContainerEmpty
                : styles.imageInputContainerFull
            }
            onPress={() => {
              ActionSheet.showActionSheetWithOptions(
                {
                  options: actionSheetButtons,
                  cancelButtonIndex: 3,
                  destructiveButtonIndex: 2,
                  tintColor: 'blue'
                },
                buttonIndex => {
                  console.log('button clicked :', buttonIndex);
                  switch (buttonIndex) {
                    case 0:
                      this.handleCam();
                      break;
                    case 1:
                      this.handleChoosePhoto();
                      break;
                    default:
                      break;
                  }
                }
              );
            }}
          >
            {this.state.photo === null ? (
              <Icon name="image-plus" size={80} color="gray" />
            ) : (
              <View
                style={{
                  height: '100%',
                  width: '100%',
                  borderRadius: 20
                }}
              >
                <Image
                  source={this.state.photo}
                  style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: 20
                  }}
                />
              </View>
            )}
          </TouchableOpacity>
          <View
            style={{ flex: 0.5, marginBottom: 20, justifyContent: 'center' }}
          >
            <TextInput
              label="Number to Call (optional)"
              mode="outlined"
              value={this.state.numberToCall}
              onChangeText={t => {
                this.setState({ numberToCall: t });
              }}
              dataDetectorTypes="phoneNumber"
              style={{ fontSize: 18 }}
              theme={{ colors: { background: '#EAE9EF' } }}
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
            />
          </View>
          <View style={{ flex: 2, marginBottom: 10 }}>
            <TextInput
              label="Description (required)"
              mode="outlined"
              value={this.state.text}
              onChangeText={text => {
                this.setState({ text });
              }}
              placeholder="What's happening?"
              style={{ fontSize: 18, height: '100%' }}
              theme={{ colors: { background: '#EAE9EF' } }}
              multiline
              maxLength={maxLength}
            />
          </View>
          <View style={styles.buttonsContainer}>
            <Button
              mode="contained"
              onPress={() => {
                this.setState({
                  modalVisible: true
                });
              }}
              color="#FFFF"
              style={{ borderRadius: 30, flex: 1 }}
              touchableStyle={{ borderRadius: 30 }}
            >
              <Text style={{ color: '#b3b3b2', fontFamily: 'Manjari-Bold' }}>
                Next
              </Text>
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  buttonsContainer: {
    flex: 1,
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
  },
  imageInputContainerEmpty: {
    flex: 3,
    marginBottom: 30,
    borderStyle: 'dashed',
    borderWidth: 2.5,
    borderRadius: 20,
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageInputContainerFull: {
    flex: 3,
    marginBottom: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
