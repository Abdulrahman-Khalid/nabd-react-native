import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { Alert } from 'react-native';
import t from './I18n';
import { connect } from 'react-redux';
import { resetSignInReducerState } from './actions';

class Err extends Component {
  errorHandler = ({ response }) => {
    if (response) {
      switch (response.status) {
        case 403:
          return Alert.alert(
            t.ErrorHappend,
            t.UnAuthorized,
            [
              {
                text: t.OK,
                onPress: () => {
                  axios.defaults.headers.common['TOKEN'] = '';
                  this.props.resetSignInReducerState();
                  Actions.reset('languageSelection');
                }
              }
            ],
            {
              cancelable: false
            }
          );
      }
    }
  };
}

export default connect(
  null,
  { resetSignInReducerState }
)(Err);
