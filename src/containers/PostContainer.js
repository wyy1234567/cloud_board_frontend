import React from 'react'
import { getUserPosts, getLocalPosts, createComment, deleteComment } from '../requests'
import PostList from '../components/PostList'
import DefaultPostPage from '../components/DefaultPostPage'
import PostDetails from '../components/PostDetails'
import AuthContext from "../AuthContext"
import SearchBar from '../components/SearchBar'
import SelectCategory from '../components/SelectCategory'
import NewPostForm from '../components/NewPostForm'

//TODO: allow user to delete/update a post 
class PostContainer extends React.Component {

    static contextType = AuthContext;

    state = {
        userPost: [],
        localPost: [],
        clickedPost: {},
        search: '',
        category: 'all',
        clickedPostComments: '',  //help to keep track of comments, can add/delete
        renderPage: 'default'

    }

    componentDidMount() {
        getUserPosts(this.context.token)
        .then(res => this.setState({
            userPost: res.data
        }))

        getLocalPosts(this.context.user.zipcode, this.context.token)
        .then(res => this.setState({
            localPost: res.data
        }))
    }

    
    clickedPost = (post_obj) => {
        this.setState({
            clickedPost: post_obj,
            clickedPostComments: post_obj.comments,
            renderPage: 'details'
        })
    }

    userSearch = (event) => {
        this.setState({
            search: event.target.value
        })
    }

    categorySelction = (event) => {
        this.setState({
            category: event.target.value
        })
    }

    addComment = (event) => {
        event.preventDefault();
        let newComment = {
            content: this.state.newComment,
            post_id: this.state.clickedPost.post.id,
            user_id: this.context.user.id
        }
        let comment_obj = {user: this.context.user, comment: newComment}
        createComment(newComment, this.context.token)
        .then(res => {
            comment_obj.comment = res.data
            const copy = [...this.state.clickedPostComments];
            copy.push(comment_obj);
            this.setState({
                clickedPostComments: copy,
                newComment: ''
            })
        })
    }

    deleteComment = (comment_id) => {
        deleteComment(comment_id, this.context.token)
        .then(res => {
            let copy = [...this.state.clickedPostComments]
            let newCopy = []
            copy.forEach(comment_obj => {
                if (comment_obj.comment.id !== comment_id) {
                    newCopy.push(comment_obj)
                }
            })
            this.setState({
                clickedPostComments: newCopy
            })
        })
    }

    newCommentInput = (event) => {
        this.setState({
            newComment: event.target.value
        })
    }

    filterPost = () => {
        let posts = [...this.state.localPost]
        let filtered = posts
        if (this.state.search) {
            filtered = posts.filter(post_obj => {
                if (post_obj.post.title.toLowerCase().includes(this.state.search.toLowerCase()) 
                || post_obj.post.description.toLowerCase().includes(this.state.search.toLowerCase()) ) {
                    return true
                } else {
                    return false
                }
            })
        }
        
        if (this.state.category !== 'all') {
            filtered = filtered.filter(post_obj => post_obj.category.name === this.state.category)
        }
        return filtered
    }

    handleNewButton = () => {
        this.setState({
            renderPage: 'form'
        })
    }

    createPost = (newPost) => {
        console.log('🔫new post found!')
        this.setState({
            localPost: [...this.state.localPost, newPost]
        })
    }

    handleRender = () => {
        if (this.state.renderPage === 'default') {
            return <DefaultPostPage />
        } else if(this.state.renderPage === 'form') {
            return <NewPostForm handleSubmit={this.createPost}/>
        } else if(this.state.renderPage === 'details') {
            return <PostDetails post={this.state.clickedPost} 
            comments={this.state.clickedPostComments} 
            newComment={this.state.newComment}  //controlled form input
            handleChange={this.newCommentInput} 
            handleSubmit={this.addComment}
            handleDelete={this.deleteComment}/>
        }
    }

    render() {
        console.log('post state', this.state)
        let filtered = this.filterPost()
        
        return (
            <div className='grid'>
                <SelectCategory category={this.state.category} handleSelect={this.categorySelction}/>
                <button className='button is-info is-small post-buttons' onClick={this.handleNewButton}>New Post</button>
                <SearchBar handleInput={this.userSearch} search={this.state.search}/>

                <PostList 
                // localPosts={this.state.localPost} 
                localPosts={filtered} 
                handleClick={this.clickedPost}
                />

                {this.handleRender()}
            </div>
        )
    }
}

export default PostContainer

