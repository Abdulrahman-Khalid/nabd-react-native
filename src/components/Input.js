import React from "react";
import { StyleSheet } from "react-native";
import PropTypes from 'prop-types';

import { Input } from "galio-framework";

import Icon from './Icon';
import { Colors } from "../constants";

class ArInput extends React.Component {
  render() {
    const { shadowless, success, error } = this.props;

    const inputStyles = [
      styles.input,
      !shadowless && styles.shadow,
      success && styles.success,
      error && styles.error,
      {...this.props.style}
    ];

    return (
      <Input
        placeholder="write something here"
        placeholderTextColor={Colors.MUTED}
        style={inputStyles}
        color={Colors.HEADER}
        iconContent={
          <Icon
            size={14}
            color={Colors.ICON}
            name="link"
            family="AntDesign"
          />
        }
        {...this.props}
      />
    );
  }
}

ArInput.defaultProps = {
  shadowless: false,
  success: false,
  error: false
};

ArInput.propTypes = {
  shadowless: PropTypes.bool,
  success: PropTypes.bool,
  error: PropTypes.bool
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 0,
    borderBottomWidth: 2,
    borderRadius: 30,
    borderBottomColor: Colors.BORDER,
    height: 44,
    backgroundColor: '#FFFFFF'
  },
  success: {
    borderBottomColor: Colors.INPUT_SUCCESS,
  },
  error: {
    borderBottomColor: Colors.INPUT_ERROR,
  },
  shadow: {
    // shadowColor: Colors.BLACK,
    // shadowOffset: { width: 0, height: 1 },
    // shadowRadius: 2,
    // shadowOpacity: 0.05,
    // elevation: 2,
  }
});

export default ArInput;
