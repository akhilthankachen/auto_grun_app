import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Icon } from 'react-native-elements'

const WIDTH = Dimensions.get('window').width
export default class PickTimeButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  onlogoutPress = ()=>{

  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style = {this.props.style} onPress = {this.onlogoutPress}>
            <View style={styles.button}>
                <Text style={styles.logoutText}>Pick Time</Text>
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
        width: 100,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(125, 196, 106)',
        color: 'white',
        borderRadius: 5,
        flexDirection: 'row'
    },
    logoutText: {
        fontFamily: 'sans-serif-medium',
        fontWeight: '500',
        fontSize: 15
    }
});
