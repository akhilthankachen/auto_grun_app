import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import config from '../../config'
import dateFormat from 'dateformat'
import AsyncStorage from '@react-native-community/async-storage';
import LineGraph from './LineGraph'



const WIDTH = Dimensions.get('window').width
type Props = {};
export default class MaxTemp extends Component<Props> {
    constructor(props){
        super(props)
        this.state = {
          lastUpdated: ''
        }
    }
  
  componentDidMount = ()=>{
    let date = new Date()
    let dateFormated = dateFormat(date, "mmmm dS, yyyy, h:MM:ss TT")
    this.setState({
      lastUpdated: dateFormated
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.box}>
            <Text style={styles.headingContainer}>
              Maximum Temp Per Hour
            </Text>
            <View style={styles.lineGraph}>
                <LineGraph/>
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
  box: {
    backgroundColor: 'white',
    width: WIDTH - 30,
    height: 360,
    marginTop: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  lineGraph: {
    marginTop: 10
  },
  headingContainer: {
    marginTop: 50
  },
  lastSync: {
    textAlign: 'center',
    position: 'absolute',
    bottom: 25
  },
  lastSyncText: {
    textAlign: 'center'
  }
});