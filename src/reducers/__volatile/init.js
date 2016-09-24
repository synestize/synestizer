import {
  RESET_TO_NOTHING,
} from '../../actions/gui'

export default function(state=true, action) {
  switch (action.type) {
    case RESET_TO_NOTHING:
      return true
    default:
      return false
  }
}
