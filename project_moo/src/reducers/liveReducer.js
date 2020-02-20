import { GET_LIVE_TEMP, GET_DEVICE_STATUS, GET_TEMP_HOUR } from '../actions/type'
import { PURGE } from "redux-persist"

const initialState = {
    temp: 0,
    lastUpdated: '',
    networkOnline: true,
    deviceOnline: null,
    maxTemp: {
        labels: [0,0,0,0],
        data: [0,0,0,0],
        lastUpdated: ''
    },
    minTemp: {
        labels: [0,0,0,0],
        data: [0,0,0,0],
        lastUpdated: ''
    },
    avgTemp: {
        labels: [0,0,0,0],
        data: [0,0,0,0],
        lastUpdated: ''
    }
}

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_LIVE_TEMP: return {
            ...state,
            temp: action.temp,
            lastUpdated: action.lastUpdated
        }
        case GET_DEVICE_STATUS: return {
            ...state,
            networkOnline: action.networkOnline,
            deviceOnline: action.deviceOnline
        }
        case GET_TEMP_HOUR: return {
            ...state,
            maxTemp: action.maxTemp,
            minTemp: action.minTemp,
            avgTemp: action.avgTemp
        }    
        case PURGE: return initialState
        default : return state
    }
}