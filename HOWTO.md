# How to synestize

## Offline mode

Want to run your own copy of synestizer? No problem!
The [sourcecode is on github](https://synestize.github.io/synestizer/).
Download and unzip that code.
Currently there are two different versions and hence two different links:

* [indigo](https://github.com/synestize/synestizer/archive/indigo.zip), an old version, online at [indigo.listentocolors.net](https://indigo.listentocolors.net)
* [violet](https://github.com/synestize/synestizer/archive/violet.zip), a recent rewrite, online at  [violet.listentocolors.net](https://violet.listentocolors.net)

(Advanced users and coders who might want to change the software should use ```git```, if you know what that means.)

Now you need to run a [node.js](https://nodejs.org/), which pre-processes the javascript and also provides a web server to access the app.

You need to make a decision: Are you a *user* who wants to simply *make music* with the app, or a *developer* who might want to *change the app*? The instructions are a little different, depending...

### Users

Open up the terminal on your platform and run the following two commands:

      npm install
      npm run serve

This should build a version of the app suitable for you to take on stage, at
[http://localhost:8080/](http://localhost:8080/).

### Developers

If you are not *performing* but *developing*, we recommend  different commands:

      npm install
      npm run dev

This should build a live-updating development version of the app for you to view in the browser. Now you can make changes to the code and see them instantly updated in the browser. However, this is a little more demanding of CPU and can occasionally crash, so it's not recommended for stage performance.

In this case, the app will still be at  [http://localhost:8080/](http://localhost:8080/),
In addition, you can visit [http://localhost:8080/webpack-dev-server/](http://localhost:8080/webpack-dev-server/) to find an interactive debugging system installed.

## Setting up the patching matrix

TBD

## Connecting MIDI Output to your DAW

TBD

## Accepting MIDI input from your MIDI controller

TBD