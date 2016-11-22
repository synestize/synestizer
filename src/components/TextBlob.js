import { PropTypes } from 'react'

const TextBlob = ({content, onChange, title}) => {
  let header;
  if (title) {
    header = <h4>{title}</h4>
  }
  return <form>
    {header}
    <textarea value={content} onChange={(e)=>onChange(e.target.value)} />
  </form>
}

TextBlob.propTypes = {
  onChange: PropTypes.func.isRequired,
  content: PropTypes.string.isRequired,
  content: PropTypes.string
}

export default TextBlob;
