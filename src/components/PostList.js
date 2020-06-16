import React from 'react'



class PostList extends React.Component{

    //render the list of the local post
    renderPost = (post_obj, index) => {
        let created_at = post_obj.post.created_at
        return(
            <div className='post-tile' key={index}>
                <h3 className='title is-4 is-marginless list-title-margin'>{post_obj.post.title}</h3>
                <p>Created at {`${created_at.substr(5, 2)}/${created_at.substr(8, 2)}/${created_at.substr(0,4)}`}</p>
                <button className='button is-info is-inverted' onClick={() => this.props.handleClick(post_obj)}>Details</button>
            </div>
        )
    }

    render() {
        return(
            <div className='post-list'>
                {this.props.localPosts.map((post, index) => this.renderPost(post, index))}
            </div>
        )
    }
}

export default PostList
