import React, { Component } from "react";
import ChatChild from "./ChatChild";

export default class ChatParent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "None Selected",
      room:'Room 1',
      previousRoom:'Room 1',
      userGroupsSubscribed: [],
      userConversations: [],
      userFriends: []
    };
    // this.handleSelectUser = this.handleSelectUser.bind(this);
    this.changeUser = this.changeUser.bind(this);
    this.changeRoom = this.changeRoom.bind(this);


    // this.socket = io('localhost:5000');
  }
  componentDidMount
  changeUser(event) {
    if(event.target.value !== "Select"){
        this.setState({
            userName: event.target.value
        });
    }

  }
  changeRoom(event) {
    if(event.target.value !== "Select"){
        this.setState({
            previousRoom: this.state.room,
            room: event.target.value
        });
    }

  }

  render() {
    console.log('the room on state is',this.state.room)
    return (
      <div>
        <div className="conversationsList">
        <h2>Select A User</h2>
          <select value={this.state.value} onChange={this.changeUser}>
            <option value="Select">Select</option>
            <option value="Greg">Greg</option>
            <option value= "Jeff">Jeff</option>
            <option value= "Paul" >Paul</option>
          </select>
          <select value={this.state.value} onChange={this.changeRoom}>
            <option value="Select">Select</option>
            <option value="Room 1">Room 1</option>
            <option value= "Room 2">Room 2</option>
            <option value= "Room 3" >Room 3</option>
          </select>

        </div>
        <ChatChild
          userName={this.state.userName}
          room = {this.state.room}
          previousRoom = {this.state.previousRoom}
          // room = {'testroom'}
        />
      </div>
    );
  }
}
