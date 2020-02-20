import { GET_LIVE_TEMP, GET_DEVICE_STATUS, GET_TEMP_HOUR } from './type'
import timeoutPromise from '../timeoutPromise'
import config from '../../config'
import dateFormat from 'dateformat'

export const getLiveTemp = () => (dispatch, getState) => {
    timeoutPromise(3000, fetch(config.remote+'/device/lastTemp', {
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
            let date = new Date(responseJSON.timeStamp)
            let dateFormated = dateFormat(date, "mmmm dS, yyyy, h:MM:ss TT")
            dispatch({
                type: GET_LIVE_TEMP,
                temp: responseJSON.temp,
                lastUpdated: dateFormated
            })
        }
        })
        .catch((err)=>{
            console.log(err)
        })
    ).catch(err => {
        console.log(err)
    })
}

export const getDeviceStatus = () => (dispatch, getState) => {
    timeoutPromise(5000, fetch(config.remote+'/device/ping', {
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
            setTimeout(()=>{
                timeoutPromise(5000, fetch(config.remote+'/device/pingAck', {
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
                      if(responseJSON.success){
                        if(responseJSON.msg){
                            dispatch({
                                type: GET_DEVICE_STATUS,
                                networkOnline: true,
                                deviceOnline: true
                            })
                        }else{
                            dispatch({
                                type: GET_DEVICE_STATUS,
                                networkOnline: true,
                                deviceOnline: false
                            })
                        }
                      }
                    }
                  })
                  .catch((err)=>{
                    console.log(err)
                    dispatch({
                        type: GET_DEVICE_STATUS,
                        networkOnline: false,
                        deviceOnline: false
                    })
                  })).catch((err)=>{
                      console.log(err)
                      dispatch({
                        type: GET_DEVICE_STATUS,
                        networkOnline: false,
                        deviceOnline: false
                      })
                  })
            }, 2000)
          }
        }
      })
      .catch((err)=>{
          console.log(err)
          dispatch({
            type: GET_DEVICE_STATUS,
            networkOnline: false,
            deviceOnline: false
          })
      })).catch((err)=>{
          console.log(err)          
          dispatch({
            type: GET_DEVICE_STATUS,
            networkOnline: false,
            deviceOnline: false
          })
      })
}

export const getTempHour = () => (dispatch,getState) =>{
  timeoutPromise(5000, fetch(config.remote+'/device/avgTempDay', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': getState().user.token,
    },
    body: JSON.stringify({date: Date.now()})
  },)  
  .then((response) => {
    if(response.status == 200){
        return response.json()
    }
  })
  .then((responseJSON)=>{
  if(responseJSON != null){
    let date = new Date()
    let dateFormated = dateFormat(date, "mmmm dS, yyyy, h:MM:ss TT")
    if(responseJSON.msg){
      var labels = responseJSON.msg.map((json)=>{
        let tempDate = new Date(json.timeStamp)
        return tempDate.getHours()
      })
  
      var data = responseJSON.msg.map((json)=>{
        return json.temp
      })
    }

    if(getState().live.maxTemp.data.length <= data.length){
      dispatch({
        type: GET_TEMP_HOUR,
        avgTemp: {
          labels: labels,
          data: data,
          lastUpdated: dateFormated
        },
        minTemp: getState().live.minTemp,
        maxTemp: getState().live.maxTemp
      })
    }
    
  }
  })
  .catch((err)=>{
    console.log(err)
  })).catch((err)=>{
    console.log(err)
  })

  timeoutPromise(5000, fetch(config.remote+'/device/minTempDay', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': getState().user.token,
    },
    body: JSON.stringify({date: Date.now()})
  },)  
  .then((response) => {
    if(response.status == 200){
        return response.json()
    }
  })
  .then((responseJSON)=>{
  if(responseJSON != null){
    let date = new Date()
    let dateFormated = dateFormat(date, "mmmm dS, yyyy, h:MM:ss TT")
    if(responseJSON.msg){
      var labels = responseJSON.msg.map((json)=>{
        let tempDate = new Date(json.timeStamp)
        return tempDate.getHours()
      })
  
      var data = responseJSON.msg.map((json)=>{
        return json.temp
      })
  
    }
  
    if(getState().live.maxTemp.data.length <= data.length){
      dispatch({
        type: GET_TEMP_HOUR,
        minTemp: {
          labels: labels,
          data: data,
          lastUpdated: dateFormated
        },
        maxTemp: getState().live.maxTemp,
        avgTemp: getState().live.avgTemp
      })
    }
    
  }
  })
  .catch((err)=>{
    console.log(err)
  })).catch((err)=>{
    console.log(err)
  })

  timeoutPromise(5000, fetch(config.remote+'/device/maxTempDay', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': getState().user.token,
    },
    body: JSON.stringify({date: Date.now()})
  },)  
  .then((response) => {
    if(response.status == 200){
        return response.json()
    }
  })
  .then((responseJSON)=>{
  if(responseJSON != null){
    let date = new Date()
    let dateFormated = dateFormat(date, "mmmm dS, yyyy, h:MM:ss TT")
    if(responseJSON.msg){
      var labels = responseJSON.msg.map((json)=>{
        let tempDate = new Date(json.timeStamp)
        return tempDate.getHours()
      })
  
      var data = responseJSON.msg.map((json)=>{
        return json.temp
      })
  
    }
  
    if(getState().live.maxTemp.data.length <= data.length){
      dispatch({
        type: GET_TEMP_HOUR,
        maxTemp: {
          labels: labels,
          data: data,
          lastUpdated: dateFormated
        },
        minTemp: getState().live.minTemp,
        avgTemp: getState().live.avgTemp
      })
    }
    
  }
  })
  .catch((err)=>{
    console.log(err)
  })).catch((err)=>{
    console.log(err)
  })
}