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

const WIDTH = Dimensions.get('window').width
type Props = {};
export default class DashboardScreen extends Component<Props> {
  constructor(props){
    super(props)
    this.getData()
    this.state = {
      channel1: [],
      channel2: [],
      isVisible: false,
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
      }else{
        console.log('no value')
      }
    } catch(e) {
      console.log(e)
    } 
  }

  componentDidMount = ()=>{
    const didFocusSubscription = this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.getData()
        this.forceUpdate()
      }
    );
  }


  onPressDeleteSettings = ()=>{
    this.getData()
  }

  renderTimerListChannel1 = ()=>{
    return  this.state.channel1.map((item,index)=>{
      return <TimerDisplay key={index+1} keyDup={index+1} index={index} channel={1} onPressDelete={this.onPressDeleteSettings}/>
    })
  }
  renderTimerListChannel2 = ()=>{
    return  this.state.channel2.map((item,index)=>{
      return <TimerDisplay key={this.state.channel1.length+index+1} keyDup={this.state.channel1.length+index+1} index={index} channel={2} onPressDelete={this.onPressDeleteSettings}/>
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