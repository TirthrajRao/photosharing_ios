/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, AsyncStorage, BackHandler, Animated, Dimensions, TouchableOpacity } from 'react-native';
import Routes from './screens/Routes';
import Routes1 from './screens/Routes1';
import Login from './screens/login';
import SignUp from './screens/signUp';
import Follow from './screens/follow';
import Post from './screens/posts';
import Profile from './screens/profile';
import Addpost from './screens/addPost';
import Explore from './screens/explore';
import SinglePost from './screens/singlePost';
import UserProfile from './screens/visitProfile';
import TabViewExample from './screens/signOut';
import Search from './screens/Search';
import Message from './screens/message';
import SharedPost from './screens/sharedPost';
import Tabs from './screens/bottomNavigation';
import Following from './screens/Following';
let { width, height } = Dimensions.get('window');




export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: [],
    }
  }
  componentWillMount = async () => {
    console.log("call componant in app js ------------------------------------------------------------------------------------------");
    let value = await AsyncStorage.getItem('curruntUser');
    console.log('curuuntuser---------------------------->', JSON.parse(value));
    let value1 = JSON.parse(value);
    if (value1.data._id !== null) {
      this.setState({ value: value1.data._id });
      console.log("appjs  ================appjss=======================", this.state.value);
    }
  }
  render() {
    console.log("=============================value=================", this.state.value);
    if (this.state.value==false) {
      return (
        <Routes />
      );
    } else {
      return (
        <Routes1 />
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
