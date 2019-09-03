import React from 'react';
import icoMoonConfigArgon from '../config/ArgonFontConfig.json';
import icoMoonConfigLinear from '../config/LinearFontConfig.json';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import { Icon } from 'galio-framework';

const IconArgonExtra = createIconSetFromIcoMoon(icoMoonConfigArgon);
const IconLinearExtra = createIconSetFromIcoMoon(icoMoonConfigLinear);

class IconExtra extends React.Component {
  render() {
    const { name, family, ...rest } = this.props;
    console.log(family);
    if (name && family) {
      switch (family) {
        case 'ArgonExtra':
          return <IconArgonExtra name={name} family={family} {...rest} />;
          break;
        case 'LinearIcon':
          return <IconLinearExtra name={name} family={family} {...rest} />;
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
