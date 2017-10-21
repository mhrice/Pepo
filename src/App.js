import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
// import UserCircle from './components/UserCircle';
import GChart from './components/GChart';
import * as firebase from "firebase";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import graph from 'fb-react-sdk';
// import * as twilio from './components/twilio_init';

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
  this.state = {loggedIn: false};
  this.login = this.login.bind(this);
}


 login(){
   var provider = new firebase.auth.FacebookAuthProvider();
provider.addScope('user_friends');
   firebase.auth().signInWithPopup(provider).then((result)=> {
  // This gives you a Facebook Access Token.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;

  console.log(result);

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
     return <GChart />
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
