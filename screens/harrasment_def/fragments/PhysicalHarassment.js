import React from 'react';
import { ScrollView, View, StyleSheet, Dimensions } from 'react-native';
import {
  Headline,
  Subheading,
  Title,
  Text,
  Card,
  Divider,
} from 'react-native-paper';
import Theme from '../../../theme';

import categoryFlags from './utilities/physical-discrimination';


export default class VerbalHarassment extends React.PureComponent {
  constructor(props) {
    super(props);

    let DC = null;

    let discriminationCategory = this.props.category;

    if (discriminationCategory === "Sexual Discrimination & Harrasment") {
      DC = categoryFlags.SD
    } else if (discriminationCategory === "Discrimination based on tribe/race") {
      DC = categoryFlags.RD;
    } else {
      DC = categoryFlags.PD;
    }

    this.DC = DC;

    this.state = {
      category: this.props.category,
    };
  }

  render() {

    return (
      <ScrollView style={styles.screen}>
        <Text style={styles.headline}>Physical Discrimination</Text>
        <Subheading style={styles.subtitle}>Definition and Examples</Subheading>
        <Title style={styles.title}>Definition</Title>
        <Text style={styles.text}>
          This is unwelcome behaviour (of sexual nature) directed towards a person that involve physical contact and physical actions towards someone.
        </Text>
        <Divider style={styles.divider} />
        <Title style={styles.title}>Examples</Title>
        {
          this.DC.map((example, i) => (
            <Card.Title 
              style={styles.card}
              titleStyle={styles.titleStyle}
              title={example.title}
              subtitleNumberOfLines={5}
              subtitle={example.description}
              key={i.toString()}
            />
          ))
        }
        <View style={styles.footer} />
      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  screen: {
    width: Dimensions.get("window").width,
  },
  headline: {
    marginStart: 16,
    paddingBottom: 4,
    fontSize: 32,
    fontFamily: Theme.OpenSansBold,
  },
  subtitle: {
    marginStart: 16,
  },
  title: {
    marginStart: 16
  },
  text: {
    marginStart: 16,
  },
  divider: {
    marginTop: 4,
    marginBottom: 4,
  },
  card: {
    width: (Dimensions.get("window").width - 32),
    alignSelf: "center"
  },
  footer: {
    height: 0,
    marginBottom: 30
  },
});

