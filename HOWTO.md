---
title: How to synestize
---

#How to synestize

So you want to try this out yourself?
The simplest option is to [try out the live version on our website](http://synestizer.com)
But maybe that's not enough? Maybe you can improve it? Maybe you want to see how it works? Well - time to run your own version.

The first step is [download synestizer](https://github.com/synestize/synestizer/archive/master.zip).
Unzip this. Now Synestizer is installed.

But you are not finished yet.
For reasons of security, your web-browser is only permitted to access the camera if it is viewing a "web site", not merely a *file*.
So you have to serve this file on web server.
Don't worry, a *local* web server is sufficient
i.e. a web server running on your computer,
*not* visible to the rest of the internet.

There are a million ways of serving websites.
For your own personal testing purposes, we recommend [caddy](https://caddyserver.com/),
an easy, free, open-source, secure server designed for developing browser apps,
available for download for most platforms.

## Participating

You can help with code or with documentation. The procedure is the same either way - fork us on gihub and send us pull requests.

The [online documentation](https://synestize.github.io/synestizer/) is here.
Source code for the documentation lives in the gh-pages branch. If you wish to use a convenient online editor, [prose.io](http://prose.io/) has worked well for us.

Your edit URL will look something like this: http://prose.io/#YOURGITHUBUSERNAME/synestizer/tree/gh-pages

### Advanced:  subtrees

Advanced class: For convenience we keep documentation and static stuff mirrored
into the main repository using [subtrees](http://blogs.atlassian.com/2013/05/alternatives-to-git-submodule-git-subtree/).


#### Documentation

Get changes 

    git subtree pull --prefix=docs upstream gh-pages
    
Send changes

    git subtree push --prefix=docs upstream gh-pages

