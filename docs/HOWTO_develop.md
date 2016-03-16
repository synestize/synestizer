---
title: How to develop synestizer
---

# Participating in Synestizer development

You can help with code or with documentation. The procedure is the same either way - [fork us on github](https://github.com/synestize/synestizer) and send us pull requests.

## documentation

The online documentation is at [synestize.gitbooks.io/synestizer](https://synestize.gitbooks.io/synestizer/content/).
Source code for the documentation lives [on github](https://github.com/synestize/synestize.github.io), and may be [edited using gitbook](https://www.gitbook.com/book/synestize/synestizer/edit).

## code

For the app itself, [the sourcecode is on github](https://synestize.github.io/synestizer/)

To edit it, you will need node.js and npm installed.
Then you run

      npm install
      npm run watch

this should build a live-updating development version of the app for you to view in the browser.

Apart from that the setup should be the same as for a non-dev user.

### Handy tools

[Firefox has a webaudio editor](https://developer.mozilla.org/en-US/docs/Tools/Web_Audio_Editor)

For debugging MIDI on OSX we recommend [MIDIMonitor](https://www.snoize.com/MIDIMonitor/)

### Advanced: documentation subtrees

Advanced class: For convenience we keep documentation and static stuff mirrored
into the main repository using [subtrees](http://blogs.atlassian.com/2013/05/alternatives-to-git-submodule-git-subtree/).

Get changes:

      git subtree pull --prefix=docs ssh://git@github.com/synestize/synestize.github.io.git master
    
Send changes:

      git subtree push --prefix=docs ssh://git@github.com/synestize/synestize.github.io.git master

