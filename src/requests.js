import axios from "axios";

const baseURL = "http://localhost:3000";

const handleError = err => console.error(err);

const config = (token) => {
    return {
        headers: {
            Authorization: "Bearer " + token
        }
    };
}

/////////////////////////////////////////////////////////
// user: login & signup & logout
export const ping = (token, callback) => {
    console.log("trigger ping");
    return axios.get(`${baseURL}/users/ping`, config(token))
    .catch((err) => {
        handleError();
        if(callback && typeof callback === "function"){
            callback(err);
        }
    });
}


export const register = (user, callback) => {
    const data = {
        name: user.name,
        password: user.password,
        zipcode: user.zipcode
    }
    return axios.post(`${baseURL}/users/register`, {user: data})
    .catch((err) => {
        handleError();
        if(callback && typeof callback === "function"){
            callback(err);
        }
    });
}

export const login = (user, callback) => {
    const data = {
        name: user.name,
        password: user.password,
        zipcode: user.zipcode
    }
    return axios.post(`${baseURL}/users/login`, {user: data})
    .catch((err) => {
        handleError();
        if(callback && typeof callback === "function"){
            callback(err);
        }
    });
}

export const logout = () => {
    return axios.post(`${baseURL}/users/logout`, null)
    .catch(handleError);
}
 

/////////////////////////////////////////////////////////
// post: user's posts, local posts, singlePost, createPost, delete

export const getUserPosts = (token) => {
    // this would just be based on the current user
    return axios.get(`${baseURL}/user_posts`, config(token))
    .catch(handleError);
}

//get '/local_posts/:zipcode'
export const getLocalPosts = (zipcode, token) => {
    // this would just be based on the current user
    return axios.get(`${baseURL}/local_posts/${zipcode}`, config(token))
    .catch(handleError);
}

export const getSinglePost = (post_id, token) => {
    return axios.get(`${baseURL}/posts/${post_id}`, config(token))
    .catch(handleError);
}

export const createPost = (post, token) => {
    // hmm, will this work as is?
    return axios.post(`${baseURL}/posts`, post, config(token))
    .catch(handleError);
}

export const updatePost = (post, post_id, token) => {
    console.log("UPDATE Post", post);
    return axios.patch(`${baseURL}/posts/${post_id}`, post, config(token))
    .catch(handleError);
}


export const deletePost = (post_id, token) => {
    return axios.delete(`${baseURL}/posts/${post_id}`, config(token))
    .catch(handleError);
}


/////////////////////////////////////////////////////////
// comments: create, delete

export const createComment = (comment, token) => {
    return axios.post(`${baseURL}/comments`, comment, config(token))
    .catch(handleError);
}

export const deleteComment = (comment_id, token) => {
    return axios.delete(`${baseURL}/comments/${comment_id}`, config(token))
    .catch(handleError);
}


/////////////////////////////////////////////////////////
// category: index
export const getCategoryIndex = (token) => {
    return axios.get(`${baseURL}/categories`, config(token))
    .catch(handleError);
}


/////////////////////////////////////////////////////////
// area: index
export const getAreaIndex = (token) => {
    return axios.get(`${baseURL}/areas`, config(token))
    .catch(handleError);
}

/////////////////////////////////////////////////////////
// image: create, delete

export const createImage = (image, token) => {
    return axios.post(`${baseURL}/images`, image, config(token))
    .catch(handleError);
}

export const updateImage = (image, image_id, token) => {
    console.log("UPDATE image", image);
    return axios.patch(`${baseURL}/images/${image_id}`, image, config(token))
    .catch(handleError);
}