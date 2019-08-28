import { StyleSheet, Platform } from 'react-native';
import { argonTheme } from '../../../../constants';

export const CELL_SIZE = 70;
export const CELL_BORDER_RADIUS = 8;
export const DEFAULT_CELL_BG_COLOR = '#fff';
// export const NOT_EMPTY_CELL_BG_COLOR = '#3557b7';
export const NOT_EMPTY_CELL_BG_COLOR = argonTheme.COLORS.APP;
export const ACTIVE_CELL_BG_COLOR = '#f7fafe';

export default StyleSheet.create({
  inputWrapper: {
    backgroundColor: 'white',
    paddingHorizontal: 20
  },

  inputLabel: {
    paddingTop: 50,
    color: '#000',
    fontSize: 25,
    fontWeight: '700',
    textAlign: 'center',
    paddingBottom: 40
  },

  icon: {
    width: 217 / 2.4,
    height: 158 / 2.4,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  inputSubLabel: {
    paddingTop: 30,
    color: '#000',
    textAlign: 'center'
  },
  inputWrapStyle: {
    height: CELL_SIZE,
    marginTop: 30,
    paddingHorizontal: 20,
    justifyContent: 'space-between'
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
    color: argonTheme.COLORS.APP,
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
    backgroundColor: argonTheme.COLORS.APP,
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
  }
});
