import {
  FILL_SIGNUP_FORM,
  SIGNUP_ATTEMPT,
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  CHECK_PASSWORD_STRENGTH,
  CHECK_NAME,
  CHECK_BIRTHDAY,
  CHECK_PHONE,
  CHECK_PASSWORD_MATCH,
  RESET_SIGNUP_REDUCER_STATE
} from './types';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import t from '../I18n';
import Err from '../ErrorHandler';

export const resetSignUpReducerState = () => {
  return {
    type: RESET_SIGNUP_REDUCER_STATE
  };
};

export const fillSignUpForm = keyAndValue => {
  return dispatch => {
    const { key, value } = keyAndValue;
    if (key === 'password') {
      runPassword(value, dispatch);
    } else {
      dispatch({
        type: FILL_SIGNUP_FORM,
        payload: keyAndValue
      });
    }
  };
};

export const validateName = name => {
  return dispatch => {
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (name) {
      if (name.length < 3) {
        dispatch({
          type: CHECK_NAME,
          payload: t.ShortName
        });
      } else if (format.test(name)) {
        dispatch({
          type: CHECK_NAME,
          payload: t.SpecialName
        });
      } else {
        dispatch({
          type: CHECK_NAME,
          payload: ''
        });
      }
    } else {
      dispatch({
        type: CHECK_NAME,
        payload: t.NameEmpty
      });
    }
  };
};

export const validateConfirmPassword = (password, confirmPassword) => {
  return dispatch => {
    if (password === confirmPassword) {
      dispatch({ type: CHECK_PASSWORD_MATCH, payload: '' });
    } else {
      dispatch({
        type: CHECK_PASSWORD_MATCH,
        payload: t.ConfirmPasswordError
      });
    }
  };
};

export const validateBirthday = birthday => {
  return dispatch => {
    const allowedAge = 13;
    var today = new Date();
    console.log('birthday:', birthday);
    var birthDate = new Date(birthday);
    console.log('birth year:', birthDate.getFullYear());
    console.log('today year:', today.getFullYear());
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    console.log('age, month ', age, m);
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    console.log('age: ', age);
    if (age < allowedAge) {
      dispatch({
        type: CHECK_BIRTHDAY,
        payload: t.AgeError
      });
    } else {
      dispatch({
        type: CHECK_BIRTHDAY,
        payload: ''
      });
    }
  };
};

export const validatePhone = isPhoneValid => {
  return dispatch => {
    if (isPhoneValid) {
      dispatch({ type: CHECK_PHONE, payload: '' });
    } else {
      dispatch({
        type: CHECK_PHONE,
        payload: t.PhoneNotValid
      });
    }
  };
};

export const signUpAttempt = signUpInfo => {
  return dispatch => {
    dispatch({
      type: SIGNUP_ATTEMPT,
      payload: signUpInfo.phone
    });
    console.log(signUpInfo);
    const {
      name,
      phone,
      birthday,
      gender,
      password,
      specialization
    } = signUpInfo;
    axios
      .post(`register/${signUpInfo.userType}`, {
        name,
        phoneNo: phone.substring(1),
        birthDate: birthday,
        gender: gender === 'male',
        password,
        specialization
      })
      .then(response => {
        console.log(response);
        dispatch({
          type: SIGNUP_SUCCESS
        });
        Actions.verifySignup({
          phoneNum: phone,
          userName: name
        });
      })
      .catch(error => {
        console.log(JSON.stringify(error));
        console.log('status error: ', JSON.stringify(error.response.status));
        if (error.response.status === 409) {
          dispatch({
            type: SIGNUP_SUCCESS
          });
          Actions.verifySignup({
            phoneNum: phone,
            userName: name
          });
        } else {
          // obj = new Err();
          // obj.errorHandler(error);
          dispatch({
            type: SIGNUP_FAIL,
            payload: t.SignUpFailed
          });
        }
      });
  };
};

