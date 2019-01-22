import React, { Component } from 'react';
import ChatParent from "./Components/ChatParent";
import ChatChild from './Components/ChatChild';
// import {HashRouter, Route, Switch} from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div>
          {/* <ChatChild room = {'hardCodedRoom1'} />
          <ChatChild room = {'hardCodedRoom2'} /> */}
           {/* <br />
           <hr /> */}
          <ChatParent/>

      </div>
    );
  }
}

export default App;
