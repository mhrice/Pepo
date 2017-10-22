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
  height: '800px',
  width: '100%'
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
var edges = [];
var nodes = [];


function createGraph(){

    console.log("CALLED")
    const colors = ["#e23b3b", "#e09c41", "#e0df41", "7be041", "#41e0c9"];
    firebase.database().ref(`/geohashes/${this.props.previoushash}`).on('value',(snapshot)=>{
      snapshot.forEach((child)=>{
        var val = child.val();
        var id = (val.fb_id);
        var num_friends = val.num_friends;
        var labelString = `${val.name}\n Friends: ${num_friends}`;
        nodes.push({
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
          // this.state.nodes.forEach((node)=>{

              edges.push({
                from: (child.val().fb_id),
                to: (key)
              });

        });
      });
    });
Promise.resolve();

}
export function renderGraph(){
  var graph;
          let prom = new Promise(createGraph(Promise.resolve, Promise.reject)).then(()=>{
            graph = {
              nodes:nodes,
              edges:edges
            }
            console.log(graph);
          });
          return graph;
}
