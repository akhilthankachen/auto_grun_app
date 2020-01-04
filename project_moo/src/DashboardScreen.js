import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, ScrollView} from 'react-native';
import {Button} from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import LiveFeed from './components/LiveFeed';
import TempGraph from './components/TempGraph'
import LogoutButton from './components/LogoutButton'
import AddNewTimerButton from './components/AddNewTimerButton';
import TimerDisplay from './components/TimerDisplay'
import LoadingModal from './components/LoadingModal'
import DisplayTimerModal from './components/DisplayTimerModal'
import config from '../config'

const WIDTH = Dimensions.get('window').width
var didFocusSubscription = ''
type Props = {};
export default class DashboardScreen extends Component<Props> {
  constructor(props){
    super(props)
    this.getData()
    this.state = {
      channel1: [],
      channel2: [],
      isVisible: false,
      activeChannel1: false,
      activeChannel2: false,
      clientToken: '',
      channelOneActive: false,
      deviceOnline: false,
      value: ''
    }
    this.getToken()
    this.getActiveIndexOne()
    this.getActiveIndexTwo()
  }

  getActiveIndexOne = async () => {
    try {
      const value = await AsyncStorage.getItem('@ActiveOne')
      if(value != null){
        this.setState({
          activeChannel1: JSON.parse(value)
        })
      }
    } catch(e) {
        // do nothing
    }
  }
  getActiveIndexTwo = async () => {
    try {
      const value = await AsyncStorage.getItem('@ActiveTwo')
      if(value != null){
        this.setState({
          activeChannel2: JSON.parse(value)
        })
      }
    } catch(e) {
        // do nothing
    }
  }

  getToken = async () => {
    try {
        const value = await AsyncStorage.getItem('@token')
        if(value != null){
          this.setState({
            clientToken: JSON.parse(value)
          })
        }
    } catch(e) {
        // do nothing
    }
  }

  getData = async ()=>{
    try {
      const value = await AsyncStorage.getItem('@timerSettings')
      if(value !== null) {
        var json = JSON.parse(value)
        this.setState({
          channel1: json.ch1,
          channel2: json.ch2,
          value: value
        })
        //this.forceUpdate()
      }else{
        console.log('no value')
      }
    } catch(e) {
      console.log(e)
    } 
  }


