import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
// import UserCircle from './components/UserCircle';
// import GChart from './components/GChart';
import * as firebase from "firebase";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import graph from 'fb-react-sdk';
import Geohash from 'latlon-geohash'


var config = {
  apiKey: "AIzaSyBc9VGjprDNigBP-2TUAai1wpfmH9cqhBU",
  authDomain: "pepo-ed60b.firebaseapp.com",
  databaseURL: "https://pepo-ed60b.firebaseio.com",
  projectId: "pepo-ed60b",
  storageBucket: "pepo-ed60b.appspot.com",
  messagingSenderId: "927182581965"
};
firebase.initializeApp(config);

let data = [
  {
    name: "Wis",
    fb: "wisk",
    friends: 200,
    key: 1

  },
  {
    name: "Matt",
    fb: "mhrice",
    friends: 80,
    key: 2

  },
]

class App extends Component {

constructor(props){
  super(props);
  this.state = {loggedIn: false, prevHash: null};
  this.login = this.login.bind(this);
}

updateUserLocation(user)
{
  if("geolocation" in navigator)
  {
    navigator.geolocation.getCurrentPosition((position) => {
      var geohash = Geohash.encode(position.coords.latitude,
                                   position.coords.longitude,
                                   this.precision);

      if(geohash != this.state.prevHash)
      {
        // fan out geohash change
        var ref = firebase.database().ref();
        var fanoutObject = {};

        if(this.state.prevHash) fanoutObject['/geohashes/' + this.state.prevHash + '/' + user.uid] = null;
        fanoutObject['/geohashes/' + geohash + '/' + user.uid] = { name: user.displayName, profile_pic: user.photoURL };
        fanoutObject['/users/' + user.uid + '/geohash'] = geohash;

        // Store geohash
        this.setState({ prevHash: geohash });

        // atomic update
        ref.update(fanoutObject);
      }
    }, (err) => {
      // error handling here
      console.log("Geolocation error");
    })
  }
}

removeUserLocation(user)
{
  if(!this.state.prevHash)
    firebase.database().ref('/geohashes/' + this.state.prevHash + '/' + user.uid).remove();
}

 login() {
   var provider = new firebase.auth.FacebookAuthProvider();
   provider.addScope('user_friends');
   firebase.auth().signInWithPopup(provider).then((result)=> {
   // This gives you a Facebook Access Token.
   var token = result.credential.accessToken;
   // The signed-in user info.
   var user = result.user;

   console.log(result);

   this.updateUserLocation(result.user);

  this.setState({
    loggedIn: true
  });
  var uid = user.uid;

graph.setAccessToken(token);
graph.get(`/me/friends`, function(err, res) {
        // returns the post id
        console.log(res); // { id: xxxxx}
    });

}).catch((e)=>{
  console.log(e);
  window.location.href = "https://www.google.com";
});
 }

 renderGraph(){
   if(this.state.loggedIn){
    //  return <GChart />
   }
   else {
    return <RaisedButton label="Log In" primary={true} onClick={this.login} />
   }
 }


  render() {
    return (
      <MuiThemeProvider>
      <div className="App">
      {this.renderGraph()}
      </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
