import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import config from '../../config'
import dateFormat from 'dateformat'
import AsyncStorage from '@react-native-community/async-storage';



const WIDTH = Dimensions.get('window').width
type Props = {};
var setIntervalObject;
var setIntervalObjectPing;
export default class LiveFeed extends Component<Props> {
    constructor(props){
        super(props)
        this.state = {
            liveTemp: '',
            lastUpdated: '',
            clientToken: '',
            deviceOnline: null,
            networkOnline: true,
        }
        this.getToken()
    }
    getToken = async () => {
      try {
          const value = await AsyncStorage.getItem('@token')
          if(value != null){
            this.setState({
              clientToken: JSON.parse(value)
            })
          }
      } catch(e) {
          // do nothing
      }
  }
    getMyValue = async () => {
        try {
            const value = await AsyncStorage.getItem('@lastTemp')
            if(value != null){
              let tempJson = JSON.parse(value)
              let date = new Date(tempJson.timeStamp)
              let dateFormated = dateFormat(date, "mmmm dS, yyyy, h:MM:ss TT")
              this.setState({
                liveTemp: tempJson.temp,
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
                let date = new Date(responseJSON.timeStamp)
                let dateFormated = dateFormat(date, "mmmm dS, yyyy, h:MM:ss TT")
                this.setState({
                  liveTemp: responseJSON.temp,
                  lastUpdated: dateFormated
                })
                AsyncStorage.setItem('@lastTemp', JSON.stringify(responseJSON))
              }
            })
            .catch((err)=>{
                console.log(err)
            })
        }, 30000)

        setIntervalObjectPing = setInterval(()=>{
          fetch(config.remote+'/device/ping', {
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

                setTimeout(()=>{
                  fetch(config.remote+'/device/pingAck', {
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
                      if(responseJSON.success){
                        console.log(responseJSON.msg)
                        if(responseJSON.msg){
                          this.setState({
                            deviceOnline: true
                          })
                        }else{
                          this.setState({
                            deviceOnline: false
                          })
                        }
                      }
                    }
                  })
                  .catch((err)=>{
                    console.log(err)
                    this.setState({
                      networkOnline: false
                    })
                  })  

                }, 2000)
              }
            }
          })
          .catch((err)=>{
              console.log(err)
              this.setState({
                networkOnline: false
              })
          })
        }, 10000)
  
    }

    componentWillUnmount = ()=>{
      clearInterval(setIntervalObject)
      clearInterval(setIntervalObjectPing)
    }

    renderStatus = ()=>{
      if(this.state.networkOnline == true){
        if(this.state.deviceOnline == null){
          return <Text style={styles.deviceLoadingText}>Loading...</Text>
        }
        if(this.state.deviceOnline == true){
          return <Text style={styles.deviceOnlineText}>Device Online</Text>
        }else{
          return <Text style={styles.deviceOfflineText}>Device Offline</Text>
        }
      }else{
        return <Text style={styles.networkText}>Network Unavailable</Text>
      }
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
                {this.renderStatus()}
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
  },
  networkText: {
    textAlign: 'center',
    fontFamily: 'sans-serif-medium',
    fontStyle: 'normal',
    color: 'red'
  },
  deviceOnlineText: {
    textAlign: 'center',
    fontFamily: 'sans-serif-medium',
    fontStyle: 'normal',
    color: 'green'
  },
  deviceOfflineText: {
    textAlign: 'center',
    fontFamily: 'sans-serif-medium',
    fontStyle: 'normal',
    color: 'red'
  },
  deviceLoadingText: {
    textAlign: 'center',
    fontFamily: 'sans-serif-medium',
    fontStyle: 'normal',
    color: 'black'
  }
});