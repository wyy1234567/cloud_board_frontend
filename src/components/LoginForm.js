import React from 'react'
import { login } from '../requests'

export default class LoginForm extends React.Component {

    state = {
        name: '',
        password: '',
        error: null
    }

    userInput = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    login = (event) => {
        event.preventDefault();
        if (this.state.name && this.state.password) {
            const user = { ...this.state };
            this.loginUser(user);
        }
        else {
            this.setState({ error: "invalid username/password combination" });
        }
    }

    loginUser = (user) => {
        login(user, (err)=>{
            this.setState({ error: "invalid username/password combination" });
        })
        .then(res => {
            if (res) {
                console.log('🔫Login', res);
                this.props.setCurrentUser(res.data)
            }
        });
    }


    render() {
        return (
            <div id='box1'>
                <h3 className='title is-3'>Login</h3>
                {
                    this.state.error
                        ? <div className="error">{this.state.error}</div>
                        : ""
                }
                <form onSubmit={this.login}>
                    <div className='field'>
                        <label className='label' htmlFor="login_name">Username</label>
                        <input className='input is-success' type="text" id="login_name"
                            name="name"
                            value={this.state.name}
                            onChange={this.userInput} />
                    </div>

                    <div className='field'>
                        <label className='label' htmlFor="login_password">Password</label>

                        <input className='input is-success' type="password" id="login_password"
                            name="password"
                            value={this.state.password}
                            onChange={this.userInput} />
                    </div>

                    <div className="control" >
                        <input className='button is-link' type="submit" value="Login" />
                    </div>
                </form>
            </div>
        )
    }
}