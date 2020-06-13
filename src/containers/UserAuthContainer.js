import React from 'react';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import Homepage from '../components/Homepage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlane } from '@fortawesome/free-solid-svg-icons'


class UserAuthContainer extends React.Component {

    state={
        render: 'home'
    }

    handleBtn = (page) => {
        this.setState({
            render: page
        })
    }

    renderpage = () => {
        if (this.state.render === 'home') {
            return <Homepage />
        } else if (this.state.render === 'signin') {
            return <LoginForm setCurrentUser={this.props.setCurrentUser}/>
        } else if (this.state.render === 'signup') {
            return <SignupForm setCurrentUser={this.props.setCurrentUser}/>
        }
    }
    render() {
        console.log('homepage state:', this.state)
        return(
            <div>
                <nav className="navbar is-fixed-top" role="navigation" aria-label="main navigation">
                        <div className='nav-start'>
                            <h4 className='navbar-item title is-4'>☁️ Cloud Board</h4>
                        </div>
                        <div className='navbar-end'>
                            <button className='navbar-item button is-light sign-margin' onClick={() => this.handleBtn('signin')}>Sign in</button>
                            <button className='navbar-item button is-link sign-margin' onClick={() => this.handleBtn('signup')}>Sign up</button>
                            
                        </div>
                </nav>
                {/* <div className='homepage'>
                    <LoginForm setCurrentUser={this.props.setCurrentUser}/>
                    <SignupForm setCurrentUser={this.props.setCurrentUser}/>
                </div> */}
                <div id='homepage'>
                    {this.renderpage()}
                </div>
            </div>
        )
    }
}

export default UserAuthContainer;
