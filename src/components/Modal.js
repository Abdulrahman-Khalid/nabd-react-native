import React, { Component } from 'react';
import {
  View,
  Modal,
  Text,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native';
import { connect } from 'react-redux';

const CustomModal = props => {
  const {
    modalVisible,
    children,
    onRequestClose,
    title,
    ...attributes
  } = props;

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="slide"
      onRequestClose={onRequestClose}
    >
      <TouchableWithoutFeedback onPress={onRequestClose}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <View style={styles.modalBackground}>
        <View style={styles.modalViewWrapper}>
          <Text
            style={[
              styles.headerText,
              {
                fontFamily:
                  props.language == 'en'
                    ? 'Quicksand-SemiBold'
                    : 'Tajawal-Medium'
              }
            ]}
          >
            {title}
          </Text>
          {children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    width: '100%',
    position: 'absolute',
    bottom: 0
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  modalViewWrapper: {
    backgroundColor: '#FFFFFF',
    height: 'auto',
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: 'stretch',
    justifyContent: 'space-around',
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 100,
    elevation: 20
  },
  headerText: {
    fontSize: 23,
    textAlign: 'left',
    padding: 20
  }
});

const mapStateToProps = state => ({
  language: state.language.lang
});

export default connect(mapStateToProps, null)(CustomModal);
