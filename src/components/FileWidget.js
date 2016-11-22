import { PropTypes } from 'react'

const FileWidget = ({ text, onChange}) => (
  <form>
    <h4>{text}</h4>
    <input onChange={(e)=>{
      console.debug(e.files)
      onChange()
    }} type='file'></input>
  </form>
)

FileWidget.propTypes = {
  onChange: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired
}

export default FileWidget;
