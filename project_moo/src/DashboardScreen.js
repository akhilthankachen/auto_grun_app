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
    this.state = {
      channel1: [],
      channel2: [],
      isVisible: false,
      clientToken: '',
      deviceOnline: false,
      value: '',
      updateOnce: false,
      initCheck: false
    }
    this.getToken()
  }

  getSettingsFromServer = () => {
    console.log('gettings settings')
    fetch(config.remote+'/device/getSettings', {
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
        if(responseJSON.success == true){
          var json = JSON.parse(responseJSON.msg)
          AsyncStorage.setItem('@timerSettings', responseJSON.msg).then(()=>{
            console.log("setting value")
            this.setState({
              channel1: json.ch1,
              channel2: json.ch2,
              value: responseJSON.msg,
              initCheck: true
            })
          })
        }
      }
    })
    .catch((err)=>{
        console.log(err)
    })
  }

  getToken = async () => {
    try {
        const value = await AsyncStorage.getItem('@token')
        if(value != null){
          this.setState({
            clientToken: JSON.parse(value)
          })
          this.getSettingsFromServer()
        }
    } catch(e) {
        // do nothing
    }
  }


  checkDataAndUpdate = async ()=>{
    try{
      const value = await AsyncStorage.getItem('@timerSettings')
        if(value != null){
          var json = JSON.parse(value)
          if(value.localeCompare(this.state.value) != 0){
            console.log("check and update")
            this.setState({
              channel1: json.ch1,
              channel2: json.ch2,
              value: value,
            })
          }
        }
    }catch(e){
      console.log(e)
    }
  }


  componentDidUpdate = ()=>{
    if(this.state.initCheck == true){
      this.checkDataAndUpdate()
    }
  }

  componentWillUnmount = ()=>{
 
  }

  updateDeviceStatus = (status)=>{
    this.setState({
      deviceOnline: status
    })
  }

  onPressActivateSettings = (channel)=>{
    console.log("onPressActivate")
    var json = {
      settings: {
        ch1: this.state.channel1,
        ch2: this.state.channel2
      }
    }

    json = JSON.stringify(json)

    fetch(config.remote+'/device/settings', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.clientToken.token,
      },
      body: json
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
                  alert('Settings update successfully...')
                  this.setState({
                    isVisible: false,
                    updateOnce: false
                  })
                }else{
                  alert('Couldn\'t update. Try again...')
                  this.setState({
                    updateOnce: false
                  })
                }
              }
            })
            .catch((err)=>{
                console.log(err)
                alert('Couldn\'t update. Try again...')
                this.setState({
                  updateOnce: false
                })
            })
          },2000)
        }
      }
    })
    .catch((err)=>{
        console.log(err)
        alert('Couldn\'t update. Try again...')
    })
        
  }

  render() {
    return (
        <View style={styles.container}>
            <LoadingModal isVisible={this.state.isVisible} content='Activating Settings'/>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <LiveFeed updateStatus = {this.updateDeviceStatus}/>
                <View style={styles.timerSettingsList}>
                  <TimerDisplay 
                    key={1} 
                    channel={1} 
                    data={this.state.channel1}
                  />
                  <TimerDisplay 
                    key={2} 
                    channel={2}
                    data={this.state.channel2}
                  />
                </View>
                <AddNewTimerButton style={styles.addNewTimer} navigation={this.props.navigation} deviceOnline={this.state.deviceOnline}/>
                <TempGraph heading="Average Temp Per Hour" route="/device/avgTempDay" key={0} keyDup={0}/>
                <TempGraph heading="Maximum Temp Per Hour" route="/device/maxTempDay" key={1} keyDup={1}/>
                <TempGraph heading="Minimum Temp Per Hour" route="/device/minTempDay" key={2} keyDup={2}/>
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