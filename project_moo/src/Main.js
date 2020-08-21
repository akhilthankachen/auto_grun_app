import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import LoginScreen from './LoginScreen'
import SplashScreen from './SplashScreen'
import {createSwitchNavigator, createAppContainer} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'
import {createMaterialTopTabNavigator} from 'react-navigation-tabs'
import DashboardScreen from './DashboardScreen';
import AddTimerScreenV2 from './AddTimerScreenV2'

var tabBarHeight = 50

const styles = StyleSheet.create({
    logo: {
        width: 42,
        height: 35
    }
});

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


const dashboardStackNavigator = createStackNavigator({
    dashboard: DashboardScreen,
    addTimer: AddTimerScreenV2,
},{
    initialRouteName: 'dashboard',
    defaultNavigationOptions: {
        headerShown: false
    }
})

const AppSwitchNavigator = createSwitchNavigator({
    splash: SplashScreen,
    login: LoginScreen,
    dashboard: dashboardStackNavigator
},{
    initialRouteName: 'splash'
})

const AppContainer = createAppContainer(AppSwitchNavigator)