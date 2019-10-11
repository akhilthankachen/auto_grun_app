import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import AddNewButton from '../other_components/addNewButton'
import Empty from '../other_components/empty'


type Props = {};
export default class UsersScreen extends Component<Props> {

  addNewUser = ()=>{
    this.props.navigation.navigate('add_user')
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Empty />
        </View>
        <View style={styles.newUserButton}>
          <AddNewButton onPress={this.addNewUser} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  newUserButton: {
    position: 'absolute',
    bottom: 15,
    right: 20
  }
});