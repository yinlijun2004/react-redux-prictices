import React, {PropTypes} from 'react'
import {Link} from 'react-router'

const User = ({user}) => {
    const {name, avatarURL, login} = this.props.user
    return (
        <div className='user'>
        <Link to={`/${login}`}>
        <img src={avatarURL} alt={login} width='72' height='72' />
        <h3>
            {login} {name && <span>{name}</span>}
        </h3>
        </Link>    
        </div>
    )
}

User.propTypes ={
    user: PropTypes.shape({
            login: PropTypes.string.isRequired,
            avatarURL: PropTypes.string.isRequired,
            name: PropTypes.string
        }).isRequired
} 

export default User