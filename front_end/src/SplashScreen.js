import React, {Component} from 'react';
import {Text, View, Image, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

type Props = {};
export default class SplashScreen extends Component<Props> {
    getMyValue = async () => {
        try {
            const value = await AsyncStorage.getItem('@token')
            if(value != null){
                this.props.navigation.navigate('dashboard')
            }else{
                this.props.navigation.navigate('login')
            }
        } catch(e) {
            // do nothing
        }
    }  
  componentDidMount = () => {
    this.getMyValue()
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.logo} source={require('./images/logo-small.png')}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
      width: 120,
      height: 100
  }
});