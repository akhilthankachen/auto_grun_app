import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import config from '../../config'
import dateFormat from 'dateformat'
import AsyncStorage from '@react-native-community/async-storage';
import LineGraph from './LineGraph'



const WIDTH = Dimensions.get('window').width
type Props = {};
export default class TempGraph extends Component<Props> {
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
              {this.props.heading}
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
    bottom: 25
  },
  lastSyncText: {
    textAlign: 'center'
  }
});