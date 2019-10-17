import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from './Icon';
import { argonTheme } from '../constants';

export default class TabBar extends React.Component {
  renderIcon(tabName) {
		const { state } = this.props.navigation;
    const activeTabIndex = state.index;
    switch (tabName) {
      case 'Home':
        return (
          <Icon
            name="house"
            family="flaticon"
            color={activeTabIndex === 0 ? argonTheme.COLORS.APP : 'black'}
            size={30}
          />
        );
        break;
      case 'Incidents':
        return (
          <Icon
            name="support"
            family="flaticon"
            color={activeTabIndex === 1 ? argonTheme.COLORS.APP : 'black'}
            size={30}
          />
        );
        break;
      case 'FirstAid':
        return (
          <Icon
            name="hospital"
            family="flaticon"
            color={activeTabIndex === 2 ? argonTheme.COLORS.APP : 'black'}
            size={30}
          />
        );
        break;
    }
  }
  render() {
    const { state } = this.props.navigation;
    const activeTabIndex = state.index;
    console.log(activeTabIndex);
    return (
      <View style={styles.tabBar}>
        {state.routes.map(element => (
          <TouchableOpacity
            key={element.key}
            onPress={() => Actions[element.key]()}
            style={styles.tabBarButton}
          >
            {this.renderIcon(element.key)}
          </TouchableOpacity>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-evenly',
    height: 70,
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.34,
    shadowRadius: 10,
    elevation: 10
  },
  tabBarButton: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
