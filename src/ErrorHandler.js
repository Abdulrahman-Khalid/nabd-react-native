import { Actions } from 'react-native-router-flux';
import { Alert } from 'react-native';
import t from './I18n';
import Axios from 'axios';
import { connect } from 'react-redux';

const errorHandler = (props, { response }) => {
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
                props.resetSignInReducerState();
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

export default connect(
  null,
  { resetSignInReducerState }
)(errorHandler);
