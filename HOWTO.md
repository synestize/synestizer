# How to synestize

## Offline mode

Want to run your own copy of synestizer?
[the sourcecode is on github](https://synestize.github.io/synestizer/).
Download the and unzip code using [ this link](https://github.com/synestize/synestizer/archive/master.zip), or using ```git``` if you know what that means.

Now you need to run a [node.js](https://nodejs.org/), which pre-processes the javascript and also provides a web server to access the app.

Then you open up the terminal on your platform and run the following two commands:

      npm install
      npm run dev

This should build a live-updating development version of the app for you to view in the browser.

Now, go to [http://localhost:8080/](http://localhost:8080/), and synestizer should be ready to go!
And if you go to [http://localhost:8080/webpack-dev-server/](http://localhost:8080/webpack-dev-server/) you will find an interactive debugging system installed too.
