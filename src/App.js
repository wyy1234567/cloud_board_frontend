import React from 'react';
import './App.css';
import { withRouter, Switch, Route, Redirect } from 'react-router-dom';
import AuthContext from './AuthContext';

class App extends React.Component {
  state = {
    user: null,
    token: null,
    loginMessage: "",
    registerMessage: "",
    loaded: false
  }

  render() {
    console.log('Inside App')
    return (
      <div>
        <h4 className='title is-4'>Inside App.js</h4>
      </div>
    );
  }
}

export default withRouter(App);
