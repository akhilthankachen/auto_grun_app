import { AUTHENTICATE, DEAUTHENTICATE } from '../actions/type'
import { PURGE } from "redux-persist"

const initialState = {
    authStatus: false,
    authMessage: '',
    token: ''
}

export default function(state = initialState, action) {
    switch(action.type) {
        case AUTHENTICATE: return {
            token: action.token,
            authMessage: action.msg,
            authStatus: action.status
        }
        case DEAUTHENTICATE: return {
            token: '',
            authStatus: false,
            authMessage: ''
        }
        case PURGE: return initialState
        default : return state
    }
}