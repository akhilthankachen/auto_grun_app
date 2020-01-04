import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, TextInput, Alert, Modal, TouchableHighlight } from 'react-native';
import SaveAndActivate from './components/SaveAndActivate'
import Close from './components/Close'
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import AddTimeAndDurationButton from './components/AddTimeAndDurationButton'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Icon } from 'react-native-elements'
import TimeAndDurationBox from './components/TimeAndDurationBox';
import AsyncStorage from '@react-native-community/async-storage';
import LoadingModal from './components/LoadingModal'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

var radio_props = [
    {label: 'Channel 1  ', value: 1 },
    {label: 'Channel 2  ', value: 2 }
];

export default class AddTimerScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        isVisible: false,
        modalVisible: false,
        channel: 1,
        hour: '-- ',
        minutes: ' --',
        duration: '',
        timeDuration: [],
        data: {},
        fetchVisible: true
    };

    this.getData(this.fetchOff)
  }

  fetchOff = ()=>{
      this.setState({
          fetchVisible: false
      })
  }

  getData = async (callback)=>{
    try{
      const value = await AsyncStorage.getItem('@timerSettings')
      if(value != null){
        var json = JSON.parse(value)
        this.setState({
            data: json
        })
        if(this.state.channel == 1){
          this.setState({
            timeDuration: json.ch1
          })
        }else{
          this.setState({
            timeDuration: json.ch2
          })
        }
      }
      callback()
    }catch(e){
      console.log(e)
    }
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
    if(this.state.timeDuration.length == 6){
        alert('Maximum settings reached...')
    }else{
        if(this.state.hour != '-- ' && this.state.duration != ''){
            var interArray = this.state.timeDuration
            var json = {"h": this.state.hour,
                        "m": this.state.minutes,
                        "d": parseInt(this.state.duration) }
            interArray.push(json)
            this.setState({
                timeDuration: interArray,
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
    return this.state.timeDuration.slice(0).reverse().map((item, index) => {
        return (
            <TimeAndDurationBox key={index} index={index} hour={item.h} minutes={item.m} duration={item.d} active={true} onPress={this.onPressDelete}/>
        );
    });
  }

  renderTimerListBuffer = ()=>{
    let len = this.state.timeDuration.length
    let list = []
    for( var i = len; i<6; i++){
        list.push(<TimeAndDurationBox key={i} index={i} hour=" ---" minutes="---" duration="---" active={false}/>)
    }
    return list
  }

  scrollToPos = (pos) => {
    this.scroller.scrollTo({x: 0, y: pos});
  };

  setTimerData = async () => {
    try {
      const value = await AsyncStorage.getItem('@timerSettings')
      if(value !== null) {
        var json = JSON.parse(value)
        if(this.state.channel == 1){
            json.ch1 = this.state.timeDuration
        }else if(this.state.channel == 2){
            json.ch2 = this.state.timeDuration
        }
        json = JSON.stringify(json)
        await AsyncStorage.setItem('@timerSettings', json)
        this.setModalVisible(false)
        this.props.navigation.navigate('dashboard')
      }else{
        try {
            var json = {"ch1": [],"ch2": []}
            if(this.state.channel == 1){
                json.ch1 = this.state.timeDuration
            }else if(this.state.channel == 2){
                json.ch2 = this.state.timeDuration
            }
            json = JSON.stringify(json)
            await AsyncStorage.setItem('@timerSettings', json)
            this.setModalVisible(false)
            this.props.navigation.navigate('dashboard')
        } catch (e) {
            console.log(e)
        }
      }
    } catch(e) {
      console.log(e)
    }
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
                timeDuration: this.state.data.ch1
            })
        }else{
            this.setState({
                channel: value,
                timeDuration: []
            })
        }
    }else{
        if(this.state.data.ch2){
            this.setState({
                channel: value,
                timeDuration: this.state.data.ch2
            })
        }else{
            this.setState({
                channel: value,
                timeDuration: []
            })
        }
    }
  }

  render() {
    return (
      <View style={styles.container}>

        <LoadingModal content='Saving and updating settings.' isVisible={this.state.modalVisible}/>
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
                    Edit Timer Settings
                </Text>
            </View>
            <View style={styles.channelBox}>
                <Text style={styles.channeltext}>Select Channel</Text>
                <View>
                    <RadioForm
                        radio_props={radio_props}
                        formHorizontal={true}
                        initial={0}
                        buttonColor={'rgb(238, 179, 158)'}
                        selectedButtonColor={'rgb(238, 179, 158)'}
                        onPress={(value)=>{this.toggleChannel(value)}}
                    />
                </View>
            </View>
            <View style={styles.addTimeBox}>
                <View style={styles.pickTimeBox}>
                    <View style={styles.timeBoxInner}>
                        <Text style={styles.timeText}>Time  :  </Text>
                        <Text style={styles.timeText}>{this.state.hour}:{this.state.minutes}</Text>
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
            </View>
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
    addTimeBox: {
        marginTop: 30,
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