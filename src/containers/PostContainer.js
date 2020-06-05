import React from 'react'
import { getUserPosts, getLocalPosts } from '../requests'
import AuthContext from "../AuthContext"

class PostContainer extends React.Component {

    static contextType = AuthContext;

    state = {
        userPost: [],
        localPost: []
    }

    componentDidMount() {
        getUserPosts(this.context.token)
        // .then(res =>  res.json())
        .then(res => this.setState({
            userPost: res.data
        }))
        getLocalPosts(this.context.user.zipcode, this.context.token)
        .then(res => this.setState({
            localPost: res.data
        }))
    }

    // export const getLocalPosts = (zipcode, token) => {
    //     // this would just be based on the current user
    //     return axios.get(`${baseURL}/local_posts/${zipcode}`, config(token))
    //     .catch(handleError);
    // }
    render() {
        console.log('post state', this.state)
        return (
            <h3 className='title is-3'>I am Post Container!</h3>
        )
    }
}

export default PostContainer

