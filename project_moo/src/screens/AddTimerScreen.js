import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, TextInput, Picker, Modal, TouchableHighlight } from 'react-native';
import SaveAndActivate from '../components/SaveAndActivate'
import Close from '../components/Close'
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import AddTimeAndDurationButton from '../components/AddTimeAndDurationButton'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Icon } from 'react-native-elements'
import TimeAndDurationBox from '../components/TimeAndDurationBox';
import AsyncStorage from '@react-native-community/async-storage';
import LoadingModal from '../components/LoadingModal'
import config from '../../config'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { putTimer } from '../actions/timerActions'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

var radio_props = [
    {label: 'Ch1  ', value: 1 },
    {label: 'Ch2  ', value: 2 },
    {label: 'Ch3  ', value: 3 },
    {label: 'Ch4  ', value: 4 }
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
        duration: '',
        timeDuration: this.props.timer.ch1,
        data: this.props.timer,
        fetchVisible: false,
        clientToken: '',
        showTimeDuration: true
    };

  }

  UNSAFE_componentWillReceiveProps = next => {
    this.setState({
      data: next.timer
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
                            "d": parseInt(this.state.duration)*60 }
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
                        "d": parseInt(this.state.duration)*60 }
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
                <TimeAndDurationBox key={index} index={index} hour={item.h} minutes={item.m} duration={item.d/60} active={true} onPress={this.onPressDelete}/>
            );
        });
    }
  }

  renderTimerListBuffer = ()=>{
    if(this.state.timeDuration != undefined){
        var len = this.state.timeDuration.length
    }else{
        var len = 0
    }
    let list = []
    for( var i = len; i<6; i++){
        list.push(<TimeAndDurationBox key={i} index={i} hour=" ---" minutes="---" duration="---" active={false}/>)
    }

    if( this.state.channel == 1 || this.state.channel == 4 ){
      return list
    }
    
  }

  renderChannelOneNotice = ()=>{
    if( this.state.channel == 1 ){
      return (
        <View><Text style={styles.noticeText}>Channel one only supports even settings upto 6</Text></View>
      )
    }
  }

  scrollToPos = (pos) => {
    this.scroller.scrollTo({x: 0, y: pos});
  };

  setTimerData = () => {
    // data manupulation for specific app
    var data = this.state.data
    var len = data.ch1.length
    var ch1 = this.state.data.ch1
    var interArray2 = []
    var interArray3 = []
    for ( var i = 0; i<len; i++ ){
      var json = {}
      var jsonAdd = {}
      if(i%2 == 0){
        json = ch1[i]
        jsonAdd.h = json.h
        jsonAdd.m = json.m
        jsonAdd.d = json.d * (parseInt(data.ch2p)/100)
        if(jsonAdd.d != 0){
          interArray2.push(jsonAdd)
        }
      }else{
        json = ch1[i]
        jsonAdd.h = json.h
        jsonAdd.m = json.m
        jsonAdd.d = json.d * (parseInt(data.ch3p)/100)
        if(jsonAdd.d != 0){
          interArray3.push(jsonAdd)
        }
      }
    }
    data.ch2 = interArray2
    data.ch3 = interArray3
    var tempM = []
    tempM[0] = data.m[0]
    tempM[1] = data.m[0]
    tempM[2] = data.m[0]
    tempM[3] = data.m[3]
    data.m = tempM

    this.props.putTimer(data, ()=>{
      this.setModalVisible(false)
      this.props.navigation.navigate('dashboard')
    })
  }


  saveActivateExit = ()=>{
    if( this.state.data.ch1.length % 2 == 0){
      this.setModalVisible(true)
      this.setTimerData()
    }else{
      alert("Channel one only supports even settings upto 6 ...")
    }

  }

  toggleChannel = (value)=>{
    if(value == 1){
      if(this.state.data.ch1){
        this.setState({
            channel: value,
            timeDuration: this.state.data.ch1,
            showTimeDuration: true
        })
      }else{
        this.setState({
            channel: value,
            timeDuration: [],
            showTimeDuration: true
        })
      }
    }else if(value == 2){
      if(this.state.data.ch2){
        this.setState({
            channel: value,
            timeDuration: [],
            percent: this.state.data.ch2p,
            showTimeDuration: false
        })
      }else{
        this.setState({
            channel: value,
            timeDuration: [],
            percent: this.state.data.ch2p,
            showTimeDuration: false
        })
      }
    }else if(value == 3){
      if(this.state.data.ch3){
        this.setState({
            channel: value,
            timeDuration: [],
            percent: this.state.data.ch3p,
            showTimeDuration: false
        })
      }else{
        this.setState({
            channel: value,
            timeDuration: [],
            percent: this.state.data.ch3p,
            showTimeDuration: false,
        })
      }
    }else if(value == 4){
      if(this.state.data.ch4){
        this.setState({
            channel: value,
            timeDuration: this.state.data.ch4,
            showTimeDuration: true
        })
      }else{
        this.setState({
            channel: value,
            timeDuration: [],
            showTimeDuration: true
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

            { this.state.showTimeDuration && 
            <View style={styles.modeBox}>
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
                <Picker.Item label="Mo-Tu-We-Th-Fr" value="1" />
                <Picker.Item label="Mo-We-Fr-Su" value="2" />
                <Picker.Item label="Mo-Th-Su" value="3" />
                <Picker.Item label="Sa-Su" value="4" />
              </Picker>
              </View>} 
            { this.state.showTimeDuration &&
            <View style={styles.addTimeBox}>
                <View style={styles.pickTimeBox}>
                    <View style={styles.timeBoxInner}>
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
                    </View>
                    <View style={styles.durationBox}>
                        <Text style={styles.durationText}>Duration  :  </Text>
                        <TextInput
                            style={styles.durationInput}
                            onChangeText={(text) => this.setState({duration: text})}
                            value={this.state.duration}
                            placeholder={'0'}
                            onFocus={() => {
                                
                                this.scrollToPos(20)
                            }}
                            keyboardType='numeric'
                        />
                        <Text style={styles.durationText}>  Minutes</Text>
                    </View>
                </View>
                <View>
                    <AddTimeAndDurationButton style={{marginTop: 15}} onPress={this.addTimeAndDuration}/>
                </View>
            </View>}

            { !this.state.showTimeDuration && 
              <View style={styles.percentBox}>
                    <Text style={styles.durationText}>Percent  :  </Text>
                    <TextInput
                        style={styles.durationInput}
                        onChangeText={(text) => {
                          var data = this.state.data
                          if( this.state.channel == 2){
                            data.ch2p = text
                          }else if( this.state.channel == 3){
                            data.ch3p = text
                          }
                          this.setState({
                            percent: text,
                            data: data
                          })
                        }}
                        value={this.state.percent}
                        placeholder={'0'}
                        onFocus={() => {
                            
                            this.scrollToPos(20)
                        }}
                        keyboardType='numeric'
                    />
                    <Text style={styles.durationText}>  %</Text>

              </View>
            }

            {this.renderChannelOneNotice()}
            
            <View style={{marginTop: 10}}>
                {this.renderTimeList()}
                {this.renderTimerListBuffer()}
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
    noticeText: {
      fontSize: 15,
      fontFamily: 'sans-serif-condensed',
      marginBottom: 2,
      marginTop: 10,
      color: "orange"
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
    percentBox: {
      marginTop: 30,
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