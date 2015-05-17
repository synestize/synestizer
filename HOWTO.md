---
title: How to synestize
---

So you want to try this out yourself?
The simplest option is to [try out the live version on our website](http://synestizer.com)
But maybe that's not enough? Maybe you can improve it? Maybe you want to see how it works? Well - time to run your own version.

## "Offline" operation

If you want to run synestizer without internet access, or make improvement so the code you'll need to download and run it for yourself.
There are many ways of doing this.

The common step is [download synestizer](https://github.com/synestize/synestizer/archive/master.zip).
Unzip this. Now Synestizer is installed.

But you are not finished yet. For reasons of security, your web-browser is only permitted to access the camera if it is viewing a "web site", not merely a *file*. So you have to serve this file on web server.
Don't worry, a *local* web server is sufficient i.e. a web server running on your computer, *not* visible to the rest of the internet. 

Here are some options:

1. If you do not use the command-line, the easiest webserver to install is (Mongoose Free Edition)[http://cesanta.com/mongoose.shtml], which runs on Windows, Mac OS X and Linux. Put the mongoose application in the same folder as synestizer/offline, double click to run it, and you are done.
2. If you are on Max OS X, your computer has a built-in web server. There are many instructions online about setting this up. (Here is a good one)[http://macosxautomation.com/workshops/sharing/03.html]
3. If you are comfortable with the command-line, running a web server is easy;
   You simply change to the synestizer offline directory and run your favourite testing web server. Almost every programming languages has a built-in testing  web server. Here is the basic python one, for example:
    
        python -m SimpleHTTPServer

## "Online" operation

The *full* version of synestizer has an included (Django)[https://www.djangoproject.com/] application to manage settings and user data. If you are going to run this, then the usual additional installation instructions for Django apply- and (Django has a built-in testing web server that you can use )[https://docs.djangoproject.com/en/1.8/intro/tutorial01/#the-development-server]

TODO: installation instructions.