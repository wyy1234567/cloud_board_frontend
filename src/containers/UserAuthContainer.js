import React from 'react';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';

class UserAuthContainer extends React.Component {

    render() {
        return(
            <div>
                <LoginForm setCurrentUser={this.props.setCurrentUser}/>
                <div className='border-line'></div>
                <SignupForm setCurrentUser={this.props.setCurrentUser}/>
            </div>
        )
    }
}

export default UserAuthContainer;
