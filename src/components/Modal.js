import React, { Component } from 'react';
import {
  View,
  Modal,
  Text,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native';

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
          <Text style={styles.headerText}>{title}</Text>
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
    bottom: -2,
    right: -12
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  modalViewWrapper: {
    backgroundColor: '#FFFFFF',
    height: 'auto',
    width: '94%',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'space-around',
    flexDirection: 'column',
    marginBottom: '3%',
  },
  headerText: {
    fontSize: 30,
    textAlign: 'left',
    fontFamily: 'Manjari-Bold',
    fontWeight: '900',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20
  }
});

export default CustomModal;
