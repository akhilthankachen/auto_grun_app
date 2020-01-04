import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Icon } from 'react-native-elements'

const WIDTH = Dimensions.get('window').width
export default class AddTimeAndDurationButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  onlogoutPress = ()=>{
    this.props.onPress()
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style = {this.props.style} onPress = {this.onlogoutPress}>
            <View style={styles.button}>
                <Icon 
                    name = 'add'
                    type = 'material'
                    color = 'rgb(10, 79, 0)'
                    size = {20}
                />
                <Text style={styles.logoutText}>Add Time And Duration</Text>
            </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container:{
    },
    button: {
        width: WIDTH - 60,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(255, 204, 186)',
        color: 'white',
        borderRadius: 5,
        flexDirection: 'row'
    },
    logoutText: {
        fontFamily: 'sans-serif-medium',
        fontWeight: '500',
        fontSize: 15,
        paddingLeft: 10
    }
});
