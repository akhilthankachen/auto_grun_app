import { UPDATE_TIMER } from '../actions/type'
import { PURGE } from "redux-persist"

initialState = {
    ch1: [],
    ch2: [],
    ch3: [],
    ch4: [],
    ch2p: "0",
    ch3p: "0",
    m: [0,0,0,0]
}

export default function(state = initialState, action) {
    switch(action.type) {
        case UPDATE_TIMER: return {
            ...state,
            ch1: action.ch1,
            ch2: action.ch2,
            ch3: action.ch3,
            ch4: action.ch4,
            ch2p: action.ch2p,
            ch3p: action.ch3p,
            m: action.m
        }
        case PURGE: return initialState
        default : return state
    }
}