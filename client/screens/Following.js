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
import _ from 'lodash'
import differenceBy from 'lodash/differenceBy'
let config = new Config();

export default class Following extends Component {
   constructor(props) {
      super(props)
      global.curruntUserData = ""
      this.state = {
         friends: [],
         ButtonStateHolder: false,
         refreshing: false,
      }
      this.props.navigation.addListener(
         'didFocus',
         payload => {
            this.componentDidMount();
         });

   }

   componentDidMount = async () => {
      console.log("_____+_+_+_+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++FOLLOW")
      try {
         const curruntUser = await AsyncStorage.getItem('curruntUser');
         if (curruntUser) {
            data = JSON.parse(curruntUser);
            global.curruntUserData = data
            console.log("value===+===========================>", global.curruntUserData.data._id);
         }
      } catch (error) {
         console.log(error);
      }
      this.getFriends();
   }
   getFriends = () => {
      fetch(config.getBaseUrl() + "user/get-my-friends/" + global.curruntUserData.data._id).
         then((Response) => Response.json()).
         then((response) => {
            console.log('currunt user Friends following==============================>', response);
            let curruntUserFriends = response;
            this.setState(prevState => ({
               friends: response
            }))
         }, function (err) {
            console.log(err);
         })
   }
   handleClickUnfollow(item) {
      console.log('data====================>', item);
      this.setState({
         ButtonStateHolder: true
      })
      var apiBaseUrl = config.getBaseUrl() + "user/unfollow";
      var payload = {
         "requestedUser": global.curruntUserData.data._id,
         "userTobeUnFollowed": item._id
      }
      console.log(payload)
      if (payload.requestedUser == payload.userTobeUnFollowed) {
         console.log("user can't Unfollow itself")
            // alert("user can't Unfollow itself")
            ToastAndroid.show("user can't Unfollow itself", ToastAndroid.SHORT);
      } else {
         axios.post(apiBaseUrl, payload)
            .then((response) => {
               console.log("response=====>    ", typeof response.data);
               console.log("Unfollow sucessfully................");
               this.getFriends();
               this.setState({ ButtonStateHolder: false })
            }).catch((err) => {
               console.log(err);
               this.setState({ ButtonStateHolder: false })
               console.log('this.state.ButtonStateHolder=============', this.state.ButtonStateHolder);
            });
      }
   }

   render() {
      console.log('this.state,friends==============================>?>', this.state.friends);
      if (!this.state.friends.length) {
         return (
            // <View style={[styles.container, styles.horizontal]}>
            //    <ActivityIndicator size="large" color="#ef6858" />
            // </View>
            <View style={styles.container}>
               <Text style={{ fontSize: 20 ,color:'black'}}>Make a new friends...</Text>
            </View>

         )
      } 
      // else if (!this.state.friends) {
      //    return (
      //       <View style={styles.container}>
      //          <Text style={{ fontSize: 20 }}>No folowers</Text>
      //       </View>
      //    )
      // } 
      else {
         return (
            <View style={{ backgroundColor: '#fff' }}>
               <ScrollView>
                  <View style={{ marginBottom: 20 }}>
                     <FlatList
                        data={this.state.friends}
                        renderItem={({ item }) =>
                           <View style={{ flexDirection: 'row' }}>
                              <TouchableOpacity
                                 style={{ flex: 8 }}
                                 onPress={() => this.props.navigation.navigate('UserProfile', { userId: item._id })}
                              >
                                 <Text style={styles.text}>{item.userName}</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                 style={[styles.button1, { backgroundColor: this.state.ButtonStateHolder ? '#607D8B' : '#0099e7' }]}
                                 disabled={this.state.ButtonStateHolder}
                                 onPress={() => this.handleClickUnfollow(item)}>
                                 <Text style={{ textAlign: 'center', marginTop: 5, color: 'white' }}>Unfollow</Text>
                              </TouchableOpacity>
                           </View>
                        }
                     />
                  </View>
               </ScrollView>
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
   button1: {
      marginTop: 15,
      height: 33,
      padding: 0,
      width: 70,
      backgroundColor: '#0099e7',
      borderRadius: 3,
      marginRight: 15,

   },
   container: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1
   },
   horizontal: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10
   },

})
