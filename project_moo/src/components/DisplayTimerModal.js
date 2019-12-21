import React, { Component } from 'react';
import { View, Text, StyleSheet, Modal, Image, Dimensions, TouchableWithoutFeedbackBase } from 'react-native';
import SimpleButton from './SimpleButton'
import OnlyTimeDuration from './OnlyTimeDuration'
import AsyncStorage from '@react-native-community/async-storage';
const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height
export default class DisplayTimerModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      channel: this.props.channel,
      index: this.props.index
    };
    this.getData()
  }
  
  onPressClose = ()=>{
    this.props.onPressClose()
  }

  getData = async ()=>{
    try{
      const value = await AsyncStorage.getItem('@timerSettings')
      if(value != null){
        var json = JSON.parse(value)
        console.log(json.channel1)
        if(this.state.channel == 1){
          var list = []
          json.channel1[this.state.index].map((item,index)=>{
            list.push(<OnlyTimeDuration key={index} hour={item.h} minutes={item.m} duration={item.d}/>)
          })
          this.setState({
            list: list
          })
        }else{
          var list = []
          json.channel2[this.state.index].map((item,index)=>{
            list.push(<OnlyTimeDuration key={index} hour={item.h} minutes={item.m} duration={item.d}/>)
          })
          this.setState({
            list: list
          })
        }
      }
    }catch(e){
      console.log(e)
    }
  }

  render() {
    return (
        <Modal
          animationType="none"
          transparent={false}
          visible={this.props.isVisible}
        >
            <View style={styles.transparentView}>
              <View style={styles.content}>
                {this.state.list}
                <View style={styles.closeButton}>
                  <SimpleButton text='Close' onPress={this.onPressClose}/>
                </View>
              </View>
            </View>
            
        </Modal>
    );
  }
}

const styles = StyleSheet.create({
  transparentView: {
    flex: 1,
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: 'rgb(232, 232, 232)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    width: WIDTH - 30,
    height: HEIGHT - 60,
    backgroundColor: 'white',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeButton: {
    width: WIDTH - 60,
    height: 50,
    position: 'absolute',
    bottom: 15
  }
});