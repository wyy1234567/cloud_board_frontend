import React from 'react'
import { getSinglePost } from '../requests'
import AuthContext from "../AuthContext"

class NewPostForm extends React.Component {

    static contextType = AuthContext;

    state={
        newPostTitle: '',
        newPostDescription: '',
        newImageUrl: ''
    }



    render() {
        return (
            <div className='post-detail'>
                <p>I'm new form!</p>
            </div>
        )
    }
}

export default NewPostForm