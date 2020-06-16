import React from 'react'
import AuthContext from "../AuthContext"

class ChangeArea extends React.Component{

    static contextType = AuthContext;

    state={
        currArea: ''
    }

    componentDidMount() {
        fetch('http://localhost:3000/users')
            .then(res => res.json())
            .then(res => {
                res.forEach(area_obj => {
                    if (area_obj.zipcode === this.context.user.zipcode) {
                        this.setState({
                            currArea: area_obj.name
                        })
                    }
                })
            })
    }

    render() {
        console.log('area context:', this.context.user.zipcode)
        let currZip = this.context.user.zipcode
        return(
            <div>
                <div className="select is-small is-warning">
                    <select value={this.props.zipcode} onChange={this.props.selectArea}>
                        <option value={currZip}>{this.state.currArea}</option>
                        <option value='07310'>Jersey City</option>
                        <option value='10027'>Manhattan</option>
                        <option value='07030'>Hoboken</option>
                    </select>
                </div>
            </div>
        )
    }
}

export default ChangeArea