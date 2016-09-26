import { connect } from 'react-redux';
import EnsembleTriad from '../components/EnsembleTriad.js'
import { union, difference, intersection } from '../lib/collections'

const mapStateToProps = (state, ownProps) => {
  return {
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {}
};

const ControlTriad = connect(
  mapStateToProps,
  mapDispatchToProps
)( EnsembleTriad );

export default ControlTriad;
