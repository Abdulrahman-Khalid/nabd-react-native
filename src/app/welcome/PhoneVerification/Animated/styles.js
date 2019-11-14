import { StyleSheet, Platform } from 'react-native';
import { Colors } from '../../../../constants';

export const CELL_SIZE = 70;
export const CELL_BORDER_RADIUS = 8;
export const DEFAULT_CELL_BG_COLOR = '#fff';
// export const NOT_EMPTY_CELL_BG_COLOR = '#3557b7';
export const NOT_EMPTY_CELL_BG_COLOR = Colors.APP;
export const ACTIVE_CELL_BG_COLOR = '#f7fafe';

export default StyleSheet.create({
  inputWrapper: {
    paddingHorizontal: 20,
    flex: 1
  },
  inputLabel: {
    paddingTop: 10,
    color: '#000',
    fontSize: 25,
    textAlign: 'center',
    paddingBottom: 30
  },
  icon: {
    width: 100,
    height: 100,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  inputSubLabel: {
    paddingTop: 10,
    fontSize: 17,
    color: 'gray',
    textAlign: 'center'
  },
  inputWrapStyle: {
    marginTop: 30,
    marginBottom: 120,
  },
  input: {
    margin: 0,
    height: CELL_SIZE,
    width: CELL_SIZE,
    lineHeight: 55,
    ...Platform.select({
      web: {
        lineHeight: 65
      }
    }),
    fontSize: 30,
    borderRadius: CELL_BORDER_RADIUS,
    // color: '#3759b8',
    color: Colors.APP,
    backgroundColor: '#fff',

    // IOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    // Android
    elevation: 3
  },
  nextButton: {
    borderRadius: 80,
    minHeight: 80,
    // backgroundColor: '#3557b7',
    backgroundColor: Colors.APP,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 300,
    maxWidth: 350,
    marginBottom: 50
  },
  nextButtonText: {
    textAlign: 'center',
    fontSize: 20,
    color: '#fff',
    fontWeight: '700'
  },
  resendCodeButtonContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  resendCodeButton: {
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: Colors.APP,
    borderRadius: 40,
    borderWidth: 1,
    width: 200
  },
  resendCodeText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center'
  }
});
