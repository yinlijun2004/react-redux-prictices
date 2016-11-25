import React from 'react'
import ReactDOM from 'react-dom'
import reducer from './reducers'
import Counter from './components/counter'
import {createStore} from 'redux'

const store = createStore(reducer)
const rootE1 = document.getElementById('root')

const render = () => ReactDOM.render(
    <Counter onIncrement={() => store.dispatch({type:'INCREMENT'})}
        onDecrement={() => store.dispatch({type:'DECREMENT'})} value={store.getState()}/>
        , rootE1
)

render()

store.subscribe(render)