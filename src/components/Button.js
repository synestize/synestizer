import { PropTypes } from 'react'

const Button = ({ text, onClick}) => (
  <button onClick={onClick}>{text}</button>
)

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired
}

export default Button;
