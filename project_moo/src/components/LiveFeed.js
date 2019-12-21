import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import config from '../../config'
import dateFormat from 'dateformat'
import AsyncStorage from '@react-native-community/async-storage';



const WIDTH = Dimensions.get('window').width
type Props = {};
var setIntervalObject;
export default class LiveFeed extends Component<Props> {
    constructor(props){
        super(props)
        this.state = {
            liveTemp: '',
            lastUpdated: ''
        }
    }
    getMyValue = async () => {
        try {
            const value = await AsyncStorage.getItem('@lastTemp')
            if(value != null){
              let tempJson = JSON.parse(value)
              let date = new Date(tempJson.dateTime)
              let dateFormated = dateFormat(date, "mmmm dS, yyyy, h:MM:ss TT")
              this.setState({
                liveTemp: tempJson.message,
                lastUpdated: dateFormated
              })
            }
        } catch(e) {
            // do nothing
        }
    }  

    componentDidMount = () => {
        this.getMyValue()

        setIntervalObject = setInterval(()=>{
            fetch(config.remote+'/device/lastTemp', {
                method: 'GET',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + this.state.clientToken,
                }
            },)  
            .then((response) => {
                if(response.status == 200){
                    return response.json()
                }
            })
            .then((responseJSON)=>{
              if(responseJSON != null){
                let date = new Date(responseJSON.dateTime)
                let dateFormated = dateFormat(date, "mmmm dS, yyyy, h:MM:ss TT")
                this.setState({
                    liveTemp: responseJSON.message,
                    lastUpdated: dateFormated
                })
                AsyncStorage.setItem('@lastTemp', JSON.stringify(responseJSON))
              }
            })
            .catch((err)=>{
                console.log(err)
            })
        }, 5000)
    }

    componentWillUnmount = ()=>{
      clearInterval(setIntervalObject)
    }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.box}>
            <View style={styles.liveFeed}>
                <Text style={styles.liveFeedText}>
                    Live Feed
                </Text>
            </View>
            <View style={styles.liveTemp}>
                <Text style={styles.liveTempText}>
                    {this.state.liveTemp}°C
                </Text>
            </View>
            <View style={styles.lastSync}>
                <Text style={styles.lastSyncText}>Last Updated</Text>
                <Text style={styles.lastSyncText}>{this.state.lastUpdated}</Text>
            </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logout: {
    position: 'absolute',
    bottom: 15,
    right: 15
  },
  box: {
    backgroundColor: 'white',
    width: WIDTH - 30,
    height: 300,
    marginTop: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  liveFeed: {
    marginTop: 30
  },  
  liveFeedText: {
    fontFamily: 'sans-serif-medium',
    fontSize: 20,
    color: 'black'
  },
  liveTempText: {
    fontSize: 70,
    fontFamily: 'sans-serif-medium',
    color: '#1B4859',
  },
  lastSync: {
    marginBottom: 30
  },
  lastSyncText: {
    textAlign: 'center',
    fontFamily: 'sans-serif-light',
    fontStyle: 'italic'
  }
});