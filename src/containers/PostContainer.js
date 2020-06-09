import React from 'react'
import { getUserPosts, getLocalPosts, createComment, deleteComment, deletePost } from '../requests'
import PostList from '../components/PostList'
import DefaultPostPage from '../components/DefaultPostPage'
import PostDetails from '../components/PostDetails'
import AuthContext from "../AuthContext"
import SearchBar from '../components/SearchBar'
import SelectCategory from '../components/SelectCategory'
import NewPostForm from '../components/NewPostForm'
import EditPostForm from '../components/EditPostForm'

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
            search: event.target.value,
            renderPage: 'default'
        })
    }

    categorySelction = (event) => {
        this.setState({
            category: event.target.value,
            renderPage: 'default'
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
            localPost: [...this.state.localPost, newPost],
            renderPage: 'default'
        })
    }

    deletePost = (post_id) => {
        console.log("Trigger Delete!, the id is:", post_id)
        deletePost(post_id, this.context.token)
        .then(res => {
            let copy = [...this.state.localPost]
            let newCopy = []
            copy.forEach(post_obj => {
                if (post_obj.post.id !== post_id) {
                    newCopy.push(post_obj)
                }
            })
            this.setState({
                localPost: newCopy,
                renderPage: 'default'
            })
        })
    }

    handleEditButton = () => {
        this.setState({
            renderPage: 'edit'
        })
    }


    //1.update selected post
    //2.update localPost array
    //3.render the updated post
    editPost = (post_details) => {
        console.log('trigger edit post, post:', post_details)
        let copy = [...this.state.localPost]
        let newCopy = []
        copy.forEach(post_obj => {
            if(post_obj.post.id !== post_details.post.id) {
                newCopy.push(post_obj)
            } else {
                newCopy.push(post_details)
            }
        })
        console.log('before state:', copy)
        console.log('new local Post is:', newCopy)
        this.setState({
            renderPage: 'details',
            clickedPost: post_details,
            localPost: newCopy
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
            handleDelete={this.deleteComment}
            handleDeletePost={this.deletePost}
            handleEditButton={this.handleEditButton}/>
        } else if(this.state.renderPage === 'edit') {
            return <EditPostForm post={this.state.clickedPost} handleEdit={this.editPost}/>
        }
    }

    render() {
        console.log('post state', this.state)
        let filtered = this.filterPost()
        
        return (
            <>
                <SelectCategory category={this.state.category} handleSelect={this.categorySelction}/>
                <button className='button is-info is-small post-buttons' onClick={this.handleNewButton}>New Post</button>
                <SearchBar handleInput={this.userSearch} search={this.state.search}/>

                <PostList 
                // localPosts={this.state.localPost} 
                localPosts={filtered} 
                handleClick={this.clickedPost}
                />

                {this.handleRender()}
            </>
        )
    }
}

export default PostContainer

