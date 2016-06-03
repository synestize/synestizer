'use strict';

import React, { Component, PropTypes, Children } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import VideoDom from './VideoDom';

/*
Actual DOM refrences can mess wit' ya.

see
https://facebook.github.io/react/docs/reusable-components.html
https://facebook.github.io/react/docs/more-about-refs.html
https://facebook.github.io/react/tips/use-react-with-other-libraries.html
https://facebook.github.io/react/docs/top-level-api.html#react.children
*/

class App extends Component {
  componentDidMount() {}
  componentDidUpdate() {}
  componentWillUnmount() {}
  render() {
    /*
    React.Children.map something...
    */
    /* key VideoDom to make the element robust, ref to provide access */

    return (<div >
      <VideoDom ref={(ref) => this.videoDom = ref} key="videodom" />
      Word.
    </div>);
  }
}

export default App;
