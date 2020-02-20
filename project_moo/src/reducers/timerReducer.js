import { UPDATE_TIMER } from '../actions/type'
import { PURGE } from "redux-persist"

initialState = {
    ch1: [],
    ch2: [],
    ch3: [],
    ch4: []
}

export default function(state = initialState, action) {
    switch(action.type) {
        case UPDATE_TIMER: return {
            ...state,
            ch1: action.ch1,
            ch2: action.ch2,
            ch3: action.ch3,
            ch4: action.ch4
        }
        case PURGE: return initialState
        default : return state
    }
}