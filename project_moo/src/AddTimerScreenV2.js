import React, { Component } from 'react'
import { View, Text, Dimensions, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native'
import SaveAndActivate from './components/SaveAndActivate'
import { Icon } from 'react-native-elements'


const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height


class AddTimerScreenV2 extends Component {
    constructor(props) {
        super(props)

        this.state = {
            active: 0,
            xTabOne: 0,
            xTabTwo: 0,
            xTabThree: 0,
            translateX: new Animated.Value(0),
            translateXTabOne: new Animated.Value(0),
            translateXTabTwo: new Animated.Value(WIDTH),
            translateXTabThree: new Animated.Value(WIDTH),
            translateYTabTwo: -1000,
            translateYTabThree: -1000 
        }
    }

    handleSlide = xValue => {
        let { 
            active, 
            xTabOne, 
            xTabTwo, 
            xTabThree, 
            translateX, 
            translateXTabOne, 
            translateXTabTwo, 
            translateXTabThree,
            translateYTabTwo,
            translateYTabThree 
        } = this.state
        Animated.spring( translateX, {
            toValue: xValue,
            duration: 100
        }).start()
        if( active === 0 ){
            Animated.parallel([
                Animated.spring(translateXTabOne, {
                    toValue: 0,
                    duration: 100
                }).start(),
                Animated.spring(translateXTabTwo, {
                    toValue: WIDTH,
                    duration: 100
                }).start(),
                Animated.spring(translateXTabThree, {
                    toValue: WIDTH,
                    duration: 100
                }).start()
            ])
        }else if( active === 1){
            Animated.parallel([
                Animated.spring(translateXTabOne, {
                    toValue: -WIDTH,
                    duration: 100
                }).start(),
                Animated.spring(translateXTabTwo, {
                    toValue: 0,
                    duration: 100
                }).start(),
                Animated.spring(translateXTabThree, {
                    toValue: WIDTH,
                    duration: 100,
                }).start()
            ])
        }else if( active === 2 ){
            Animated.parallel([
                Animated.spring(translateXTabOne, {
                    toValue: -WIDTH,
                    duration: 100
                }).start(),
                Animated.spring(translateXTabTwo, {
                    toValue: -WIDTH,
                    duration: 100
                }).start(),
                Animated.spring(translateXTabThree, {
                    toValue: 0,
                    duration: 100
                }).start()
            ])
        }
    }

    onPressSync = ()=>{
        return
    }

    render() {
        let { 
                active, 
                xTabOne, 
                xTabTwo, 
                xTabThree, 
                translateX,
                translateXTabOne,
                translateXTabTwo,
                translateXTabThree,
                translateYTabTwo,
                translateYTabThree

            } = this.state
        return(
            <View style={styles.container}>
                <ScrollView 
                    style={styles.main}
                    contentContainerStyle={{alignItems:'center',height:HEIGHT}}
                    ref={(scroller) => {this.scroller = scroller}
                }>
                    <View style={styles.headingBox}>
                        <Text style={styles.heading}>
                            Timer Settings
                        </Text>
                        <Text style={styles.deviceText}>Device : <Text>ACTIVE</Text></Text>
                        
                    </View>

                    <View style={{
                            flexDirection: 'row',
                            marginTop: 40,
                            marginBottom: 20, 
                            marginLeft: 30, 
                            marginRight: 30,
                            height: 36,
                            position: 'relative'
                        }}>
                        
                        <Animated.View style={{
                            position: 'absolute',
                            width: '33.3%',
                            height: '100%',
                            top: 0,
                            left: 0,
                            backgroundColor: '#027368',
                            borderRadius: 4,
                            transform: [{
                                translateX
                            }]
                        }}/>

                        <TouchableOpacity style={{
                                flex: 1, 
                                justifyContent: 'center', 
                                alignItems:'center',
                                borderWidth: 1,
                                borderColor: '#027368',
                                borderRadius: 4,
                                borderRightWidth: 0,
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0,
                            }}
                                onLayout= { event => this.setState({xTabOne: event.nativeEvent.layout.x}) }
                                onPress= { () => this.setState({active:0}, () => this.handleSlide(xTabOne)) }
                            >
                            <Text style={[styles.tabText, {color: active === 0 ? 'white' : '#027368'}]}>Ch 1</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                                flex: 1, 
                                justifyContent: 'center', 
                                alignItems:'center',                                
                                borderWidth: 1,
                                borderColor: '#027368',
                                borderRadius: 4,
                                borderRightWidth: 0,
                                borderLeftWidth: 0,
                                borderRadius: 0,
                            }}
                                onLayout= { event => this.setState({xTabTwo: event.nativeEvent.layout.x}) }
                                onPress= { () => this.setState({active:1}, () => this.handleSlide(xTabTwo)) }
                            >
                            <Text style={[styles.tabText, {color: active === 1 ? 'white' : '#027368'}]}>Ch 2</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                                flex: 1, 
                                justifyContent: 'center', 
                                alignItems:'center',                                
                                borderWidth: 1,
                                borderColor: '#027368',
                                borderRadius: 4,
                                borderLeftWidth: 0,
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0,
                            }}
                                onLayout= { event => this.setState({xTabThree: event.nativeEvent.layout.x}) }
                                onPress= { () => this.setState({active:2}, () => this.handleSlide(xTabThree)) }
                            >
                            <Text style={[styles.tabText, {color: active === 2 ? 'white' : '#027368'}]}>Ch 3</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <ScrollView style={{width: '100%'}}>
                        <Animated.View style={{
                                justifyContent: 'center', 
                                alignItems: 'center',
                                transform: [{
                                    translateX: translateXTabOne
                                }]
                            }}
                                onLayout = { event => this.setState({translateYTabTwo : event.nativeEvent.layout.height}) }
                            >
                            <Text>One</Text>
                        </Animated.View>
                        <Animated.View style={{
                                justifyContent: 'center', 
                                alignItems: 'center',
                                transform: [
                                    {
                                        translateX: translateXTabTwo,
                                    },
                                    {
                                        translateY: -translateYTabTwo
                                    }
                                ]
                            }}
                                onLayout = { event => this.setState({translateYTabThree : event.nativeEvent.layout.height + translateYTabTwo}) }
                            >
                            <Text>two</Text>
                        </Animated.View>
                        <Animated.View style={{
                                justifyContent: 'center', 
                                alignItems: 'center',
                                transform: [
                                    {
                                        translateX: translateXTabThree
                                    },
                                    {
                                        translateY: -translateYTabThree
                                    }
                                ]
                            }}>
                            <Text>three</Text>
                        </Animated.View>
                    </ScrollView>

                </ScrollView>

                <View style={styles.bottom}>
                    <View>
                        <TouchableOpacity style = {styles.sync} onPress = {this.onPressSync}>
                            <View style={styles.syncButton}>
                                <Icon 
                                    name = 'sync'
                                    type = 'material'
                                    color = 'white'
                                    size = {20}
                                />
                                <Text style={styles.syncText}>Sync</Text>
                            </View>
                        </TouchableOpacity> 
                    </View>                   
                </View>

            </View>
        )
    }
}

export default AddTimerScreenV2

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(232, 232, 232)',
        alignItems: 'center'
    },
    bottom: {
        position: 'absolute',
        bottom: 15,
        flexDirection: 'row'
    },
    sync: {
    },
    syncButton: {
        width: WIDTH - 30,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        color: 'white',
        borderRadius: 5,
        flexDirection: 'row',
        backgroundColor: '#027368'
    },
    syncText: {
        fontFamily: 'sans-serif-medium',
        fontWeight: '500',
        fontSize: 15,
        color: 'white',
        paddingLeft: 10
    },    
    main: {
        width: WIDTH - 30,
        backgroundColor: 'white',
        borderRadius: 5,
        marginTop: 15,
        marginBottom: 88
    },
    headingBox: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: WIDTH - 90,
        marginLeft: 15,
        marginRight: 15
    },
    heading: {
        fontFamily: 'sans-serif-medium',
        fontSize: 20
    },
    tabContainer: {
        flexDirection: 'row',
        marginTop: 40,
        marginBottom: 20
    },
    tabText: {
        fontFamily: 'sans-serif-medium',
        fontWeight: '500',
        fontSize: 15,
    },
    deviceText: {
        fontFamily: 'sans-serif-medium',
        fontSize: 12
    }
})

