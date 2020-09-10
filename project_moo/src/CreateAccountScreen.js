import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'


const { width : WIDTH } = Dimensions.get('window')
const fontFamily = Platform.OS === 'ios' ? 'Helvetica' : 'sans-serif-medium'
const fontFamilyLight = Platform.OS === 'ios' ? 'Helvetica-Light' : 'sans-serif-light'


export default class CreateAccountScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
        name: '',
        email: '',
        mobile: '',
        username: '',
        password: '',
        confirmPassword: ''
    }
  }

  render() {
    return (
      <SafeAreaView style={{flex:1, backgroundColor: 'white'}}>
          <KeyboardAvoidingView 
            behavior="position"
            style={{flex:1}}
            contentContainerStyle={styles.container}
          >
            <Text style={styles.heading}>
                Create new account
            </Text>
            <View style={styles.inputBox}>
                <Text style={styles.inputText}>
                    Enter your name
                </Text>
                <TextInput 
                    style = {styles.textInputBox}
                    placeholder = {'Full Name'}
                    autoCapitalize = 'none'
                    onChangeText = {(text) => {this.setState({
                    name: text,
                    })}}
                />
            </View>
            <View style={styles.inputBox}>
                <Text style={styles.inputText}>
                    Enter your email
                </Text>
                <TextInput 
                    style = {styles.textInputBox}
                    placeholder = {'Email'}
                    autoCapitalize = 'none'
                    onChangeText = {(text) => {this.setState({
                    email: text,
                    })}}
                />
            </View>
            <View style={styles.inputBox}>
                <Text style={styles.inputText}>
                    Enter your mobile number
                </Text>
                <TextInput 
                    style = {styles.textInputBox}
                    placeholder = {'Mobile'}
                    autoCapitalize = 'none'
                    onChangeText = {(text) => {this.setState({
                    mobile: text,
                    })}}
                />
            </View>
            <View style={styles.inputBox}>
                <Text style={styles.inputText}>
                    Enter new username
                </Text>
                <TextInput 
                    style = {styles.textInputBox}
                    placeholder = {'Username'}
                    autoCapitalize = 'none'
                    onChangeText = {(text) => {this.setState({
                    username: text,
                    })}}
                />
            </View>
            <View style={styles.inputBox}>
                <Text style={styles.inputText}>
                    Enter new password
                </Text>
                <TextInput 
                    style = {styles.textInputBox}
                    placeholder = {'Password'}
                    autoCapitalize = 'none'
                    onChangeText = {(text) => {this.setState({
                    password: text,
                    })}}
                />
                <TextInput 
                    style = {[styles.textInputBox, {marginTop: 10}]}
                    placeholder = {'Confirm Password'}
                    autoCapitalize = 'none'
                    onChangeText = {(text) => {this.setState({
                    confirmPassword: text,
                    })}}
                />
            </View>
            <TouchableOpacity
                style={styles.button}
                onPress = {this.onPressCreate}
            >
                <Text style={styles.buttonText}>
                    Create !
                </Text>
          </TouchableOpacity>
          </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        //justifyContent: 'center',
        alignItems: 'center',
    },
    heading: {
        fontFamily: fontFamily,
        fontSize: 20,
        color: '#1B4859',
        marginTop: 30,
        marginBottom: 30
    },
    inputBox: {
        width: WIDTH - 55,
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 12
    },
    textInputBox: {
        width: '100%',
        height: 50,
        borderRadius: 5,
        paddingLeft: 20,
        fontSize: 18,
        backgroundColor: '#F2F2F2',
        fontFamily: fontFamilyLight,
        color: '#5E7A7E'
    },
    inputText: {
        fontFamily: fontFamily,
        fontSize: 15,
        color: '#5E7A7E',
        marginBottom: 7
    },
    button: {
        top: 7,
        width: WIDTH - 55,
        height: 50,
        borderRadius: 5,
        backgroundColor: '#027368',
        marginLeft: 0,
        marginRight: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '600'
    },
})