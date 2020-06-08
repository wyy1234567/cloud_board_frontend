import React from 'react'
import { getLocalPosts } from '../requests'
import AuthContext from "../AuthContext"

class DefaultPostPage extends React.Component{

    static contextType = AuthContext;

    state = {
        localPost: null
    }

    componentDidMount() {
        getLocalPosts(this.context.user.zipcode, this.context.token)
        .then(res => this.setState({
            localPost: res.data
        }))
    }
    render() {
        console.log('Default state:', this.state)
        return(
            <div className='post-detail'>
                <h3 className='title is-3'>Local Posts at a Glance</h3>
                <p>{this.state.localPost 
                ? `Area ${this.state.localPost[0].area.name} has ${this.state.localPost.length} posts`
                : 'No post in your area yet'}</p>
                
            </div>
        )
    }
}

export default DefaultPostPage