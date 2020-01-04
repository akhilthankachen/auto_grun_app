import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Icon } from 'react-native-elements'

const WIDTH = Dimensions.get('window').width
export default class AddNewTimer extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  onAddPress = ()=>{
    if(this.props.deviceOnline){
      this.props.navigation.navigate('addTimer')
    }else(
      alert("Device not online...")
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style = {this.props.style} onPress = {this.onAddPress}>
            <View style={styles.button}>
                <Icon 
                    name = 'add'
                    type = 'material'
                    color = 'rgb(10, 79, 0)'
                    size = {20}
                />
                <Text style={styles.addNewTimerText}>Edit Time Durations</Text>
            </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    button: {
        width: WIDTH - 30,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        color: 'white',
        borderRadius: 5,
        flexDirection: 'row'
    },
    addNewTimerText: {
        fontFamily: 'sans-serif-medium',
        fontWeight: '500',
        fontSize: 15,
        paddingLeft: 10
    }
});
