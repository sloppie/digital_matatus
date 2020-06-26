import React from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { Card, List, IconButton } from 'react-native-paper';
import { ReportParser } from '../../../utilities';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class AudioCarousel extends React.PureComponent {

  constructor(props) {
    super(props);

    let report = new ReportParser(this.props.report);
    this.state = {
      report,
      data: report.fetchAudios()
    };

  }

  _showReportOptions = () => {
    console.log("Showing report options");
  }

  _renderItem = ({item}) => (
    <View style={styles.carousel}>
      <View style={styles.iconButtonContainer}>
        <IconButton
          disabled={this.state.activeFile === 0} 
          style={styles.carouselButtons} 
          icon="chevron-left" />
      </View>
      <Card
        style={styles.mediaCard}
        onLongPress={this._showReportOptions}
      >
        <Card.Cover source={item} />
        <Card.Title 
          left={props => <Icon name="file-video" />}
          subtitle="Video taken during the incident"/>
      </Card>
      <View style={styles.iconButtonContainer}>
        <IconButton 
          disabled={this.state.activeFile !== this.state.data.length - 1} 
          size={24}
          style={styles.carouselButtons} 
          icon="chevron-right" />
      </View>
    </View>
  );

  _keyExtractor = (item) => item; // since the item is simply a url

  render() {

    if(this.state.data.length == 0)
      return <View />

    console.log("Audio data size: " + this.state.data);

    return (
      <>
        <List.Section title="Audio Files" />
        <FlatList
          style={styles.flatList}
          data={this.state.data}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          pagingEnabled={true}
          horizontal={true}
        />
      </>
    );
  }

}

const styles = StyleSheet.create({
  flatList: {
    height: Math.floor(Dimensions.get("window").height * 0.4),
    width: Dimensions.get("window").width,
  },
  carousel: {
    width: Dimensions.get("window").width,
    flexDirection: "row",
  },
  iconButtonContainer: {
    width: 16,
    justifyContent: "center",
    position: "relative",
  },
  iconButton: {
    alignSelf: "center",
  },
  mediaCard: {
    width: (Dimensions.get("window").width - 32),
    height: Math.floor(Dimensions.get("window").height * 0.4),
    alignSelf: "center",
  },
});

