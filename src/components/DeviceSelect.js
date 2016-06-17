'use strict';

import React, { Component, PropTypes, Children } from 'react';

export default () => (<div className="streamchooserwidget">
  <label htmlFor="videoInDevice">Device </label>
  <select name="videoInDevice" id="videoInDevice" className="videoselect" disable={disabled} value={selectValue} onChange={(ev) => intents.selectVideoInDevice(ev.target.value)}>
    {deviceOptNodes}
  </select>
</div>)
