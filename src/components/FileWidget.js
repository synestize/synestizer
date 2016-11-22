import { PropTypes } from 'react'

const FileWidget = ({ text, onChange}) => (
  <form>
    <h4>{text}</h4>
    <input onChange={(e)=>{
      console.debug(e.target.files)
      if (e.target.files.length===1) {
        onChange(e.target.files[0])
      }
    }} type='file'></input>
  </form>
)

FileWidget.propTypes = {
  onChange: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired
}

export default FileWidget;
