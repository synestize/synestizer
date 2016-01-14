---
title: How to synestize
---

# How to synestize

So you want to try this out yourself?
The simplest option is to [try out the live version on our website](http://synestizer.com)
But maybe that's not enough? Maybe you can improve it? Maybe you want to see how it works? Well - time to run your own version.

The first step is [download synestizer](https://github.com/synestize/synestizer/archive/master.zip).
Unzip this. Now Synestizer is installed.
But you are not finished yet.

For reasons of security, your web-browser is only permitted to access the camera if it is viewing a "web site", not merely a *file*, so you will be missing a lot of functions if you open it without a web server to help you.

There are a million ways of serving websites.
For your own personal testing purposes, we recommend [caddy](https://caddyserver.com/),
an easy, free, open-source, secure server designed for developing browser apps,
available for download for most platforms.
This particular method *will* require you to serve the files publicly on the internet for the SSL to work, however...
If you want to get a genuinely private version you will have to do a little more work.

* *For Mac users with a copy of Mac OS Server*, it is very easy to setup up a local SSL site. 
* *For other Mac users*, it's [slightly](https://certsimple.com/blog/localhost-ssl-fix) [complicated](https://gist.github.com/jonathantneal/774e4b0b3d4d739cbc53)
* *For Windows users with IIS* it's [medium complicated](http://weblogs.asp.net/scottgu/tip-trick-enabling-ssl-on-iis7-using-self-signed-certificates)
* *For Linux users* the Mac users' instructions will work if you happen to be using Apache httpd, but if you are using one of the many other web servers, you will have to look it up. [you can cheat, though](https://github.com/Daplie/localhost.daplie.com-certificates)

## Participating

You can help with code or with documentation. The procedure is the same either way - [fork us on github]() and send us pull requests.

The [online documentation is here](https://synestize.github.io/synestizer/).
Source code for the documentation lives in the gh-pages branch. If you wish to use a convenient online editor, [prose.io](http://prose.io/) has worked well for us.

Your edit URL will look something like this: http://prose.io/#YOURGITHUBUSERNAME/synestizer/tree/gh-pages

### Advanced: documentation subtrees

Advanced class: For convenience we keep documentation and static stuff mirrored
into the main repository using [subtrees](http://blogs.atlassian.com/2013/05/alternatives-to-git-submodule-git-subtree/).

Get changes 

    git subtree pull --prefix=docs upstream gh-pages
    
Send changes

    git subtree push --prefix=docs upstream gh-pages

