import { UPDATE_TIMER } from './type'
import timeoutPromise from '../timeoutPromise'
import config from '../../config'

export const getTimer = () => (dispatch,getState) => {
    console.log('get')
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
            if(responseJSON.msg !== ''){
              dispatch({
                  type: UPDATE_TIMER,
                  ch1: json.ch1 ? json.ch1 : {},
                  ch2: json.ch2 ? json.ch2 : {},
                  ch3: json.ch3 ? json.ch3 : {},
                  ch4: json.ch4 ? json.ch4 : {},
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
    let ch1 = {
      up: data.ch1.up ? data.ch1.up : 0,
      lp: data.ch1.lp ? data.ch1.lp : 0
    }
    let ch2 = {
      up: data.ch2.up ? data.ch2.up : 0,
      lp: data.ch2.lp ? data.ch2.lp : 0
    }
    let ch3 = {
      up: data.ch3.up ? data.ch3.up : 0,
      lp: data.ch3.lp ? data.ch3.lp : 0,
      d : 1
    }
    var json = {
      settings: {
        ch1: ch1,
        ch2: ch2,
        ch3: ch3
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