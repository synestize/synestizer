# How to synestize
## Setting up the patching matrix

TBD

## Connecting MIDI Output to your DAW

TBD

## Accepting MIDI input from your MIDI controller

TBD

## Offline mode

Want to run your own copy of synestizer? No problem!
The [sourcecode is on github](https://synestize.github.io/synestizer/).
Download and unzip that code.
Currently there are two different versions and hence two different links:

* [indigo](https://github.com/synestize/synestizer/archive/indigo.zip), an old version
* [violet](https://github.com/synestize/synestizer/archive/violet.zip), a recent rewrite

(Advanced users and coders who might want to change the software should use ```git```, if you know what that means.)

Now you need to run a [node.js](https://nodejs.org/), which pre-processes the javascript and also provides a web server to access the app.

Then you open up the terminal on your platform and run the following two commands:

      npm install
      npm run dev

This should build a live-updating development version of the app for you to view in the browser.

Now, go to [http://localhost:8080/](http://localhost:8080/), and synestizer should be ready to go!
And, developers, if you go to [http://localhost:8080/webpack-dev-server/](http://localhost:8080/webpack-dev-server/) you will find an interactive debugging system installed too.
