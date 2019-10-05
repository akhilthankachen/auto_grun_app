import React, {Component} from 'react';
import {
  Platform, 
  StyleSheet, 
  Text, 
  View, 
  Image,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

type Props = {};
const { width : WIDTH } = Dimensions.get('window')
export default class LoginScreen extends Component<Props> {

  constructor(props){
    super(props)

    this.state = {
      username: '',
      password: '',
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.logo} source={require('./images/logo-small.png') } />

        <View style={styles.loginSection}>
          <TextInput 
            style = {styles.username}
            placeholder = {'Username'}
            onChangeText = {(text) => this.setState({username: text})}
          />  
          <TextInput 
            style = {styles.password}
            placeholder = {'Password'}
            underlineColorAndroid = 'transparent'
            secureTextEntry = {true}
            onChangeText = {(text) => this.setState({password: text})}
          />  
          <TouchableOpacity
            style={styles.login}
            >
            <Text style={styles.loginText}>
              Login
            </Text>
          </TouchableOpacity>
        </View>  
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    width: null,
    height: null
  },
  logo: {
    width: 120,
    height: 100,
    marginTop: 0
  },
  username: {
    marginTop: 30,
    width: WIDTH - 55,
    height: 50,
    borderWidth: 1,
    borderRadius: 25,
    paddingLeft: 15,
    fontSize: 20,
  },
  password: {
    marginTop: 10,
    width: WIDTH - 55,
    height: 50,
    borderWidth: 1,
    borderRadius: 25,
    paddingLeft: 15,
    fontSize: 20,
  },
  loginSection: {
    marginTop: 50,
  },
  login: {
    marginTop: 10,
    width: WIDTH - 55,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(145, 179, 144)'
  },
  loginText: {
    color: 'white',
    fontSize: 20
  }
});