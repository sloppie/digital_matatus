import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { Card, Surface, TouchableRipple, IconButton, List, Title } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


class MediaCard extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      actionsVisible: false,
    };
  }

  _reportCulprit = (url) => this.props.navigation.navigate("ReportCulprit", {
    highlightedMediaUrl: url,
    report: this.props.report,
  });

  _toggleActionsVisible = (actionsVisible) => this.setState({actionsVisible});

  renderContent = () => {

    if(this.state.actionsVisible)
      return (
        <Card
          style={styles.mediaCard}
        >
          <Card.Title 
            title="Media options"
            titleStyle={styles.cardTitle}
            right={props => (
              <Icon 
                {...props} 
                name="close" 
                color="white"
                style={styles.cardTitleRight}
                onPress={this._toggleActionsVisible.bind(this, false)} />
            )
          }
          />
          <Card.Content style={styles.cardContent}>
            <IconButton 
              icon="information" 
              onPress={this._reportCulprit.bind(this, this.props.mediaUrl)}
              size={50}
              color="white"
              style={styles.iconButton}
            />
            <Title style={{textAlign:"center", color: "white"}}>Report culprit</Title>
          </Card.Content>
        </Card>
      );

    else 
      return (
        <Card
          style={styles.mediaCard}
          onLongPress={this._toggleActionsVisible.bind(this, true)}
          rippleColor="#777"
        >
          <Card.Title 
            title="Media options"
            titleStyle={styles.cardTitle}
          />
          <Card.Content style={styles.cardContent}>
              <Icon 
                name="play" 
                style={styles.iconButton} 
                size={50} 
                color="white"
              />
          </Card.Content>
        </Card>
      );
  }

  render() {

    return this.renderContent()
  }

}


export default class Media extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      media: this.props.media
    };

  }


  _renderMedia = () => {

    return this.props.media.map((mediaFile, index) => {
      return (
        <MediaCard 
          report={this.props.report}
          key={index.string}
          mediaUrl={mediaFile}
          navigation={this.props.navigation}
        />
      );
    });
  }

  render() {

    return (
      <View>
          <Card.Title 
            title={this.props.mediaType}
            titleStyle={styles.cardTitle}
            subtitle="Scroll sideways to go through all media"
            subtitleStyle={styles.cardSubtitle}
          />
          <Card.Content>
            <ScrollView
              horizontal={true}
              pagingEnabled={true}
              style={styles.scrollView}
            >
              {this._renderMedia()}
            </ScrollView>
          </Card.Content>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "rgba(18, 18, 18, 0.9)",
  },
  mediaCard: {
    backgroundColor: "#444",
    width: Dimensions.get("window").width - 32,
    alignSelf: "center",
    padding: 0,
  },
  cardContent: {
    alignContent: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width - 32,
  },
  cardTitle: {
    color: "white",
  },
  cardSubtitle: {
    color: "white",
  },
  cardTitleRight: {
    paddingRight: 16
  },
  iconButton: {
    fontSize: 50,
    alignSelf: "center",
  },
});
