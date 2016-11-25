import {Schema, arrayOf, normalize} from 'normalizr'
import {camelizeKeys} from 'humps'

const getNextPageUrl = response => {
    const link = response.headers.get('link')
    if(!link) {
        return null
    }

    const nextLink = link.split(',').find(s => s.indexOf('rel="next') > -1)
    if(!getNextPageUrl) {
        return null
    }

    return nextLink.split(';')[0].slice(1, -1);
}

const API_ROOT = 'https://api.github.com/'

const callApi = (endPoint, schema) => {
    const fullURL = (endPoint.indexOf(API_ROOT) === -1) ? API_ROOT + endPoint : endPoint
    
    return fetch(fullURL)
        .then(response =>  response.json().then(json => {
            if(!response.ok) {
                return Promise.reject(json)
            }

            const camelizedJson = camelizeKeys(json)
            const nextPageUrl = getNextPageUrl(response)
            return Object.assign({}, normalize(camelizedJson, schema), {nextPageUrl})
        }))
}

const userSchema = new Schema('users', {
    idAttribute: user=> user.login.toLowerCase()
})

const repoSchema = new Schema('repos', {
    idAttribute: repo=> repo.fullName.toLowerCase()
})

repoSchema.define({
    ower:userSchema
})

export const Schemas = {
    USER: userSchema,
    USER_ARRAY: arrayOf(userSchema),
    REPO: repoSchema,
    REPO_ARRAY: arrayOf(repoSchema)
}

export const CALL_API = Symbol('Call API')

export default store => next => action => {
    const callAPI = action[CALL_API]
    if(typeof callAPI === 'undefined') {
        return next(action)
    }
    let {endpoint} = callAPI
    const {schema ,types} = callAPI

    if(typeof endpoint === 'function') {
        endpoint = endpoint(store.getState())
    }

    if(typeof endpoint !== 'string') {
        throw new Error('Specify a string endpoint URL.')
    }
    if(!schema) {
        throw new Error('Specify one of the export Schemas')
    }
    if(!Array.isArray(types) || types.length !== 3) {
        throw new Error('Expect a array of three action types')
    }
    if(!types.every(type=>typeof type === 'string')) {
        throw new Error('Expect action types to be strings')
    }
    const actionWith = data => {
        const finalAction = Object.assign({}, action, data)
        delete finalAction[CALL_API]
        return finalAction
    }

    const [requestType, successType, failureType] = types;
    next(actionWith({type:requestType}))
    return callApi(endpoint, schema).then(
        response => next(actionWith({response, type:successType})),
        error => next(actionWith({type:failureType, error: error.message || 'Something bad happened'}))
    )
}