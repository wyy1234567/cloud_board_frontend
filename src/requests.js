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
 

