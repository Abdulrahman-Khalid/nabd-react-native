// import {
//   REQUSET_DOCTOR,
//   REQUSET_PARAMEDIC,
//   REQUSET_AMBULANCE
// } from '../actions/types';

// const INTIAL_STATE = {
//   helperType: null,
//   helperName: null,
//   helperSpecialization: null // in case the helper is a doctor
// };

// export default (state = INTIAL_STATE, action) => {
//   switch (action.type) {
//     case REQUSET_DOCTOR:
//       const { helperSpecialization, helperName } = action.payload;
//       return {
//         ...state,
//         helperType: 'doctor',
//         helperName,
//         helperSpecialization
//       };
//       break;
//     case REQUSET_PARAMEDIC:
//       const { helperName } = action.payload;
//       return { ...state, helperType: 'Paramedic', helperName };
//       break;
//     case REQUSET_AMBULANCE:
//       const { helperName } = action.payload;
//       return { ...state, helperType: 'ambu', helperName };
//       break;
//     default:
//       return state;
//       break;
//   }
// };
