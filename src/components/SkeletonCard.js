import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../constants';
import { theme } from 'galio-framework';
import SvgAnimatedLinearGradient from 'react-native-svg-animated-linear-gradient';
import Svg, { Circle, Rect } from 'react-native-svg';

class SkeletonCard extends React.Component {
  render() {
    const { style } = this.props;
    return (
      <View style={[styles.container, style]}>
        <SvgAnimatedLinearGradient
          primaryColor="white"
          secondaryColor="#E2DDDD"
          height={220}
        >
          <Rect x="0" y="0" rx="5" ry="5" width="100%" height="68%" />
          <Rect x="0" y="170" rx="3" ry="3" width="43%" height="4.54%" />
          <Rect x="140" y="170" rx="3" ry="3" width="40%" height="4.54%" />
          <Rect x="0" y="190" rx="3" ry="3" width="30%" height="4.54%" />
          <Rect x="100" y="190" rx="3" ry="3" width="20%" height="4.54%" />
          <Rect x="170" y="190" rx="3" ry="3" width="15%" height="4.54%" />
          <Rect x="0" y="210" rx="3" ry="3" width="33%" height="4.54%" />
          <Rect x="110" y="210" rx="3" ry="3" width="5%" height="4.54%" />
        </SvgAnimatedLinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: theme.SIZES.BASE
  }
});

export default SkeletonCard;
