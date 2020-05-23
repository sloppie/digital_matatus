import React from 'react';
import { StyleSheet, Text, ToastAndroid } from 'react-native';
import { List, TouchableRipple, Colors } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Theme from '../../../theme';


class SaccoEntry extends React.PureComponent {

  render() {

    return (
      <List.Item 
        left={props => <Icon {...props} name="file-cabinet" size={30} style={styles.rightEntryIcons}/>}
        title={this.props.name}
        description={`located at ${this.props.location}`}
        right={props => <TouchableRipple 
            {...props}>
              <>
                <Icon 
                  name="star" 
                  size={30}
                  style={styles.leftEntryIcons}
                  />
                <Text style={styles.ratingText}>{this.props.rating}</Text>
              </>
          </TouchableRipple>
        }
        onPress={() => ToastAndroid.show( `Tapped to sho more data on ${this.props.name}`, ToastAndroid.SHORT) }
      />
    );
  }

}


export default class SaccoList extends React.PureComponent {

  _renderSaccos = () => {
    let saccos = [];
    let titles = ["Ya Kwanza", "Ya Pili", "Ya Tatu", "Ya Nne", "Ya Tano"];
    let ratings = ["5", "4.8", "4.7", "4.6", "5"];
    let location = "Apo kando ya iyo building"

    for(let i=0; i<5; i++) {
      saccos.push(
        <SaccoEntry 
          name={titles[i]}
          rating={ratings[i]}
          location={location}
          key={i.toString()}
        />
      );
    }

    return saccos;
  }

  render() {

    return (
      <ScrollView>
        {this._renderSaccos()}
      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  rightEntryIcons: {
    textAlignVertical: "center",
    color: Theme.PrimaryColor
  },
  leftEntryIcons: {
    textAlignVertical: "center",
    color: Colors.yellow700
  },
  ratingText: {
    textAlign: "center",
    fontFamily: Theme.OpenSansBold
  },
});
