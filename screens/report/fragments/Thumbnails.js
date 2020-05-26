import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Card, TouchableRipple, List } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

class Item extends React.PureComponent {

  removeMedia = () => this.props.removeMedia(this.props.thumbnailUri, this.props.type, this.props.index);

  render() {

    return (
      <Card.Title 
        left={props => (
          (this.props.thumbnailUri != null)
          ? <Image  source={{width: 30, height: 30, scale: 0.5, uri: this.props.thumbnailUri}}/>
          : <Icon {...props} name="file-video" size={30}/>
        )
        }
        title={`${this.props.type}_${this.props.index + 1}`}
        right={props => (
          <TouchableRipple
            onPress={this.removeMedia}
          >
            <Icon 
              {...props} 
              name="trash-can"
              style={styles.trashCanIcon}
            />
          </TouchableRipple>
        )}
      />
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
    padding: 16
  },
});
