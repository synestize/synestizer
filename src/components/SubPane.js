import React from 'react'

const SubPane = ({title, children, className=''}) => {
  let titleBlock = "";
  if (title) {
    titleBlock= (<h2>{title}</h2>)
  }
  return (
    <section className={`subpane ${className}`}>
      {titleBlock}
      {children}
    </section>
  )
}

export default SubPane;
