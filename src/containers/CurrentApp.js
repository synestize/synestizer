import { connect } from 'react-redux'
import App from '../components/App'


const CurrentApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default CurrentApp
