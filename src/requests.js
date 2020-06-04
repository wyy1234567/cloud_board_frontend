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

 

