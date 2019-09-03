// import { INJURY_BUTTON_PRESSED } from '../actions/types';

const INTIAL_STATE = {
  userType: null,
  userName: null,
  helperType: null,
  helperName: null,
  helperspecialization: null // in case the helper is a doctor
};

export default (state = INTIAL_STATE, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
