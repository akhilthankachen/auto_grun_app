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
          lastUpdated: this.props.data.lastUpdated,
          clientToken: '',
          labels: this.props.data.labels,
          data: this.props.data.data,
          keyDup: this.props.keyDup
        }
    }

  UNSAFE_componentWillReceiveProps = next => {
    if(next.data.data.length != this.state.data.length) {
      this.setState({
        data: next.data.data,
        labels: next.data.labels,
        lastUpdated: next.data.lastUpdated
      })
    }
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