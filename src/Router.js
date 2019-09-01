// import React, { Component } from 'react';
// import { Scene, Router } from 'react-native-router-flux';
// import WhoAmI from './app/welcome/WhoAmI';
// import IamDoctor from './app/welcome/IamDoctor';
// import IamAmbulance from './app/welcome/IamAmbulance';
// import IamUser from './app/welcome/IamUser';
// import IamParamedic from './app/welcome/IamParamedic';
// import Register from './app/welcome/Register';
// import VerifySignup from './app/welcome/PhoneVerification/Animated';
// import SignIn from './app/welcome/SignIn';
// import UserHome from './app/home/UserHome';
// import { argonTheme } from './constants';
// import InjuriesList from './app/firstAid/InjuriesList';
// import FirstAidDetails from './app/firstAid/FirstAidDetails';
// class RouterComponent extends Component {
//   render() {
//     return (
//       <Router
//         // navigationBarStyle={{
//         //   bacIamDoctorkgroundColor: '#EF171D'
//         // }}
//         titleStyle={{
//           fontWeight: 'bold',
//           color: '#000'
//         }}
//         tintColor={argonTheme.COLORS.APP}
//       >
//         <Scene key="root" hideNavBar>
//           <Scene key="welcome" intial headerLayoutPreset="center">
//             <Scene key="whoRU" component={WhoAmI} title="Nabd" initial />
//             <Scene key="iUser" component={IamUser} title="User" />
//             <Scene key="iDoctor" component={IamDoctor} title="Doctor" />
//             <Scene
//               key="iParamedic"
//               component={IamParamedic}
//               title="Paramedic"
//             />
//             <Scene
//               key="iAmbulance"
//               component={IamAmbulance}
//               title="Ambulance"
//             />
//             <Scene key="signup" component={Register} title="Sign up" />
//             <Scene key="signin" component={SignIn} title="Sign in" />
//             <Scene key="verifySignup" component={VerifySignup} title="Verify" />
//           </Scene>

//           <Scene key="home">
//             <Scene key="userHome" component={UserHome} title="Home" />
//           </Scene>

//           <Scene key="FirstAid">
//             <Scene
//               key="InjuriesList"
//               component={InjuriesList}
//               // title="First Aid Instructions"
//               initial
//             />
//             <Scene
//               // type="reset"
//               key="FirstAidDetails"
//               component={FirstAidDetails}
//             />
//           </Scene>
//         </Scene>
//       </Router>
//     );
//   }
// }

// export default RouterComponent;
