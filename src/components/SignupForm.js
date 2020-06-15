import React from 'react'
import { register } from '../requests'
import AuthContext from "../AuthContext"
const ipUrl = 'https://api.ipify.org/?format=json'

export default class SignupForm extends React.Component {

    static contextType = AuthContext;

    state = {
        name: '',
        zipcode: '',
        password: '',
        confirmed_password: '',
        error: '',
        ip: '',
        area: ''
    }

    componentDidMount() {
        fetch(ipUrl)
        .then(res => res.json())
        // .then(res => this.setState({ip: res.ip}))
        .then(res => {
            let ipAddress = res.ip
            let url = `http://api.ipstack.com/${ipAddress}?access_key=${process.env.REACT_APP_API_KEY}&format=1`
            fetch(url)
            .then(res => res.json())
            // .then(res => console.log('geolocation response:', res))
            .then(res => {
                this.setState({
                    ip: res.ip,
                    zipcode: res.zip,
                    area: res.city
                })
            })
        })
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
        return (
            <div id='box1'>
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