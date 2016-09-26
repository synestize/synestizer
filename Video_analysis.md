# Video Analysis

## How it works now

At the moment, we use a very simple and easy model;
We calculate the first two "central sample moments" of the video data.
In plain language, this is the *mean* and the *covariance*.
Since all the statistics are normalized, this ends up being the same thing as the sample *correlation*, which might be more familiar.

Approximately 25 times per second we receive 3 matrixes full of pixel information from the video camera. Depending on the camera, this could be 1 megapixel or approximately 3 megabytes of data per frame

This is too much data, however, for such simple statistics, so we preprocess it in the following ways.

First, we *downsample* the video and chop it into a 64x64 pixel square.

Second, we convert the colorspace from Red/Green/Blue to [Y/Cb/Cr](https://en.wikipedia.org/wiki/YCbCr)
because otherwise blue and green are too similar to each other,
and *everything* is too similar to brightness).
Approximately speaking, "Y" is "brightness", "Cb" is "blueness"
and "Cr" is "Redness".

At this stage we have 3 64x64 matrixes: $$ Y,C_b,C_r. $$

For each of these we calculate the mean, a Y-mean, a Cb-mean and a Cr-mean.
These are the *first moments*.

Now for the *second moments*.


Then we add spatial coordinates to the pixels - a pixel on the left side of the screen has an x coordinate of 0. On the right side it has a coordinate of 1. On the bottom of the screen it would have a Y coordinate of 0 and on the top, 1.

![YCbCr space, from https://en.wikipedia.org/wiki/File:YCbCr.GIF](./media/YCbCr.GIF)

Next, we

## Ideas for the future

* Gaussian mixture model

  * we could get a consistent indexing for mixtures
  by starting our mixtures at known points,
  e.g. on the colour wheel or the space.
  Colour wheel alone seems more natural,
  but might require pre-processing by an inner product to find
  a good starting spatial coordinate.
* Compressive-sensing-style hacks, such as sparse random projections
* image descriptors
* PCA
* Haar cascade.
* random IIR filters
* cascaded IIR lowpass filters at successively lower resolution

    * You know what could lower the dimension further? Reporting only the extremest n extrema of the filtered fields, and the coordinates thereof.
    * Also arbitrary differences between layers
    * would the color coordinates interact at all?
    * could even takes squared difference features to extract localised frequency

* something like a convolution layer from machine vision?
* autocorrelation
* Kalman filters
* particle filters

    * with a loss fn to do with low-variance estimates of next timestep value in IJYUV space

* FFT features (or something else translation/phase-invariant?)
* exponentially weighted moments
* inner-product with desired eigen-features
* Features based on correlation with eigenfeatures (even fourier ones?)
* MCMC updating
* Gaussian mixture models
* user interaction: They choose a few key scenes, and we try to measure distance from those scenes.
* other clustering, say, spectral?
* switch to YUV-style projections - say, [JPEG YCbCr](https://en.wikipedia.org/wiki/YCbCr#JPEG_conversion) for correlation structures.
* [motion detection](http://www.adobe.com/devnet/html5/articles/javascript-motion-detection.html)
* [various sweet segmenations hacks](https://stackoverflow.com/questions/31071781/html5-canvas-image-segmentation)
* neural networks?

    * We can [train them online](https://cs.stanford.edu/people/karpathy/convnetjs/)
    * https://github.com/karpathy/recurrentjs
    * or use a high-performance pre-trained JS prediction models via [neocortex.js](https://github.com/scienceai/neocortex)?
    Note this woudl also get us features for free even if we ignore the model.
    * can we do *recursive* NN for realtime stuff this way?
    * Examples from keras https://github.com/fchollet/keras/tree/master/examples
    * torch examples http://www.di.ens.fr/willow/research/weakcnn/ https://hal.inria.fr/hal-01015140

* random forests

    * https://github.com/karpathy/forestjs
    * http://techtalks.tv/talks/randomized-decision-forests-and-their-applications-in-computer-vision-jamie/59432/


## Machine vision libraries

* tangible.js tracks a bunch of useful libraries such as [machine vision in js](http://tangiblejs.com/libraries/computer-vision)
* [tracking.js]http://trackingjs.com/) does cool stuff already
* so does [jsfeat](https://inspirit.github.io/jsfeat/) including some by EPFL and an entire linear algebra library
* [js-objectdetect](https://github.com/mtschirs/js-objectdetect/) also looks decent and fast
* [opencvjs](https://github.com/blittle/opencvjs) looks abandoned
* [blob detection](http://blog.acipo.com/blob-detection-js/)
* [segmentation engine](http://vision.akshaybhat.com/)
* [graphcut](http://www.jscuts.com/graphcuts/)

## WebGL optimisation

* notes about webgl support - e.g.
* FFT options for mobile.

    * [webgl fft paper](http://www.wuhao.co/uploads/2/6/0/1/26012804/paper_final.pdf)
    * [webgl fft demo](https://github.com/wuhao1117/WebGL-Ocean-FFT). No open-source, sadly.
    * [MDC animates textures in webgl ](https://developer.mozilla.org/en-US/docs/Web/WebGL/Animating_textures_in_WebGL)

* video+WebGL:

    * [live video in webgl](http://learningthreejs.com/blog/2012/02/07/live-video-in-webgl/)
    * [three.js and video](http://threejs.org/examples/#canvas_materials_video)

* [how to do WebGL-optimized image processing](http://learningwebgl.com/blog/?p=1786)
* [good plain intro](http://www.html5rocks.com/en/tutorials/webgl/webgl_fundamentals/)
* [webgl transforms](http://games.greggman.com/game/webgl-2d-matrices/)

* CSS filters to shunt to GPU? blur+invert+opacity gives us a cheap edge detection

## Colour handling

* [colorspaces](https://vis4.net/blog/posts/avoid-equidistant-hsv-colors/)
* [colormaps](http://www.sandia.gov/~kmorel/documents/ColorMaps/ColorMapsExpanded.pdf)
* [excellent series on color](http://earthobservatory.nasa.gov/blogs/elegantfigures/2013/08/05/subtleties-of-color-part-1-of-6/)
