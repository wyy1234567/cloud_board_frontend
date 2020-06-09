import React from 'react'

class SearchBar extends React.Component {
    render() {
        return (
            <list className='field post-buttons'>
                <div className="control">
                    <input className="input is-small" type="text" placeholder="Search a post" value={this.props.search} onChange={this.props.handleInput}/>
                </div>
            </list>
        )
    }
}

export default SearchBar
