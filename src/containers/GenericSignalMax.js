'use strict';
import { connect } from 'react-redux';
import {
  setMaxNGenericSinkSignals
} from '../actions/signal'
import IntSelect from '../components/IntSelect'

const mapStateToProps = (state, ownProps) => {
  return {
    currentNum: state.signal.nGenericSinkSignals,
    maxNum: 21
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: (i) => {
      // console.debug('setMaxNGenericSinkSignals', i)
      dispatch(setMaxNGenericSinkSignals(i))
    }
  }
};

const GenericSignalMax = connect(
  mapStateToProps,
  mapDispatchToProps
)( IntSelect );

export default GenericSignalMax;
