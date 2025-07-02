import React from 'react'
import TabNav from './TabNav'
import CurrentPane from './CurrentPane'

const PaneSet = ({visiblePane}) => {
  return (<div >
    <TabNav />
    <CurrentPane visiblePane={visiblePane} />
  </div>)
}


export default PaneSet;
