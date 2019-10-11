import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Button} from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import { Icon } from 'react-native-elements'

type Props = {};
export default class AddNewButton extends Component<Props> {

  render() {
    return (
      <View>
        <TouchableOpacity style={styles.container} onPress={this.props.onPress}>
        <Icon 
          name = 'add'
          type = 'material'
          color = 'white'
          size = {25}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection:'row',
    width: 50,
    height: 50,
    backgroundColor: 'rgb(106, 161, 98)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30
  },
  text: {
    fontWeight: '700',
    color: 'white',
    marginLeft: 5
  }
});