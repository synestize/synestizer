
# How to develop synestizer
First, you need to run your own copy of synestizer.
the best way to do this is offline mode:

## Editing Synestizer
### Edit the documentation
If all you want to do is update the documentation, you don't even need offline mode.

The online documentation is at [synestize.gitbooks.io/synestizer](https://synestize.gitbooks.io/synestizer/content/).
Source code for the documentation lives [on github](https://github.com/synestize/synestize.github.io), and may be [edited using gitbook](https://www.gitbook.com/book/synestize/synestizer/edit).

### Edit the code ("Offline mode")
If you have the app in offline mode, you can do this.
All the javascript files in the ```src/``` folder are for editing.
Any changes you make will update the offline version automatically.

## Advanced information
### Handy tools

* [Firefox has a webaudio editor](https://developer.mozilla.org/en-US/docs/Tools/Web_Audio_Editor)

* For debugging MIDI on OSX we recommend [MIDIMonitor](https://www.snoize.com/MIDIMonitor/).


### Notes on public websites and HTTPS

If you want to not only host your *own* version of synestizer but share it with others, you have to do more work;
For security reasons, only secure websites (HTTPS) are permitted to access the camera etc.

So you have to run a secure website.
There are a lot of how-to guides to this on the internet.
The easiest is probably [caddy](https://caddyserver.com/), a free, open-source, secure server designed for developing browser apps,
available for download for most platforms.
[Anything which supports letsencrypt](https://github.com/certbot/certbot/wiki/Links) should be simple.

If you are doing this advanced stuff,
you might also have to think about packaging up the javascript as static assets,
which is faster and safer than using the node.js server.
You can do this using an appropriate SSH configuration, and the handy script

      npm publish

This is defined in ```package.json```.

### Documentation subtrees

For convenience we keep documentation mirrored
into the main repository using [subtrees](http://blogs.atlassian.com/2013/05/alternatives-to-git-submodule-git-subtree/).

Get changes:

      git subtree pull --prefix=docs ssh://git@github.com/synestize/synestize.github.io.git master

Send changes:

      git subtree push --prefix=docs ssh://git@github.com/synestize/synestize.github.io.git master
