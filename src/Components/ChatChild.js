import React, { Component } from "react";
import io from "socket.io-client";
import axios from "axios";

class ChatChild extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      previousRoom: props.previousRoom,
      roomKey: props.roomKey,
      message: {
        senderID:0,
        text:'',
        timeStamp:Date
      },
      userTyping: false
    };
    //changed from 5000 to 3000
    this.socket = io.connect(":3000");

    this.socket.on("generate room response", data => this.roomResponse(data));
    this.socket.on("user is typing", data => this.setUserTyping(data));
    this.socket.on(`user not typing`, data => this.removeUserTyping(data));
  }
  componentDidMount() {
    if (this.props.roomKey) {
      console.log("will join rooom ", this.props.roomKey);
      this.socket.emit("join room", { roomKey: this.props.roomKey });
    }
  }
  componentDidUpdate() {
    if (this.props.roomKey) {
      //might need to add a condtion to see if previous and current are different.
      console.log(
        "leaving ",
        this.props.previousRoom,
        " and joining ",
        this.props.roomKey
      );
      this.socket.emit("leave room", { roomKey: this.props.previousRoom });
      this.socket.emit("join room", { roomKey: this.props.roomKey });
    }
  }

  roomResponse(data) {
    this.setState({ messages: [...this.state.messages, data.message] });
  }

  sendMessage = (type, message) => {
    axios.post('/send', message).then((res) =>{
      console.log('It is finished.')
    })
    this.socket.emit(`${type} message to room`, {
      message: message,
      roomKey: this.props.roomKey
    });
    // }
    this.setState({ message: {
      senderID:0,
      text:'',
      timeStamp:Date()} }, () =>
      
      this.socket.emit("user not typing", { roomKey: this.props.roomKey })
    );
  };

  updateInput(val) {
    this.setState({ 
      message: {
        senderID:this.props.userID,
        text:val,
        timeStamp:Date()
      }
     }, () => {
      if (this.state.message.text)
        this.socket.emit("user is typing", { roomKey: this.props.roomKey });
      else this.socket.emit("user not typing", { roomKey: this.props.roomKey });
    });
  }

  setUserTyping(data) {
    if (data.roomKey === this.props.roomKey) this.setState({ userTyping: true });
    else if (!data.roomKey && !this.props.roomKey)
      this.setState({ userTyping: true });
  }
  removeUserTyping(data) {
    if (data.roomKey === this.props.roomKey) this.setState({ userTyping: false });
    else if (!data.roomKey && !this.props.roomKey)
      this.setState({ userTyping: false });
  }

  render() {
    const messagesList = this.state.messages.map((message, index) => {
      if(index === this.state.messages.length-1){
        let mostRecent = new Date(message.timeStamp);

        return <p key={index}>{message.text} <br/>{`${mostRecent.getHours()}:${mostRecent.getMinutes()}:${mostRecent.getSeconds()}`}</p>;
      }
      return <p key={index}>{message.text}</p>;
    });
    return (
      <div className="container">
        <div className="row">
          <div className="col-4">
            <div className="card">
              <div className="card-body">
                <div className="card-title">
     
                    User:{this.props.userName}
                    <br/>
                    Chatting With:{this.props.chattingWith}
                </div>
                <hr />
              </div>
              <div className="card-footer">

                <div className="messages">{messagesList}</div>
                {this.state.userTyping && (
                  <p className="user-typing">Another User is Typing</p>
                )}
                <br />
                <input
                  type="text"
                  onChange={e => this.updateInput(e.target.value)}
                  className="form-control"
                  value={this.state.message.text}
                />
                <br />
                <button
                  onClick={() => this.sendMessage("blast", this.state.message)}
                  className="btn btn-primary form-control"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default ChatChild;
