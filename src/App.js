import React from 'react';
import './App.css';
import { withRouter, Switch, Route, Redirect } from 'react-router-dom';
import AuthContext from './AuthContext';
import { logout, ping } from './requests'

import NavBar from './components/NavBar'
import UserAuthContainer from './containers/UserAuthContainer'
import PostContainer from './containers/PostContainer'

class App extends React.Component {
  state = {
    user: null,
    token: null,
    loginMessage: "",
    registerMessage: "",
    loaded: false
  }

  componentDidMount() {
    const data = {
      id: parseInt(localStorage.getItem('__cloud_board_token_user_id__')),
      name: localStorage.getItem('__cloud_board_token_user_name__'),
      zipcode: localStorage.getItem('__cloud_board_token_zipcode__'),
      jwt: localStorage.getItem('__cloud_board_token_jwt__')
    };

    const url = this.props.location.pathname;
    const query = this.props.location.search;

    if(data.name && data.name !== "null" && data.name !== "undefined" &&
      data.jwt && data.jwt !== "null" && data.jwt !== "undefined" ){

      ping(data.jwt, () => {
        console.log("Error on ping")
        this.logout();
      })
      .then(res => {
        if(res){
          this.setCurrentUser(data, () => {
            if (url !== "/"){
              this.props.history.push(url+query);
            }
          });
        }
      });
    } else {
      this.logout()
    }
  }

  setCurrentUser = (data, callback) => {    
    this.setState({loaded: true});

    if(data){
      if(callback && typeof callback === "function"){
        this.setState({
          user: {id: data.id, name: data.name, zipcode: data.zipcode}, token: data.jwt}, callback);
      }
      else{
        this.setState({
          user: {id: data.id, name: data.name, zipcode: data.zipcode}, token: data.jwt});
      }
      
      localStorage.setItem('__cloud_board_token_user_id__', data.id);
      localStorage.setItem('__cloud_board_token_user_name__', data.name);
      localStorage.setItem('__cloud_board_token_zipcode__', data.zipcode);
      localStorage.setItem('__cloud_board_token_jwt__', data.jwt);
    }
    else{      
      this.setState({user: null, token: null});
    }
  }

  logout = () => {
    logout()
    .then(res => {
      this.setCurrentUser(null);
      localStorage.removeItem('__cloud_board_token_user_id__');
      localStorage.removeItem('__cloud_board_token_user_name__');
      localStorage.removeItem('__cloud_board_token_jwt__');
      localStorage.removeItem('__cloud_board_token_zipcode__');
    });
  }

  render() {
    console.log("APP STATE", this.state);
    return (
      <AuthContext.Provider value={this.state}>
        {this.state.loaded
        ? (
          <div>
            {this.state.user
            ? <NavBar logout={this.logout} />
            : '' }
            <Switch>
              <Route exact path='/'>
                {!this.state.user
                ? <>
                    <UserAuthContainer setCurrentUser={this.setCurrentUser}/>
                  </>
                : <Redirect to='/posts' />
                }
              </Route>
              <Route render={() => <WithContainer {...this.state}/>}/>
            </Switch>
          </div>
        )
        : <span>loading</span>
        } 
      </AuthContext.Provider>
    );
  }
}

export default withRouter(App);

const WithContainer = (props) => {
  return(
    <>
      {props.user
      ? <>
          <Switch>
            <Route path='/posts'>
              <PostContainer />
            </Route>
            {/* <Route path='/posts'>
              <PostContainer />
            </Route> */}
          </Switch>
        </>
      : <>
          <Redirect to='/' />
        </>
      }
    </>)
}
