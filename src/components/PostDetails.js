import React from 'react'
import Comment from './Comment'
import AuthContext from "../AuthContext"


class PostDetails extends React.Component {

    static contextType = AuthContext;

    render() {
        //TODO:
        //2. image edit?
        const post = this.props.post
        const created_at = post.post.created_at;
        return (
            <div className='post-detail'>
                <h3 className='title is-3'>{post.post.title}</h3>
                <p>Created by {post.user.name} at {`${created_at.substr(5, 2)}/${created_at.substr(8, 2)}/${created_at.substr(0, 4)}`}</p>
                <img src={post.images[0].image_url}></img>
                <p>{post.post.description}</p>
                {this.props.comments.length > 0
                ? this.props.comments.map((comment, index) => <Comment key={index} {...comment} deleteComment={this.props.handleDelete}/>)
                : null
                }
                
                <form onSubmit={this.props.handleSubmit}>
                    <div className="field is-grouped">
                        <p className="control is-expanded">
                            <input className="input" type="text" placeholder="Leave a comment" value={this.props.newComment} onChange={this.props.handleChange} />
                        </p>
                        <p className="control">
                            <button className='button is-info'>Add Comment</button>
                        </p>
                    </div>
                </form>
            </div>
        )
    }
}

export default PostDetails