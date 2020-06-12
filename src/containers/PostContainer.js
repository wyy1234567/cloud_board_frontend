import React from 'react'
import { getUserPosts, getLocalPosts, createComment, deleteComment, deletePost, createArea } from '../requests'
import PostList from '../components/PostList'
import DefaultPostPage from '../components/DefaultPostPage'
import PostDetails from '../components/PostDetails'
import AuthContext from "../AuthContext"
import SearchBar from '../components/SearchBar'
import SelectCategory from '../components/SelectCategory'
import NewPostForm from '../components/NewPostForm'
import EditPostForm from '../components/EditPostForm'

const ipUrl = 'https://api.ipify.org/?format=json'

class PostContainer extends React.Component {

    static contextType = AuthContext;

    state = {
        userPost: [],
        localPost: [],
        clickedPost: {},
        search: '',
        category: 'all',
        clickedPostComments: '',  //help to keep track of comments, can add/delete
        renderPage: 'default',
        renderList: 'all', //all: all local posts, user: user's posts
        allAreas: ''
    }

    componentDidMount() {
        fetch('http://localhost:3000/users')
            .then(res => res.json())
            .then(res => {
                this.setState({ allAreas: res })
                let isAreaExist = false
                res.forEach(area_obj => {
                    if (area_obj.zipcode === this.context.user.zipcode) {
                        isAreaExist = true
                    }
                })
                console.log('🔴is area exist?:', isAreaExist)

                if (isAreaExist) {
                    console.log('😀ARea found!')
                    getUserPosts(this.context.token)
                        .then(res => this.setState({
                            userPost: res.data
                        }))

                    getLocalPosts(this.context.user.zipcode, this.context.token)
                        .then(res => this.setState({
                            localPost: res.data
                        }))
                } else {
                    console.log('😰Area not found!')
                    fetch(ipUrl)
                        .then(res => res.json())
                        .then(res => {
                            let ipAddress = res.ip
                            let url = `http://api.ipstack.com/${ipAddress}?access_key=${process.env.REACT_APP_API_KEY}&format=1`
                            fetch(url)
                                .then(res => res.json())
                                .then(res => {
                                    let newArea = {
                                        zipcode: res.zip,
                                        name: res.city
                                    }
                                    createArea(newArea, this.context.token)
                                        .then(res => {
                                            getUserPosts(this.context.token)
                                                .then(res => this.setState({
                                                    userPost: res.data
                                                }))

                                            getLocalPosts(res.data.zipcode, this.context.token)
                                                .then(res => this.setState({
                                                    localPost: res.data
                                                }))
                                        })
                                })
                        })
                }
            })
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
        let comment_obj = { user: this.context.user, comment: newComment }
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

    filterPost = (posts) => {
        let filtered = posts
        if (this.state.search) {
            filtered = posts.filter(post_obj => {
                if (post_obj.post.title.toLowerCase().includes(this.state.search.toLowerCase())
                    || post_obj.post.description.toLowerCase().includes(this.state.search.toLowerCase())) {
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
            if (post_obj.post.id !== post_details.post.id) {
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

    toggleUserPosts = (status) => {
        console.log('trigger botton!')
        this.setState({
            renderList: status,
            renderPage: 'default'
        })
    }


    handleRender = () => {
        if (this.state.renderPage === 'default') {
            let localPosts = this.state.localPost ? [...this.state.localPost] : ''
            let userPosts = this.state.userPost ? [...this.state.userPost] : ''
            let filtered = this.state.renderList === 'all' ? this.filterPost(localPosts) : this.filterPost(userPosts)
            return <DefaultPostPage posts={filtered} />
        } else if (this.state.renderPage === 'form') {
            return <NewPostForm handleSubmit={this.createPost} />
        } else if (this.state.renderPage === 'details') {
            return <PostDetails post={this.state.clickedPost}
                comments={this.state.clickedPostComments}
                newComment={this.state.newComment}  //controlled form input
                handleChange={this.newCommentInput}
                handleSubmit={this.addComment}
                handleDelete={this.deleteComment}
                handleDeletePost={this.deletePost}
                handleEditButton={this.handleEditButton} />
        } else if (this.state.renderPage === 'edit') {
            return <EditPostForm post={this.state.clickedPost} handleEdit={this.editPost} />
        }
    }

    render() {
        console.log('post state', this.state)
        let localPosts = this.state.localPost ? [...this.state.localPost] : ''
        let userPosts = this.state.userPost ? [...this.state.userPost] : ''
        // let filtered = this.filterPost(localPosts)
        let filtered = this.state.renderList === 'all' ? this.filterPost(localPosts) : this.filterPost(userPosts)

        return (
            <>
                <nav className='level nav-level is-marginless'>
                    <div className='level-left'>
                        <div className='level-item'>
                            <button className='button is-info is-small all-post-margin' onClick={() => this.toggleUserPosts('all')}>All posts</button>
                        </div>
                        <div className='level-item'>
                            <SelectCategory category={this.state.category} handleSelect={this.categorySelction} />
                        </div>
                        <div className='level-item'>
                            <div className='level-item'>
                                <SearchBar handleInput={this.userSearch} search={this.state.search} />
                            </div>
                        </div>
                    </div>

                    <div className='level-right'>
                        <div className='level-item'>
                            <button className='button is-info is-small' onClick={() => this.toggleUserPosts('user')}>My post</button>
                        </div>
                        <button className='button is-primary is-small new-post-margin' onClick={this.handleNewButton}>New Post</button>
                    </div>
                </nav>

                <div>
                    <PostList
                        // localPosts={this.state.localPost} 
                        localPosts={filtered}
                        handleClick={this.clickedPost}
                    />
                </div>
                <div className='tile is-parent is-8'>
                    {this.handleRender()}
                </div>
            </>
        )
    }
}

export default PostContainer

