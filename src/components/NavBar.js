import React from "react";
import { Link } from "react-router-dom";
import AuthContext from "../AuthContext"

class NavBar extends React.Component {
    static contextType = AuthContext;
    render() {
        console.log('navbar context:', this.context)
        return (
            <nav className="navbar is-fixed-top" role="navigation" aria-label="main navigation">
                <div id="navbarBasicExample" className="navbar-menu">
                    <div className="navbar-start">
                        <div className="navbar-item">
                            <p className='title nav-title'>Cloud Borad</p>
                        </div>
                    </div>

                    <div className="navbar-end">
                        <div className="navbar-item">
                            {this.context.user
                                ? <a className="subtitle is-underlined">Hi, {this.context.user.name}</a>
                                : ""}
                        </div>
                        <div className="navbar-item">
                            {this.context.user
                                ? <a className="button is-danger is-inverted" onClick={this.props.logout}><strong>Logout</strong></a>
                                : ""
                            }
                        </div>
                    </div>
                </div>
            </nav>
        )
    }
}

export default NavBar;

