import * as firebase from "firebase";
import React from 'react';
import MyPrettyGraph from './MyPrettyGraph';


export default class RenderEngine extends React.Component{
constructor(props){
  super(props);
  this.state = {nodes:[], edges: []};
  // this.createNodes = this.createNodes.bind(this);
}

calculateScore(){

}


componentWillMount(){
  console.log("CALLED")
  const colors = ["#e23b3b", "#e09c41", "#e0df41", "7be041", "#41e0c9"];
  firebase.database().ref(`/geohashes/${this.props.previoushash}`).on('value',(snapshot)=>{
    snapshot.forEach((child)=>{
      var val = child.val();
      var id = Number(val.fb_id);
      var num_friends = val.num_friends;
      var labelString = `${val.name}\n Friends: ${num_friends}`;
      this.state.nodes.push({
        id: id,
        label: labelString,
        color: colors[id%5]
      });
    });

    snapshot.forEach((child)=>{
      var friends = child.child('friends');

      friends.forEach((friend)=>{
        var key = friend.key;

        console.log(key);
        this.state.nodes.forEach((node)=>{
          if(key.indexOf(node.id) > 0){
            this.state.edges.push({
              from: key,
              to: node.id
            });
          }
        });
      });
    });
  });
console.log(this.state.edges);
console.log(this.state.nodes)
}

createEdges(){

}



  render(){
    const graph = {
      nodes: this.state.nodes,
      edges:this.state.edges
    };
    return (

      {<MyPrettyGraph graph={graph}/>}
    );
  }
}
