import React from 'react'
class DefaultPostPage extends React.Component{

    render() {
        console.log('default page props', this.props)
        return(
            <div className='post-detail'>
                <h3 className='title is-3'>Local Posts at a Glance</h3>
                <p>{this.props.posts.length > 0
                ? `${this.props.posts.length} posts found`
                : 'No post found'}</p>
            </div>
        )
    }
}

export default DefaultPostPage