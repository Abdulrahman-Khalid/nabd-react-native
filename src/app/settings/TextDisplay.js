import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';

class TextDisplay extends Component {
  render() {
    return (
      <View style={styles.containerInSection}>
        <View style={styles.containerInnerSection}>
          <Icon name={this.props.iconName} size={24} style={styles.iconLeft} />
          <Text style={[styles.text, {fontFamily: this.props.language == 'en' ? 'Quicksand-SemiBold' : 'Tajawal-Medium'}]} numberOfLines={1} ellipsizeMode={'tail'}>
            {this.props.text}
          </Text>
          <Text style={styles.value} numberOfLines={1} ellipsizeMode={'tail'}>
            {this.props.value}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerInSection: {
    flex: 1,
    height: 50,
    borderRadius: 1,
    borderBottomWidth: 0.2
  },
  containerInnerSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconLeft: {
    flex: 1,
    textAlign: 'center',
    color: 'gray'
  },
  text: {
    flex: 6,
    flexDirection: 'row',
    fontSize: 15,
    color: 'black'
  },
  value: {
    flex: 1,
    color: 'grey'
  }
});

const mapStateToProps = state => ({
  language: state.language.lang
});

export default connect(mapStateToProps, null)(TextDisplay);
