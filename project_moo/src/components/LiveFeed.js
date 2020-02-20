import React, {Component} from 'react'
import {StyleSheet, Text, View, Dimensions} from 'react-native'
import config from '../../config'
import dateFormat from 'dateformat'
import { connect } from 'react-redux'
import { getLiveTemp, getDeviceStatus } from '../actions/liveTempActions'
import PropTypes from 'prop-types'


const WIDTH = Dimensions.get('window').width
type Props = {};
var setIntervalObject;
var setIntervalObjectPing;
class LiveFeed extends Component<Props> {
    constructor(props){
        super(props)
        this.state = {
            deviceOnline: null,
            networkOnline: true,
            liveTemp: this.props.live.temp,
            lastUpdated: this.props.live.lastUpdated
        }
    }

    UNSAFE_componentWillReceiveProps = next => {
      this.setState({
        liveTemp: next.live.temp,
        lastUpdated: next.live.lastUpdated,
        networkOnline: next.live.networkOnline,
        deviceOnline: next.live.deviceOnline
      })
    }

    componentDidMount = () => {
        setIntervalObject = setInterval(()=>{
          this.props.getLiveTemp()
          this.props.getDeviceStatus()
        }, 5000)

    }

    componentWillUnmount = ()=>{
      clearInterval(setIntervalObject)
      clearInterval(setIntervalObjectPing)
    }

    renderStatus = ()=>{
      if(this.state.networkOnline == true){
        if(this.state.deviceOnline == null){
          return <Text style={styles.deviceLoadingText}>Loading...</Text>
        }
        if(this.state.deviceOnline == true){
          return <Text style={styles.deviceOnlineText}>Device Online</Text>
        }else{
          return <Text style={styles.deviceOfflineText}>Device Offline</Text>
        }
      }else{
        return <Text style={styles.networkText}>Connection Error</Text>
      }
    }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.box}>
            <View style={styles.liveFeed}>
                <Text style={styles.liveFeedText}>
                    Live Feed
                </Text>
            </View>
            <View style={styles.liveTemp}>
                <Text style={styles.liveTempText}>
                    {this.state.liveTemp}°C
                </Text>
            </View>
            <View style={styles.lastSync}>
                <Text style={styles.lastSyncText}>Last Updated</Text>
                <Text style={styles.lastSyncText}>{this.state.lastUpdated}</Text>
                {this.renderStatus()}
            </View>
        </View>
      </View>
    );
  }
}

LiveFeed.propTypes = {
  live: PropTypes.object.isRequired,
  getLiveTemp: PropTypes.func.isRequired,
  getDeviceStatus: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  live: state.live
})

export default connect(mapStateToProps, {getLiveTemp, getDeviceStatus})(LiveFeed)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logout: {
    position: 'absolute',
    bottom: 15,
    right: 15
  },
  box: {
    backgroundColor: 'white',
    width: WIDTH - 30,
    height: 300,
    marginTop: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  liveFeed: {
    marginTop: 30
  },  
  liveFeedText: {
    fontFamily: 'sans-serif-medium',
    fontSize: 20,
    color: 'black'
  },
  liveTempText: {
    fontSize: 70,
    fontFamily: 'sans-serif-medium',
    color: '#1B4859',
  },
  lastSync: {
    marginBottom: 30
  },
  lastSyncText: {
    textAlign: 'center',
    fontFamily: 'sans-serif-light',
    fontStyle: 'italic'
  },
  networkText: {
    textAlign: 'center',
    fontFamily: 'sans-serif-medium',
    fontStyle: 'normal',
    color: 'red'
  },
  deviceOnlineText: {
    textAlign: 'center',
    fontFamily: 'sans-serif-medium',
    fontStyle: 'normal',
    color: 'green'
  },
  deviceOfflineText: {
    textAlign: 'center',
    fontFamily: 'sans-serif-medium',
    fontStyle: 'normal',
    color: 'red'
  },
  deviceLoadingText: {
    textAlign: 'center',
    fontFamily: 'sans-serif-medium',
    fontStyle: 'normal',
    color: 'black'
  }
});