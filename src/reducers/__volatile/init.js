import {
  RESET_TO_NOTHING,
} from '../../actions/app'

export default function(state=true, action) {
  switch (action.type) {
    case RESET_TO_NOTHING:
      return true
    default:
      return false
  }
}
