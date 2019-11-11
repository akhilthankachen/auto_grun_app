import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height
export default class timerDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  render() {
    return (
      <View style={styles.container}>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: WIDTH - 30,
    height: 200,
    backgroundColor: 'white',
    marginTop: 15,
    borderRadius: 5
  }
});
