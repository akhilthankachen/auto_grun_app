import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import LoginScreen from './LoginScreen'
import DashboardScreen from './DashboardScreen'
import {createSwitchNavigator, createAppContainer} from 'react-navigation'

type Props = {};
export default class Main extends Component<Props> {
  render() {
    return <AppContainer />
  }
}

const AppSwitchNavigator = createSwitchNavigator({
    login: LoginScreen,
    dashboard: DashboardScreen
},{
    initialRouteName: 'login'
})

const AppContainer = createAppContainer(AppSwitchNavigator)
