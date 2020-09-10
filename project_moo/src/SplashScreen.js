import React, {Component} from 'react';
import {Text, View, Image, StyleSheet} from 'react-native';
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

type Props = {};
class SplashScreen extends Component<Props> { 
  // componentDidMount = () => {
  //   if( this.props.user.token != '' && this.props.user.authStatus == true){
  //     this.props.navigation.navigate('dashboard')
  //   }else{
  //     this.props.navigation.navigate('login')
  //   }
  // }

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.logo} source={require('./images/logo-small.png')}/>
      </View>
    );
  }
}

SplashScreen.propTypes = {
  user: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  user: state.user
})

export default connect(mapStateToProps, null)(SplashScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
      width: 100,
      height: 100
  }
});