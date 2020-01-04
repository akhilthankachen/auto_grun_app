import React, { Component } from 'react';
import { View, Text, StyleSheet, Modal, Image } from 'react-native';

export default class LoadingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
        <Modal
          animationType="none"
          transparent={true}
          visible={this.props.isVisible}
        >
            <View style={styles.transparentView}>
                <View style={styles.contentBox}>
                  <Image 
                    source={require('../images/loading.gif')}  
                    style={{width: 50, height: 50 }}
                  />
                  <Text>{this.props.content}</Text>
                </View>
            </View>
        </Modal>
    );
  }
}

const styles = StyleSheet.create({
  transparentView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  contentBox: {
    width: '90%',
    height: 100,
    backgroundColor: 'rgb(249, 249, 249)',
    elevation: 20,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  }
});