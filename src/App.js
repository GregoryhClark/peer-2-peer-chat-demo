import React, { Component } from 'react';
import ChatParent from "./Components/ChatParent";
import {HashRouter, Route, Switch} from 'react-router-dom';
import Login from './Components/Login/Login';
import Dashboard from './Components/Dashboard/Dashboard';
class App extends Component {
  render() {
    return (
      <div>
        <HashRouter>
          <Switch>
            <Route exact path = '/' component={Login}/>
            <Route exact path = '/dashboard' component={Dashboard}/>
            <Route exact path = '/chat' component={ChatParent}/>
            </Switch>
        </HashRouter>
          
      </div>
    );
  }
}

export default App;
