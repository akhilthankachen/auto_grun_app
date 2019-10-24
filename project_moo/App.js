import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import Main from './src/Main'

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <Main/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});