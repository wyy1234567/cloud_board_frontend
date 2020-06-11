import React from 'react'

class SearchBar extends React.Component {
    render() {
        return (
            <div className='field'>
                <div className="control">
                    <input className="input" type="text" placeholder="Find a post" value={this.props.search} onChange={this.props.handleInput} />
                </div>
            </div>
        )
    }
}

export default SearchBar
