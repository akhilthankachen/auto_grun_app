import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import config from '../../config'
import dateFormat from 'dateformat'
import AsyncStorage from '@react-native-community/async-storage';
import LineGraph from './LineGraph'



const WIDTH = Dimensions.get('window').width
type Props = {};
var setIntervalObject
export default class TempGraph extends Component<Props> {
    constructor(props){
        super(props)
        this.state = {
          lastUpdated: '',
          clientToken: '',
          labels: [0,0],
          data: [0,0],
          keyDup: this.props.keyDup
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
  
  componentDidMount = ()=>{
    setIntervalObject = setInterval(()=>{
      fetch(config.remote+this.props.route, {
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
          let date = new Date()
          let dateFormated = dateFormat(date, "mmmm dS, yyyy, h:MM:ss TT")
          if(responseJSON.msg){
            var labels = responseJSON.msg.map((json)=>{
              let tempDate = new Date(json.timeStamp)
              return tempDate.getHours()
            })

            var data = responseJSON.msg.map((json)=>{
              return json.temp
            })

          }

          if(this.state.data.length <= data.length){
            this.setState({
              labels: labels,
              data: data,
              lastUpdated: dateFormated
            })
          }
          
        }
      })
      .catch((err)=>{
          console.log(err)
      })
    }, 30000)
  }

  componentWillUnmount = ()=>{
    clearInterval(setIntervalObject)
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.box}>
            <Text style={styles.headingContainer}>
              {this.props.heading}
            </Text>
            <View style={styles.lineGraph}>
                <LineGraph labels={this.state.labels} data={this.state.data} key={this.state.keyDup}/>
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
  box: {
    backgroundColor: 'white',
    width: WIDTH - 30,
    height: 360,
    marginTop: 15,
    borderRadius: 5,
    alignItems: 'center'
  },
  lineGraph: {
    marginTop: 30
  },
  headingContainer: {
    marginTop: 15
  },
  lastSync: {
    textAlign: 'center',
    position: 'absolute',
    bottom: 25,
  },
  lastSyncText: {
    textAlign: 'center',
    fontFamily: 'sans-serif-light',
    fontStyle: 'italic'
  }
});