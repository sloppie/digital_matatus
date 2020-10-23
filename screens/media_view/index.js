import React from 'react';
import {} from 'react-native';
import {} from 'react-native-paper';
import * as Fragments from './fragments';

console.log("MediaView is being loaded");

export default class MediaView extends React.PureComponent {

  render() {

    if(this.props.route.params.type === "IMAGE")
      return (
        <Fragments.ImageView 
          uri={this.props.route.params.uri}
          mediaUrl={this.props.route.params.mediaUrl}
        />
      );
    else
      return (
        <Fragments.VideoView 
          uri={this.props.route.params.uri}
          mediaUrl={this.props.route.params.mediaUrl}
        />
      );
  }

}
