synestizer
==========

an app that helps you listen to colors.

This branch, alternate_patching, is a complete rebuild of the UI and synths
to make a simple analysis system with quasi-dynamic patching.

It is based on Rx.js.

It is missing  features of the master version, but saving grey hairs.
In particular, online app DOES NOT WORK AT ALL in this version and
*will* not unless we do a complete rewrite of that part.
(Which we will do if the alternate version proves that it is worth it ;-) )

Plans:

* implement a general scheduler
* implement arbitrary patching (this is what we really want to save online)
* stitch d3 into RXjs - https://github.com/Reactive-Extensions/RxJS/blob/master/examples/d3/index.js