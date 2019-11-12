import React, { Component } from 'react';
import { Platform, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Config from 'react-native-config';
import t from '../I18n';

class MapSearch extends Component {
  state = {
    searchFocused: false
  };

  render() {
    const { searchFocused } = this.state;
    const { onLocationSelected, language } = this.props;

    return (
      <GooglePlacesAutocomplete
        placeholder={t.SearchForAPlace}
        placeholderTextColor="#333"
        onPress={onLocationSelected}
        query={{
          key: Config.GOOGLE_MAPS_API_KEY,
          language: language.lang,
          components: 'country:eg'
        }}
        textInputProps={{
          onFocus: () => {
            this.setState({ searchFocused: true });
          },
          onBlur: () => {
            this.setState({ searchFocused: false });
          },
          autoCapitalize: 'none',
          autoCorrect: false
        }}
        listViewDisplayed={searchFocused}
        fetchDetails
        enablePoweredByContainer={false}
        styles={{
          container: {
            position: 'absolute',
            top: Platform.select({ ios: 80, android: 60 }),
            width: '100%'
          },
          textInputContainer: {
            flex: 1,
            height: 54,
            marginHorizontal: 20,
            borderRadius: 30
          },
          textInput: {
            height: 54,
            margin: 0,
            borderRadius: 30,
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 20,
            paddingRight: 20,
            marginTop: 0,
            marginLeft: 0,
            marginRight: 0,
            fontSize: 18
          },
          listView: {
            borderBottomLRightRadius: 30,
            backgroundColor: '#FFF',
            marginHorizontal: 20,
            borderRadius: 30,
            marginTop: 10
          },
          description: {
            fontSize: 16
          },
          row: {
            padding: 20,
            height: 58
          }
        }}
      />
    );
  }
}

const mapStateToProps = state => ({ language: state.language });

export default connect(
  mapStateToProps,
  null
)(MapSearch);
