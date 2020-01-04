import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import {LineChart} from 'react-native-chart-kit'


const WIDTH = Dimensions.get('window').width
type Props = {};

export default class LineGraph extends Component<Props> {
    constructor(props){
        super(props)
    }

  render() {

    return (
      <View style={styles.container}>
        <LineChart
            data={{
            labels:  this.props.labels,
            datasets: [
                {
                data: this.props.data
                }
            ]
            }}
            width={Dimensions.get("window").width - 60} // from react-native
            height={220}
            xAxisSuffix={"h"}
            yAxisSuffix={"°C"}
            fromZero={true}
            chartConfig={{
                backgroundColor: "white",
                backgroundGradientFrom: "white",
                backgroundGradientTo: "white",
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `#1B4859`,
                labelColor: (opacity = 1) => `#5E7A7E`,
                propsForDots: {
                    r: "5",
                    strokeWidth: "2",
                    stroke: "#5E7A7E"
                },
            }}
            style={{
                marginVertical: 8,
                borderRadius: 5,
            }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  
});