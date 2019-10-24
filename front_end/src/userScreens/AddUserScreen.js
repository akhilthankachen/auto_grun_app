import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, ScrollView, TouchableOpacity} from 'react-native';
import {Input} from 'react-native-elements'
import { Dropdown } from 'react-native-material-dropdown'



type Props = {};
const { width : WIDTH } = Dimensions.get('window')

export default class AddUserScreen extends Component<Props> {
    constructor(props){
        super(props)
        this.state= {
            addCompanyDetails: true
        }
    }

  render() {
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle = {{paddingBottom: 20, alignItems: 'center', width: WIDTH}}>
                <View style={styles.textTop}>
                    <Text style={styles.text}>
                        Temperory username and password will be auto generated for first sign-in. 
                    </Text>
                </View>
                <View style={styles.inputName}>    
                    <Input
                        placeholder = 'name'
                        label = 'Enter Name'
                        inputContainerStyle = {styles.input}
                        />
                </View>
                <View style={styles.inputEmail}>
                    <Input
                        placeholder = 'email@address.com'
                        label = 'Enter Email Address'
                        inputContainerStyle = {styles.input}
                        />
                </View>
                <View style={styles.inputEmail}>
                    <Input
                        placeholder = 'mobile number'
                        label = 'Enter Mobile Number'
                        inputContainerStyle = {styles.input}
                        />
                </View>
                <View style={styles.inputUser}>
                    <Dropdown
                        containerStyle= {styles.input}
                        label='Select User Type'
                        data={[{value: 'super'},{value: 'mid'},{value: 'end'}]}
                    />
                </View>
                {
                    this.state.addCompanyDetails && 
                    <View style={styles.companyDetails}>
                        <Text>Company details</Text>
                    </View>
                }
                <TouchableOpacity style={styles.register}>
                    <Text style={styles.registerText}>
                        Register
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  text: {
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    color: 'rgb(81, 112, 40)'
  },
  textTop: {
    width: WIDTH - 50,
    marginTop: 30,
  },
  input: {
    width: WIDTH - 50,
    height: 50,
  },
  inputName: {
    marginTop: 40
  },
  inputEmail: {
    marginTop: 20
  },
  inputUser: {
      marginTop: 20,
      alignContent: 'center',
  }, 
  register: {
    marginTop: 30,
    width: WIDTH - 55,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(131, 166, 125)'
  },
  registerText: {
      color: 'white',
      fontSize: 20,
      fontWeight: '500'
  },
  companyDetails: {
      marginTop: 20
  }
});