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

![YCbCr space, from https://en.wikipedia.org/wiki/File:YCbCr.GIF](./media/YCbCr.GIF)


At this stage we have 3 64x64 matrixes: $$ Y,C^b,C^r. $$

For each of these we calculate the mean, a Y-mean, $$ \bar{Y}, $$ a Cb-mean $$ \bar{C}^b $$ etc

$$ \bar{Y} = \sum_{i=1}^{64}\sum_{j=1}^{64} Y_{ij} $$

These are the *first moments*.

Now for the *second moments*....

We add spatial coordinates to the pixels - a pixel on the left side of the screen has a $$ U $$ coordinate of 0. On the right side it has a coordinate of 64. On the bottom of the screen it would have a $$ V $$ coordinate of 0 and on the top, 64. Now we "unpack" these index matrices into a 5x(64x64) sample matrix:

$$ X_1 := \begin{align*}1, 1, Y_{11}, C^b_{11} C^r_{11}\end{align*}$$

$$ X_2 := \begin{align*}1, 2, Y_{12}, C^b_{12} C^r_{12}\end{align*}$$

...

The second moments are the sample covariance /correlation of this unpacked matrix $$ X. $$

## Ideas for the future

* nearest-neighbours in color space
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
* particle filters
* FFT features (or something else translation/phase-invariant?)
* inner-product with desired eigen-features
* user interaction: They choose a few key scenes, and we try to measure distance from those scenes.
* other clustering, say, spectral?
* [motion detection](http://www.adobe.com/devnet/html5/articles/javascript-motion-detection.html)
* [various sweet segmenations hacks](https://stackoverflow.com/questions/31071781/html5-canvas-image-segmentation)
* neural networks?

    * We can [train them online](https://cs.stanford.edu/people/karpathy/convnetjs/)
    * https://github.com/karpathy/recurrentjs
    * or use a high-performance pre-trained JS prediction models via [neocortex.js](https://github.com/scienceai/neocortex)?
    Note this would also get us features for free even if we ignore the model.
    * can we do *recursive* NN for realtime stuff this way?
    * Examples from keras https://github.com/fchollet/keras/tree/master/examples
    * torch examples http://www.di.ens.fr/willow/research/weakcnn/ https://hal.inria.fr/hal-01015140

* random forests

    * https://github.com/karpathy/forestjs
    * http://techtalks.tv/talks/randomized-decision-forests-and-their-applications-in-computer-vision-jamie/59432/


## Machine vision libraries

* tangible.js tracks a bunch of useful libraries such as [machine vision in js](http://tangiblejs.com/libraries/computer-vision)
* [tracking.js](http://trackingjs.com/) does cool stuff already
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
