import React from 'react';
import { ScrollView, Text, StyleSheet, Dimensions } from 'react-native';
import { Card, Title, Divider, List } from 'react-native-paper';

import * as Fragments from './fragments';

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


export default class CategoryDefinition extends React.PureComponent {

  _renderCategory = (category) => {

    if(category == "Verbal")
      return <Fragments.VerbalHarassment />
    else if(category == "Non-verbal")
      return <Fragments.NonVerbalHarassment />
    else
      return <Fragments.PhysicalHarassment />

  }

  _renderAll = () => {
    const category = this.props.route.params.category;
    
    return [
      <Fragments.VerbalHarassment key="v" category={category} />,
      <Fragments.NonVerbalHarassment key="nv" category={category} />,
      <Fragments.PhysicalHarassment key="p" category={category} />
    ]
  }

  render() {

    console.log("Rendering more info");

    return (
      <ScrollView 
        style={styles.screen}
        horizontal={true}
        nestedScrollEnabled={true}
        pagingEnabled={true}
      >
        {
          this._renderAll()
        }
      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  screen: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    flex: 1,
  },
});
