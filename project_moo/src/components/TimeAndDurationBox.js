import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Icon } from 'react-native-elements'


const WIDTH = Dimensions.get('window').width
export default class TimeAndDurationBox extends Component {
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
          <View style={{position: 'absolute', right: 15}}>
            <TouchableOpacity onPress={this.onPressDelete}>
              <Icon 
                  name = 'delete-forever'
                  type = 'material'
                  color = 'rgb(10, 79, 0)'
                  size = {25}
              />
            </TouchableOpacity>
          </View>
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
        flexDirection: 'row'
    },
    logoutText: {
        fontFamily: 'sans-serif-medium',
        fontWeight: '500',
        fontSize: 15,
        paddingLeft: 15
    }
});
