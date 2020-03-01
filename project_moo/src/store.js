import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage'
import liveReducer from './reducers/liveReducer'
import userReducer from './reducers/userReducer'
import timerReducer from './reducers/timerReducer'

const middleware = [thunk]

const rootPersistConfig = {
    key: 'root',
    storage: AsyncStorage,
    blacklist: ['live', 'timer']
}

const livePersistConfig = {
    key: 'live',
    storage: AsyncStorage,
    blacklist: ['networkOnline', 'deviceOnline']
}

const timerPersistConfig = {
    key: 'timer',
    storage: AsyncStorage,
    blacklist: ['ch1','ch2','ch3','ch4','m']
}

const rootReducer = combineReducers({
    user: userReducer,
    live: persistReducer(livePersistConfig, liveReducer),
    timer: persistReducer(timerPersistConfig, timerReducer)
})

const persistedReducer = persistReducer(rootPersistConfig, rootReducer)

var persistor

export default () => {
    let store = createStore(
        persistedReducer,     
        compose (
        applyMiddleware(...middleware),
        )
    )
    persistor = persistStore(store)
    return { store, persistor }
}

export const purge = () => () => {
    persistor.purge().then(()=>{
        console.log(" state purged ")
    })
}