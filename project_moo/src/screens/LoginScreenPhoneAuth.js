import React, {Component} from 'react';
import { Icon, CheckBox } from 'react-native-elements'
import LoadingModal from '../components/LoadingModal'
import { connect } from 'react-redux'
import { authenticate } from '../actions/userActions'
import PropTypes from 'prop-types'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SliderBox } from "react-native-image-slider-box"
import FastImage from 'react-native-fast-image'

import {
  StyleSheet, 
  Text, 
  View, 
  Image,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView, 
  Platform,
  Keyboard
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

type Props = {};
const { width : WIDTH } = Dimensions.get('window')
const fontFamily = Platform.OS === 'ios' ? 'Helvetica' : 'sans-serif-medium'
const fontFamilyLight = Platform.OS === 'ios' ? 'Helvetica-Light' : 'sans-serif-light'

class LoginScreenPhoneAuth extends Component<Props> {

  constructor(props){
    super(props)
    this.state = {
      modalVisible: false,
      mobileNumber: '',
      password: '',
      checked: false,
      showHide: true,
      status: '',
      keyboardHeight : 0,
      sliderImages: [
        require('../images/slider1.jpg'),
        require('../images/slider2.jpg'),
        require('../images/slider3.jpg'),
        require('../images/slider4.jpg')
      ],
      width: 0
    }
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow)
  }

  componentWillUnmount = () => {
    Keyboard.removeListener('keyboardDidShow')
  }

  _keyboardDidShow = (e) => {
      this.setState({
          keyboardHeight: e.endCoordinates.height,
          //normalHeight: Dimensions.get('window').height, 
          //shortHeight: Dimensions.get('window').height - e.endCoordinates.height, 
      }) 
  }


  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  UNSAFE_componentWillReceiveProps = (next)=>{
    if(next.user.authStatus == true && next.user.token != ''){
      this.setModalVisible(false)
      this.props.navigation.navigate('dashboard')
    }

    if(next.user.authMessage != '' && next.user.authStatus == false){
      this.setModalVisible(false)
      this.setState({
        status: next.user.authMessage
      })
    }
  }

  onLoginPressRedux = () => {
    this.setModalVisible(true)

    if(this.state.mobileNumber != '' && this.state.password != ''){
      let credentials = {
        mobileNumber: this.state.mobileNumber,
        password: this.state.password
      }
      
      this.props.authenticate(credentials)
    }else{
      this.setState({
        status: '* Empty fields'
      })
      this.setModalVisible(false)
    }
  }

  onLayout = e => {
    this.setState({
      width: e.nativeEvent.layout.width
    });
  }


  render() {
    let {keyboardHeight} = this.state
    return (
      <SafeAreaView style={{flex:1,backgroundColor: 'white'}}>
        <KeyboardAvoidingView
              behavior={Platform.OS == "ios" ? "position" : "position"}
              style={{flex:1}}
              contentContainerStyle={styles.container}
              keyboardVerticalOffset={Platform.OS == "ios" ? -0 : -keyboardHeight}
              >
          <LoadingModal content="Logging In" isVisible={this.state.modalVisible}/>
          <Image style={styles.logo} source={require('../images/logo-small.png')}/>
          <Text style={styles.logoText}>Ally</Text>


          <View style={styles.imageSliderSection} onLayout={this.onLayout}>
            <SliderBox 
              sliderBoxHeight={400} 
              images={this.state.sliderImages} 
              parentWidth={this.state.width}
              paginationBoxVerticalPadding={0}
              autoplay
              imageComponetStyle={styles.sliderImageComponet}
              imageComponent={FastImage}
              resizeMode={FastImage.resizeMode.contain}
              circleLoop
            />
          </View>


          <View style={styles.loginSection}>
            <View style={styles.statusContainer}>
              <Text style = {styles.statusText}>
                {this.state.status}
              </Text>
            </View>
            <View style={styles.mobileNumberContainer}>
              <TextInput 
                style = {styles.mobileNumber}
                placeholder = {'Mobile Number'}
                autoCapitalize = 'none'
                keyboardType='number-pad'
                onChangeText = {(text) => {this.setState({
                  mobileNumber: text,
                  status: ''
                })}}
              />
              <View style = {styles.areaCodeContainer}>
                <Text style={styles.areaCode}>
                  +91
                </Text>
              </View>  
            </View>
            <TouchableOpacity
              style={styles.login}
              onPress = {()=>{
                this.props.navigation.navigate('CreateAccount')
              }}
              >
              <Text style={styles.loginText}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
          
        </KeyboardAvoidingView>  
      </SafeAreaView>
    );
  }
}

LoginScreenPhoneAuth.propTypes = {
  authenticate: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

const mapStateToProps = state =>({
  user: state.user
})

export default connect(mapStateToProps, { authenticate })(LoginScreenPhoneAuth)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    marginTop: 0,
    display: 'none'
  },
  mobileNumberContainer: {
    marginTop: 5
  },  
  areaCodeContainer: {
    position: 'absolute',
    left: 10,
    top: 12
  },
  mobileNumber: {
    width: WIDTH - 55,
    height: 50,
    borderRadius: 5,
    paddingLeft: 50,
    fontSize: 18,
    backgroundColor: '#F2F2F2',
    fontFamily: fontFamilyLight,
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
    fontFamily: fontFamilyLight,
    color: '#5E7A7E'
  },
  loginSection: {
    marginTop: 50,
    marginBottom: 55/2
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
    top: -20,
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
    fontFamily: fontFamily,
    fontSize: 25,
    color: '#027368',
    display: 'none'
  },
  createNewAccount: {
    marginTop: 20,
    alignItems: 'center'
  },
  createText: {
    fontWeight: '400',
    fontFamily: fontFamily,
    fontSize: 15,
    color: '#5E7A7E'
  },
  areaCode: {
    fontSize:18,
    fontFamily: fontFamilyLight,
  },
  imageSliderSection:{
    flex: 1,
    width: WIDTH - 55,
    marginTop: 100
  },
  sliderImageComponet:{
    width: '100%',
    backgroundColor: 'red'
  }
});