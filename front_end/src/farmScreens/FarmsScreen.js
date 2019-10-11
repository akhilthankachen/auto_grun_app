import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import AddNewButton from '../other_components/addNewButton'
import Empty from '../other_components/empty'

type Props = {};
export default class FarmsScreen extends Component<Props> {

  addNewFarm = ()=>{
    alert('hey am pressed')
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Empty/>
        </View>
        <View style={styles.newButton}>
          <AddNewButton onPress={this.addNewFarm}/>
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
  newButton: {
    position: 'absolute',
    bottom: 15,
    right: 20
  }
});