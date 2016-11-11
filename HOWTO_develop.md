
# How to develop synestizer


## Edit the documentation
If all you want to do is update the documentation, you don't even need offline mode.

The online documentation is at [synestize.gitbooks.io/synestizer](https://synestize.gitbooks.io/synestizer/content/).
Source code for the documentation lives [on github](https://github.com/synestize/synestize.github.io), and may be [edited using gitbook](https://www.gitbook.com/book/synestize/synestizer/edit).

## Edit the code ("Development server mode")

If you have the app in development server mode mode, you can do this.
All the javascript files in the ```src/``` folder are for editing.
Any changes you make will update the offline version automatically.

First, you need to run your own copy of synestizer.
the best way to do this is using the development server

If you are not *performing* but *developing*, we recommend  different commands:

      npm install
      npm run dev

This should build a live-updating development server
for you to view in the browser.
Now you can make changes to the code and see them instantly updated in the browser.
However, this is

1. more demanding of CPU and can occasionally crash
2. much slower to respond to input (so that developers can see what is happening)

In this case, the app will still be at  [http://localhost:8080/](http://localhost:8080/),
In addition, you can visit [http://localhost:8080/webpack-dev-server/](http://localhost:8080/webpack-dev-server/) to find an interactive debugging system installed.

Note that you may need to bypass the offline cache to see your changes reliably.

![](https://synestize.github.io/synestizer/media/bypass_service_worker.png)

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
