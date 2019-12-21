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
      activeIndexChannel1: -1,
      activeIndexChannel2: -1,
    }
  }

  getData = async ()=>{
    try {
      const value = await AsyncStorage.getItem('@timerSettings')
      if(value !== null) {
        var json = JSON.parse(value)
        this.setState({
          channel1: json.channel1,
          channel2: json.channel2,
        })
        this.forceUpdate()
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

  onPressDeleteSettings = ()=>{
    this.getData()
  }

  onPressActivateSettings = (index, channel, callback)=>{
    if(channel == 1){
      if(this.state.activeIndexChannel2 == -1){
        var settings = {
          channel1: this.state.channel1[activeIndexChannel1],
          channel2: []
        }
      }else{
        var settings = {
          channel1: this.state.channel1[activeIndexChannel1],
          channel2: this.state.channel2[activeIndexChannel2]
        }
      }
      fetch(config.remote+'/device/lastTemp', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': this.state.clientToken.token,
        },
        body: settings
      },)  
      .then((response) => {
          if(response.status == 200){
              return response.json()
          }
      })
      .then((responseJSON)=>{
        if(responseJSON != null){
          console.log(responseJSON)
        }
      })
      .catch((err)=>{
          console.log(err)
      })
      this.setState({
        activeIndexChannel1: index
      })
    }else{
      this.setState({
        activeIndexChannel2: index
      })
    }
  }

  renderTimerListChannel1 = ()=>{
    return  this.state.channel1.map((item,index)=>{
      var isActive = false
      if(this.state.activeIndexChannel1 == index){
        isActive = true
      }
      return <TimerDisplay 
                key={index+1} 
                keyDup={index+1} 
                index={index} 
                channel={1} 
                onPressDelete={this.onPressDeleteSettings}
                onPressActivate={this.onPressActivateSettings}
                isActive={isActive}
            />
    })
  }
  renderTimerListChannel2 = ()=>{
    return  this.state.channel2.map((item,index)=>{
      var isActive = false
      if(this.state.activeIndexChannel2 == index){
        isActive = true
      }
      return <TimerDisplay 
                key={this.state.channel1.length+index+1} 
                keyDup={this.state.channel1.length+index+1} 
                index={index} 
                channel={2} 
                onPressDelete={this.onPressDeleteSettings}
                onPressActivate={this.onPressActivateSettings}
                isActive={isActive}
            />
    })
  }

  render() {
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <LiveFeed/>
                <TempGraph heading="Average Temp Per Hour"/>
                <TempGraph heading="Maximum Temp Per Hour"/>
                <TempGraph heading="Minimum Temp Per Hour"/>
                <View style={styles.timerSettingsList}>
                  {this.renderTimerListChannel1()}
                  {this.renderTimerListChannel2()}
                </View>
                <AddNewTimerButton style={styles.addNewTimer} navigation={this.props.navigation}/>
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