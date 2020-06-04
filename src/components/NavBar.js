import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCarrot } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";
import AuthContext from "../AuthContext"

class NavBar extends React.Component {
    static contextType = AuthContext;
    render(){
        return(
            <>
                <h1><FontAwesomeIcon icon={faCarrot} color='orange'/>Navbar</h1>
                {this.context.user
                    ? <a className="button is-danger is-inverted" onClick={this.props.logout}><strong>Logout</strong></a>
                    : ""
                }
            </>
        )
    }
}

export default NavBar;