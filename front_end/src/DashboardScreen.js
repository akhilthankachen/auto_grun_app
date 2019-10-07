import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';



type Props = {};
export default class DashboardScreen extends Component<Props> {

  render() {
    return (
      <View style={styles.container}>
        <Text> DashboardScreen </Text>
        <Button
            title='logout'
            onPress={()=>{
                AsyncStorage.setItem('@token', '').then(()=>{
                    this.props.navigation.navigate('splash')
                })
            }}
            />
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
});