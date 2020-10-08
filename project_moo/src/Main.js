import React, {Component} from 'react'
import LoginScreenPhoneAuth from './screens/LoginScreenPhoneAuth'
import AddTimerScreenV2 from './screens/AddTimerScreenV2'
import CreateAccountScreen from './screens/CreateAccountScreen'
import TitleBar from './components/TitleBar'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

const rootStack = createStackNavigator()

type Props = {};
class Main extends Component<Props> {
    constructor(props){
        super(props)
    }

    render() {
        let { user } = this.props
        return (
            <SafeAreaProvider>
                <NavigationContainer>
                    
                        <rootStack.Navigator
                            headerMode='float'
                            screenOptions={{
                                header: (props) => {
                                    return(<TitleBar {...props}/>)
                                }
                            }}
                        >
                            { user.token === '' ? (
                            <>
                                <rootStack.Screen 
                                    name="Login" 
                                    component={LoginScreenPhoneAuth} 
                                    options={{
                                        title: 'Ally'
                                    }}
                                />
                                <rootStack.Screen 
                                    name="CreateAccount" 
                                    component={CreateAccountScreen}
                                    options={{
                                        title: 'Update Info'
                                    }}
                                />
                            </>
                            ) : (
                                <rootStack.Screen name="home" component={AddTimerScreenV2} />
                            )}
                        </rootStack.Navigator>
                    
                </NavigationContainer>
            </SafeAreaProvider>
        )
    }
}

Main.propTypes = {
    user: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    user: state.user
})

export default connect(mapStateToProps, null)(Main)

// const dashboardStackNavigator = createStackNavigator({
//     dashboard: DashboardScreen,
//     addTimer: AddTimerScreenV2,
// },{
//     initialRouteName: 'dashboard',
//     defaultNavigationOptions: {
//         headerShown: false
//     }
// })

// const materialBottomTabNavigator = createMaterialTopTabNavigator({
//     Timer: { 
//         screen: AddTimerScreenV2,
//         navigationOptions: {
//             tabBarIcon: ({tintColor, focused}) => {
//                 <Icon  
//                     name={'device-hub'} 
//                     type = 'material' 
//                     color={'white'}  
//                     size={25}  
//                 />  
//             }
//         } 
//     },
//     Device: { screen: dashboardStackNavigator },
//     Stats: { screen: AddTimerScreenV2 }
// },{
//     initialRouteName: 'Device',
//     tabBarPosition: 'bottom',
//     tabBarOptions: {
//         upperCaseLabel: false,
//         showIcon: true,
//         showLabel: false,
//         activeTintColor: 'black',
//         background
//     }
// })

// const AppSwitchNavigator = createSwitchNavigator({
//     splash: SplashScreen,
//     login: LoginScreen,
//     dashboard: materialBottomTabNavigator
// },{
//     initialRouteName: 'splash'
// })

// const AppContainer = createAppContainer(AppSwitchNavigator)