import * as React from 'react';
import { View, StyleSheet, Dimensions, StatusBar } from 'react-native';
import Routes from './Routes';
import App from '.././App';



export default class SignOut extends React.Component {
  render() {
    return (
      <App />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight
  },
  scene: {
    flex: 1,
  },
});