import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { Alert } from 'react-native';
import t from './I18n';
import { connect } from 'react-redux';
import { resetSignInReducerState } from './actions';

class Err extends Component {
  errorHandler = ({ response }) => {
    if (response) {
      console.log(JSON.stringify(response.status));
      switch (response.status) {
        case 403:
          Alert.alert(
            t.ErrorHappend,
            t.UnAuthorized,
            [
              {
                text: t.OK,
                onPress: () => {
                  axios.defaults.headers.common['TOKEN'] = '';
                  this.props.resetSignInReducerState();
                  Actions.reset('welcome');
                }
              }
            ],
            {
              cancelable: false
            }
          );
          break;
        case 400:
          Alert.alert('', t.WrongPassword, [
            {
              text: t.OK
            }
          ]);
          break;
      }
    }
  };
}

export default connect(null, { resetSignInReducerState })(Err);
