import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default class SimpleButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
        <TouchableOpacity style={styles.main} onPress={this.props.onPress}>
            <Text style={{
                fontFamily: 'sans-serif-medium',
                fontWeight: '500',
                fontSize: 15,
            }}>{this.props.text}</Text>
        </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
    main: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
        backgroundColor: 'rgb(255, 204, 186)',
        justifyContent: 'center',
        alignItems: 'center'
    }
});