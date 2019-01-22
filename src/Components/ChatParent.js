import React, { Component } from "react";
import ChatChild from "./ChatChild";
import axios from "axios";
import './ChatParent.css';
// import { apiRoutes } from "../utils/apiService/config";
import {REACT_APP_TOKEN, baseUrl } from "../utils/utils";

// import {
//   AccountFormModel,
//   ProfileFormModel
// } from "../utils/apiService/Models/User";
require('dotenv').config();

// const {
//   REACT_APP_TOKEN
// } = process.env;

export default class ChatParent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: 0,
      userFirstName:'',
      userLastName:'',
      chattingFirstName: "",
      chattingLastName: "",
      // userName: "None Selected",
      roomKey: "",
      previousRoomKey: "Room 1",
      userGroups: [],
      users: [],
      convos: []
      // userGroupsSubscribed: [],
      // userConversations: [],
      // userFriends: []
    };
    // this.handleSelectUser = this.handleSelectUser.bind(this);
    // this.changeUser = this.changeUser.bind(this);
    this.changeRoom = this.changeRoom.bind(this);
  }
  componentWillMount() {
    axios({
      method: "get",
      url: `${baseUrl}user/info`,
      // params: {'HTTP_CONTENT_LANGUAGE': self.language},
      headers: {
        "auth-token":REACT_APP_TOKEN
      }
    }).then(res => {
      console.log(REACT_APP_TOKEN);
      this.setState({
        userID: res.data.data.id,
        userFirstName: res.data.data.firstName,
        userLastName: res.data.data.lastName
      });
    });
    axios({
      method: "get",
      url: `${baseUrl}user/allUsers`,
      headers: {
        "auth-token":REACT_APP_TOKEN
      }
    }).then(res => {
      //Slicing here because currently I get back ALL users. This needs to change to only get affiliated users. -Greg
      let users = res.data.data.users.list.slice(0, 10);
      // console.log(users);
      this.setState({
        users: users
      });
    });
  }

  changeRoom(event) {
    if (event.target.value !== "Select") {
      // console.log("hit here", event.target.value.split(','));
      let values = event.target.value.split(',')
      //generating a string that is unique to this pair of users
      let newKey = [this.state.userID, values[0]].sort().join("");
      this.setState({
        previousRoomKey: this.state.roomKey,
        roomKey: newKey,
        chattingFirstName: values[1],
        chattingLastName: values[2]
      });
    }
  }

  render() {
    let convos = this.state.users.map(user => {
      // console.log(user)
        return (
          <button
            key={user.id}
            className="convo"
            value={[user.id, user.firstName, user.lastName]}
            onClick={this.changeRoom}
          >
            {user.firstName} {user.lastName}
          </button>
        );
      
    });
    let filteredConvos = convos.filter((button)=>{
      console.log(button.props.value[1])
      return button.props.value[1]
    })

    // console.log(convos);
    let chatView = this.state.roomKey? 
    <ChatChild
    userName={`${this.state.userFirstName} ${this.state.userLastName}`}
    chattingWith={`${this.state.chattingFirstName} ${this.state.chattingLastName}`}
    roomKey={this.state.roomKey}
    previousRoomKey={this.state.previousRoomKey}
  />:
  []
    return (
      <div className="chat_parent_wrapper">
       
          
          <div className="convos_wrapper">
          <h2>Select A User</h2>
          {filteredConvos}
          </div>
          {chatView}

      </div>
    );
  }
}
