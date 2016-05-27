
# How to develop synestizer
First, you need to run your own copy of synestizer.
the best way to do this is offline mode:

## Offline mode

For the app itself, [the sourcecode is on github](https://synestize.github.io/synestizer/).
Download the and unzip code using [ this link](https://github.com/synestize/synestizer/archive/master.zip), or using git if you know what that means.

But you are not finished yet;
Now you need to run a [node.js](https://nodejs.org/), which pre-processes the javascript and also provides a web server to access the app.

Then you open up the terminal on your platform and run the following two commands:

      npm install
      npm run dev

This should build a live-updating development version of the app for you to view in the browser.

Now, go to [http://localhost:8080/](http://localhost:8080/), and synestizer should be ready to go!

## Editing Synestizer
### Edit the documentation
If all you want to do is update the documentation, you don't even need offline mode.

The online documentation is at [synestize.gitbooks.io/synestizer](https://synestize.gitbooks.io/synestizer/content/).
Source code for the documentation lives [on github](https://github.com/synestize/synestize.github.io), and may be [edited using gitbook](https://www.gitbook.com/book/synestize/synestizer/edit).

### Edit the code ("Offline mode")
If you have the app in offline mode, you can do this. All the javascript files in the ```src/``` folder are for editing.

## Advanced information
### Notes on public websites and HTTPS

If you want to not only host your *own* version of synestizer but share it with others, you have to do more work;
For security reasons, only secure websites (HTTPS) are permitted to access the camera etc.

So you have to run a secure website.
There are a lot of how-to guides to this on the internet.
The easiest is probably [caddy](https://caddyserver.com/), a free, open-source, secure server designed for developing browser apps,
available for download for most platforms.
[Anything which supports letsncrypt](https://github.com/certbot/certbot/wiki/Links) should be simple.

If you are doing this advanced stuff, you might also have to think about packaging up the javascript as static assets, which is simpler than using the node.js server. This isbeyond the current scope.

### Handy tools

[Firefox has a webaudio editor](https://developer.mozilla.org/en-US/docs/Tools/Web_Audio_Editor)

For debugging MIDI on OSX we recommend [MIDIMonitor](https://www.snoize.com/MIDIMonitor/).

### Advanced: documentation subtrees

For convenience we keep documentation mirrored
into the main repository using [subtrees](http://blogs.atlassian.com/2013/05/alternatives-to-git-submodule-git-subtree/).

Get changes:

      git subtree pull --prefix=docs ssh://git@github.com/synestize/synestize.github.io.git master

Send changes:

      git subtree push --prefix=docs ssh://git@github.com/synestize/synestize.github.io.git master
