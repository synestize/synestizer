import React, { Component, PropTypes } from 'react'
import SelectTabLink from '../containers/SelectTabLink'

const TabNav = () => {
  return (<ul>
    <li>
      <SelectTabLink paneId="welcome" >
        About
      </SelectTabLink>
    </li>
    <li>
      <SelectTabLink paneId="io" >
        IO
      </SelectTabLink>
    </li>
    <li>
      <SelectTabLink paneId="video">
        Video
      </SelectTabLink>
    </li>
  </ul>)
}
export default TabNav;
