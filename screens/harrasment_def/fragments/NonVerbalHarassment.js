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
        <Headline style={styles.headline}>Non Verbal Harassment</Headline>
        <Subheading style={styles.subtitle}>Definition and Examples</Subheading>
        <Title style={styles.title}>Definition</Title>
        <Text style={styles.text}>
          Non Verbal harassment is unwelcome behaviour of a sexual nature that does not involve any physical or verbal encounters. This mastyle entails, staring, gestures etc.
        </Text>
        <Divider style={styles.divider} />
        <Title style={styles.title}>Examples</Title>
        <Card.Title 
          style={styles.card}
          titleStyle={styles.titleStyle}
          title={"\"Sizing\""}
          subtitleNumberOfLines={5}
          subtitle={"This includes looking at someone for a long perios as they walk by trying to size the person. (kuona kama\"Utawezana\""}
        />
        <Card.Title 
          style={styles.card}
          title="Staring"
          subtitleNumberOfLines={5}
          subtitle="Inappropriately looking at someone for an extended period of time with no intention of sparking conversation. Just looking and making them uneasy"
        />
        <Card.Title 
          style={styles.card}
          title="Blocking someone's path"
          subtitleNumberOfLines={5}
          subtitle="Blocking someon's path as they attempt to access an entrance just to make a sexual advance on them or make a sexual retort. (this is especially common in public transport)"
        />
        <Card.Title 
          style={styles.card}
          title="Following a person"
          subtitleNumberOfLines={5}
          subtitle="Following a person for no reason which doubles as an invasion of privacy and also an unwelcome act of making someon uneasy"
        />
        <Card.Title 
          style={styles.card}
          title="Displaying sexually suggestive visuals"
          subtitleNumberOfLines={5}
          subtitle="This includes any hand or body movement that may be considered to be sexually loaded, thus making the user uncomfortable"
        />
        <Card.Title 
          style={styles.card}
          title="Making sexually suggestive gestures towards a person"
          subtitleNumberOfLines={5}
          subtitle="This is making gestures that may be termed to be of sexual nature or mimicking a sexual act"
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

