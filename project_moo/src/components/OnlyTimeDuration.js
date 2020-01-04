import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Icon } from 'react-native-elements'


const WIDTH = Dimensions.get('window').width
export default class OnlyTimeDuration extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  onPressDelete = ()=>{
    this.props.onPress(this.props.index)
  }

  displayTime = (time)=>{
    if(time == 0){
      return "00"
    }else{
      if(time / 10 < 1){
        return "0" + time
      }
      return time
    }
  }

  render() {
    if(this.props.color == "active"){
      return (
        <View style={styles.container}>
          <View style={styles.button}>
            <Text style={styles.activeText}>Time : {this.displayTime(this.props.hour)}:{this.displayTime(this.props.minutes)}   Duration : {this.displayTime(this.props.duration)} Mins</Text>
          </View>
        </View>
      )
    }else{
      return (
        <View style={styles.container}>
          <View style={styles.button}>
            <Text style={styles.inactiveText}>Time : {this.props.hour}:{this.props.minutes}   Duration : {this.props.duration} Mins</Text>
          </View>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
    button: {
      marginTop: 2,
      width: WIDTH - 60,
      height: 30,
      alignItems: 'center',
      backgroundColor: 'white',
      color: 'white',
      borderRadius: 5,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    activeText: {
      fontFamily: 'sans-serif-medium',
      fontWeight: '500',
      fontSize: 15,
      paddingLeft: 30,
      color: '#0C2E59'
    },
    inactiveText: {
      fontFamily: 'sans-serif-medium',
      fontWeight: '500',
      fontSize: 15,
      paddingLeft: 30,
      color: 'gray'
    }
});
