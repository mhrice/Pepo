import React from 'react';
import Chat from 'twilio-chat';
import TextField from 'material-ui/TextField';
import {orange500, blue500} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import axios from 'axios';
import '../styles/chat.css';
// var Twilio = require('twilio');

export default class ChatInterface extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        token: '',
        chatReady: false,
        messages: [],
        newMessage: '',
        name: '',
      };
    }

componentDidMount(){
  let token, name;
  axios.post('https://pepo-server.herokuapp.com/token').then((res)=>{
    token = res.data.token;
    name = res.data.identity;
    this.setState({token: token, name: name});
  this.chatClient = new Chat(this.state.token);
    this.chatClient.initialize().then(this.clientInitiated.bind(this));
  });
}
clientInitiated = () => {
    this.setState({ chatReady: true }, () => {
      this.chatClient
              .getChannelByUniqueName('general')
              .then(channel => {
                if (channel) {
                  return (this.channel = channel);
                } else {
                  return this.chatClient.createChannel({
                    uniqueName: 'general'
                  });
                }
              })
              .then(channel => {
                this.channel = channel;
                window.channel = channel;
                return this.channel.join();
              })
              .then(() => {
                this.channel.getMessages().then(this.messagesLoaded);
                this.channel.on('messageAdded', this.messageAdded);
              });
          });
        };
  messagesLoaded = messagePage => {
      this.setState({ messages: messagePage.items });
    };

    messageAdded = message => {
      this.setState((prevState, props) => ({
        messages: [...prevState.messages, message]
      }));
    };

    onMessageChanged = event => {
      this.setState({ newMessage: event.target.value });
    };

    sendMessage = event => {
      event.preventDefault();
      const message = this.state.newMessage;
      this.setState({ newMessage: '' });
      this.channel.sendMessage(message);
      console.log(this.channel.uniqueName)
    };

    newMessageAdded = li => {
      if (li) {
        li.scrollIntoView();
      }
    };


  render(){
    const messages = this.state.messages.map(message => {
      return (
        <li key={message.sid} ref={this.newMessageAdded}>
          <b>{message.author}:</b> {message.body}
        </li>
      );
    });
    return(
            <div className="chat-container">
              <h3>Chat</h3>
              <p>Logged in as {this.state.name}</p>
              <ul className="messages">
                {messages}
              </ul>
              <form onSubmit={this.sendMessage}>

                <TextField
                  underlineStyle={{borderColor: orange500}}
                  name="message"
                  id="message"
                  onChange={this.onMessageChanged}
                  value={this.state.newMessage}
                />
                <FlatButton label="Submit" primary={true} onClick = {this.sendMessage}/>
              </form>
            </div>
    )
  }
}
