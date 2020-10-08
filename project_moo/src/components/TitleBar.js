import React, { Component } from 'react';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'
import { useNavigationState, useNavigation } from '@react-navigation/native'
import { 
    View,
    Text,
    StyleSheet,
    Image,
    Platform,
    Animated
} from 'react-native';

const fontFamily = Platform.OS === 'ios' ? 'Helvetica' : 'sans-serif-medium'
const fontFamilyLight = Platform.OS === 'ios' ? 'Helvetica-Light' : 'sans-serif-light'

export default function TitleBar(props) {
    let title1 = "Ally"
    const routeName = useNavigationState(state => state.routeNames[state.index])
    switch (routeName) {
        case 'Login':
            title1 = 'Ally'
            break
        case 'CreateAccount':
            title1 = 'Update Info'
            break
        case 'Account':
            title1 = 'My account'
            break
    }

    const { options } = props.scene.descriptor;
    const title =
      options.headerTitle !== undefined
        ? options.headerTitle
        : options.title !== undefined
        ? options.title
        : props.scene.route.name;


    const progress = Animated.add(props.scene.progress.current, props.scene.progress.next || 0);

    const opacity = progress.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0, 1, 0],
    })
    
    return (
        <SafeAreaInsetsContext.Consumer>
            {(insets) => (
                <View style={[{position: 'absolute', top: insets.top + 55/2,left: 55/2, right:55/2,},styles.container]}>
                    <Image style={styles.icon} source={require('../images/logo-small.png')}/>
                    <Animated.View style={{ opacity }}>
                        <Text style={styles.title}>{title}</Text>
                    </Animated.View>
                </View>
            )}
        </SafeAreaInsetsContext.Consumer>
    );
  
}


const styles = StyleSheet.create({
    container: { 
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
        overflow: 'hidden'
    },
    icon: {
        height: 40,
        width: 40
    },
    title: {
        marginLeft: 5,
        fontFamily: fontFamily,
        fontSize: 18,
        color: '#027368',
        fontWeight: '500'
    }
    
})