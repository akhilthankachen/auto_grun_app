import React, {Component} from 'react';
import { Icon, CheckBox } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import config from '../config'
import LoadingModal from './components/LoadingModal'
import {
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
      modalVisible: false,
      username: '',
      password: '',
      checked: false,
      showHide: true,
      status: ''
    }
  }


  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  onLoginPress = () =>{
    this.setModalVisible(true)
    if(this.state.username != '' && this.state.password != ''){
      fetch(config.remote+'/users/authenticate', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password
        },

        )
      })  
      .then((response) => {
        if(response.status == 200){
          return response.json()
        }else{
          this.setState({
            status: '* Error'
          })
          this.setModalVisible(false)
        }
      })
      .then((responseJSON)=>{
        // response json
        if(responseJSON.success == false){
          this.setState({
            status: '* '+responseJSON.msg
          })
          this.setModalVisible(false)
        }else{
          // user token
          AsyncStorage.setItem('@token', JSON.stringify(responseJSON)).then(()=>{
            this.setModalVisible(false)
            this.props.navigation.navigate('dashboard')
          })
          .catch((err)=>{
            console.log(err)
            this.setModalVisible(false)
          })
        }
      })
      .catch((err)=>{
        this.setState({
          status: '* Error, Check network connection'
        })
        this.setModalVisible(false)
      })
    }else{
      this.setState({
        status: '* Empty fields'
      })
      this.setModalVisible(false)
    }
  }


  render() {
    return (
      <View style={styles.container}>
        <LoadingModal content="Logging In" isVisible={this.state.modalVisible}/>
        <Image style={styles.logo} source={require('./images/logo-small.png')}/>
        <Text style={styles.logoText}>Ally</Text>

        <View style={styles.loginSection}>
          <View style={styles.statusContainer}>
            <Text style = {styles.statusText}>
            {this.state.status}</Text>
          </View>
          <View style={styles.usernameContainer}>
            <TextInput 
              style = {styles.username}
              placeholder = {'Username'}
              autoCapitalize = 'none'
              onChangeText = {(text) => {this.setState({
                username: text,
                status: ''
              })}}
            />
            <View style = {styles.person}>
              <Icon 
                name = 'person'
                type = 'material'
                color = '#A66066'
                size = {20}
              />
            </View>  
          </View>
          <View style = {styles.passwordContainer}>
            <TextInput 
              style = {styles.password}
              placeholder = {'Password'}
              autoCapitalize = 'none'
              underlineColorAndroid = 'transparent'
              secureTextEntry = {this.state.showHide}
              onChangeText = {(text) => {this.setState({
                password: text,
                status: ''
              })}}
            /> 
            <View style = {styles.person}>
              <Icon 
                name = 'lock'
                color = '#A66066'
                size = {20}
              />
            </View>
            <View style = {styles.showHide}>
              <TouchableOpacity
                onPress = {()=>{this.setState({showHide: !this.state.showHide})}}  
              >
                <Icon 
                  name = 'ios-eye'
                  type = 'ionicon'
                  color = '#A66066'
                  size = {25}
                />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={styles.login}
            onPress = {this.onLoginPress}
            >
            <Text style={styles.loginText}>
              Login
            </Text>
          </TouchableOpacity>
          <View style = {styles.remember} >
            <CheckBox 
              center
              title = 'Remember me'
              iconType='material'
              checkedIcon='check-box'
              uncheckedIcon='check-box-outline-blank'
              checked={this.state.checked}
              onPress = {()=>{this.setState({checked: !this.state.checked})}}
            />
          </View>
          <View style = {styles.forgotContainer}>
            <TouchableOpacity>
              <Text style = {styles.forgotText}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>
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
    width: 80,
    height: 80,
    marginTop: 0
  },
  usernameContainer: {
    marginTop: 5
  },  
  person: {
    position: 'absolute',
    left: 10,
    top: 14,
  },
  username: {
    width: WIDTH - 55,
    height: 50,
    borderRadius: 5,
    paddingLeft: 40,
    fontSize: 18,
    backgroundColor: '#F2F2F2',
    fontFamily: 'sans-serif-light',
    color: '#5E7A7E'
  },
  passwordContainer: {
    marginTop: 10
  },
  password: {
    width: WIDTH - 55,
    height: 50,
    borderRadius: 5,
    paddingLeft: 40,
    fontSize: 18,
    backgroundColor: '#F2F2F2',
    fontFamily: 'sans-serif-light',
    color: '#5E7A7E'
  },
  loginSection: {
    marginTop: 50,
  },
  login: {
    marginTop: 10,
    width: WIDTH - 55,
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#027368'
  },
  loginText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600'
  },
  showHide: {
    position: 'absolute',
    right: 12,
    top: 14
  },
  forgotContainer: {
    alignItems: 'center',
    marginTop: 10,
    display: 'none'
  },
  forgotText: {
    fontWeight: '500',
    textDecorationLine: 'underline'
  },
  statusContainer: {
    position: 'absolute',
    top: 5,
    left: 10,
  },
  statusText: {
    color: 'red',
  },
  remember: {
    display: 'none'
  },
  logoText: {
    marginTop: 25,
    fontFamily: 'sans-serif-medium',
    fontSize: 25,
    color: '#027368'
  }
});