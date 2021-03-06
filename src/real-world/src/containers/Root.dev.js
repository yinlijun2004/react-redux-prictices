import React, {PropTypes} from 'react'
import {Router} from 'react-router'
import DevTools from './DevTools'
import {Provider} from 'react-redux'
import routes from '../routes'

const Root = ({store, history}) => {
    return (
        <Provider store={store}>
        <div>
            <Router history={history} routes={routes}/>
            <DevTools />
        </div>
        </Provider>
    )
}

Root.propTypes = {
    store: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
}

export default Root