import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image} from 'react-native';
import LoginScreen from './LoginScreen'
import DashboardScreen from './DashboardScreen'
import SplashScreen from './SplashScreen'
import UsersScreen from './userScreens/UsersScreen'
import FarmsScreen from './farmScreens/FarmsScreen'
import SettingsScreen from './SettingsScreen'
import {createSwitchNavigator, createAppContainer} from 'react-navigation'
import {createMaterialTopTabNavigator} from 'react-navigation-tabs'
import {createStackNavigator} from 'react-navigation-stack'
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { Icon } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler';

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

const DashboardTabNavigator = createMaterialTopTabNavigator({
    users: {
        screen: UsersScreen,
        navigationOptions: {
            tabBarLabel: 'Users',
            tabBarIcon: ({tintColor}) => (
                <Icon name="people" color={tintColor} size={25} type='material'/> 
            )
        }
    },
    farms: {
        screen: FarmsScreen,
        navigationOptions: {
            tabBarLabel: 'Farms',
            tabBarIcon: ({tintColor}) => (
                <Icon name="home" color={tintColor} size={25} type='material'/>
            )
        }
    },
    settings: {
        screen: SettingsScreen,
        navigationOptions: {
            tabBarLabel: 'Farms',
            tabBarIcon: ({tintColor}) => (
                <Icon name="settings" color={tintColor} size={25} type='material'/>
            )
        }   
    },
},{
    navigationOptions: ({navigation})=>{
        const { routeName } = navigation.state.routes[navigation.state.index]
        return {
            headerTitle: routeName
        }
    },
    shifting: true,
    animationEnabled: false,
    initialRouteName: 'farms',
    tabBarPosition: 'bottom',
    tabBarOptions: {
        showIcon: true,
        showLabel: false,
        style: {
            marginBottom: 0,
            backgroundColor: 'rgb(106, 161, 98)',
            height: tabBarHeight,
        },
        activeTintColor: 'white',
        tabStyle: {
           borderTopWidth: 0
        },
        inactiveTintColor: 'white',
        indicatorStyle: {
            height: 3,
            backgroundColor: 'white'
        },
    },

})

const DashboardStackNavigator = createStackNavigator({
    dashboardTab: DashboardTabNavigator
},{
    headerLayoutPreset: 'center',
    defaultNavigationOptions: {
        headerTitleStyle: {
            fontSize: 20,
            textTransform: 'capitalize',
            fontWeight: '700',
            color: 'rgb(5, 43, 0)'
        },
        headerStyle: {
            height: 70
        },
        headerLeftContainerStyle: {
            marginLeft: 40
        },
        headerRight: (
            <TouchableOpacity>
                <Icon name="search" color='rgb(20, 20, 20)' size={30} type='material'/>
            </TouchableOpacity>
        ),
        headerRightContainerStyle:{
            marginRight: 45
        }
    }
})

const AppSwitchNavigator = createSwitchNavigator({
    splash: SplashScreen,
    login: LoginScreen,
    dashboard: DashboardStackNavigator,

},{
    initialRouteName: 'splash'
})

const AppContainer = createAppContainer(AppSwitchNavigator)


