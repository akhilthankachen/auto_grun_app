import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import LoginScreen from './LoginScreen'
import DashboardScreen from './DashboardScreen'
import SplashScreen from './SplashScreen'
import {createSwitchNavigator, createAppContainer} from 'react-navigation'

type Props = {};
export default class Main extends Component<Props> {
    constructor(props){
        super(props)
        this.state = {
            initialRoute: 'login'
        }
    }
    render() {
        return <AppContainer />
    }
}


const AppSwitchNavigator = createSwitchNavigator({
    splash: SplashScreen,
    login: LoginScreen,
    dashboard: DashboardScreen,

},{
    initialRouteName: 'splash'
})

const AppContainer = createAppContainer(AppSwitchNavigator)
