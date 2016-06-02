'use strict';
import { connect } from 'react-redux';
import App from '../components/App';

const mapStateToProps = () => {};
const mapDispatchToProps = () => {};

const CurrentApp = connect(
  mapStateToProps,
  mapDispatchToProps
)( App );

export default CurrentApp;
