# synestizer

[An app](https://github.com/synestize/synestizer/) that lets you hear color.
For more information on how, read the basic [documentation](https://synestize.github.io/synestizer/).

This branch, alternate_patching, is a complete rebuild of the UI and synths
to make a simple analysis system with quasi-dynamic patching.

It is missing features of the master version, but saving grey hairs.
In particular, online app DOES NOT WORK AT ALL in this version and
*will* not until we do a rewrite.

Plans:

* implement a general scheduler for notes
* Move video analysis into a Web Worker - https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers#Timeouts_and_intervals
* have some nice synths
* Additional statistics
* dynamically load the readme text into the info tab
* Allow dynamic patch switching
* allow RANDOM patching
* allow partial modulation (i.e. not full-range for a given ensemble paramter)

## Details

This version uses Rx.js for much streaming communication.
Maybe eventually it will use Rx.js for all communication.
This makes things simpler, although it looks weird.
You might wish to read these docs:

* [basic tutorial](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754)
* [visualizing streams](http://jaredforsyth.com/2015/03/06/visualizing-reactive-streams-hot-and-cold/)
* [constructors](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/which-static.md)
* [methods](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/which-instance.md)
