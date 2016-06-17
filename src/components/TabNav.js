import React, { Component, PropTypes } from 'react'
import { SelectTabLink } from '../containers/SelectTabLink'

const TabNav = () => (<ul>
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

export default TabNav;
