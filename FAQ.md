
![](https://synestize.github.io/synestizer/media/synestizer_logo_50x50.png)


#FAQ

Ask us more things!

## Why does the tempo slow down when the tab is in the background?

It's complicated! Browsers make background tabs run slowly to avoid wasting time...
[Here is an overview of the problem](https://blog.pivotal.io/labs/labs/chrome-and-firefox-throttle-settimeout-setinterval-in-inactive-tabs)

Summary: if you want this app to run at normal speed, simply run this tab *in its own window*, not *in a background tab of a window*.

(We tried to fix this with [HackTimer](https://github.com/turuslan/HackTimer#npm) but it doesn't work.)

[Firefox might fix this problem? Let us know!](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setTimeout#Timeouts_in_inactive_tabs_clamped_to_>1000ms)

## Weird permissions error

Chrome gives a permissions error when I use the synestizer camera or audio!

Try to reset privacy exceptions for [camera](chrome://settings/contentExceptions#media-stream-camera) or (microphone)[chrome://settings/contentExceptions#media-stream-mic] as per [google's instructions](https://support.google.com/chrome/answer/2693767?hl=en)