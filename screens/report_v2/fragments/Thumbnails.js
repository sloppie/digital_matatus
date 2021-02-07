import React from 'react';
import { Image, StyleSheet, Dimensions } from 'react-native';
import { Card, Colors, List } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


class Item extends React.PureComponent {

  removeMedia = () => this.props.removeMedia(this.props.thumbnailUri, this.props.type, this.props.index);

  render() {

    return (
      <Card
        style={styles.itemContainer}
      >
        <Card.Title
          left={props => (
            (this.props.type === "audio")? 
              <Icon {...props} name="record-rec" color={Colors.red500} size={30} />
            :(this.props.thumbnailUri != null)
            ? <Image style={{alignSelf: "center"}} source={{width: 40, height: 40, scale: 0.5, uri: this.props.thumbnailUri,}}/>
            : <Icon {...props} name="file-video" size={30}/>
          )
          }
          title={`${this.props.type} evidence ${this.props.index + 1}`}
          subtitle="This media file will be sent attached to the report"
          subtitleNumberOfLines={2}
          right={props => (
              <Icon 
                {...props}
                name="trash-can-outline"
                onPress={this.removeMedia}
                style={styles.trashCanIcon}
                size={24}
                color="red"
              />
          )}
        />
      </Card>
    );
  }

}

export default class Thumbnails extends React.PureComponent {

  _renderThumbnails = () => {

    return this.props.thumbnails.map((tn, index) => (
      <Item 
        thumbnailUri={tn} 
        removeMedia={this.props.removeMedia}
        type={this.props.type}
        index={index}
        key={index.toString()}
      />
    ));
  }

  render() {

    return (
      <List.Section
        title={`${this.props.type} Added`}
      >
        {this._renderThumbnails()}
      </List.Section>
    );
  }

}

const styles = StyleSheet.create({
  trashCanIcon: {
    marginEnd: 16,
    alignSelf: "center",
  },
  itemContainer: {
    width: (Dimensions.get("window").width - 32),
    alignSelf: "center",
    borderRadius: 4,
    elevation: 1,
    marginBottom: 8,
  },
});
