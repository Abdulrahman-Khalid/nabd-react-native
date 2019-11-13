import { Actions } from 'react-native-router-flux';
import { Alert } from 'react-native';
import t from './I18n';

errorHandler = ({ response }) => {
  if (response) {
    switch (response.status) {
      case 403:
        return Alert.alert(
          t.ErrorHappend,
          t.UnAuthorized,
          [{ text: t.OK, onPress: () => Actions.reset('languageSelection') }],
          {
            cancelable: false
          }
        );
    }
  }
};
