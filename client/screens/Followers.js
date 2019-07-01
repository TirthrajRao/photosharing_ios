import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity, Dimensions, ScrollView, RefreshControl, Alert, ToastAndroid, ActivityIndicator } from 'react-native';
import Config from './config';
import axios from 'axios';
import { AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Container, Header, Content, Card, CardItem, } from 'native-base';
import { EventRegister } from 'react-native-event-listeners';
import PTRView from 'react-native-pull-to-refresh';
import _ from 'lodash'
import differenceBy from 'lodash/differenceBy'

let config = new Config();

export default class Followers extends Component {
   constructor(props) {
      super(props)
      global.curruntUserData = ""
      this.state = {
         followers: [],
         ButtonStateHolder: false,
      }
      this.props.navigation.addListener(
         'didFocus',
         payload => {
            this.componentDidMount();
         });
   }
   componentDidMount = async () => {
      try {
         const curruntUser = await AsyncStorage.getItem('curruntUser');
         if (curruntUser) {
            data = JSON.parse(curruntUser);
            global.curruntUserData = data
            console.log("value===+++++++++++++++++++++===========================>", global.curruntUserData.data._id);
         }
      } catch (error) {
         console.log(error);
      }
      fetch(config.getBaseUrl() + "user/get-my-followers/" + global.curruntUserData.data._id).
         then((Response) => Response.json()).
         then((response) => {
            console.log('currunt user followers==============================>', response);
            this.setState(prevState => ({
               followers: response
            }))
         }, function (err) {
            console.log(err);
         })
   }

   render() {
      console.log('this.state,friends==============================>?>', this.state.followers);
      if (!this.state.followers.length) {
         return (
            <View style={styles.container}>
               <Text style={{ fontSize: 20 }}>No folowers</Text>
            </View>
         )
      } else {
         return (
            <View style={{ backgroundColor: '#fff', paddingBottom: 10 }} >
               <FlatList
                  data={this.state.followers}
                  renderItem={({ item }) =>
                     <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                           style={{ flex: 8 }}
                           onPress={() => this.props.navigation.navigate('UserProfile', { userId: item._id })}
                        >
                           <Text style={styles.text}>{item.userName}</Text>
                        </TouchableOpacity>
                     </View>
                  }
               />
            </View>
         )
      }
   }
}
const styles = StyleSheet.create({
   text: {
      fontSize: 18,
      flexDirection: 'column',
      flex: 8,
      marginLeft: 10,
      marginTop: 14,
      color: 'black'
   },
   container: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
   },
   horizontal: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10
   },
})
