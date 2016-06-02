"use strict";

import React, { Component, PropTypes } from 'react'

/*
Actual DOM refrences can mess wit' ya.

see
https://facebook.github.io/react/docs/reusable-components.html
https://facebook.github.io/react/docs/more-about-refs.html
https://facebook.github.io/react/tips/use-react-with-other-libraries.html

TODO: find out how to stop the component ever unmounting.
*/

class VideoDom extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}
  componentDidUpdate() {}
  componentWillUnmount() {}
  render() {
    // The ref attribute is a callback that saves a reference to the
    // components when mounted.
    return (<section id="video-display">
        <canvas id="video-canvas" ref={(ref) => this.videoCanvas = ref}></canvas>
        <video id="video-video" muted autoplay ref={(ref) => this.videoVideo = ref}></video>
      </section>
    );
  }
}
// VideoDom.propTypes = { initialCount: PropTypes.number };
// VideoDom.defaultProps = { initialCount: 0 };
export default VideoDom;
