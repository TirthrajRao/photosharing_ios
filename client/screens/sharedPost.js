import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, AsyncStorage, TouchableOpacity, ScrollView, Image, ActivityIndicator, Dimensions } from 'react-native';
import Config from './config';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';

let { width } = Dimensions.get('window');
let config = new Config();

export default class SharedPost extends Component {
  constructor(props) {
    global.curruntUserId = ""
    super(props)
    this.state = {
      sharedPost: [],
    }
  }

  componentDidMount = async () => {
    fetch(config.getBaseUrl() + "message/get-shared-post-by-id/" + this.props.navigation.state.params.id).
      then((Response) => Response.json()).
      then((response) => {
        console.log('Shared posttt==================================>', response.postId.reverse());
        this.setState(prevState => ({
          sharedPost: response
        }))
      }, function (err) {
        console.log(err);
      })

  }

  profilePic = (profilePhoto) => {
    // console.log("profile pic===========================>",item.userId.profilePhoto);
    if (!profilePhoto) {
      return (
        <Image resizeMode='cover' style={styles.profile}
          source={require('../images/profile.png')}
        />
      )
    } else {
      return (
        <Image resizeMode='cover' style={styles.profile} source={{ uri: config.getMediaUrl() + profilePhoto }} />
      )
    }
  }

  showPost = () => {
    return (
      this.state.sharedPost.postId.map((item) => {
        if (item.isDelete == true) {
          console.log("====================post deleted========================");
          return (
            <View style={styles.card}>
              <View style={{ padding: 10 }}>
                <Text style={{ color: 'black', fontSize: 15 }}>Post Unavailable</Text>
                <Text style={{ flexWrap: 'wrap' }}>This Post is Unavailable because it was deleted</Text>
              </View>
            </View>
          )
        } else {
          console.log("====================post not deleted========================");
          return (
            <View style={styles.card}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 2 }}>
                  {this.profilePic(item.userId.profilePhoto)}
                </View>
                <View style={{ flex: 6 }}>
                  <Text style={styles.userName}>{item.userId.userName}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('SinglePost', { id: item._id })}
              >
                <View>
                  <Image resizeMode='contain' style={styles.img} source={{ uri: config.getMediaUrl() + item.images }} />
                </View>
              </TouchableOpacity>
              <View style={{ marginLeft: 10, padding: 10 }}>
                <Text style={{ color: 'black', fontSize: 17, fontWeight: 'bold', }}>{item.userId.userName}</Text>
              </View>
            </View>
          )
        }
      })
    )
  }

  render() {
    console.log('this.state.sharedPost===============>', this.state.sharedPost);
    let posts = this.state.sharedPost.postId;
    if (!posts) {
      return (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#ef6858" />
        </View>
      )
    } else if (!Object.keys(posts[0])) {
      return (
        <View >
          <Text>This Post was deleted</Text>
        </View>
      )
    } else {
      return (
        <View style={{ backgroundColor: 'white', flex: 1 }}>
          <ScrollView>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 2 }}></View>
              <View style={{ flex: 6 }}>
                {this.showPost()}
              </View>
            </View>
          </ScrollView>
        </View>
      )
    }
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  card: {
    color: 'white',
    width: 250,
    backgroundColor: 'white',
    borderColor: 'lightgray',
    borderWidth: 2,
    borderRadius: 17,
    marginBottom: 10,
    marginTop: 10
  },
  profile: {
    borderRadius: 20,
    height: 40,
    width: 40,
    margin: 10
  },
  text: {
    color: 'black',
    fontSize: 18,
    marginTop: 13,
    textTransform: 'capitalize'
  },
  userName: {
    color: 'black',
    fontSize: 17,
    marginLeft: 10,
    marginTop: 15,
    fontWeight: 'bold',
    textTransform: 'capitalize'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  },
  img: {
    height: 200,
    width: 246,
    marginTop: 10,
    resizeMode: 'cover',
  },
});
