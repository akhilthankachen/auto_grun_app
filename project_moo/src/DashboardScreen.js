import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, ScrollView} from 'react-native';
import {Button} from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import LiveFeed from './components/LiveFeed';
import TempGraph from './components/TempGraph'
import LogoutButton from './components/LogoutButton'
import AddNewTimerButton from './components/AddNewTimerButton';

const WIDTH = Dimensions.get('window').width
type Props = {};
export default class DashboardScreen extends Component<Props> {

  render() {
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <LiveFeed/>
                <TempGraph heading="Average Temp Per Hour"/>
                <TempGraph heading="Maximum Temp Per Hour"/>
                <TempGraph heading="Minimum Temp Per Hour"/>
                <AddNewTimerButton style={styles.addNewTimer} />
                <LogoutButton style={styles.logout} navigation={this.props.navigation}/>
            </ScrollView>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(232, 232, 232)',
  },
  contentContainer: {
    alignItems: 'center'
  },
  logout: {
    marginTop: 15,
    marginBottom: 15
  },
  addNewTimer: {
    marginTop: 15
  },    
  box: {
    backgroundColor: 'white',
    width: WIDTH - 30,
    height: 200,
    marginTop: 15,
    borderRadius: 5,
  },
  liveTemp: {
      alignSelf: 'center'
  },
  liveTempText: {
      fontSize: 70,
      color: 'rgb(104, 61, 50)',
      marginTop: 10
  }
});