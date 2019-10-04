import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Dimensions,
  Image,
  View,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Block, Text, theme } from 'galio-framework';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { argonTheme } from '../constants';

class Card extends React.Component {
  _renderCTA() {
    if (this.props.item.cta) {
      return (
        <Text
          size={12}
          muted={!ctaColor}
          color={ctaColor || argonTheme.COLORS.ACTIVE}
          bold
        >
          {item.cta}
        </Text>
      );
    } else {
      return null;
    }
  }
  render() {
    const {
      item,
      horizontal,
      full,
      style,
      ctaColor,
      imageStyle,
      onPress,
      onPressInfo
    } = this.props;

    const imageStyles = [
      full ? styles.fullImage : styles.horizontalImage,
      imageStyle
    ];
    const cardContainer = [styles.card, styles.shadow, style];
    const imgContainer = [
      styles.imageContainer,
      horizontal ? styles.horizontalStyles : styles.verticalStyles,
      styles.shadow
    ];

    return (
      <Block row={horizontal} card flex style={cardContainer}>
        <TouchableOpacity
          onPress={onPressInfo}
          style={{ position: 'absolute', margin: 7, right: -1, zIndex: 1 }}
        >
          <Icon
            size={20}
            color='white'
            name="information-outline"
            style={{
              textAlign: 'center'
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPress}>
          <View>
            <Block flex style={imgContainer}>
              <Image source={item.image} style={imageStyles} />
            </Block>
          </View>
          <View>
            <Block flex space="between" style={styles.cardDescription}>
              <Text size={20} style={styles.cardTitle}>
                {item.title}
              </Text>
              {this._renderCTA}
            </Block>
          </View>
        </TouchableOpacity>
      </Block>
    );
  }
}

Card.propTypes = {
  item: PropTypes.object,
  horizontal: PropTypes.bool,
  full: PropTypes.bool,
  ctaColor: PropTypes.string,
  imageStyle: PropTypes.any
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.COLORS.WHITE,
    marginTop: theme.SIZES.BASE,
    borderWidth: 0,
    minHeight: 114
  },
  cardTitle: {
    flex: 1,
    flexWrap: 'wrap'
  },
  cardDescription: {
    padding: theme.SIZES.BASE / 2
  },
  imageContainer: {
    borderRadius: 5,
    elevation: 1,
    overflow: 'hidden'
  },
  image: {
    // borderRadius: 3,
  },
  horizontalImage: {
    height: 204,
    width: 'auto'
  },
  horizontalStyles: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0
  },
  verticalStyles: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0
  },
  fullImage: {
    height: 204,
    width: 'auto'
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2
  }
});

export default Card;
