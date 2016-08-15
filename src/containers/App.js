'use strict';
import { connect } from 'react-redux';
import PaneSet from '../components/PaneSet';

const mapStateToProps = (state, ownProps) => {
  return {
    visiblePane: state.gui.visiblePane,
    version: ownProps.version
  }
};

const App = connect(
  mapStateToProps //,
  //mapDispatchToProps,
  // undefined //mergeprops
)( PaneSet );

export default App;
