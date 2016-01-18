---
title: How to develop synestizer
---

# Participating in Synestizer development

You can help with code or with documentation. The procedure is the same either way - [fork us on github]() and send us pull requests.

The [online documentation is here](https://synestize.github.io/synestizer/).
Source code for the documentation lives in the gh-pages branch. If you wish to use a convenient online editor, [prose.io](http://prose.io/) has worked well for us.

Your edit URL will look something like this: http://prose.io/#YOURGITHUBUSERNAME/synestizer/tree/gh-pages

## Advanced: documentation subtrees

Advanced class: For convenience we keep documentation and static stuff mirrored
into the main repository using [subtrees](http://blogs.atlassian.com/2013/05/alternatives-to-git-submodule-git-subtree/).

Get changes 

    git subtree pull --prefix=docs upstream gh-pages
    
Send changes

    git subtree push --prefix=docs upstream gh-pages

