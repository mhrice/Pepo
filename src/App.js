import React, {Component} from 'react';
import './App.css';
// import UserCircle from './components/UserCircle';
import * as firebase from "firebase";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import graph from 'fb-react-sdk';
import Geohash from 'latlon-geohash';
import Close from 'material-ui/svg-icons/navigation/close';
import IconButton from 'material-ui/IconButton';
// import Game_Vis from './components/Game_Vis';
// import RenderEngine from './components/RenderEngine';
import MyPrettyGraph from './components/MyPrettyGraph';
import ChatInterface from './components/ChatInterface';

var config = {
  apiKey: "AIzaSyBc9VGjprDNigBP-2TUAai1wpfmH9cqhBU",
  authDomain: "pepo-ed60b.firebaseapp.com",
  databaseURL: "https://pepo-ed60b.firebaseio.com",
  projectId: "pepo-ed60b",
  storageBucket: "pepo-ed60b.appspot.com",
  messagingSenderId: "927182581965"
};
firebase.initializeApp(config);

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      prevHash: null,
      uid: "",
      friendsArray: null,
      num_friends: 0,
      renderEngineReady: false
    };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.renderGraph = this.renderGraph.bind(this);
  }
  updateUserFriends(friendsArray) {
    // var ref = firebase.database().ref();
    // var fanoutObject = {};
    // fanoutObject[`/users/${this.state.uid}/friends/`] = friendsArray;
    //
    //
    // ref.update(fanoutObject);

    friendsArray = friendsArray.map((friend) => {
      let id = friend.id;
      return {[id]: true}

    });

  }

  updateUserLocation(user, fb_id)
  {
    this.setState({
      renderEngineReady: false
    });
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        var geohash = Geohash.encode(position.coords.latitude, position.coords.longitude, this.precision);
        console.log(position.coords.latitude, position.coords.longitude);
        if (geohash !== this.state.prevHash) {
          // fan out geohash change
          var ref = firebase.database().ref();
          var fanoutObject = {};

          if (this.state.prevHash)
            fanoutObject['/geohashes/' + this.state.prevHash + '/' + this.state.uid] = null;

          fanoutObject['/geohashes/' + geohash + '/' + this.state.uid] = {
            name: user.displayName,
            profile_pic: user.photoURL,
            fb_id: fb_id,
            friends: this.state.friendsArray,
            num_friends: this.state.num_friends
          };
          fanoutObject['/users/' + this.state.uid + '/geohash'] = geohash;
          // Store geohash
          this.setState({prevHash: geohash});

          // atomic update
          ref.update(fanoutObject);
            this.setState({renderEngineReady: true})
        }

      }, (err) => {
        // error handling here
        console.log("Geolocation error");
      })
    }
  }

  removeUserLocation()
  {
    if (this.state.prevHash)
      firebase.database().ref('/geohashes/' + this.state.prevHash + '/' + this.state.uid).remove();
    }

  login() {
    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('user_friends');
    firebase.auth().signInWithPopup(provider).then((result) => {
      // This gives you a Facebook Access Token.

      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;

      let uid = user.uid;
      let fb_id = result.additionalUserInfo.profile.id;

      this.setState({loggedIn: true, uid: uid});

      graph.setAccessToken(token);
      graph.get(`/me/friends`, (err, res) => {
        // returns the post id
        console.log(res); // { id: xxxxx}
        let friendsArray = res.data;
        let friendsObject = {};
        let num_friends = res.summary.total_count
        friendsArray.forEach((friend) => {
          let id = friend.id;
          friendsObject[id] = true;
        });
        this.setState({friendsArray: friendsObject, num_friends: num_friends});
        this.updateUserLocation(result.user, fb_id);
        // this.updateUserFriends(friendsArray);
        setTimeout(() => {
          // alert(this.state.uid);
          firebase.database().ref(`/users/${this.state.uid}/fb_id`).set(fb_id);
          firebase.database().ref(`/users/${this.state.uid}/num_friends`).set(num_friends);
          friendsArray.forEach((friend) => {
            let id = friend.id;
            firebase.database().ref(`/users/${this.state.uid}/friends`).set({[id]: true});
          });
        }, 1000);

      });


    }).catch((e) => {
      console.log(e);
      // window.location.href = "https://www.google.com";
    });
  }

  logout() {
    this.removeUserLocation();
    this.setState({loggedIn: false, prevHash: null, uid: ""})
    firebase.auth().signOut().then(() => {

      // Sign-out successful.
    }, (error) => {
      // An error happened.
    });
  }

  renderGraph() {
    if (this.state.loggedIn) {
      //  return <GChart />
      return <RaisedButton label="Log Out" primary={true} onClick={this.logout}/>

    } else {
      this.setState({loggedIn: true})
      return <RaisedButton label="Log In" primary={true} onClick={this.login}/>
    }
  }

  render() {
    let button = null;
    let theGraph = null;
    let close = null;
    let chat = null;
    const isLoggedIn = this.state.loggedIn;
    if (isLoggedIn) {
      chat = <ChatInterface location = {this.state.prevHash} />
      button = null;
      close = <IconButton tooltip="Close" className="close" onClick={this.logout} ><Close hoverColor={'red'} /></IconButton>
      if(this.state.renderEngineReady){
        theGraph = <MyPrettyGraph previoushash = {this.state.prevHash} />
        // this.setState(titleStyle: 'float:left')
      }
    } else {
      chat = <div></div>;
      button = <RaisedButton label="Log In" primary={true} onClick={this.login} className="login"/>
      close = null;

      // theGraph = <RenderEngine previoushash = {this.state.prevHash} />
      theGraph = null;

  }

    return (
      <MuiThemeProvider>
        <div className="App">
        <div className="title-container">
        <div className="Title">
        Pepo
          </div>
                {close}
        </div>
        <div className = "button-div">
        {button}
        </div>
        <div className="body-container">

          {theGraph}
      </div>

        {chat}

        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
