![Synestizer logo](https://raw.githubusercontent.com/synestize/synestizer/master/docs/synestizer_logo_50x50.png)

# FAQ

> „Just open the window...”  J.Cage and focus on listening to what emerges outside.
- Cage

> „It`s time to open the digital window and listen colourwise.”
- Koenig

version 150123:

This document is made to explain the idea and function of the synestizer project 
at [synestizer.com](http://synestizer.com).
A webapp to listen to the dataflow of the camera-imagery. 

## What is a Synestizer?

The word Synestizer is a blend of the word synthesizer (electric signals converted into sounds) and synaesthesia (sensation together).
The synestizer is an attempt to sonify the live imagery of a (web-)camera by making colour-values audible in different ways.
The idea behind the synestizer is to let visual and audio-input interact to tickle the synapse between your ears and eyes.
In many ways visualizers (including screensavers) do this by transforming sound in to animated or generated graphics.
The synestizer tries to do the opposite as it translates Red, Green and Blue values to sound. For this effect or let say „sense“ there are less obvious methods and techniques explored and spread online.  That's why it is time to open the digital window and listen to it.

## Why working hard to invent a Synestizer? 

Since Cameras can measure Red Green Blue (RGB) values and its luminosity in given situations they correspond to the RGB sensitivity of the cones of the eyes.
Since audible and visible frequencies differ in wavelength only, there might be a relation of some sort.
The fascinating part of the synestizer is to come up with sonifying techniques to suggest an intstant soundtrack matching exactly what you see in front of you right now. Imagining an induced synesthesia by technical means already on an average desk or pocket.

![color sensitivity of the eye](https://raw.githubusercontent.com/synestize/synestizer/master/docs/Color_Sensitivity.jpg)

Can this webapp contribute to the moment? Or at least extend the “obvious” with an interesting „odor” 
or an ambient-lighting but with audible means.
In the future we might get used to an add-on sonification to our daily routines. Like a personal contextual-sound-DJ or as an automated soundtrack-maker for movies.
Maybe just to pimp a daily situation or create an acoustic ambiance for a room.

A challenge for the synestizer-project is to generate ad-hoc compositions that are fitting to the situation you are or better said your camera is in, and on top surprise you again and again. 

## Features

The screen is divided into 4 sections. The left column is a visual readout of the camera measuring the Red, Green and Blue values in realtime. The background-colour is the representation and intensity of the average colour I=1/3*(R+G+B)  and the middle frame obviously displays what the camera captures. The right frame is the Audio section which enables the user to change the volume-mixture and the sound characteristics. 

### TRIAD

direct simple sonification.

the RGB values are directly translated into tones. A 50% RGB value has an output of 3 sinewave tones with 880Hz by default. 
To differentiate the similar sine-wave sound, we decided to make a square-wave and saw-wave available. On top the lowest pitch can be adopted by the knob located at each colour.

### Minimal 

The RGB values influence the intervals of the notes played by synthesized instruments available through the implementation of [waax](https://github.com/hoch/waax).
According to the score at 50% colour value, the 3 instruments 
(piano = red / pan flute = green / vibraphone = blue)
play each 3 notes a bar with small intervals in between. Going up and down the scale in a variety of intervals, the color amounts are sonified. (see picture 1). The tempo of the intervals are set with the corresponding knob.

![Score of the “minimal” patch](https://raw.githubusercontent.com/synestize/synestizer/master/docs/Synestizer_Partitur_.png)

### Sample

(Under development)

This frame is based on the manipulation of short samples that can be recorded immediately and played back with RGB values influencing speed and pitch.

## Who develops the synestizer?

Soundartist [Kaspar König](www.kasparkoenig.com) loves experimenting with analog and digital techniques to sonify the context imminently surrounding us.
His interest in interpreting colours, patterns, materials and most recently also wind as an actor to map sound lead to the development of the initial version of synestizer.
Now the group is growing and there are new people interested in the project, and we have opened up the code to invite even more to join us.
Users and artists are welcome to experiment with, and developers, to modify, this thing. 

Now [Christoph Stähli](http://www.stahlnow.com) (programmer of Noisetracks and more) and [Dan MacKinlay](http://notes.livingthing.org/), the mathemagician in the team, are committedly contributing a great deal to the code of the project.
Support is also coming from the [Sonic Science Festival from the Fasos Department of the UM Maastricht](http://fasos-research.nl/sonicsciencefestival/event/163/?instance_id=98) thanks to Prof. K. Bijsterveld. 

Want to join us?
See [github](https://github.com/synestize/synestizer) for the source code.

A big thank you is in order for much previous work that has also been done by: Univ.- Prof. Peter Kiefer, Prof. Dr. Stefan Reuss, Dr. Roman Mauer, Dr. Michael Liegl, Mark Lingk.
And the [Forschungsschwerpunkt Medienkonvergenz](http://www.medienkonvergenz.uni-mainz.de/) from the Johannes Gutenberg University in Mainz (D) 
The Dutch “Stichting de 4 Koningen” supported the development of this Web-app.

Ideas or interest in participation? Just write us an email at artresearchmusic@gmail.com


## Privacy

Although you have to accept the general use of the camera and microphone in the browser, we do not collect or even receive any data from it.
You can verify this by going off- and online again and see that, once the app is downloaded, it doesn't use the network connection.
Or [inspect the source code](https://github.com/synestize/synestizer).

The sound and imagery is not captured.
The only thing we think is useful and thus may addin the future, is a way to save your preferences online.
The (voluntary) option of saving prefernces, patches, settings or mappings online at [synestizer.com](http://synestizer.com) may be added in a future version.