import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native'
import SimpleButton from './SimpleButton'
import LoadingModal from './LoadingModal'
import AsyncStorage from '@react-native-community/async-storage';
import DisplayTimerModal from './DisplayTimerModal'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height
export default class timerDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOn: this.props.isActive,
      isVisible: false,
      displayTimerVisible: false,
      keyDup: this.props.keyDup,
      index: this.props.index,
      channel: this.props.channel
    };
  }

  componentDidUpdate = ()=>{
    if(this.props.isActive == true && this.state.isVisible == true){
      this.setState({
        isVisible: false,
        isOn: true
      })
    }
    if(this.state.isOn == true && this.props.isActive == false){
      this.setState({
        isOn: false
      })
    }
  }

  toggleStatus = (isOn)=>{
    if(this.state.isOn == true){
      alert('Activate another settings to deactivate this..')
    }else{
      this.setState({
        isVisible: true
      })
      this.props.onPressActivate(this.state.index, this.state.channel)
    }
  }

  onPressDelete = async ()=>{
    try{
      const value = await AsyncStorage.getItem('@timerSettings')
      if(value != null){
        var json = JSON.parse(value)
        if(this.props.channel == 1){
          json.channel1.splice(this.props.index, 1)
        }else{
          json.channel2.splice(this.props.index, 1)
        }
        json = JSON.stringify(json)
        await AsyncStorage.setItem('@timerSettings', json)
        this.props.onPressDelete()
      }
    }catch(e){
      console.log(e)
    }
  }

  onPressView =()=>{
    this.setState({
      displayTimerVisible: true
    })
  }

  onPressCloseDisplayTimer = ()=>{
    this.setState({
      displayTimerVisible: false
    })
  }

  render() {
    return (
      <View style={styles.container}>
      <DisplayTimerModal
        isVisible={this.state.displayTimerVisible} 
        key={this.state.keyDup}
        index={this.state.index} 
        channel={this.state.channel}
        onPressClose={this.onPressCloseDisplayTimer}
      />
      <LoadingModal isVisible={this.state.isVisible} content='Activating Settings'/>
        <View style={styles.titleBox}>
          <Text style={styles.titleText}>Settings {this.props.keyDup}</Text>
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
        <View style={styles.buttonBox}>
          <View style={styles.viewBox}>
            <SimpleButton text='View' onPress={this.onPressView}/>
          </View>
          <View style={styles.removeBox}>
            <SimpleButton text='Remove' onPress={this.onPressDelete}/>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: WIDTH - 30,
    height: 120,
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
  channelText: {
    fontFamily: 'sans-serif-medium',
    fontWeight: '500',
    fontSize: 15
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
