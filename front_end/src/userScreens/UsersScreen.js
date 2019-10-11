import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import AddNewButton from '../buttons/addNewButton'



type Props = {};
export default class UsersScreen extends Component<Props> {

  addNewUser = ()=>{
    
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.newUserButton}>
          <AddNewButton onPress={this.addNewUser} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  newUserButton: {
    position: 'absolute',
    bottom: 15,
    right: 20
  }
});