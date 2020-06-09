import React from 'react'

class SelectCategory extends React.Component {

    render() {
        return (
            <list className="select is-small is-info post-buttons">
                <select value={this.props.category} onChange={this.props.handleSelect}>
                    <option value='all'>All</option>
                    <option value='housing'>Housing</option>
                    <option value='marketplace'>Marketplace</option>
                    <option value='education'>Education</option>
                    <option value='pet adoption'>Pet Adoption</option>
                    <option value='event'>Event</option>
                </select>
            </list>
        )
    }
}

export default SelectCategory