import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Icon } from 'react-native-elements'
import { connect } from 'react-redux'
import { deauthenticate } from '../actions/userActions'
import PropTypes from 'prop-types'
import { purge } from '../store'


const WIDTH = Dimensions.get('window').width
class LogoutButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  UNSAFE_componentWillReceiveProps = next => { 
    if(next.authStatus == false){
      this.props.navigation.navigate('splash')
    }
  }

  onlogoutPress = ()=>{
    Alert.alert(
        'Logout',
        'Are you sure ?',
        [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {text: 'OK', onPress: () => {
                this.props.purge()
                this.props.deauthenticate()
            }},
        ],
        {cancelable: false},
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style = {this.props.style} onPress = {this.onlogoutPress}>
            <View style={styles.button}>
                <Icon 
                    name = 'exit-to-app'
                    type = 'material'
                    color = 'rgb(10, 79, 0)'
                    size = {20}
                />
                <Text style={styles.logoutText}>Logout</Text>
            </View>
        </TouchableOpacity>
      </View>
    )
  }
}

LogoutButton.propTypes = {
  deauthenticate: PropTypes.func.isRequired,
  authStatus: PropTypes.bool.isRequired,
  purge: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  authStatus: state.user.authStatus
})

export default connect(mapStateToProps, { deauthenticate, purge })(LogoutButton)

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    button: {
        width: WIDTH - 30,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        color: 'white',
        borderRadius: 5,
        flexDirection: 'row'
    },
    logoutText: {
        fontFamily: 'sans-serif-medium',
        fontWeight: '500',
        fontSize: 15,
        paddingLeft: 10
    }
});
