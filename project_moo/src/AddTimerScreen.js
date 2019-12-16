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
        timeDuration: []
    };
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
      if(this.state.hour != '-- ' && this.state.duration != ''){
        var interArray = this.state.timeDuration
        var json = {"hour": this.state.hour,
                    "minutes": this.state.minutes,
                    "duration": this.state.duration }
        interArray.push(json)
        this.setState({
            timeDuration: interArray,
            hour: '-- ',
            minutes: ' --',
            duration: ''
        })
      }else{
          alert('Time or Duration Empty')
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
            <TimeAndDurationBox key={index} index={index} hour={item.hour} minutes={item.minutes} duration={item.duration} onPress={this.onPressDelete}/>
        );
    });
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
            json.channel1.push(this.state.timeDuration)
        }else if(this.state.channel == 2){
            json.channel2.push(this.state.timeDuration)
        }
        json = JSON.stringify(json)
        await AsyncStorage.setItem('@timerSettings', json)
        this.setModalVisible(false)
        this.props.navigation.navigate('dashboard')
      }else{
        try {
            var json = {"channel1": [],"channel2": []}
            if(this.state.channel == 1){
                json.channel1.push(this.state.timeDuration)
            }else if(this.state.channel == 2){
                json.channel2.push(this.state.timeDuration)
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
    if (Array.isArray(this.state.timeDuration) && this.state.timeDuration.length){
        this.setModalVisible(true)
        this.setTimerData()
    }else{
        Alert.alert(
            'Empty Timer',
            'Add some schedules !',
            [
                {text: 'OK', onPress: () => {
                  
                }},
            ],
            {cancelable: false},
        );
    }         
  }

  render() {
    return (
      <View style={styles.container}>
        
        <LoadingModal content='Saving and activating settings.' isVisible={this.state.modalVisible}/>

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
                    Add New Timer Settings
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
                        onPress={(value) => {this.setState({channel:value})}}
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