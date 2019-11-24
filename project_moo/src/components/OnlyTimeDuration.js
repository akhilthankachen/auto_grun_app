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

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.button}>
          <Text style={styles.logoutText}>Time : {this.props.hour}:{this.props.minutes}   Duration : {this.props.duration} Minutes</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container:{

    },
    button: {
      marginTop: 10,
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
    logoutText: {
        fontFamily: 'sans-serif-medium',
        fontWeight: '500',
        fontSize: 15,
        paddingLeft: 15
    }
});
