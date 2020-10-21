import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, TextInput, Picker, Modal, TouchableHighlight } from 'react-native';
import SaveAndActivate from './components/SaveAndActivate'
import Close from './components/Close'
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import AddTimeAndDurationButton from './components/AddTimeAndDurationButton'
import { Icon } from 'react-native-elements'
import TimeAndDurationBox from './components/TimeAndDurationBox';
import AsyncStorage from '@react-native-community/async-storage';
import LoadingModal from './components/LoadingModal'
import config from '../config'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { putTimer } from './actions/timerActions'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

var radio_props = [
    {label: 'Ch1  ', value: 1 },
    {label: 'Ch2  ', value: 2 },
    {label: 'Ch3  ', value: 3 },
];

class AddTimerScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        isVisible: false,
        modalVisible: false,
        channel: 1,
        hour: '-- ',
        minutes: ' --',
        duration: this.props.timer.ch1.duration ? this.props.timer.ch1.duration.toString() : '0',
        up: this.props.timer.ch1.up ? this.props.timer.ch1.up.toString() : '0',
        lp: this.props.timer.ch1.lp ? this.props.timer.ch1.lp.toString() : '0',
        data: this.props.timer,
        fetchVisible: false,
        clientToken: '',
        durationToggle: false,
    };
  }

  UNSAFE_componentWillReceiveProps = next => {
    this.setState({
      data: next.timer,
    })
  }

  fetchOff = (val)=>{
      this.setState({
          fetchVisible: val
      })
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  setTime = (event, date)=>{
    if(date != undefined){
        this.setState({
            hour: date.getHours(),
            minutes: date.getMinutes()
        })
    }
    if(event.type == 'set'){
        this.setState({
            isVisible: false
        })
    }
  }

  addTimeAndDuration = () =>{
    if(this.state.timeDuration != undefined){
        if( this.state.timeDuration.length == 6 ){
            alert('Maximum settings reached...')
        }else{
            if(this.state.hour != '-- ' && this.state.duration != ''){
                var interArray = this.state.timeDuration
                var json = {"h": this.state.hour,
                            "m": this.state.minutes,
                            "d": parseInt(this.state.duration) }
                interArray.push(json)
                let tempData = this.state.data
                if(this.state.channel == 1){
                  tempData.ch1 = interArray
                }else if(this.state.channel == 2){
                  tempData.ch2 = interArray
                }else if(this.state.channel == 3){
                  tempData.ch3 = interArray
                }else if(this.state.channel == 4){
                  tempData.ch4 = interArray
                }
                this.setState({
                    timeDuration: interArray,
                    data: tempData,
                    hour: '-- ',
                    minutes: ' --',
                    duration: '',
                })

            }else{
                alert('Time or Duration Empty...')
            }
        }
    }else{
        if(this.state.hour != '-- ' && this.state.duration != ''){
            var interArray = []
            var json = {"h": this.state.hour,
                        "m": this.state.minutes,
                        "d": parseInt(this.state.duration) }
            interArray.push(json)
            var tempData = this.state.data
            if(this.state.channel == 1){
              tempData.ch1 = interArray
            }else if(this.state.channel == 2){
              tempData.ch2 = interArray
            }else if(this.state.channel == 3){
              tempData.ch3 = interArray
            }else if(this.state.channel == 4){
              tempData.ch4 = interArray
            }
            this.setState({
                timeDuration: interArray,
                data: tempData,
                hour: '-- ',
                minutes: ' --',
                duration: ''
            })
        }else{
            alert('Time or Duration Empty...')
        }
    }
  }

  onPressDelete = (index)=>{
      let temp = this.state.timeDuration
      temp.splice(index, 1)
      this.setState({
          timeDuration: temp
      })
  }

  renderTimeList = ()=>{
    if(this.state.timeDuration != undefined){
        return this.state.timeDuration.slice(0).map((item, index) => {
            return (
                <TimeAndDurationBox key={index} index={index} hour={item.h} minutes={item.m} duration={item.d} active={true} onPress={this.onPressDelete}/>
            );
        });
    }
  }

/*   renderTimerListBuffer = ()=>{
    if(this.state.timeDuration != undefined){
        var len = this.state.timeDuration.length
    }else{
        var len = 0
    }
    let list = []
    for( var i = len; i<6; i++){
        list.push(<TimeAndDurationBox key={i} index={i} hour=" ---" minutes="---" duration="---" active={false}/>)
    }
    return list
  } */

  scrollToPos = (pos) => {
    this.scroller.scrollTo({x: 0, y: pos});
  };

  setTimerData = () => {
    this.props.putTimer(this.state.data, ()=>{
      this.setModalVisible(false)
      this.props.navigation.navigate('dashboard')
    })
  }


  saveActivateExit = ()=>{
    this.setModalVisible(true)
    this.setTimerData()
  }

  toggleChannel = (value)=>{
    if(value == 1){
      if(this.state.data.ch1){
        this.setState({
            channel: value,
            up: this.state.data.ch1.up ? this.props.timer.ch1.up.toString() : '0',
            lp: this.state.data.ch1.lp ? this.props.timer.ch1.lp.toString() : '0',
            duration: this.state.data.ch1.duration ? this.props.timer.ch1.duration.toString() : '0',
            durationToggle: false,
        })
      }
    }else if(value == 2){
      if(this.state.data.ch2){
        this.setState({
            channel: value,
            up: this.state.data.ch2.up ? this.props.timer.ch2.up.toString() : '0',
            lp: this.state.data.ch2.lp ? this.props.timer.ch2.lp.toString() : '0',
            duration: this.state.data.ch2.duration ? this.props.timer.ch2.duration.toString() : '0',
            durationToggle: false,
        })
      }
    }else if(value == 3){
      if(this.state.data.ch3){
        this.setState({
            channel: value,
            up: this.state.data.ch3.up ? this.props.timer.ch3.up.toString() : '0',
            lp: this.state.data.ch3.lp ? this.props.timer.ch3.lp.toString() : '0',
            duration: this.state.data.ch3.duration ? this.props.timer.ch3.duration.toString() : '0',
            durationToggle: true,
        })
      }
    }else if(value == 4){
      if(this.state.data.ch4){
        this.setState({
            channel: value,
            up: this.state.data.ch3.up ? this.props.timer.ch4.up.toString() : '0',
            lp: this.state.data.ch3.lp ? this.props.timer.ch4.lp.toString() : '0',
            duration: this.state.data.ch3.duration ? this.props.timer.ch4.duration.toString() : '0',
            durationToggle: false,
        })
      }
    }
  }

  displayTime = (time)=>{
    if(time == 0){
      return "00"
    }else{
      if(time / 10 < 1){
        return "0" + time
      }
      return time
    }
  }

  setUp = (text) => {
    let interData = this.state.data
    if(this.state.channel == 1){
      interData.ch1.up = parseInt(text)
    }else if(this.state.channel == 2){
      interData.ch2.up = parseInt(text)
    }else if(this.state.channel == 3){
      interData.ch3.up = parseInt(text)
    }
    this.setState({
      up: text,
      data: interData
    })
  }

  setLp = (text) => {
    let interData = this.state.data
    if(this.state.channel == 1){
      interData.ch1.lp = parseInt(text)
    }else if(this.state.channel == 2){
      interData.ch2.lp = parseInt(text)
    }else if(this.state.channel == 3){
      interData.ch3.lp = parseInt(text)
    }
    this.setState({
      lp: text,
      data: interData
    })
  }

  setDuration = (text) => {
    let interData = this.state.data
    if(this.state.channel == 1){
      interData.ch1.duration = parseInt(text)
    }else if(this.state.channel == 2){
      interData.ch2.duration = parseInt(text)
    }else if(this.state.channel == 3){
      interData.ch3.duration = parseInt(text)
    }
    this.setState({
      duration: text,
      data: interData
    })
  }

  render() {
      const pickerStyle = {
        inputIOS: {
          color: 'white',
          paddingTop: 13,
          paddingHorizontal: 10,
          paddingBottom: 12,
        },
        inputAndroid: {
          color: 'white',
        },
        placeholderColor: 'white',
        underline: { borderTopWidth: 0 },
        icon: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 5,
          borderTopColor: '#00000099',
          borderRightWidth: 5,
          borderRightColor: 'transparent',
          borderLeftWidth: 5,
          borderLeftColor: 'transparent',
          width: 0,
          height: 0,
          top: 20,
          right: 15,
        },
      };
    return (
      <View style={styles.container}>
        <LoadingModal content='Saving and activating settings.' isVisible={this.state.modalVisible}/>
        <LoadingModal content='Fetching data...' isVisible={this.state.fetchVisible}/>

        { this.state.isVisible && <DateTimePicker value={new Date()}
            mode={'time'}
            is24Hour={true}
            display="spinner"
            onChange={this.setTime}/> }

        <ScrollView 
        style={styles.main}
        contentContainerStyle={{alignItems:'center',height:HEIGHT}}
        ref={(scroller) => {this.scroller = scroller}}>
            <View style={styles.headingBox}>
                <Text style={styles.heading}>
                    Edit Irrigation Timer Settings
                </Text>
            </View>
            <View style={styles.channelBox}>
                <Text style={styles.channeltext}>Select Channel</Text>
                <View>
                    <RadioForm
                        radio_props={radio_props}
                        formHorizontal={true}
                        initial={0}
                        buttonColor={'#027368'}
                        selectedButtonColor={'#027368'}
                        onPress={(value)=>{this.toggleChannel(value)}}
                    />
                </View>
            </View>
            <View style={{display: 'none'}}>
              <Text style={styles.modeText}>Mode : </Text>
              <Picker
                selectedValue={this.state.data.m[(this.state.channel)-1].toString()}
                style={styles.modePicker}
                itemStyle={{ backgroundColor: "grey", color: "blue", fontFamily:"Ebrima", fontSize:17 }}
                onValueChange={(itemValue, itemIndex) =>{
                  let tempData = this.state.data
                  tempData.m[this.state.channel-1] = itemIndex
                  this.setState({
                    data: tempData
                  })
                }
                }>
                <Picker.Item label="All Days" value="0" />
                <Picker.Item label="Weekday" value="1" />
                <Picker.Item label="Skip One" value="2" />
                <Picker.Item label="Skip Two" value="3" />
                <Picker.Item label="Weekend" value="4" />
              </Picker>
            </View>
            <View style={styles.addTimeBox}>
                <View style={styles.pickTimeBox}>
{/*                     <View style={styles.timeBoxInner}>
                        <Text style={styles.timeText}>Time  :  </Text>
                        <Text style={styles.timeText}>{this.displayTime(this.state.hour)}:{this.displayTime(this.state.minutes)}</Text>
                        <TouchableOpacity style={styles.timePicker} onPress={()=>{this.setState({isVisible: !this.state.isVisible})}}>
                            <Icon 
                                name = 'access-time'
                                type = 'material'
                                color = 'rgb(10, 79, 0)'
                                size = {20}
                            />
                        </TouchableOpacity>
                    </View> */}
                    <View style={styles.durationBoxOne}>
                        <Text style={styles.durationText}>Upper Temp  :  </Text>
                        <TextInput
                            style={styles.durationInput}
                            onChangeText={(text) => {this.setUp(text)}}
                            value={this.state.up}
                            onFocus={() => {
                                
                                this.scrollToPos(20)
                            }}
                            keyboardType='numeric'
                        />
                        <Text style={styles.durationText}>  °C</Text>
                    </View>
                    <View style={styles.durationBox}>
                        <Text style={styles.durationText}>Lower Temp  :  </Text>
                        <TextInput
                            style={styles.durationInput}
                            onChangeText={(text) => {this.setLp(text)}}
                            value={this.state.lp}
                            onFocus={() => {
                                
                                this.scrollToPos(20)
                            }}
                            keyboardType='numeric'
                        />
                        <Text style={styles.durationText}>  °C</Text>
                    </View>
                    {
                      this.state.durationToggle &&
                      <View style={[styles.durationBox, {marginLeft: 38}]}>
                          <Text style={styles.durationText}>Duration         :  </Text>
                          <TextInput
                              style={styles.durationInput}
                              onChangeText={(text) => {this.setDuration(text)}}
                              value={this.state.duration}
                              onFocus={() => {
                                  
                                  this.scrollToPos(20)
                              }}
                              keyboardType='numeric'
                          />
                          <Text style={styles.durationText}>  seconds</Text>
                      </View>
                    }

                </View>
                <View>
                    {/* <AddTimeAndDurationButton style={{marginTop: 15}} onPress={this.addTimeAndDuration}/> */}
                </View>
            </View>
            <View style={{marginTop: 10}}>
                {/* this.renderTimeList() */}
                {/* {this.renderTimerListBuffer()} */}
            </View>
        </ScrollView>

        <View style={styles.bottom}>
            <View>
                <Close navigation={this.props.navigation}/>
            </View>
            <View>
                <SaveAndActivate style={styles.saveAndActivate} onPress={this.saveActivateExit}/> 
            </View>                   
        </View>

      </View>
    );
  }
}

