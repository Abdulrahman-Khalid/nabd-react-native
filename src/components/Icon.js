import React from 'react';
import icoMoonConfigArgon from '../config/ArgonFontConfig.json';
import icoMoonConfigLinear from '../config/LinearFontConfig.json';
import icoMoonConfigFlat from '../config/FlatIconConfig.json';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import { Animated } from 'react-native';
import { Icon } from 'galio-framework';
import * as Animatable from 'react-native-animatable';

const IconArgonExtra = createIconSetFromIcoMoon(icoMoonConfigArgon);
const IconLinearExtra = createIconSetFromIcoMoon(icoMoonConfigLinear);
const IconFlatExtra = createIconSetFromIcoMoon(icoMoonConfigFlat);
const AnimatedFlatIcon = Animatable.createAnimatableComponent(IconFlatExtra);

class IconExtra extends React.Component {
  render() {
    const { name, family, ...rest } = this.props;
    if (name && family) {
      switch (family) {
        case 'ArgonExtra':
          return <IconArgonExtra name={name} family={family} {...rest} />;
          break;
        case 'LinearIcon':
          return <IconLinearExtra name={name} family={family} {...rest} />;
          break;
        case 'flaticon':
          return <IconFlatExtra name={name} family={family} {...rest} />;
          break;
        case 'animatedFlaticon':
          return <AnimatedFlatIcon name={name} family={family} {...rest} />;
          break;
        default:
          return <Icon name={name} family={family} {...rest} />;
          break;
      }
    }

    return null;
  }
}

export default IconExtra;