function checkPassword(password) {
  var m_strUpperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var m_strLowerCase = 'abcdefghijklmnopqrstuvwxyz';
  var m_strNumber = '0123456789';
  var m_strCharacters = '!@#$%^&*?_~';
  // Reset combination count
  var nScore = 0;

  // Password length
  // -- Less than 4 characters
  if (password.length < 5) {
    nScore += 5;
  }
  // -- 5 to 7 characters
  else if (password.length > 4 && password.length < 8) {
    nScore += 10;
  }
  // -- 8 or more
  else if (password.length > 7) {
    nScore += 25;
  }

  // Letters
  var nUpperCount = countContain(password, m_strUpperCase);
  var nLowerCount = countContain(password, m_strLowerCase);
  var nLowerUpperCount = nUpperCount + nLowerCount;
  // -- Letters are all lower case
  if (nUpperCount == 0 && nLowerCount != 0) {
    nScore += 10;
  }
  // -- Letters are upper case and lower case
  else if (nUpperCount != 0 && nLowerCount != 0) {
    nScore += 20;
  }

  // Numbers
  var nNumberCount = countContain(password, m_strNumber);
  // -- 1 number
  if (nNumberCount == 1) {
    nScore += 10;
  }
  // -- 3 or more numbers
  if (nNumberCount >= 3) {
    nScore += 20;
  }

  // Characters
  var nCharacterCount = countContain(password, m_strCharacters);
  // -- 1 character
  if (nCharacterCount == 1) {
    nScore += 10;
  }
  // -- More than 1 character
  if (nCharacterCount > 1) {
    nScore += 25;
  }

  // Bonus
  // -- Letters and numbers
  if (nNumberCount != 0 && nLowerUpperCount != 0) {
    nScore += 2;
  }
  // -- Letters, numbers, and characters
  if (nNumberCount != 0 && nLowerUpperCount != 0 && nCharacterCount != 0) {
    nScore += 3;
  }
  // -- Mixed case letters, numbers, and characters
  if (
    nNumberCount != 0 &&
    nUpperCount != 0 &&
    nLowerCount != 0 &&
    nCharacterCount != 0
  ) {
    nScore += 5;
  }

  return nScore;
}

// Runs password through check and then updates GUI

function runPassword(password, dispatch) {
  console.log('runPassword');
  // Check password
  var nScore = checkPassword(password);
  var passStrengthText = '';
  var passStrengthColor = 'white';
  var passError = '';

  if (nScore >= 90) {
    passStrengthText = t.VSecure;
    passStrengthColor = '#0ca908';
  }
  // -- Secure
  else if (nScore >= 80) {
    passStrengthText = t.Secure;
    passStrengthColor = '#7ff67c';
  }
  // -- Very Strong
  else if (nScore >= 80) {
    passStrengthText = t.VStrong;
    passStrengthColor = '#008000';
  }
  // -- Strong
  else if (nScore >= 60) {
    passStrengthText = t.Strong;
    passStrengthColor = '#006000';
  }
  // -- Average
  else if (nScore >= 40) {
    passStrengthText = t.Average;
    passStrengthColor = '#e3cb00';
  }
  // -- Weak
  else if (nScore >= 20) {
    passStrengthText = t.Weak;
    passStrengthColor = '#Fe3d1a';
    passError = t.PWeak;
  }
  // -- Very Weak
  else {
    passStrengthText = t.VWeak;
    passStrengthColor = '#e71a1a';
    passError = t.PVWeak;
  }

  dispatch({
    type: CHECK_PASSWORD_STRENGTH,
    payload: { password, passStrengthText, passStrengthColor, passError }
  });
}

// Checks a string for a list of characters
function countContain(password, strCheck) {
  // Declare variables
  var nCount = 0;

  for (i = 0; i < password.length; i++) {
    if (strCheck.indexOf(password.charAt(i)) > -1) {
      nCount++;
    }
  }

  return nCount;
}
