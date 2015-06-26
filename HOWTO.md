---
title: How to synestize
---

#How to synestize

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

UPDATE: It grows more complex! You need not only to have a web server, but an encrypted web server, even  for local use of the app, thanks to the [removal of advanced features ](https://sites.google.com/a/chromium.org/dev/Home/chromium-security/deprecating-powerful-features-on-insecure-origins)

Here are some options:

1. If you do not use the command-line, the easiest webserver to install is [Mongoose Free Edition](http://cesanta.com/mongoose.shtml), which runs on Windows, Mac OS X and Linux. Put the mongoose application in the same folder as synestizer/offline, double click to run it, and you are done.

   You will find synestizer at http://localhost:8080/
   
   NB although mongoose supposedly supports SSL, I can't make it work. Might need 

2. If you are on Max OS X, your computer has a built-in web server. There are many instructions online about setting this up. [Here is a good one](http://macosxautomation.com/workshops/sharing/03.html)
3. If you are comfortable with the command-line, running a web server is easy; TODO: explain how to make it work with SSL.


### Tidier SSL

More in-depth version: http://stackoverflow.com/a/10176685
````
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 1001 -subj '/CN=localhost' -nodes
````

Your browser might additionally complain about the nonsense SSL certificate that you have just accepted. [Here is how to fix that](http://stackoverflow.com/a/15076602).

## "Online" operation

The full version of synestizer has an included [Django](https://www.djangoproject.com/) application to manage settings and user data. 
It doesn't do much at the moment, but you are welcome to change that.
To use the Django app, the usual additional installation instructions for Django apply- and as a bonus [Django has a built-in testing web server that you can use ](https://docs.djangoproject.com/en/1.8/intro/tutorial01/#the-development-server)

## Participating

You can help with code or with documentation. The procedure is the same either way - fork us on gihub and send us pull requests.

The [online documentation](https://synestize.github.io/synestizer/) is here.
Source code for the documentation lives in the gh-pages branch. If you wish to use a convenient online editor, [prose.io](http://prose.io/) has worked well for us.
Your edit URL will look something like this: http://prose.io/#YOURGITHUBUSERNAME/synestizer/tree/gh-pages

### Advanced: documentation subtree

Advanced class: For convenience we also keep documentation mirrored into the main repository using [subtrees](http://blogs.atlassian.com/2013/05/alternatives-to-git-submodule-git-subtree/).

The 

    git subtree pull --prefix=docs upstream gh-pages
    
and

    git subtree push --prefix=docs upstream gh-pages