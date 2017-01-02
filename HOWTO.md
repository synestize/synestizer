# How to synestize

## Offline mode

You need to make a decision:  
Are you a _user_ who wants only to _make music_ with the app, a _curator_ who wants to run it as an interactive installtion for the public,  or a _developer_ who might want to _change the app_?  
The instructions are different, depending...

### Users



### Curators

Want to run your own copy of synestizer? No problem!  
The [sourcecode is on github](https://synestize.github.io/synestizer/).  
Download and unzip that code.

All currently recognized version at at [the github releases page](https://github.com/synestize/synestizer/releases)

You might be interested in, for example,

* [violet](https://github.com/synestize/synestizer/archive/0.3.0.zip), a recent edition, online at [violet.listentocolors.net](https://violet.listentocolors.net)
* [indigo](https://github.com/synestize/synestizer/archive/0.2.0.zip), an old version, online at [indigo.listentocolors.net](https://indigo.listentocolors.net)

\(Advanced users and coders who might want  
to _change_ the software should use `git`.\)

Now you need to run a [node.js](https://nodejs.org/),  
which pre-processes the javascript and also  
provides a web server to access the app.

First test basic mode.

Open up the terminal on your platform and run the following two commands:

```
  npm install
  npm run serve
```

This should build a version of the app suitable for you to take on stage, at  
[http://localhost:8080/](http://localhost:8080/).

Gallery mode disables sensitive controls for the general public, and prevents them from leaving the website.  
A reasonable approximation to to this can be got on OSX by running the Chrome browser locked down:

```
  npm install
  npm run galleryserve
  /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --kiosk --app=http://localhost:8080/index.html --host-rules="MAP * localhost:8080"
```

### Developers

If you are not _performing_ but _developing_, we recommend  different commands.

See [HOW TO DEVELOP](HOWTO_develop.md)

### Special notes for Android users

You might have trouble switching cameras in Android tablets. This is because of an incompatibility between the `window.mediaDevices.getUserMedia` Promise-based API, and the no-autoplay gesture-required-for-media-playback setting of Chrome.  
If this sounds exciting to you, you can [read the argument which has been raging for about 4 years](https://bugs.chromium.org/p/chromium/issues/detail?id=178297).

There will be no fix any time soon, but you might be able to avoid the problem if you try  
the workaround suggested there - disabling the setting. However, in our tests, this removes the error, but does not fix the video switching.  
The setting can be found at [chrome://flags/\#disable-gesture-requirement-for-media-playback](chrome://flags/#disable-gesture-requirement-for-media-playback)

## Setting up the patching matrix

TBD

## Sending MIDI Output to your DAW

TBD

## Receiving MIDI input from your MIDI controller

TBD

