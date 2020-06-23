import { UPDATE_TIMER } from './type'
import timeoutPromise from '../timeoutPromise'
import config from '../../config'

export const getTimer = () => (dispatch,getState) => {
    timeoutPromise(5000, fetch(config.remote+'/device/getSettings', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': getState().user.token,
        }
      },)  
      .then((response) => {
          if(response.status == 200){
              return response.json()
          }
      })
      .then((responseJSON)=>{
        if(responseJSON != null){
          if(responseJSON.success == true){
            var json = JSON.parse(responseJSON.msg)
            if(responseJSON != ''){
              dispatch({
                  type: UPDATE_TIMER,
                  ch1: json.ch1 ? json.ch1 : [],
                  ch2: json.ch2 ? json.ch2 : [],
                  ch3: json.ch3 ? json.ch3 : [],
                  ch4: json.ch4 ? json.ch4 : [],
                  ch2p: json.ch2p ? json.ch2p : "0",
                  ch3p: json.ch3p ? json.ch3p : "0",
                  m: json.m ? json.m : [0,0,0,0]
              })
            }
          }
        }
      })
      .catch((err)=>{
          console.log(err)
      })).catch((err)=>{
          console.log(err)
      })
}

export const putTimer = (data, callback) => (dispatch,getState) => {
    console.log("Put Timer")
    var json = {
      settings: {
        ch1: data.ch1,
        ch2: data.ch2,
        ch3: data.ch3,
        ch4: data.ch4,
        ch2p: data.ch2p,
        ch3p: data.ch3p,
        m: data.m
      }
    }

    json = JSON.stringify(json)
    timeoutPromise(5000, fetch(config.remote+'/device/settings', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': getState().user.token,
      },
      body: json
    },)  
    .then((response) => {
        if(response.status == 200){
            return response.json()
        }
    })
    .then((responseJSON)=>{
      if(responseJSON != null){
        if(responseJSON.success == true){
          setTimeout(()=>{
            timeoutPromise(5000, fetch(config.remote+'/device/settingsAck', {
                method: 'GET',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': getState().user.token,
                }
              },)  
              .then((response) => {
                  if(response.status == 200){
                      return response.json()
                  }
              })
              .then((responseJSON)=>{
                if(responseJSON != null){
                  if(responseJSON.msg == true){
                    alert('Settings update successfully...')
                    callback()
                    dispatch({
                        type: UPDATE_TIMER,
                        ch1: data.ch1,
                        ch2: data.ch2,
                        ch3: data.ch3,
                        ch4: data.ch4,
                        ch2p: data.ch2p,
                        ch3p: data.ch3p,
                        m: data.m
                    })
                  }else{
                    alert('Couldn\'t update. Try again...')
                    callback()
                  }
                }
              })
              .catch((err)=>{
                console.log(err)
                alert('Couldn\'t update. Try again...')
                callback()
              })).catch(err=>{
                console.log(err)
                alert('Couldn\'t update. Try again...')
                callback()
              })
          },2000)
        }
      }
    })
    .catch((err)=>{
        console.log(err)
        alert('Couldn\'t update. Try again...')
        callback()
    })).catch(err=>{
        console.log(err)
        alert('Couldn\'t update. Try again...')
        callback()
    })
}