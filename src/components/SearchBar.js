import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

class SearchBar extends React.Component {
    render() {
        return (
            <div className='field'>
                <div className="control has-icons-left">
                    <input className="input" type="text" placeholder="Find a post" value={this.props.search} onChange={this.props.handleInput} />
                    <span class="icon is-small is-left">
                        <FontAwesomeIcon color='green' icon={faSearch} />
                    </span>
                </div>
            </div>
        )
    }
}

export default SearchBar
