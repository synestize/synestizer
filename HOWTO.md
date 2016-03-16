# How to synestize

So you want to try this out yourself?
The simplest option is to [try out the live version on our website](http://synestizer.com)
But maybe that's not enough? Maybe you can improve it? Maybe you want to see how it works? Well - time to run your own version.

The first step is [download synestizer](https://github.com/synestize/synestizer/archive/master.zip).
Unzip this. Now Synestizer is installed.
But you are not finished yet.

For reasons of security, your web-browser is only permitted to access the camera if it is viewing a "web site", not merely a *file*, so you will be missing a lot of functions if you open it without a web server to help you.

(We will probably make this easier soon using a Chrome App or similar/)

There are a million ways of serving websites.
For your own development purposes, we recommend [caddy](https://caddyserver.com/),
an easy, free, open-source, secure server designed for developing browser apps,
available for download for most platforms.

This particular method *will* require you to serve the files publicly on the internet for the SSL to work, however...
If you want to get a genuinely private version you will have to do a little more work.

* *For Mac users with a copy of Mac OS Server*, it is very easy to setup up a local SSL site. 
* *For other Mac users*, it's [slightly](https://certsimple.com/blog/localhost-ssl-fix) [complicated](https://gist.github.com/jonathantneal/774e4b0b3d4d739cbc53)
* *For Windows users with IIS* it's [medium complicated](http://weblogs.asp.net/scottgu/tip-trick-enabling-ssl-on-iis7-using-self-signed-certificates)
* *For Linux users* the Mac users' instructions will work if you happen to be using Apache httpd, but if you are using one of the many other web servers, you will have to look it up. [you can cheat, though](https://github.com/Daplie/localhost.daplie.com-certificates)

NOTE FOR USERS OF CHROME BETA VERSIONS:

Chrome version 51 seems to have no getUserMedia API by default. What that means is that to access video you have to manually turning it on by clicking [enable experimental web platform features](chrome://flags/#enable-experimental-web-platform-features).
