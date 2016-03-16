---
title: How to develop synestizer
---

# Participating in Synestizer development

You can help with code or with documentation. The procedure is the same either way - [fork us on github]() and send us pull requests.

## documentation

The [online documentation is here](https://synestize.github.io/synestizer/).
Source code for the documentation lives in the gh-pages branch. If you wish to use a convenient online editor, [prose.io](http://prose.io/) has worked well for us.

Your edit URL will look something like this: http://prose.io/#YOURGITHUBUSERNAME/synestizer/tree/gh-pages

## code

[Sourcecode on github](https://synestize.github.io/synestizer/)

You will need node.js and npm installed.
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

Get changes 


    git subtree pull --prefix=docs origin gh-pages
    
Send changes

    git subtree push --prefix=docs origin gh-pages

