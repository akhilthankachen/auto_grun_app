import React, {Component} from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { Icon } from 'react-native-elements'



type Props = {};
export default class Empty extends Component<Props> {

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.empty}>
          <Icon 
            name = 'hourglass-empty'
            type = 'material'
            color = 'rgb(189, 189, 189)'
            size = {50}
          />
          <Text style={styles.emptyText}>Empty</Text>
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
  empty: {
      alignItems: 'center'
  },
  emptyText: {
      fontSize: 30,
      fontWeight: '500',
      color: 'rgb(189, 189, 189)'
  }
});