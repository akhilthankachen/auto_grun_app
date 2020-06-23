import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native'
import SimpleButton from './SimpleButton'
import LoadingModal from './LoadingModal'
import AsyncStorage from '@react-native-community/async-storage';
import DisplayTimerModal from './DisplayTimerModal'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements'
import OnlyTimeDuration from './OnlyTimeDuration';

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height
export default class timerDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayTimerVisible: false,
      channel: this.props.channel,
      data: [],
      value: ''
    };
  } 

  renderTimeList = ()=>{
    if( this.props.data.length < 1){
      return <Text style={styles.empty}>Empty</Text>
    }
    return this.props.data.slice(0).reverse().map((item, index) => {
      return (
          <OnlyTimeDuration key={index} index={index} hour={item.h} minutes={item.m} duration={item.d/60} color="active"/>
      );
    });
  }

  renderTimerListBuffer = ()=>{
    let len = this.props.data.length
    let list = []
    for(var i = len; i<6 ; i++){
      list.push(
        <OnlyTimeDuration key={i} index={i} hour=" ---" minutes="---" duration=" ---" color="inactive"/>
      )
    }
    return list
  }

  render() {
    var height = 75 + (((this.props.data.length > 0 ? this.props.data.length : 1)  - 1) * 35)
    return (
      <View style={[styles.container, {height: height}]}>
        <View style={styles.titleBox}>
          <Text style={styles.channelText}>Channel {this.props.channel}</Text>
        </View>
        <View style={styles.listDuration}>
          {this.renderTimeList()}
        </View>

      </View>
    );
  }
}

//<View style={styles.buttonBox}>
//<View style={styles.viewBox}>
//  <SimpleButton text='View' onPress={this.onPressView}/>
//</View>
//<View style={styles.removeBox}>
//  <SimpleButton text='Remove' onPress={this.onPressDelete}/>
//</View>
//</View>

const styles = StyleSheet.create({
  container: {
    width: WIDTH - 30,
    backgroundColor: 'white',
    marginTop: 15,
    borderRadius: 5
  },
  titleBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15
  },
  titleText: {
    fontFamily: 'sans-serif-medium',
    fontWeight: '500',
    marginLeft: 15,
    fontSize: 15
  },
  statusBox: {
    marginRight: 15
  },
  removeIcon: {
    marginRight: 15
  },
  channelText: {
    fontFamily: 'sans-serif-medium',
    fontWeight: '500',
    fontSize: 15,
    marginLeft: 15,
  },
  buttonBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 15,
    height: 50,
    width: WIDTH - 60,
  },
  viewBox: {
    width: (WIDTH - 60)/2 - 7.5,
  },
  removeBox: {
    width: (WIDTH - 60)/2 - 7.5,
  },
  empty:{
    alignSelf: 'center',
    fontFamily: 'sans-serif-medium',
    fontWeight: '500',
    fontSize: 15,
    color: 'gray'
  }
});
