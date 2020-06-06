import React from 'react';
import { ScrollView, View, StyleSheet, Dimensions } from 'react-native';
import {
  Headline,
  Subheading,
  Title,
  Text,
  Caption,
  Card,
  List,
  Divider,
} from 'react-native-paper';


export default class VerbalHarassment extends React.PureComponent {

  render() {

    return (
      <ScrollView style={styles.screen}>
        <Headline style={styles.headline}>Verbal Harassment</Headline>
        <Subheading style={styles.subtitle}>Definition and Examples</Subheading>
        <Title style={styles.title}>Definition</Title>
        <Text style={styles.text}>
          Verbal harassment is unwelcome behaviour of a sexual nature (often carried out using sound, i.e voice) that leaves
          the victim feeling uneasy and uncomfortable. This is often carried out through verbal cues.
        </Text>
        <Divider style={styles.divider} />
        <Title style={styles.title}>Examples</Title>
        <Card.Title 
          style={styles.card}
          titleStyle={styles.titleStyle}
          title="Petnames"
          subtitleNumberOfLines={5}
          subtitle="This include endearing names which may in turn objectify the individual and make them uncomfortable. e.g: Babe, Msupa, Babe etc."
        />
        <Card.Title 
          style={styles.card}
          title="Whistling and cat calls"
          subtitleNumberOfLines={5}
          subtitle="Actions such as whistling and cat calling once a person walks by and direct it to them, are considered a verbal act of sexual harassment"
        />
        <Card.Title 
          style={styles.card}
          title="Sexual remarks about a person's body"
          subtitleNumberOfLines={5}
          subtitle="This is very common especially in the public transport sector. This often involes a person making remarks about outward physical features of the victim that often are of a sexual nature"
        />
        <Card.Title 
          style={styles.card}
          title="Random inclusion of sexual topic"
          subtitleNumberOfLines={5}
          subtitle="This is the act of people sneaking in question sexual topics and also asking questions about a person's sexual activity causing the person to be uneasy because of the sexual topic brought uo"
        />
        <Card.Title 
          style={styles.card}
          title="Making making sounds"
          subtitleNumberOfLines={5}
          subtitle="This includes howling and/or smacking of lips directed at someon"
        />
        <Card.Title 
          style={styles.card}
          title="Remarks about a persons choice of dressing"
          subtitleNumberOfLines={5}
          subtitle="This includes making sexual remarks often related to how a person chose to dress often making them feel uneasy in their own shoes"
        />
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