AddTimerScreen.propTypes = {
  timer: PropTypes.object.isRequired,
  putTimer: PropTypes.func.isRequired
}

mapStateToProps = state => ({
  timer: state.timer
})

export default connect(mapStateToProps,{ putTimer })(AddTimerScreen) 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(232, 232, 232)',
        alignItems: 'center'
    },
    bottom: {
        position: 'absolute',
        bottom: 15,
        flexDirection: 'row'
    },
    saveAndActivate: {
        paddingLeft: 12,
    },
    main: {
        width: WIDTH - 30,
        backgroundColor: 'white',
        borderRadius: 5,
        marginTop: 15,
        marginBottom: 88
    },
    headingBox: {
        marginTop: 30
    },
    heading: {
        fontFamily: 'sans-serif-medium',
        fontSize: 20
    },
    channelBox: {
        marginTop: 40,
        alignItems: 'center'
    },
    channeltext: {
        fontSize: 15,
        fontFamily: 'sans-serif-condensed',
        marginBottom: 10
    },
    modeBox: {
      alignItems: 'center',
      flexDirection: 'row',
      marginTop: 10
    },
    modeText: {
      fontSize: 15,
      fontFamily: 'sans-serif-condensed',
      marginBottom: 2,
      marginRight: 10
    },
    modePicker: {
      height: 50,
      width: 140,
      backfaceVisibility: 'visible',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: 'black',
    },
    addTimeBox: {
        marginTop: 15,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    pickTimeBox: {
        alignItems: 'center'
    },
    timeBoxInner: {
        flexDirection: 'row'
    },
    timePicker: {
        marginLeft: 10
    },
    durationBox: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    durationBoxOne: {
      marginTop: 50,
      flexDirection: 'row',
      alignItems: 'center'
  },
    durationInput: {
        borderWidth:1,
        borderColor: 'black',
        height: 40,
        fontSize: 15,
        width:50,
        borderRadius: 5,
        textAlign: 'center'
    },
    savingModal: {
    }
    
});