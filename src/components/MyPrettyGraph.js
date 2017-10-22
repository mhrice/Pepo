import React from 'react';
// var Graph = require('react-graph-vis');
import Graph from 'react-graph-vis';
import '../styles/graph.css';
import * as firebase from "firebase";




const options = {
  layout: {
    hierarchical: false
  },
  edges: {
    arrows:{
      to:{
        enabled: false,

      },

    },
    width: 20,
    color: "#000000",
    font:{
      face: 'Montserrat',
      size: 20,
    },
    smooth: true
  },
  nodes: {
    borderWidth: 0,
    shape: 'circularImage',
    image: 'https://scontent.xx.fbcdn.net/v/t1.0-1/p100x100/12938356_1002700309812212_5687568132096036639_n.jpg?oh=81d972001cabf9fce3baf8f5c8778dbe&oe=5A7A0F01',
    widthConstraint: {
      minimum: 70
    },
    shadow:{
      enabled: true,
      color: "#e0e0e0",
      x: 0,
      y: 0,
      size: 20
    }
  },
  interaction: {
    hover: true
  },
  height: '400px',
  width: '1250px'
};

const events = {
  select: function(event) {
    var { nodes, edges } = event;
    console.log("Selected nodes:");
    console.log(nodes);
    console.log("Selected edges:");
    console.log(edges);
  }
};

export default class MyPrettyGraph extends React.Component {
  constructor(props){
    super(props);
    this.state = { nodes: [], edges:[], renderReady: false, graph: {} }
    // this.renderGraph = this.renderGraph.bind(this);
  }
  componentWillMount(){
    const colors = ["#e23b3b", "#e09c41", "#e0df41", "7be041", "#41e0c9"];
    firebase.database().ref(`/geohashes/${this.props.previoushash}`).on('value',(snapshot)=>{
      snapshot.forEach((child)=>{
        var val = child.val();
        var id = Number(val.fb_id);
        var num_friends = val.num_friends;
        let size = num_friends / 300 * 30+5;
        var labelString = `${val.name}\n Friends: ${num_friends}`;
        this.state.nodes.push({
          id: id,
          label: labelString,
          color: colors[id%5],
          size: size
        });
      });

      snapshot.forEach((child)=>{
        var friends = child.child('friends');

        friends.forEach((friend)=>{
          var key = friend.key;


              this.state.edges.push({
                from: Number(child.val().fb_id),
                to: Number(key)
              });
              setTimeout(()=>{
              }, 1000)
        });
      });
      this.setState({
        renderReady: true
      })
    });
  }
  render(){
    let theGraph = null;
    // this.state.edges.push({to: 80, from: 1505097026239202})
    this.state.edges.push({});
    if(this.state.renderReady){
      theGraph=null;
        let graph = {
          nodes:this.state.nodes,
          edges: this.state.edges
        }

        theGraph = <Graph graph={graph} options={options} events={events} />
      // console.log(graph.edges)
    }
    return(

      <div className="graph-container">
    {theGraph}
      </div>
    );



  }
}
