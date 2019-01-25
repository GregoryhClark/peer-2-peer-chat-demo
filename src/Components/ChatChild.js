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
        author_id:0,
        message:'',
        timeStamp:Date
      },
      userTyping: false
    };
    //changed from 5000 to 3000
    this.socket = io.connect(":3000");
    // REMOVE THIS FUNCTIONALITY FOR SECURITY PURPOSES
    // this.socket.on("generate room response", data => this.roomResponse(data));
    this.socket.on("fetch new messages", data=> this.updateChat(data))
    this.socket.on("user is typing", data => this.setUserTyping(data));
    this.socket.on(`user not typing`, data => this.removeUserTyping(data));
  }
  componentDidMount() {
    if (this.props.roomKey) {
      console.log("will join rooom ", this.props.roomKey);
      this.socket.emit("join room", { roomKey: this.props.roomKey });
    }
    //THIS IS WHAT THE REAL VERSION WILL LOOK LIKE ONCE WE HAVE THE DATABASE
    // let chattingUsers = {
    //   user1:this.props.userID,
    //   user2:this.props.chattingWithID
    // }
    // axios.get(`/past_conversation/${this.props.chattingWithID}`).then(

    // )
    
    //THIS IS TEMPORARY JUST FOR CONCEPT
    axios.get('/all_messages').then((res)=>{
      this.setState({ messages: res.data });
    })
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
  // REMOVE THIS FUNCTIONALITY FOR SECURITY PURPOSES
  // roomResponse(data) {
  //   console.log(data.message)
  //   this.setState({ messages: [...this.state.messages, data.message] });
  // }
  updateChat(data) {
    if(data.userID !== this.props.userID){
      // CHANGE "all_messages" to "past_conversation" WHEN WE GET THE DATABASE SET UP
      axios.get('/all_messages').then((res)=>{
        this.setState({ messages: res.data });
      })
    }
  }


  updateInput(val) {
    this.setState({ 
      message: {
        author_id:this.props.userID,
        message:val,
        timeStamp:Date()
      }
     }, () => {
      if (this.state.message.message)
        this.socket.emit("user is typing", { roomKey: this.props.roomKey });
      else this.socket.emit("user not typing", { roomKey: this.props.roomKey });
    });
  };
  
  sendMessage = (message) => {
    axios.post('/send', message).then((res) =>{
    })
    console.log(message, this.props.roomKey, "lets see...")
    //THIS IS WHAT WE WILL REPLACE
    // this.socket.emit(`${type} message to room`, {
    //   message: message,
    //   roomKey: this.props.roomKey
    // });
    //THIS IS WHAT WE WILL REPLACE IT WITH
    this.socket.emit('notify user', {
      userID:this.props.userID,
      roomKey:this.props.roomKey
    });
    this.setState({ 
      message: {
        author_id:0,
        message:'',
        timeStamp:Date()},
        messages:[...this.state.messages, message]
       }, () =>{
          this.socket.emit("user not typing", { roomKey: this.props.roomKey })
        }
    );
  };

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
      // if(index === this.state.messages.length-1){
        // let mostRecent = message.message_timeStamp;
      // 
        // return <p key={index}>{message.message} <br/>{`${mostRecent.getHours()}:${mostRecent.getMinutes()}:${mostRecent.getSeconds()}`}</p>;
      // }

      //could not use === here since author_id is returning as a string. We should fix this later.
      if(message.author_id == this.props.userID){
        return <p className = "my_message" key={index}>ME:{message.message}</p>;
      }
      return <p className = "foreign_message" key={index}>{this.props.chattingWith}: {message.message}</p>;
    });
    return (
      <div className="container">
        <div className="row">

            <div className="card">
              <div className="card-body">
                <div className="card-title">
     
                    User:{this.props.userName}
                    <br/>
                    Chatting With:{this.props.chattingWith}
                </div>
                <hr />
                <div className="messages">{messagesList}</div>

              </div>
              <div className="card-footer">

                {this.state.userTyping && (
                  <p className="user-typing">Another User is Typing</p>
                )}
                <br />
                <input
                  type="text"
                  onChange={e => this.updateInput(e.target.value)}
                  className="form-control"
                  value={this.state.message.message}
                />
                <br />
                <button
                  onClick={() => this.sendMessage(this.state.message)}
                  className="btn btn-primary form-control"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>

    );
  }
}

export default ChatChild;
