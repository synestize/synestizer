import { connect } from 'react-redux';
import {
  setSourceSinkScale,
  setSinkBias,
} from '../actions/signal'
import ScaleSlider from '../components/ScaleSlider'


const mapStateToProps = (state, {sourceKey, sinkKey, ...ownProps}) => {
  return {
    scale: state.signal.sourceSinkScale[sourceKey+'/'+sinkKey]|| 0.0,
    ...ownProps
  }
}
const mapDispatchToProps = (dispatch, {sourceKey, sinkKey}) => {
  return {
    onChange: (val=0) => {
      dispatch(
        setSourceSinkScale(sourceKey, sinkKey, val))
    },
    onDoubleClick:  (val=0) => dispatch(
      setSourceSinkScale(sourceKey, sinkKey, 0.0)
    ),
  }
};

const ActivePatchMappingControl = connect(
  mapStateToProps,
  mapDispatchToProps
)( ScaleSlider );

export default ActivePatchMappingControl;
