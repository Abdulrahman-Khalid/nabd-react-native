// Dependencies import
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Class for switch rows
class TextDisplay extends Component {
  render() {
    return (
      <View style={styles.containerInSection}>
        <View style={styles.containerInnerSection}>
          <Icon name={this.props.iconName} size={24} style={styles.iconLeft} />
          <Text style={styles.text} numberOfLines={1} ellipsizeMode={'tail'}>
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
    textAlign: 'center'
  },
  text: {
    flex: 6,
    flexDirection: 'row',
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold'
  },
  value: {
    flex: 1,
    color: 'grey'
  }
});

// const SettingsRowStyle = StyleSheet.create({
//     container: {
//         marginBottom: 8,
//         backgroundColor: 'white',
//         shadowColor: "#000",
//         shadowOffset: {
//             width: 0,
//             height: 1,
//         },
//         shadowOpacity: 0.18,
//         shadowRadius: 1.00,
//         elevation: 1,
//     },
//     containerSection: {
//         flex: 1,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         height: 50
//     },
//     containerInSection: {
//         flex: 1,
//         height: 50,
//         borderRadius: 1,
//         borderBottomWidth: 0.2

//     },
//     containerInnerSection: {
//         flex: 1,
//         flexDirection: 'row',
//         alignItems: 'center'
//     },
//     containerInnerSectionMiddle: {
//         flex: 1,
//         flexDirection: 'row',
//         justifyContent: 'center',
//         alignItems: 'center'
//     },
//     text: {
//         flex: 6,
//         flexDirection: 'row',
//         fontSize: 15,
//         color: 'black'
//     },
//     textSection: {
//         flex: 1,
//         textAlign: 'left',
//         fontSize: 15,
//         fontWeight: 'bold',
//         color: 'black',
//         paddingLeft: 8
//     },
//     iconRight: {
//         flex: 1,
//         textAlign: 'center'
//     },
//     iconLeft: {
//         flex: 1,
//         textAlign: 'center'
//     },
//     switchSt: {
//         flex: 1
//     },
//     checkSt: {
//         flex: 1
//     },
//     sliderSt: {
//         marginHorizontal: 16
//     }
// })

export default TextDisplay;
