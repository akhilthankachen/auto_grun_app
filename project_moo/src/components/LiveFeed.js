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
            fetch(config.remote+'/cowfarm/lastTemp', {
                method: 'GET'
            })  
            .then((response) => {
                if(response.status == 200){
                    return response.json()
                }
            })
            .then((responseJSON)=>{
                let date = new Date(responseJSON.dateTime)
                let dateFormated = dateFormat(date, "mmmm dS, yyyy, h:MM:ss TT")
                this.setState({
                    liveTemp: responseJSON.message,
                    lastUpdated: dateFormated
                })
                AsyncStorage.setItem('@lastTemp', JSON.stringify(responseJSON))
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
                <Text>{this.state.lastUpdated}</Text>
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
    justifyContent: 'center'
  },
  liveFeed: {
    position: 'absolute',
    top: 30
  },
  liveFeedText: {
    fontFamily: 'sans-serif-medium',
    fontSize: 22,
    color: 'rgb(27, 16, 13)'
  },
  liveTemp: {
    alignSelf: 'center'
  },
  liveTempText: {
    fontSize: 70,
    color: 'rgb(195, 56, 73)',
    marginTop: 10
  },
  lastSync: {
    textAlign: 'center',
    position: 'absolute',
    bottom: 30
  },
  lastSyncText: {
    textAlign: 'center'
  }
});