import React, { Component } from 'react';
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  Dimensions
} from 'react-native';
import IncidentCard from '../../components/IncidentCard';
import { argonTheme, Images } from '../../constants';
import { theme, Block } from 'galio-framework';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';

const { width, height } = Dimensions.get('screen');

const incidentsDummyData = [
  {
    userID: '01001796904',
    description: 'Accident on ElSahrawy road',
    date: new Date(+(new Date()) - Math.floor(Math.random()*10000000000)),
    image: Images.aideCard,
    location: {
      latitude: 30.027757,
      longitude: 31.200701
    },
    numberToCall: null
  },
  {
    userID: '01001796905',
    description: 'انفجار مغسلة في حي المعادي',
    date: new Date(+(new Date()) - Math.floor(Math.random()*10000000000)),
    image: null,
    location: {
      latitude: -33.8600024,
      longitude: 18.697459
    },
    numberToCall: '01001796904'
  },
  {
    userID: '01001796906',
    description: 'طلب كيس دم ضروري في مستشفي الدفاع الجوي التخصصي',
    date: new Date(+(new Date()) - Math.floor(Math.random()*10000000000)),
    image: Images.ambulanceCard,
    location: {
      latitude: -33.8600024,
      longitude: 18.697459
    },
    numberToCall: '01001796904'
  }
];

export class Incidents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // IncidentCards: [],
      IncidentCards: incidentsDummyData,
      userID: '01001796904',
      refreshing: false
    };
  }

  componentDidMount() {
    this.pullRefresh();
  }

  /**
   * Pull to refresh functionality
   */
  pullRefresh = () => {
    this.setState({
      refreshing: true
    });
    // this.updateIncidentCards();
    setTimeout(() => {
      this.setState({
        refreshing: false
      });
    }, 5000);
  };

  // /** Get more IncidentCards when we get to the end of the scrollView.
  //  * Check we reached end of content
  //  * @param {int} layoutMeasurement - size of the layout .
  //  * @param  {int} contentOffset - position on screen
  //  * @param  {int} contentSize - size of all content
  //  */
  moreIncidentCards = ({ layoutMeasurement, contentOffset, contentSize }) => {
    //   if (
    //     layoutMeasurement.height + contentOffset.y >= contentSize.height - 1 &&
    //     this.state.refreshing !== true
    //   ) {
    //     this.setState({
    //       refreshing: true
    //     });
    //     this.updateIncidentCards(
    //       this.state.IncidentCards[this.state.IncidentCards.length - 1].id
    //     );
    //   }
  };

  // /** Update IncidentCards.
  //  * gets first 20 IncidentCards With default parameter (id=null)
  //  * To retrieve more send the id of the last retrieved IncidentCard.
  //  * @param {int} id - The id of IncidentCard .
  //  */
  updateIncidentCards(id = null, username = null) {
    //   axios
    //     .get('Incidents/cards', {
    //       params: {
    //         last_retrieved_IncidentCard_id: id
    //       }
    //     })
    //     .then(response => {
    //       if (id === null) {
    //         this.setState({
    //           IncidentCards: response.data
    //         });
    //       } else {
    //         this.setState(prevState => ({
    //           IncidentCards: prevState.IncidentCards.concat(response.data)
    //         }));
    //       }
    //       this.setState({ refreshing: false });
    //     })
    //     .catch(() => {})
    //     .then(() => {
    //       // always executed
    //     });
  }

  render() {
    return (
      <Block flex center style={styles.mainContainer}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.pullRefresh}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.buttons}
          style={{ flex: 1 }}
          onScroll={({ nativeEvent }) => {
            this.moreIncidentCards(nativeEvent);
          }}
        >
          {this.state.IncidentCards.map((item, index) => (
            <IncidentCard
              key={index}
              item={item}
              onPressRemove={() => {
                console.log('Remove Pressed');
              }}
              renderRemove={this.state.userID === item.userID}
              style={styles.incidents}
            />
          ))}
        </ScrollView>
        <TouchableOpacity
          onPress={() => console.log('create Incident')}
          style={{
            position: 'absolute',
            right: 20,
            bottom: 20,
            width: 60,
            height: 60,
            borderRadius: 30,
            alignItems: 'flex-end'
          }}
        >
          <Icon name="plus" size={30} />
        </TouchableOpacity>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  incidents: {
    width: width - theme.SIZES.BASE * 2,
    marginBottom: theme.SIZES.BASE
  },
  mainContainer: {
    width: width,
    height: height,
    alignContent: 'center'
  }
});

export default Incidents;
