import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Icon } from 'react-native-elements'
import PropTypes from 'prop-types'
import { getTimer } from '../actions/timerActions'
import { connect } from 'react-redux'

const WIDTH = Dimensions.get('window').width
class Close extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  onlogoutPress = ()=>{
    Alert.alert(
        'Close',
        'Do you want to leave ?',
        [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {text: 'OK', onPress: () => {
              this.props.getTimer()
              this.props.navigation.navigate('dashboard')
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
                    name = 'close'
                    type = 'material'
                    color = 'rgb(10, 79, 0)'
                    size = {20}
                />
            </View>
        </TouchableOpacity>
      </View>
    );
  }
}

Close.propTypes = {
  getTimer: PropTypes.func.isRequired
}

mapStateToProps = state => ({

})

export default connect(mapStateToProps,{ getTimer })(Close) 

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    button: {
        width: 60,
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
