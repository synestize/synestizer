'use strict';

import React, { Component, PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import VideoDom from './VideoDom';

/*
Actual DOM refrences can mess wit' ya.

see
https://facebook.github.io/react/docs/reusable-components.html
https://facebook.github.io/react/docs/more-about-refs.html
https://facebook.github.io/react/tips/use-react-with-other-libraries.html
*/

class App extends Component {
  componentDidMount() {}
  componentDidUpdate() {}
  componentWillUnmount() {}
  render() {
    console.debug("actually rendered yay");
    return (<div>
      Word.
    </div>);
  }
}
export default App
