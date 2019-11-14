import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Keyboard
} from 'react-native';
import axios from 'axios';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-picker';
import { Actions } from 'react-native-router-flux';
import { HelperText, TextInput, Button } from 'react-native-paper';
import ActionSheet from 'react-native-action-sheet';
import { LocationPicker, Icon } from '../../components';
import { Colors } from '../../constants';
import { connect } from 'react-redux';
import t from '../../I18n';
import { addedNewIncident } from '../../actions';
import Err from '../../ErrorHandler';
const actionSheetButtons = t.ActionSheetButtons;

class AddIncident extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      numberToCall: null,
      location: {
        latitude: this.props.position.coords.latitude,
        longitude: this.props.position.coords.longitude
      },
      photo: null,
      media: null,
      modalVisible: false,
      descriptionFieldError: false,
      numberFieldError: false,
      loading: false,
      showIcon: true
    };
    this._keyboardDidShow = this._keyboardDidShow.bind(this);
    this._keyboardDidHide = this._keyboardDidHide.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.text != '' && this.state.descriptionFieldError) {
      this.setState({
        descriptionFieldError: false
      });
    }
    if (this.state.numberToCall != prevState.numberToCall) {
      this.setState({
        numberFieldError: false
      });
    }
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow() {
    this.setState({
      showIcon: false
    });
  }

  _keyboardDidHide() {
    this.setState({
      showIcon: true
    });
  }

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
        url: '/media',
        data: formData,
        config: { headers: { 'Content-Type': 'multipart/form-data' } }
      })
        .then(response => {
          console.log(response.status);
          console.log(response.data.id);
          this.setState({ media: response.data.url });
        })

        .catch(err => {
          // handle error
          // Err.errorHandler(err);
          let error = JSON.stringify(err);
          error = JSON.parse(error);
          console.log(error);
          console.log(error.response.status);
        })
        .then(() => {
          // always executed
          axios
            .post('/incident', {
              description: this.state.text,
              date: new Date(),
              image: this.state.media,
              location: this.state.location,
              numberToCall: this.state.numberToCall
            })
            .then(response => {
              console.log(response.status);
            })
            .catch(err => {
              // handle error
              // Err.errorHandler(err);
              let error = JSON.stringify(err);
              error = JSON.parse(error);
              console.log(error);
              console.log(error.response.status);
              Actions.Incidents();
            })
            .then(() => {
              this.props.addedNewIncident();
              Actions.Incidents();
            });
        });
    }
    if (this.state.photo === null) {
      axios
        .post('/incident', {
          description: this.state.text,
          date: new Date(),
          image: null,
          location: this.state.location,
          numberToCall: this.state.numberToCall
        })
        .then(response => {})
        .catch(err => {
          // handle error
          // Err.errorHandler(err);
          let error = JSON.stringify(err);
          error = JSON.parse(error);
          Actions.Incidents();
        })
        .then(() => {
          this.props.addedNewIncident();
          Actions.Incidents();
        });
    }
    this.setState({
      loading: true
    });
  }

  modalCancelOnPress = () => {
    this.setState({
      modalVisible: false
    });
  };

  modalOnPressSubmit = () => {
    this.submitIncident();
  };

  render() {
    const maxLength = 240;
    return (
      <View
        style={{
          flexDirection: 'column',
          flex: 1
        }}
      >
        <Modal
          visible={this.state.modalVisible}
          onRequestClose={this.modalCancelOnPress}
          translucent={false}
        >
          <LocationPicker
            onValueChange={region => {
              this.setState({
                location: {
                  latitude: region.latitude,
                  longitude: region.longitude
                }
              });
            }}
            cancelOnPress={this.modalCancelOnPress}
            onPressSubmit={this.modalOnPressSubmit}
            loading={this.state.loading}
          />
        </Modal>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
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
              this.state.showIcon ? (
                <Icon
                  name="add-image"
                  family="flaticon"
                  size={80}
                  color="gray"
                />
              ) : null
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
          <View style={{ marginTop: 20 }}>
            <TextInput
              label={t.NumberToCallOpt}
              mode="flat"
              value={this.state.numberToCall}
              onChangeText={t => {
                this.setState({ numberToCall: t });
              }}
              dataDetectorTypes="phoneNumber"
              placeholder={t.NumberToCall}
              style={{ fontSize: 18 }}
              theme={{
                colors: { background: '#EAE9EF', primary: Colors.WARNING },
                roundness: 30,
                fonts: {
                  regular:
                    this.props.language.lang == 'en'
                      ? 'Quicksand-Regular'
                      : 'Tajawal-Regular'
                }
              }}
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              underlineColor={Colors.BLACK}
              error={this.state.numberFieldError}
            />
            <HelperText type="error" visible={this.state.numberFieldError}>
              {t.NumberUnvalid}
            </HelperText>
          </View>
          <View style={{ marginBottom: 10, justifyContent: 'center' }}>
            <TextInput
              label={t.IncidentDescriptionReq}
              mode="flat"
              value={this.state.text}
              onChangeText={text => {
                this.setState({ text });
              }}
              placeholder={t.IncidentDescription}
              style={{ fontSize: 18 }}
              theme={{
                colors: { background: '#EAE9EF', primary: Colors.WARNING },
                roundness: 30,
                fonts: {
                  regular:
                    this.props.language.lang == 'en'
                      ? 'Quicksand-Regular'
                      : 'Tajawal-Regular'
                }
              }}
              maxLength={maxLength}
              error={this.state.descriptionFieldError}
              underlineColor={Colors.BLACK}
            />
            <HelperText type="error" visible={this.state.descriptionFieldError}>
              {t.RequiredField}
            </HelperText>
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => {
                if (this.state.text == '' || isNaN(this.state.numberToCall)) {
                  if (this.state.text == '') {
                    this.setState({
                      descriptionFieldError: true
                    });
                  }
                  if (isNaN(this.state.numberToCall))
                    this.setState({
                      numberFieldError: true
                    });
                } else {
                  this.setState({
                    modalVisible: true
                  });
                }
              }}
            >
              <View style={styles.button}>
                <Text
                  style={{
                    color: Colors.WHITE,
                    fontFamily:
                      this.props.language.lang == 'en'
                        ? 'Quicksand-SemiBold'
                        : 'Tajawal-Medium'
                  }}
                >
                  {t.Next}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonsContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  buttonContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%'
  },
  button: {
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    flexDirection: 'row',
    backgroundColor: Colors.APP
  },
  imageInputContainerEmpty: {
    flex: 3,
    borderStyle: 'dashed',
    borderWidth: 2.5,
    borderRadius: 20,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageInputContainerFull: {
    flex: 3,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const mapStateToProps = state => ({
  position: state.location.position,
  userID: state.signin.phone.substring(1),
  language: state.language
});

export default connect(mapStateToProps, { addedNewIncident })(AddIncident);
