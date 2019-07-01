
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TextInput, Button, FlatList, Image, ScrollView, TouchableOpacity, AsyncStorage, Dimensions, ActivityIndicator, Alert, ToastAndroid, Modal, Animated, BackHandler, CameraRoll } from 'react-native';
import Config from './config';
import axios from 'axios';
import { PermissionsAndroid } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Popover from 'react-native-popover-view';
import RNFetchBlob from "rn-fetch-blob";
import RNFS from 'react-native-fs';
import { EventRegister } from 'react-native-event-listeners';
let { width } = Dimensions.get('screen');
import { TabNavigator } from 'react-navigation';
import ParsedText from 'react-native-parsed-text';
import RBSheet from "react-native-raw-bottom-sheet";
import { StackActions, NavigationActions } from 'react-navigation';

let config = new Config();

export default class Post extends Component {
  constructor(props) {
    super(props)
    global.curruntUserId = ""
    this.springValue = new Animated.Value(100);
    this.state = {
      post: [],
      like: [],
      comment: '',
      isVisible: false,
      popoverAnchor: { x: 90, y: 200, width: 80, height: 60 },
      likeCount: 0,
      visible: false,
      ButtonStateHolder: false,
      User: [],
      modalVisible: false,
      animation: new Animated.Value(0),
      postId: '',
      backClickCount: 0,
      page: 1
    };
    this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.componentDidMount();
      });
  }
  componentDidMount = async () => {
    let userId;
    try {
      const curruntUser = await AsyncStorage.getItem('curruntUser');
      if (curruntUser) {
        userId = JSON.parse(curruntUser);
        console.log("value===+++++++++++++++++++++===========================>", userId.data._id);
        global.curruntUserId = userId.data._id
      }
    } catch (error) {
      Console.log("errr=====>", err)
    }
    this.getMyFriendsPost();

  }
  getMyFriendsPost = () => {
    fetch(config.getBaseUrl() + "post/get-my-friends-post/" + global.curruntUserId)
      .then((Response) => Response.json())
      .then((response) => {
        console.log('all friends postttttttttttttttttttttttttttt===================>', response);
        console.log("]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]", Object.keys(response.friendsPost[0]).length);
        if (Object.keys(response.friendsPost[0]).length > 1) {
          for (let i = 0; i < response.friendsPost.length; i++) {
            console.log("{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{")
            for (let j = 0; j < response.friendsPost[i].like.length; j++) {
              if (global.curruntUserId == response.friendsPost[i].like[j]) {
                console.log("=================liked=====================")
                response.friendsPost[i].isLiked = true
              } else {
                console.log("===================un liked=====================")
                response.friendsPost[i].isLiked = false
              }
            }
          }
        }
        this.setState(prevState => ({
          post: response
        }))
      }, function (err) {
        console.log(err);
      })
  }

  like = async (postId) => {
    let userId;
    let curruntUser = await AsyncStorage.getItem('curruntUser');
    userId = JSON.parse(curruntUser);
    console.log('userId======================>', userId.data._id);
    console.log('postId============================>', postId);
    let apiBaseUrl = config.getBaseUrl() + "post/like";
    console.log('apiBaseUrl===========>', apiBaseUrl);
    let payload = {
      "postId": postId,
      "userId": userId.data._id
    }
    axios.post(apiBaseUrl, payload)
      .then(function (response) {
        console.log("-------------------------------------------------------------------------------------------");
        console.log("response of  like=================>", response.data);
        console.log("like successfull");
      }, function (err) {
        console.log(err);
      })
    setTimeout(() => {
      this.getMyFriendsPost();
    }, 200)
  }
  comment = async (postId) => {
    console.log('data=============================>', postId);
    this.setState({
      ButtonStateHolder: true
    })
    if (!this.state.comment) {
      ToastAndroid.show('Enter any comment', ToastAndroid.SHORT);
      this.setState({
        ButtonStateHolder: false
      })
    } else {
      let userId;
      let curruntUser = await AsyncStorage.getItem('curruntUser');
      userId = JSON.parse(curruntUser);
      console.log('userId======================>', userId.data._id);
      console.log('postId============================>', postId);
      let apiBaseUrl = config.getBaseUrl() + "comment/addcomment";
      console.log('apiBaseUrl===========>', apiBaseUrl);
      let payload = {
        "postId": postId,
        "userId": userId.data._id,
        "comment": this.state.comment
      }
      axios.post(apiBaseUrl, payload)
        .then(function (response) {
          console.log("comment successfull");
        }, function (err) {
          console.log(err);

        })
      this.setState(prevState => ({
        comment: '',
        ButtonStateHolder: false
      }))
      setTimeout(() => {
        this.getMyFriendsPost();
      }, 200)

    }
  }
  savePostImage = (data) => {
    console.log("=====================", data);
    this.setState(
      {
        visible: true,
        ButtonStateHolder: true
      },
      () => {
        this.hideToast();
      },
    );
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          'title': 'Storage',
          'message': 'This app would like to store some files on your phone'
        }
      ).then(() => {
        let dirs = RNFetchBlob.fs.dirs.DownloadDir;
        RNFetchBlob
          .config({
            // response data will be saved to this path if it has access right.
            fileCache: true,
            addAndroidDownloads: {
              title: data,
              path: dirs + '/' + data,
              ext: "jpg",
              useDownloadManager: true,
              description: "fileName",
              notification: true,
            }
          })
          .fetch('GET', config.getMediaUrl() + data, {
          })
          .then((res) => {
            console.log('The file saved to ', res)
          })
      })
    } else {
      CameraRoll.saveToCameraRoll(config.getMediaUrl() + data)
        .then(Alert.alert('Success', 'Photo added to camera roll!'))
    }
    setTimeout(() => {
      this.setState({ ButtonStateHolder: false })
    }, 700)
  }

  hideToast = () => {
    this.setState({
      visible: false,
    });
  };
  profilePic = (profilePhoto) => {
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

  commentProfile = (comment) => {
    if (!comment.userId.profilePhoto) {
      return (
        <Image resizeMode='cover' style={styles.profile}
          source={require('../images/profile.png')}
        />
      )
    } else {
      return (
        <Image resizeMode='cover' style={styles.profile} source={{ uri: config.getMediaUrl() + comment.userId.profilePhoto }} />
      )
    }

  }
  displayComment = (item) => {
    if (item.comment.length > 3) {
      console.log("=======moe than 3 comments===========");
      return (
        item.comment.slice(-3).map((comment) => {
          console.log('comment ======================>', comment);
          let count = Object.keys(comment).length;
          console.log("=]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]count=============>", count);
          if (comment && count > 0) {
            console.log("========================in If=======================", count);
            return (
              <View>
                <View style={{ flexDirection: 'row' }}>
                  {this.commentProfile(comment)}
                  <View style={{ marginTop: 5, marginLeft: 15 }}>
                    <TouchableOpacity
                      onPress={() => this.props.navigation.navigate('UserProfile', { userId: comment.userId._id })}
                    >
                      <Text style={{ fontWeight: 'bold', color: 'black', marginLeft: 10 }}>{comment.userId.userName}</Text>
                    </TouchableOpacity>
                    <Text style={styles.text}>{comment.comment}</Text>
                  </View>
                </View>
              </View>
            )
          } else {
            console.log("========================in else=======================", count);
            return (
              null
            )
          }
        }).reverse()
      )
    } else {
      return (
        item.comment.map((comment) => {
          console.log('comment ======================>', comment);
          let count = Object.keys(comment).length;
          console.log("=]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]count=============>", count);
          if (comment && count > 0) {
            console.log("========================in If=======================", count);
            return (
              <View>
                <View style={{ flexDirection: 'row' }}>
                  {this.commentProfile(comment)}
                  <View style={{ marginTop: 5, marginLeft: 15 }}>
                    <TouchableOpacity
                      onPress={() => this.props.navigation.navigate('UserProfile', { userId: comment.userId._id })}
                    >
                      <Text style={{ fontWeight: 'bold', color: 'black', marginLeft: 10 }}>{comment.userId.userName}</Text>
                    </TouchableOpacity>
                    <Text style={styles.text}>{comment.comment}</Text>
                  </View>
                </View>
              </View>
            )
          } else {
            console.log("========================in else=======================", count);
            return (
              null
            )
          }
        }).reverse()
      )
    }
  }

  displayCommentCount = (item) => {
    console.log("item.comment============>", item.comment[0])
    let count = Object.keys(item.comment[0]).length;
    console.log('count=======in count=============>', count);
    if (count) {
      return (
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('SinglePost', { id: item._id })}>
          <Text style={{ marginLeft: 10 }}>All {item.comment.length} comments</Text>
        </TouchableOpacity>
      )
    } else {
      return (
        null
      )
    }

  }
  sharePost = (postId) => {
    console.log(" share postid ====================================> ", postId);
    this.RBSheet.open();
    fetch(config.getBaseUrl() + "user/get-all-user").
      then((Response) => Response.json()).
      then((response) => {
        console.log('all user===============================>', response);
        this.setState(prevState => ({
          User: response,
          postId: postId
        }))
      }, function (err) {
        console.log(err);
      })
  }
  sendPost = (userId) => {
    console.log("========================sharepost ======================================", userId, this.state.postId, global.curruntUserId);
    this.setState({ ButtonStateHolder: true })
    let apiBaseUrl = config.getBaseUrl() + "message/sharepost";
    console.log('apiBaseUrl===========>', apiBaseUrl);
    let payload = {
      "postId": this.state.postId,
      "srcId": global.curruntUserId,
      "desId": userId
    }
    axios.post(apiBaseUrl, payload)
      .then(function (response) {
        console.log("Shared post successfullllllllllllll=================", response.data);
      }, function (err) {
        console.log(err);
      })
    this.RBSheet.close();
    setTimeout(() => {
      this.getMyFriendsPost();
    }, 200)
  }
  render() {
    const Toast = (props) => {
      if (props.visible) {
        ToastAndroid.showWithGravityAndOffset(
          props.message,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          140,
        );
        return null;
      }
      return null;
    };
    console.log("postttttttttttttttttttttt================================>", this.state.post);
    console.log("post=================friend===============>", this.state.post.friendsPost);
    console.log("comment================================>", this.state.comment);
    let friendpostarr = this.state.post.friendsPost;
    if (!friendpostarr) {
      return (
        <>
          <View style={[styles.container, styles.horizontal]}>
            <ActivityIndicator size="large" color="#ef6858" />
          </View>
        </>
      )
    }
    else if (friendpostarr[0].comment.length > 0 && Object.keys(friendpostarr[0]).length > 2 && Object.keys(friendpostarr[0].comment).length > 2) {
      return (
        <>
          <View style={{ height: 50, elevation: 3, backgroundColor: 'white' }}>
            <Text style={{ fontSize: 20, top: 10, left: 20 }}>Posts</Text>
            <TouchableOpacity
              style={{ position: 'absolute', right: 10, top: 15, }}
              onPress={() => this.props.navigation.navigate('Message')}
            >
              <Image style={{ height: 25, width: 25 }}
                source={require('../images/Share_icon.png')}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            data={friendpostarr}
            renderItem={({ item }) =>
              <View style={styles.card}>
                <View>
                  <View style={{ flexDirection: 'column' }}>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ flex: 10 }}>
                        <View style={{ flexDirection: 'row' }}>
                          <View>
                            {this.profilePic(item.userId.profilePhoto)}
                          </View>
                          <View>
                            <TouchableOpacity
                              onPress={() => this.props.navigation.navigate('UserProfile', { userId: item.userId._id })}
                            >
                              <Text style={styles.userName}>{item.userId.userName}</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Icon onPress={() => { this.savePostImage(item.images) }}
                          name="file-download"
                          size={30}
                          color={this.state.ButtonStateHolder ? '#C0C0C0' : '#696969'}
                          disabled={this.state.ButtonStateHolder}
                          style={{ marginTop: 13 }}
                        />
                        <Toast visible={this.state.visible} message="Downloading..." />
                      </View>
                    </View>
                    <Image resizeMode='cover' style={styles.img} source={{ uri: config.getMediaUrl() + item.images }} />
                  </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <View style={{ flexDirection: 'row', flex: 9 }}>
                    {item.isLiked ? (<Icon name="favorite"
                      size={25}
                      onPress={() => this.like(item._id)}
                      style={{ marginLeft: 10, color: '#cd1d1f' }}
                    />) : (<Icon name="favorite-border"
                      size={25}
                      onPress={() => this.like(item._id)}
                      style={styles.like}
                    />)}
                    {item.like.length > 0 ? ((item.like.length == 1 ? (<Text style={styles.likeText}>{item.like.length} like</Text>) : (<Text style={styles.likeText}>{item.like.length} likes</Text>))) : (null)}
                  </View>
                  <View style={{ flexDirection: 'row', flex: 3, right: 10, position: 'absolute' }}>
                    {item.sharePostCount != 0 ? (<Text style={[styles.likeText, { marginRight: 9 }]}>{item.sharePostCount} Share</Text>) : (null)}
                    <TouchableOpacity
                      onPress={() => this.sharePost(item._id)}
                    >
                      <Image style={{ height: 20, width: 20, marginTop: 7 }}
                        source={require('../images/Share_icon.png')}
                      />
                    </TouchableOpacity>

                  </View>
                </View>
                <View style={{ marginBottom: 10 }}>
                  <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <TouchableOpacity
                      onPress={() => this.props.navigation.navigate('UserProfile', { userId: item.userId._id })}
                    >
                      <Text style={{ fontWeight: 'bold', color: 'black', marginLeft: 10, textTransform: 'capitalize' }}>{item.userId.userName}</Text>
                    </TouchableOpacity>
                    <ParsedText
                      style={styles.text}
                      parse={
                        [
                          { pattern: /#(\w+)/, style: styles.hashTag },
                        ]
                      }
                      childrenProps={{ allowFontScaling: false }}
                    >
                      {item.content}
                    </ParsedText>

                  </View>
                  <View style={{ marginBottom: 10, flexDirection: 'row' }}>
                    <View style={{ flex: 10 }}>
                      <TextInput
                        onChangeText={(text) => this.setState({ comment: text })}
                        placeholder={'Comment here....'}
                        style={styles.input}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <TouchableOpacity style={styles.button}
                        onPress={() => this.comment(item._id)}
                        disabled={this.state.ButtonStateHolder}>
                        <Icon
                          name="send"
                          size={25}
                          color={this.state.ButtonStateHolder ? '#C0C0C0' : '#696969'}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('SinglePost', { id: item._id })}
                  >
                  </TouchableOpacity>
                  {this.displayCommentCount(item)}
                  {this.displayComment(item)}
                </View>
                <View style={{ marginBottom: 10 }}>
                  <RBSheet
                    ref={ref => {
                      this.RBSheet = ref;
                    }}
                    height={400}
                    duration={250}
                    customStyles={{
                      container: {
                        borderTopLeftRadius: 15,
                        borderTopRightRadius: 15
                      }
                    }}
                  >
                    <View>
                      <ScrollView>
                        {this.state.User.map((user) =>
                          <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 2 }}>
                              {this.profilePic(user.profilePhoto)}
                            </View>
                            <TouchableOpacity
                              style={{ flex: 8 }}
                              onPress={() => { this.props.navigation.navigate('UserProfile', { userId: user._id }), this.RBSheet.close(); }}
                            >
                              <Text style={{ marginTop: 10, color: 'black', fontSize: 18, marginLeft: 10 }}>{user.userName}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.button1, { backgroundColor: this.state.ButtonStateHolder ? '#607D8B' : '#0099e7', flex: 3 }]}
                              disabled={this.state.ButtonStateHolder}
                              onPress={() => this.sendPost(user._id, item._id)}
                            >
                              <Text style={{ textAlign: 'center', marginTop: 5, color: 'white' }}>Send</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </ScrollView>
                    </View>
                  </RBSheet>
                </View>
              </View>
            }
          />

        </>
      );
    } else {
      return (
        <>
          <View style={{ height: 50, elevation: 3, backgroundColor: 'white' }}>
            <Text style={{ fontSize: 20, top: 10, left: 20 }}>Posts</Text>
            <TouchableOpacity
              style={{ position: 'absolute', right: 10, top: 15, }}
              onPress={() => this.props.navigation.navigate('Message')}
            >
              <Image style={{ height: 25, width: 25 }}
                source={require('../images/Share_icon.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <Text >No post yet</Text>
          </View>
        </>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  input: {
    height: 35,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: '#C0C0C0',
    padding: 0,
    borderRadius: 5,
    marginLeft: 10,
  },
  button: {
    marginTop: 3,
    position: 'absolute',
    marginLeft: 5
  },
  MainContainer:
  {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: (Platform.OS === 'ios') ? 20 : 0
  },
  textStyle: {
    color: '#fff',
    fontSize: 22
  },
  footer: {
    flexDirection: 'column', flex: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    elevation: 5,
    color: 'white',
    backgroundColor: 'white',
    borderBottomColor: '#ddd',
    borderBottomWidth: 2,
  },
  img: {
    height: 325,
    width: width * 1,
    marginTop: 10
  },
  buttons: {
    backgroundColor: 'white',
    height: 30,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    color: 'black'
  },
  userName: {
    color: 'black',
    fontSize: 18,
    marginLeft: 20,
    marginTop: 13,
    fontWeight: 'bold',
    textTransform: 'capitalize'
  },
  text: {
    color: 'gray',
    fontSize: 15,
    marginLeft: 10,
    flex: 1,
    flexWrap: 'wrap'
  },
  like: {
    color: '#696969',
    marginLeft: 10,

  },
  likeText: {
    color: 'black',
    marginLeft: 9,
    marginTop: 4
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  },
  profile: {
    borderRadius: 20,
    height: 40,
    width: 40,
    marginTop: 5,
    left: 10,
    borderColor: 'lightgray',
    borderWidth: 2,
  },
  hashTag: {
    color: '#3F729B'
  },
  sheet: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    height: "100%",
    justifyContent: "flex-end",
  },
  popup: {
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    minHeight: 80,
    alignItems: "center",
    justifyContent: "center",
  },

  button1: {
    marginTop: 15,
    height: 33,
    padding: 0,
    width: 70,
    backgroundColor: '#0099e7',
    borderRadius: 3,
    marginRight: 22,

  },
  animatedView: {
    width,
    backgroundColor: "#4b415a",
    elevation: 2,
    position: "absolute",
    bottom: 0,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  exitTitleText: {
    textAlign: "center",
    color: "#fff",
    marginRight: 10,
  },
  exitText: {
    color: "#e5933a",
    paddingHorizontal: 10,
    paddingVertical: 3
  }
});

