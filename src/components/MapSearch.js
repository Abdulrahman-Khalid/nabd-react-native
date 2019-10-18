import React, { Component } from "react";
import { Platform, View, Text } from "react-native";
import { connect } from 'react-redux';

class MapSearch extends Component {

  render() {
    const { onLocationSelected, language } = this.props;

    return (
      <View><Text>map search</Text></View>
    );
  }
}

const mapStateToProps = state => ({ language: state.language });

export default connect(
  mapStateToProps,
  null
)(MapSearch);
