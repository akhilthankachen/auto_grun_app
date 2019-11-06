import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, ScrollView} from 'react-native';
import {Button} from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import LiveFeed from './components/LiveFeed';
import AvgTemp from './components/AvgTemp'
import MaxTemp from './components/MaxTemp'

const WIDTH = Dimensions.get('window').width
type Props = {};
export default class DashboardScreen extends Component<Props> {

  render() {
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <LiveFeed/>
                <AvgTemp/>
                <MaxTemp/>
            </ScrollView>
            <View style={styles.logout}>
                <Button
                    title='logout'
                    onPress={()=>{
                        AsyncStorage.setItem('@token', '').then(()=>{
                            this.props.navigation.navigate('login')
                        })
                }}
                />
            </View>
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
      position: 'absolute',
      bottom: 15,
      right: 15
  },
  box: {
    backgroundColor: 'white',
    width: WIDTH - 30,
    height: 200,
    marginTop: 15,
    borderRadius: 5,
  },
  liveFeed: {
      marginLeft: 25,
      marginTop: 20
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
      color: 'rgb(104, 61, 50)',
      marginTop: 10
  }
});