import React from 'react';
import {} from 'react-native';
import { Card, Chip } from 'react-native-paper';
import CardActions from 'react-native-paper/lib/typescript/src/components/Card/CardActions';


export default class ReportCard extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      incidentDescription: JSON.parse(this.props.data.incidentDescription),
      culpritDescription: JSON.parse(this.props.data.culpritDescription),
      flags: Object.keys(incidentDescription.harassmentFlags),
    };
  }

  _viewReport = () => {
    this.props.navigation.navigate("ReportDetails", {
      report: this.props.data
    });
  }

  _renderHarassmentFlagChips = () => this.state.flags.map(flag => (
    <Chip icon="flag-triangle" >{flag}</Chip>
  ));

  render() {

    return (
      <Card
        onPress={this._viewReport}
      >
        <Card.Title 
          title={this.props.data._id}
          subtitle={`Happened on: ${new Date(this.state.incidentDescription.date)}`}
        />
        <Card.Content>
          {this._renderHarassmentFlagChips()}
        </Card.Content>
      </Card>
    );
  }

}
