import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { List, TouchableRipple, Colors, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView } from 'react-native-gesture-handler';

const categories = {
  "Verbal": "This is unwelcome behaviour of a sexual nature conducted through verbal cues.",
  "Non-Verbal": "This is unwelcome sexual behaviour which may be implied through non-verbal cues which do not involve physically engaging with te victim",
  "Physical": "This is unwelcome sexual behaviour which is mainly carried out through explicit physical actions towards the victim",
};

const categoryExamples = {
  "Verbal": [
    "Refering to an adult as a \"girl\", \"hunk\", \"babe\" or \"honey\"",
    "Whistling at someone, e.g:cat calls",
    "Making sexual comments about a persons body",
    "Turning random discussion into sexual topics",
    "Telling unwelcome sexual jokes or stories",
    "Asking about a person's sexual fantasies, preferences and/or history",
    "Asking personal questions about social or sexual life",
    "Making kissing sounds, howling and/or smacking lips directing it towards a person",
    "Making sexual comments about a person's clothing, anatomy and/or looks",
    "Repeatedly asking out a person who has mase it clear that they are not interested in your sexual advances",
    "Telling lies or spreading rumours about a person's sex life"
  ],
  "Non-verbal": [
    "Looking at a person up and down (in an attempt to \"size\" the person)",
    "Inappropriately staring at someone for a long period of time",
    "Blocking someone's path as they try to access a service just to seek their attention for no forthcoming reason",
    "Following a person",
    "Displaying sexually suggestive visuals",
    "Making sexually suggestive gestures towards a person using hands or through body movements",
    "Making sexually suggestive actioins towards a person such as: winking, blowing kisses and/or licking lips at the sight of a person"
  ],
  "Physical": [
    "Giving a massage around the neck or shoulders",
    "Touching a person's hair, clothing and/or body",
    "Hugging, kissing, touching and/or stroking someone",
    "Touching or rubbing yourself sexually against another person",
    "Standing close or brushing yourself against another person"
  ]
};

class Flag extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      selected: false,
    };
  }

  _updateFlags = () => {
    requestAnimationFrame(() => {
      this.setState({selected: !this.state.selected});
  
      this.props.updateFlags(this.props.index);
    });
  }


  render() {

    return (
      <>
      <List.Item
        left={props => 
          <List.Icon 
            {...props} 
            icon="format-list-bulleted" 
            color={this.state.selected ? Colors.red600 : Colors.grey500}
            size={24} 
          />
        }
        title={this.props.example}
        titleStyle={styles.flagTitle}
        titleNumberOfLines={3}
        onPress={this._updateFlags}
        underlayColor={Colors.red600}
        right={props => (
          <List.Icon
            {...props}
            icon="flag-triangle"
            color={this.state.selected ? Colors.red600 : Colors.grey500}
            size={24}
          />
        )}
      />
      <Divider />
      </>

    );
  }

}


export default class HarassmentDecription extends React.PureComponent {

  constructor(props) {
    super(props);

    let flags = [];

    for(let i=0; i<categoryExamples[this.props.category].length; i++) {
      flags.push(false);
    }

    this.state = {
      "flags": [flags],
      loading: true
    };
  }

  componentDidMount() {
    this.setState({loading: false})
  }

  _updateFlags = (index) => {
    let lastFlag = this.state.flags[this.state.flags.length - 1];
    let flags = [...this.state.flags]; // unpack last stored flags
    lastFlag[index] = !lastFlag[index];
    flags.push(lastFlag);

    this.setState({flags});
  }

  // maps all the examples to the section
  _renderFlags = (category) => categoryExamples[category]
      .map((example, index) => (
        <Flag 
          example={example} 
          index={index} 
          updateFlags={this._updateFlags} 
          key={index.toString()}
        />
      ));

  _returnSetFlags = () => {
    let lastSet = this.state.flags[this.state.flags.length - 1];
    let set = lastSet.map((flag, index) => (
      (flag) ? categoryExamples[this.props.category][index]: null
    )).filter(flag => flag !== null);

    return set;
  }

  render() {

    return(
      <>
        <List.Section
          title={`${this.props.category} Harassment Flags`}
        >
        </List.Section>
        {/* <Divider /> */}
          {(this.state.loading)
              ? <ActivityIndicator size="large"/>
              : this._renderFlags(this.props.category)
            }
      </>
    );
  }

}

const styles = StyleSheet.create({
  flagContainer: {
    // flexDirection: "row",
  },
  flagIcon: {
    padding: 8
  },
  flagTitle: {
    fontSize: 13
  },
});