  componentDidMount = ()=>{
    didFocusSubscription = this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.getData()
      }
    );

  }

  componentWillUnmount = ()=>{
    didFocusSubscription.remove()
  }

  updateDeviceStatus = (status)=>{
    this.setState({
      deviceOnline: status
    })
  }

  onPressActivateSettings = (channel, callback, activate)=>{
    if(!this.state.deviceOnline){
      callback()
      alert("Device not online...")
      return
    }
    if(channel == 1){
      if( activate == true ){
        if(this.state.activeChannel2 == false){
          var json = {
            settings: {
              ch1: this.state.channel1,
              ch2: []
            }
          }
        }else{
          var json = {
            settings: {
              ch1: this.state.channel1,
              ch2: this.state.channel2
            }
          }
        }
      }else{
        if(this.state.activeChannel2 == false){
          var json = {
            settings: {
              ch1: [],
              ch2: []
            }
          }
        }else{
          var json = {
            settings: {
              ch1: [],
              ch2: this.state.channel2
            }
          }
        }
      }
      fetch(config.remote+'/device/settings', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': this.state.clientToken.token,
        },
        body: JSON.stringify(json)
      },)  
      .then((response) => {
          if(response.status == 200){
              return response.json()
          }
      })
      .then((responseJSON)=>{
        if(responseJSON != null){
          if(responseJSON.success == true){
            setTimeout(()=>{
              fetch(config.remote+'/device/settingsAck', {
                method: 'GET',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': this.state.clientToken.token,
                }
              },)  
              .then((response) => {
                  if(response.status == 200){
                      return response.json()
                  }
              })
              .then((responseJSON)=>{
                if(responseJSON != null){
                  if(responseJSON.msg == true){
                    if(activate){
                      this.setState({
                        activeChannel1: true
                      })
                      AsyncStorage.setItem('@ActiveOne', JSON.stringify(true))
                    }else{
                      this.setState({
                        activeChannel1: false
                      })
                      AsyncStorage.setItem('@ActiveOne', JSON.stringify(false))
                    }
                    callback()
                  }
                }
              })
              .catch((err)=>{
                  console.log(err)
              })
            },2000)
          }
        }
      })
      .catch((err)=>{
          console.log(err)
      })
    }else{
      if(activate){
        if(this.state.activeChannel1 == false){
          var json = {
            settings: {
              ch1: [],
              ch2: this.state.channel2
            }
          }
        }else{
          var json = {
            settings: {
              ch1: this.state.channel1,
              ch2: this.state.channel2
            }
          }
        }
      }else{
        if(this.state.activeChannel1 == false){
          var json = {
            settings: {
              ch1: [],
              ch2: []
            }
          }
        }else{
          var json = {
            settings: {
              ch1: this.state.channel1,
              ch2: []
            }
          }
        }
      }

      console.log(JSON.stringify(json))
      fetch(config.remote+'/device/settings', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': this.state.clientToken.token,
        },
        body: JSON.stringify(json)
      },)  
      .then((response) => {
          if(response.status == 200){
              return response.json()
          }
      })
      .then((responseJSON)=>{
        if(responseJSON != null){
          if(responseJSON.success == true){
            setTimeout(()=>{
              fetch(config.remote+'/device/settingsAck', {
                method: 'GET',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': this.state.clientToken.token,
                }
              },)  
              .then((response) => {
                  if(response.status == 200){
                      return response.json()
                  }
              })
              .then((responseJSON)=>{
                if(responseJSON != null){
                  if(responseJSON.msg == true){
                    if(activate){
                      this.setState({
                        activeChannel2: true
                      })
                      AsyncStorage.setItem('@ActiveTwo', JSON.stringify(true))
                    }else{
                      this.setState({
                        activeChannel2: false
                      })
                      AsyncStorage.setItem('@ActiveTwo', JSON.stringify(false))
                    }
                    callback()
                  }
                }
              })
              .catch((err)=>{
                  console.log(err)
              })
            },2000)
          }
        }
      })
      .catch((err)=>{
          console.log(err)
      })
    }
  }

  render() {
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <LiveFeed updateStatus = {this.updateDeviceStatus}/>
                <View style={styles.timerSettingsList}>
                  <TimerDisplay 
                    key={1} 
                    keyDup={1} 
                    index={0} 
                    channel={1} 
                    onPressDelete={this.onPressDeleteSettings}
                    onPressActivate={this.onPressActivateSettings}
                    isActive={this.state.activeChannel1}
                  />
                  <TimerDisplay 
                    key={2} 
                    keyDup={1} 
                    index={0} 
                    channel={2} 
                    onPressDelete={this.onPressDeleteSettings}
                    onPressActivate={this.onPressActivateSettings}
                    isActive={this.state.activeChannel2}
                  />
                </View>
                <AddNewTimerButton style={styles.addNewTimer} navigation={this.props.navigation} deviceOnline={this.state.deviceOnline}/>
                <TempGraph heading="Average Temp Per Hour" route="/device/avgTempDay"/>
                <TempGraph heading="Maximum Temp Per Hour" route="/device/maxTempDay"/>
                <TempGraph heading="Minimum Temp Per Hour" route="/device/minTempDay"/>
                <LogoutButton style={styles.logout} navigation={this.props.navigation}/>
            </ScrollView>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(232, 232, 232)',
  },
  contentContainer: {
    alignItems: 'center'
  },
  logout: {
    marginTop: 15,
    marginBottom: 15
  },
  addNewTimer: {
    marginTop: 15
  },    
  box: {
    backgroundColor: 'white',
    width: WIDTH - 30,
    height: 200,
    marginTop: 15,
    borderRadius: 5,
  },
  liveTemp: {
      alignSelf: 'center'
  },
  liveTempText: {
      fontSize: 70,
      color: 'rgb(104, 61, 50)',
      marginTop: 10
  }
});