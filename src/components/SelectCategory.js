import React from 'react'

class SelectCategory extends React.Component {

    render() {
        return (
            <div>
                <div className="select is-small is-info">
                    <select value={this.props.category} onChange={this.props.handleSelect}>
                        <option value='all'>All</option>
                        <option value='housing'>Housing</option>
                        <option value='marketplace'>Marketplace</option>
                        <option value='education'>Education</option>
                        <option value='pet adoption'>Pet Adoption</option>
                        <option value='event'>Event</option>
                    </select>
                </div>
            </div>
        )
    }
}

export default SelectCategory