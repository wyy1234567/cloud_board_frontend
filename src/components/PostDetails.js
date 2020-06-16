import React from 'react'
import Comment from './Comment'
import AuthContext from "../AuthContext"


class PostDetails extends React.Component {

    static contextType = AuthContext;

    renderButtons = () => {
        return (
            <>
                <button className='button is-danger is-marginless button-margin' onClick={() => this.props.handleDeletePost(this.props.post.post.id)}>Delete</button>
                <button className='button is-danger button-margin' onClick={() => this.props.handleEditButton()}>Edit</button>
            </>
        )
    }

    capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    render() {
        const post = this.props.post
        const created_at = post.post.created_at;
        console.log('🔴Post details props', this.props.post)
        console.log('COntext:', this.context.user)
        return (
            <div className='post-detail'>
                <h3 className='title is-4'>{post.post.title}</h3>
                {/* <p>Created by {post.user.name} at {`${created_at.substr(5, 2)}/${created_at.substr(8, 2)}/${created_at.substr(0, 4)}`} in {post.category.name}</p> */}
                <p className='subtitle is-6'>Created by {post.user.name} at {`${created_at.substr(5, 2)}/${created_at.substr(8, 2)}/${created_at.substr(0, 4)}`} in {this.capitalize(post.category.name)}</p>
                {post.user.id === this.context.user.id
                ? this.renderButtons()
                : ''
                }
                <br />
                {post.images.length > 0
                ? <img className='image-size' src={post.images[0].image_url}></img>
                : ''
                }


                <p className='title is-5 is-marginless'>Description:</p>
                <p className='discription-margin'>{post.post.description}</p>
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