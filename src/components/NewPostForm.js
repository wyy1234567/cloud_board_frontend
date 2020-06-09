import React from 'react'
import { getSinglePost, getCategoryIndex, getAreaIndex, createPost, createImage } from '../requests'
import AuthContext from "../AuthContext"
import Dropzone from 'react-dropzone'

const acceptedFileTypes = 'image/x-png, image/png, image/jpg, image/jpeg, image/gif'
const acceptedFileTypesArray = acceptedFileTypes.split(",").map((item) => { return item.trim() })
const imageMaxSize = 100000000

//TODO: for area that not exists in backend, create new area with its zipcode and name
class NewPostForm extends React.Component {

    static contextType = AuthContext;

    state = {
        title: '',
        description: '',
        user_id: '',
        area_id: '',
        newPostCategory: 'pet adoption',
        category_id: '',
        image_url: '',
        post_id: '',
        allCategories: ''
    }

    componentDidMount() {
        getCategoryIndex(this.context.token)
            .then(res => this.setState({
                allCategories: res.data,
                user_id: this.context.user.id,
                category_id: res.data.find(cat => cat.name === this.state.newPostCategory).id
            }))
        getAreaIndex(this.context.token)
            .then(res => {
                res.data.forEach(area => {
                    if (area.zipcode === this.context.user.zipcode) {
                        return (this.setState({
                            area_id: area.id
                        }))
                    }
                })
            })

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
                        image_url: myResult
                    })
                }, false)
                myFileItemReader.readAsDataURL(currentFile)
            }
        }
    }

    createPost = (event) => {
        event.preventDefault()
        console.log('trigger submit!')
        let newPost = {
            title: this.state.title,
            description: this.state.description,
            user_id: this.state.user_id,
            area_id: this.state.area_id,
            category_id: this.state.category_id
        }
        createPost(newPost, this.context.token)
            // .then(res => console.log('new post posted:', res.data))
            .then(res => {
                let postId = res.data.id
                this.setState({
                    post_id: res.data.id
                })
                let newImage = {
                    image_url: this.state.image_url,
                    post_id: res.data.id
                }
                createImage(newImage, this.context.token)
                    .then(response => {
                        getSinglePost(postId, this.context.token)
                            // .then(singleResponses => console.log('Single post:', singleResponses.data))
                            .then(singleResponses => this.props.handleSubmit(singleResponses.data))
                    })

            })
    }

    handleSelection = (event) => {
        let copy = this.state.allCategories
        let cateId = copy.find(cat => cat.name === event.target.value).id
        this.setState({
            newPostCategory: event.target.value,
            category_id: cateId
        })
    }


    render() {
        console.log('new form state:', this.state)
        // console.log('new form context:', this.context.user)
        return (
            <div className='post-detail'>
                <h4 className='title is-4'>Create a new post</h4>
                <form onSubmit={this.createPost}>
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
                                            <select value={this.state.newPostCategory} onChange={this.handleSelection}>
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

                    {this.state.image_url
                        ? <div className="field is-horizontal">
                            <div className="field-label is-normal">
                                <label className="label">Preview Image</label>
                            </div>
                            <div className="field-body">
                                <div className="control">
                                    <img src={this.state.image_url} alt='New image'></img>
                                </div>
                            </div>
                        </div>

                        : <div className="field is-horizontal">
                            <div className="field-label is-normal">
                                <label className="label">Upload Image</label>
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
                    }

                    <button className='button is-info new-button-margin'>Create a new post</button>
                </form>
            </div>
        )
    }
}

export default NewPostForm