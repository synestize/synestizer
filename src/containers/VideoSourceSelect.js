'use strict';
import { connect } from 'react-redux';
import { setValidVideoSource, setCurrentVideoSource, setAllVideoSources } from '../actions/video'
import DeviceSelect from '../components/DeviceSelect.js'

const mapStateToProps = (state, ownProps) => {
  return {
    deviceMap: state.__volatile.video.sources,
    valid: state.__volatile.video.validSource,
    currentDevice: state.video.source
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: (key) => dispatch(setCurrentVideoSource(key))
  }
};

const VideoSourceSelect = connect(
  mapStateToProps,
  mapDispatchToProps
)( DeviceSelect );

export default VideoSourceSelect;
