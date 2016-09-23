import {
  RESET,
} from '../../actions/gui'

export default function(state=true, action) {
  switch (action.type) {
    case RESET:
      return true
    default:
      return false
  }
}
