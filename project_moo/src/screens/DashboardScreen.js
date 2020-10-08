import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, ScrollView} from 'react-native';
import {Button} from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import LiveFeed from '../components/LiveFeed';
import TempGraph from '../components/TempGraph'
import LogoutButton from '../components/LogoutButton'
import AddNewTimerButton from '../components/AddNewTimerButton';
import TimerDisplay from '../components/TimerDisplay'
import LoadingModal from '../components/LoadingModal'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getTimer } from '../actions/timerActions'
import { getTempHour } from '../actions/liveTempActions'

const WIDTH = Dimensions.get('window').width
var didFocusSubscription = ''
type Props = {};
var setIntervalObject
class DashboardScreen extends Component<Props> {
  constructor(props){
    super(props)
    this.state = {
      channel1: this.props.timer.ch1,
      channel2: this.props.timer.ch2,
      channel3: this.props.timer.ch3,
      channel4: this.props.timer.ch4,
      maxTemp: this.props.live.maxTemp,
      minTemp: this.props.live.minTemp,
      avgTemp: this.props.live.avgTemp,
      isVisible: false,
      clientToken: '',
      deviceOnline: false,
      value: '',
      updateOnce: false,
      initCheck: false
    }
    this.props.getTimer()
  }

  componentDidMount = ()=>{
    setIntervalObject = setInterval(()=>{
      this.props.getTempHour()
    }, 10000)
  }

  componentWillUnmount = ()=>{
    clearInterval(setIntervalObject)
  }

  UNSAFE_componentWillReceiveProps = next => {
    if(this.state.channel1.length != next.timer.ch1.length || 
      this.state.channel2.length != next.timer.ch2.length || 
      this.state.channel3.length != next.timer.ch3.length || 
      this.state.channel4.length != next.timer.ch4.length){
        this.setState({
          channel1: next.timer.ch1,
          channel2: next.timer.ch2,
          channel3: next.timer.ch3,
          channel4: next.timer.ch4,
        })
    }
    if( this.state.maxTemp.data.length != next.live.maxTemp.data.length || 
      this.state.minTemp.data.length != next.live.minTemp.data.length || 
      this.state.avgTemp.data.length != next.live.avgTemp.data.length){
        this.setState({
          maxTemp: next.live.maxTemp,
          minTemp: next.live.minTemp,
          avgTemp: next.live.avgTemp
        })
    } 
    if( next.live.deviceOnline == true && this.props.live.deviceOnline != true){
      this.props.getTimer()
    }
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
                  <TimerDisplay 
                    key={3} 
                    channel={3}
                    data={this.state.channel3}
                  />
                  <TimerDisplay 
                    key={4} 
                    channel={4}
                    data={this.state.channel4}
                  />
                </View>
                <AddNewTimerButton style={styles.addNewTimer} navigation={this.props.navigation} />
                <TempGraph heading="Today's average temperature °C/h" data={this.state.avgTemp} route="/device/avgTempDay" key={0} keyDup={0}/>
                <TempGraph heading="Today's maximum temperature °C/h" data={this.state.maxTemp} route="/device/maxTempDay" key={1} keyDup={1}/>
                <TempGraph heading="Today's minimum temperature °C/h" data={this.state.minTemp} route="/device/minTempDay" key={2} keyDup={2}/>
                <LogoutButton style={styles.logout} navigation={this.props.navigation}/>
            </ScrollView>
        </View>
    );
  }
}

DashboardScreen.propTypes = {
  getTimer: PropTypes.func.isRequired,
  timer: PropTypes.object.isRequired,
  live: PropTypes.object.isRequired,
  getTempHour: PropTypes.func.isRequired,
}

mapStateToProps = state => ({
  timer: state.timer,
  live: state.live
})

export default connect(mapStateToProps, { getTimer, getTempHour })(DashboardScreen)

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