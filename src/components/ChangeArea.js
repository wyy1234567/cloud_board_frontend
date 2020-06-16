import React from 'react'
import AuthContext from "../AuthContext"

class ChangeArea extends React.Component{

    static contextType = AuthContext;

    state={
        currArea: ''
    }

    render() {
        return(
            <div>
                <div className="select is-small is-warning">
                    <select value='select' onChange={null}>
                        <option value='all'>Select a different area</option>
                    </select>
                </div>
            </div>
        )
    }
}

export default ChangeArea