import React from 'react'

class Homepage extends React.Component{

    render(){
        console.log('HOMEPAGE rendered')
        return(
            <div className='homepage'>
                <div id='box3'>
                    <p className='title is-4'>Welcome to Cloud Board!</p>
                    <p className='title is-5'>Check what's happening in your neighbor!</p>
                </div>
            </div>
        )
    }
}

export default Homepage