import React, { Component } from "react";
import ChatChild from "./ChatChild";
import axios from "axios";
import './ChatParent.css';

const { REACT_APP_LOGOUT } = process.env


export default class ChatParent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user:{},
      userID: 0,
      userFirstName:'',
      userLastName:'',
      chattingFirstName: "",
      chattingLastName: "",
      chattingWithID:null,
      roomKey: "",
      previousRoomKey: "Room 1",
      userGroups: [],
      users: [],
      convos: []
    };

    this.changeRoom = this.changeRoom.bind(this);
  }
  // componentWillMount() {
  //   axios({
  //     method: "get",
  //     url: `${baseUrl}user/info`,
  //     headers: {
  //       "auth-token":REACT_APP_TOKEN
  //     }
  //   }).then(res => {
  //     console.log(REACT_APP_TOKEN);
  //     this.setState({
  //       userID: res.data.data.id,
  //       userFirstName: res.data.data.firstName,
  //       userLastName: res.data.data.lastName
  //     });
  //   });
  //   axios({
  //     method: "get",
  //     url: `${baseUrl}user/allUsers`,
  //     headers: {
  //       "auth-token":REACT_APP_TOKEN
  //     }
  //   }).then(res => {
  //     //Slicing here because currently I get back ALL users. This needs to change to only get affiliated users. -Greg
  //     let users = res.data.data.users.list.slice(0, 10);
  //     this.setState({
  //       users: users
  //     });
  //   });
  // }
  componentWillMount() {
    axios.get('/auth/me').then(res => {
      this.setState({
        user:res.data,
        userID: res.data.id
      });
      axios.get(`/all_other_users/${res.data.id}`).then(res => {
        console.log('users', res)
        this.setState({
          users: res.data
        });
      });
    });
    
  }
  changeRoom(event) {
    if (event.target.value !== "Select") {
      let values = event.target.value.split(',')
      //generating a string that is unique to this pair of users
      let newKey = [this.state.userID, values[0]].sort().join("");
      this.setState({
        previousRoomKey: this.state.roomKey,
        roomKey: newKey,
        chattingWithID: values[0],
        chattingFirstName: values[1],
        chattingLastName: values[2]
      });
    }
  }
  render() {
    let convos = this.state.users.map(user => {
        return (
          <button
            key={user.id}
            className="convo"
            value={[user.id, user.first_name, user.last_name]}
            onClick={this.changeRoom}
          >
            {user.first_name} {user.last_name}
          </button>
        );
      
    });

    let chatView = this.state.roomKey? 
    <ChatChild
    userID = {this.state.userID}
    userName={`${this.state.userFirstName} ${this.state.userLastName}`}
    chattingWith={`${this.state.chattingFirstName} ${this.state.chattingLastName}`}
    roomKey={this.state.roomKey}
    previousRoomKey={this.state.previousRoomKey}
    chattingWithID={this.state.user}
  />:
  []
    return (
      <div className="chat_parent_wrapper">
       <button><a href={REACT_APP_LOGOUT}>Logout</a></button>
          
          <div className="convos_wrapper">
          <h2>Select A User</h2>
          {convos}
          </div>
          {chatView}

      </div>
    );
  }
}
