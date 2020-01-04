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
      isOn: this.props.isActive,
      isVisibleActivate: false,
      isVisibleDeactivate: false,
      displayTimerVisible: false,
      channel: this.props.channel,
      data: [],
      value: ''
    };

    this.getData()
  } 

  getData = async ()=>{
    try{
      const value = await AsyncStorage.getItem('@timerSettings')
      if(value != null){
        var json = JSON.parse(value)
        if(this.state.channel == 1){
          this.setState({
            data: json.ch1,
            value: value
          })
        }else{
          this.setState({
            data: json.ch2,
            value: value
          })
        }
      }
    }catch(e){
      console.log(e)
    }
  }

  checkDataAndUpdate = async ()=>{
    try{
      const value = await AsyncStorage.getItem('@timerSettings')
      if(value != null){
        var json = JSON.parse(value)
        if(value.localeCompare(this.state.value) != 0){
          if(this.state.channel == 1){
            this.setState({
              data: json.ch1,
              value: value
            })
          }else{
            this.setState({
              data: json.ch2,
              value: value
            })
          }
          if(this.state.isOn == true){
            this.setState({
              isVisibleActivate: true
            })
            this.props.onPressActivate(this.state.channel, this.switchOff, true)
          }
        }
      }
    }catch(e){
      console.log(e)
    }
  }

  componentDidUpdate = ()=>{
    if(this.props.isActive == true && this.state.isOn == false){
      this.setState({
        isOn: true
      })
    }
    if(this.props.isActive == false && this.state.isOn == true){
      this.setState({
        isOn: false
      })
    }
    this.checkDataAndUpdate()
  }

  switchOff = ()=>{
    this.setState({
      isVisibleActivate: false,
      isVisibleDeactivate: false
    })
  }

  toggleStatus = (isOn)=>{
    if(this.state.isOn == true){
      this.setState({
        isVisibleDeactivate: true
      })
      this.props.onPressActivate(this.state.channel, this.switchOff, false)
    }else{
      this.setState({
        isVisibleActivate: true
      })
      this.props.onPressActivate(this.state.channel, this.switchOff, true)
    }
  }

  renderTimeList = ()=>{
    return this.state.data.slice(0).reverse().map((item, index) => {
        return (
            <OnlyTimeDuration key={index} index={index} hour={item.h} minutes={item.m} duration={item.d} color="active"/>
        );
    });
  }

  renderTimerListBuffer = ()=>{
    let len = this.state.data.length
    let list = []
    for(var i = len; i<6 ; i++){
      list.push(
        <OnlyTimeDuration key={i} index={i} hour=" ---" minutes="---" duration=" ---" color="inactive"/>
      )
    }
    return list
  }

  render() {
    return (
      <View style={styles.container}>
      <LoadingModal isVisible={this.state.isVisibleActivate} content='Activating Settings'/>
      <LoadingModal isVisible={this.state.isVisibleDeactivate} content='Deactivating Settings'/>
        <View style={styles.titleBox}>
          <Text style={styles.channelText}>Channel {this.props.channel}</Text>
          <View style={styles.statusBox}>
            <ToggleSwitch
              isOn={this.state.isOn}
              onColor="green"
              offColor="gray"
              size="medium"
              onToggle={this.toggleStatus}
            />
          </View>
        </View>
        <View style={styles.listDuration}>
          {this.renderTimeList()}
          {this.renderTimerListBuffer()}
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
    height: 250,
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
  }
});
