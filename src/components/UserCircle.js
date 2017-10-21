import React, { Component } from 'react';
import '../styles/UserCircle.css'


export default class App extends Component {

render(){
var {name, fb, friends, size} = this.props;
size = `${size*400}px`;

let circleStyle = {
  height: size,
  width: size
}
  return(
    <div className="circle-container" style={circleStyle}>
    <div className="circle-text">
      {name}
    </div>
    <div className="circle-text">
    Facebook: {fb}
    </div>
    <div className="circle-text">
    Friends = {friends}
    </div>
    </div>
  );
}



}
