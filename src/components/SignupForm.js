import React from 'react'
import { register, allAreas, createArea } from '../requests'
import AuthContext from "../AuthContext"

export default class SignupForm extends React.Component {

    static contextType = AuthContext;

    //TODO: 
    //USE API to get user's zipcode!
    state = {
        name: '',
        zipcode: '',
        password: '',
        confirmed_password: '',
        error: '',
    }

    handleUserInput = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    
    submitForm = (event) => {
        event.preventDefault()
        if (this.state.name && this.state.zipcode && this.state.password) {
            if (this.state.password !== this.state.confirmed_password) {
                this.setState({
                    error: 'password do not match'
                })
            } else {
                const newUser = {...this.state}
                register(newUser, (err) => {
                    console.log("ERROR REGISTERING");
                    this.setState({ error: "username taken, please try another name" });
                })
                .then(res => {
                    if (res) {
                        this.props.setCurrentUser(res.data)
                    }
                })
            }
        } else {
            this.setState({
                error: 'username, zipcode, and password are required'
            })
        }
    }
    render() {
        console.log('Register state:', this.state)
        console.log('🏵API key is', process.env.REACT_APP_API_KEY)
        return (
            <div id='box2'>
                <h3 className='title is-3'>Register</h3>
                {
                    this.state.error
                        ? <div className="error">{this.state.error}</div>
                        : ""
                }
                <form onSubmit={this.submitForm}>
                    <div className='field'>
                        <label className='label'>Username</label>
                        <input className='input is-success' type="text" 
                            name="name"
                            value={this.state.name}
                            onChange={this.handleUserInput}
                        />
                    </div>

                    <div className='field'>
                        <label className='label'>Zipcode</label>
                        <input className='input is-success' type="text" 
                            name="zipcode"
                            value={this.state.zipcode}
                            onChange={this.handleUserInput}
                        />
                    </div>

                    <div className='field'>
                        <label className='label'>Password</label>
                        <input className='input is-success' type="password"
                            name="password"
                            value={this.state.password}
                            onChange={this.handleUserInput}
                        />
                    </div>
                    <div className='field'>
                        <label className='label'>Confirm Password</label>
                        <input className='input is-success' type="password"
                            name="confirmed_password"
                            value={this.state.confirmed_password}
                            onChange={this.handleUserInput}
                        />
                    </div>
                    <div className='control'>
                        <input className='button is-link' type="submit" value="Register" />
                    </div>
                </form>
            </div>
        )
    }
}