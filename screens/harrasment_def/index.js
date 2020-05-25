import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';

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
    let definitions = [];

    let explanation = (
      <Card style={styles.explanationCard} key={category}>
        <Card.Title 
          title={category}
        />
        <Card.Content> 
          <Text>{categories[category]}</Text>
        </Card.Content>
      </Card>
    );

    return explanation;
  }

  _renderAll = () => {
    // for(let cat in categories) {
    //   definitions.push(this._renderCategory(cat));
    // }
    
    return Object.keys(categories)
      .map(category => this._renderCategory(category));
  }

  render() {

    return (
      <ScrollView style={styles.screen}>
        {
          (this.props.route.params.category != "all")
          ? this._renderCategory(this.props.route.params.category)
          : this._renderAll()
        }
      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  screen: {
    height: "100%",
  },
});
