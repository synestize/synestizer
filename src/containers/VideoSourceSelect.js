'use strict';
import { connect } from 'react-redux';
import { setValidVideoSource, setCurrentVideoSource, setAllVideoSources } from '../actions/video'
import DeviceSelect from '../components/DeviceSelect.js'

const mapStateToProps = (state, ownProps) => {
  return {
    deviceMap: state.video.__videoSources,
    valid: state.video.__validVideoSource,
    currentDevice: state.video.currentVideoSource
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: (key) => setCurrentVideoSource(key)
  }
};

const VideoSourceSelect = connect(
  mapStateToProps,
  mapDispatchToProps
)( DeviceSelect );

export default VideoSourceSelect;
