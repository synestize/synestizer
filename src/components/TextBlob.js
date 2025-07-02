import React from 'react'

const TextBlob = ({content='', onChange, title, className=''}) => {
  let header;
  if (title) {
    header = <h4 className='textblobtitle'>{title}</h4>
  }
  return <form className={'textblob ' + className}>
    {header}
    <textarea value={content} onChange={(e)=>onChange(e.target.value)} />
  </form>
}


export default TextBlob;
