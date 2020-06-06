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
        <Headline style={styles.headline}>Physical Harassment</Headline>
        <Subheading style={styles.subtitle}>Definition and Examples</Subheading>
        <Title style={styles.title}>Definition</Title>
        <Text style={styles.text}>
          This is unwelcome behaviour (of sexual nature) directed towards a person that involve physical contact and physical actions towards someone.
        </Text>
        <Divider style={styles.divider} />
        <Title style={styles.title}>Examples</Title>
        <Card.Title 
          style={styles.card}
          titleStyle={styles.titleStyle}
          title="Massage"
          subtitleNumberOfLines={5}
          subtitle="Giving a massage to someone (possibly around the neck or shoulders) that result ot that person feeling uneasy as this act was unwelcome."
        />
        <Card.Title 
          style={styles.card}
          title="Touching a person"
          subtitleNumberOfLines={5}
          subtitle="Touching a person's hair, clothing and/or body to initate sexual advancements which are unwelcome."
        />
        <Card.Title 
          style={styles.card}
          title="Intimate actions"
          subtitleNumberOfLines={5}
          subtitle="This includes acts of affection such as hugging, kissing and/or stroking someone to advance unwelcome affection that makes the person feel uneeasy."
        />
        <Card.Title 
          style={styles.card}
          title="Forcing Oneself on another"
          subtitleNumberOfLines={5}
          subtitle="This includes actions such as touching a person, rubbing sexually against them (this may include rubbing your genitals on them) and standing too close wile trying to rub against them thus makig them uneasy"
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

