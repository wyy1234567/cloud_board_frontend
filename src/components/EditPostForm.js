import React from 'react'
import { getSinglePost, getCategoryIndex, updatePost, updateImage } from '../requests'
import AuthContext from "../AuthContext"
import Dropzone from 'react-dropzone'

const acceptedFileTypes = 'image/x-png, image/png, image/jpg, image/jpeg, image/gif'
const acceptedFileTypesArray = acceptedFileTypes.split(",").map((item) => { return item.trim() })
const imageMaxSize = 100000000

class EditPostForm extends React.Component {

    static contextType = AuthContext;

    state = {
        title: '',
        description: '',
        user_id: '',
        area_id: '',
        category_id: '',
        image_id: '',
        image_url: '',
        post_id: '',
        allCategories: '',
        post: {},
        currentCategory: '',
        newImageUpload: false
    }

    componentDidMount() {
        this.setState({
            post: this.props.post,
            title: this.props.post.post.title,
            description: this.props.post.post.description,
            user_id: this.props.post.user.id,
            area_id: this.props.post.area.id,
            category_id: this.props.post.category.id,
            // image_url: this.props.post.post.images[0].image_url,
            post_id: this.props.post.post.id,
            currentCategory: this.props.post.category.name
        })

        if (this.props.post.images.length > 0) {
            this.setState({
                image_id: this.props.post.images[0].id,
                image_url: this.props.post.images[0].image_url
            })
        }

        getCategoryIndex(this.context.token)
            .then(res => this.setState({
                allCategories: res.data
            }))

    }

    userInput = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    verifyFile = (files) => {
        if (files && files.length > 0) {
            const currentFile = files[0]
            const currentFileType = currentFile.type
            const currentFileSize = currentFile.size
            if (currentFileSize > imageMaxSize) {
                alert("This file size is to large")
                return false
            }
            if (!acceptedFileTypesArray.includes(currentFileType)) {
                alert("This file is not allowed. Only images are allowed.")
                return false
            }
            return true
        }
    }

    handleOnDrop = (files, rejectedFiles) => {
        if (rejectedFiles && rejectedFiles.length > 0) {
            this.verifyFile(rejectedFiles)
        }

        if (files && files.length > 0) {
            const isVerified = this.verifyFile(files)
            if (isVerified) {
                const currentFile = files[0]
                const myFileItemReader = new FileReader()
                myFileItemReader.addEventListener("load", () => {
                    const myResult = myFileItemReader.result
                    this.setState({
                        image_url: myResult,
                        newImageUpload: true
                    })
                }, false)
                myFileItemReader.readAsDataURL(currentFile)
            }
        }
    }

    handleSelection = (event) => {
        let copy = this.state.allCategories
        let cateId = copy.find(cat => cat.name === event.target.value).id
        this.setState({
            currentCategory: event.target.value,
            category_id: cateId
        })
    }

    //update post and update image
    updatePost = (event) => {
        event.preventDefault()
        console.log('Save triggered!')
        let newPost = {
            title: this.state.title,
            description: this.state.description,
            user_id: this.state.user_id,
            area_id: this.state.area_id,
            category_id: this.state.category_id
        }
        let newImage = {
            post_id: this.state.post_id, 
            image_url: this.state.image_url
        }
        console.log('🌟Update post is:', newPost)
        console.log('🌟Update image is:', newImage)

        updatePost(newPost, this.state.post_id, this.context.token)
        updateImage(newImage, this.state.image_id, this.context.token)
        getSinglePost(this.state.post_id, this.context.token)
        // .then(res => console.log('After patching, singe recipe is:', res.data))
        .then(res => {
            this.props.handleEdit(res.data)
        })
    }


    render() {
        console.log('🔫edit form state:', this.state)
        // console.log('new form context:', this.context.user)
        return (
            <div className='post-detail'>
                <h4 className='title is-4'>Edit this post</h4>
                <form onSubmit={this.updatePost}>
                    <div className="field is-horizontal">
                        <div className="field-label is-normal">
                            <label className="label">Title</label>
                        </div>
                        <div className="field-body">
                            <div className="field">
                                <div className="control">
                                    <input className="input is-danger" type="text" name='title' value={this.state.title} placeholder='Enter your post title' onChange={this.userInput} />
                                </div>
                                <p className="help is-danger">
                                    This field is required
                                    </p>
                            </div>
                        </div>
                    </div>

                    {this.state.allCategories
                        ? <div className="field is-horizontal">
                            <div className="field-label is-normal">
                                <label className="label">Category</label>
                            </div>
                            <div className="field-body">
                                <div className="field is-narrow">
                                    <div className="control">
                                        <div className="select is-fullwidth">
                                            <select value={this.state.currentCategory} onChange={this.handleSelection}>
                                                <option value='pet adoption'>Pet Adoption</option>
                                                <option value='housing'>Housing</option>
                                                <option value='marketplace'>Marketplace</option>
                                                <option value='education'>Education</option>
                                                <option value='event'>Event</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        : null
                    }


                    <div className="field is-horizontal">
                        <div className="field-label is-normal">
                            <label className="label">Description</label>
                        </div>
                        <div className="field-body">
                            <div className="field">
                                <div className="control">
                                    <textarea className="textarea" placeholder="Tell us more about your post" name='description' value={this.state.description} onChange={this.userInput}></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    {this.state.newImageUpload === false
                        ? <div className="field is-horizontal">
                            <div className="field-label is-normal">
                                <label className="label">Current Image</label>
                            </div>
                            <div className="field-body">
                                <div className="control">
                                    <img src={this.state.image_url} alt='New image'></img>
                                </div>
                            </div>
                            <div className="field-label is-normal">
                                <label className="label">New Image</label>
                            </div>
                            <div className="field-body">
                                <div className="control">
                                    <Dropzone onDrop={this.handleOnDrop}>
                                        {({ getRootProps, getInputProps }) => (
                                            <section className="container">
                                                <div {...getRootProps({ className: 'dropzone' })}>
                                                    <input className="input is-danger" {...getInputProps()} placeholder='select' />
                                                    <p>Drag 'n' drop some files here, or click to select files</p>
                                                </div>
                                            </section>
                                        )}
                                    </Dropzone>
                                </div>
                            </div>
                        </div>
                        : <div className="field is-horizontal">
                            <div className="field-label is-normal">
                                <label className="label">New Image Preview</label>
                            </div>
                            <div className="field-body">
                                <div className="control">
                                    <img src={this.state.image_url} alt='New image'></img>
                                </div>
                            </div>
                        </div>
                    }
                    <button className='button is-info new-button-margin'>Save Post</button>
                </form>
            </div>
        )
    }
}

export default EditPostForm