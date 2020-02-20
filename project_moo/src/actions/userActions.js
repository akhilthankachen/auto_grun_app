import { AUTHENTICATE, DEAUTHENTICATE } from './type'
import timeoutPromise from '../timeoutPromise'
import config from '../../config'


export const authenticate = (credentials) => dispatch => {
    timeoutPromise(3000, fetch( config.remote + '/users/authenticate', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      })  
      .then((response) => {
        if(response.status == 200){
            return response.json()
        }else{
            dispatch({
                type: AUTHENTICATE,
                status: false,
                msg: '* Error',
                token: ''
            }) 
        }
      })
      .then((responseJSON)=>{
        // response json
        if(responseJSON.success == false){
            dispatch({
                type: AUTHENTICATE,
                status: false,
                msg: '* '+responseJSON.msg,
                token: ''
            })            
        }else{
            // user token
            dispatch({
                type: AUTHENTICATE,
                status: true,
                msg: '',
                token: responseJSON.token
            })
        }
      })
      .catch((err)=>{
        dispatch({
            type: AUTHENTICATE,
            status: false,
            msg: '* Error, Check network connection',
            token: ''
        }) 
      })).catch((err)=>{
        dispatch({
            type: AUTHENTICATE,
            status: false,
            msg: '* Error, Check network connection',
            token: ''
        }) 
      })
}

export const deauthenticate = () => dispatch => {
    dispatch({
        type: DEAUTHENTICATE
    })
}