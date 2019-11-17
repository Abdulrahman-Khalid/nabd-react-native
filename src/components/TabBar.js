import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from './Icon';
import { Colors } from '../constants';

export default class TabBar extends React.Component {
  renderIcon(tabName) {
		const { state } = this.props.navigation;
    const activeTabIndex = state.index;
    switch (tabName) {
      case 'Home':
        return (
          <Icon
            name="home"
            family="flaticon"
						style={{ fontWeight: '900' }}
            color={activeTabIndex === 0 ? "white" : '#a8000b'}
            size={28}
          />
        );
        break;
      case 'Incidents':
        return (
          <Icon
            name="support"
            family="flaticon"
            color={activeTabIndex === 1 ? "white" : '#a8000b'}
            size={30}
          />
        );
        break;
      case 'FirstAid':
        return (
          <Icon
            name="hospital"
            family="flaticon"
            color={activeTabIndex === 2 ? "white" : '#a8000b'}
            size={30}
          />
        );
        break;
    }
  }
  render() {
    const { state } = this.props.navigation;
    const activeTabIndex = state.index;
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
    height: 88,
    width: '100%',
    borderTopLeftRadius: 44,
    borderTopRightRadius: 44,
    backgroundColor: Colors.APP,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.34,
    shadowRadius: 10,
    elevation: 10,
    flex: 0.12,
  },
  tabBarButton: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
