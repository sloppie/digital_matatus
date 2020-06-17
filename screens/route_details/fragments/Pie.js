import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import {} from 'react-native-paper';
import { PieChart } from 'react-native-chart-kit';

export default class DataPieChart extends React.PureComponent {

  chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };

  _generateGraphData = () => {}

  _renderGraph = () => (
    <PieChart 
      data={this._generateGraphData()}
      chartConfig={this.chartConfig}
      accessor="number"
      width={width}
      height={220}
      style={styles.pieChart}
      paddingRight={8}
    />
  );

  render() {

    return (
      <View style={styles.graphContainer}>
        {this._renderGraph()}
      </View>
    );
  }

}

const styles = StyleSheet.create({
  graphContainer: {},
});
