import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import Main from './src/Main'
import { PersistGate } from 'redux-persist/integration/react'
import configureStore from './src/store'
const { store, persistor } = configureStore()
import { Provider } from 'react-redux'
import SplashScreen from './src/SplashScreen'

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={<SplashScreen/>} persistor={persistor}>
          <Main/>
        </PersistGate>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});