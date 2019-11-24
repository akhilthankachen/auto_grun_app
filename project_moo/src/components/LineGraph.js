import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import {LineChart} from 'react-native-chart-kit'


const WIDTH = Dimensions.get('window').width
type Props = {};

export default class LineGraph extends Component<Props> {
    constructor(props){
        super(props)
        this.state = {
        }
    }

  render() {

    return (
      <View style={styles.container}>
        <LineChart
            data={{
            datasets: [
                {
                data: [
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100
                ]
                }
            ]
            }}
            width={Dimensions.get("window").width - 60} // from react-native
            height={220}
            yAxisSuffix={"°C"}
            chartConfig={{
                backgroundColor: "white",
                backgroundGradientFrom: "white",
                backgroundGradientTo: "white",
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgb(241, 69, 90)`,
                labelColor: (opacity = 1) => `rgb(195, 56, 73)`,
                propsForDots: {
                    r: "5",
                    strokeWidth: "2",
                    stroke: "#ffa726"
                }
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