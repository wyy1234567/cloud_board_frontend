import React from 'react'
import AuthContext from "../AuthContext"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

class Comment extends React.Component{

    static contextType = AuthContext;

    showButtons = () => {
        return (
            <>
                <button className='delete' onClick={() => this.props.deleteComment(this.props.comment.id)}>delete</button>
            </>
        )
    }

    render() {
        console.log('Comment props', this.props)
        return (
            <div className='notification is-grey'>
                <p className='subtitle is-5'><FontAwesomeIcon color='orange' icon={faUser} />{this.props.user.name}'s comment:</p>
                <p>{this.props.comment.content}</p>
                {this.context.user.id === this.props.user.id
                    ? this.showButtons()
                    : null
                }
            </div>
        )
    }
}

export default Comment