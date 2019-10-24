import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Dimensions} from 'react-native';
import {Button} from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import config from '../config'


const WIDTH = Dimensions.get('window').width
type Props = {};
export default class DashboardScreen extends Component<Props> {
    constructor(props){
        super(props)
        this.state = {
            liveTemp: '',
        }
    }

    componentDidMount = () => {
        setInterval(()=>{
            fetch(config.remote+'/cowfarm/lastTemp', {
                method: 'GET'
            })  
            .then((response) => {
                if(response.status == 200){
                    return response.json()
                }
            })
            .then((responseJSON)=>{
                this.setState({
                    liveTemp: responseJSON.message
                })
                console.log('updated' + responseJSON.message)
            })
        }, 5000)
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
        </View>

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