# Synestizer Indigo — Beta

**Synestizer does the opposite of a music visualiser.**  
Point your camera at anything — a painting, a sunset, a busy street — and it turns colour, brightness and motion into live music.

🔗 **Try it now → [synestizer.vercel.app](https://synestizer.vercel.app)**  
*(Chrome or Edge required — Firefox does not yet support Web MIDI)*

---

## Quick start

1. Open the link above in **Chrome or Edge** on a laptop or desktop
2. Allow camera access when the browser asks — your image stays on your device, nothing is uploaded
3. Press **Start**
4. You will hear a rhythm and melody generated from what the camera sees
5. Move around, change the light, hold up coloured objects — the music follows

---

## What you are hearing

| Voice | What drives it |
|---|---|
| **Melody** | Note pattern shifts with the blue/cool tones in the image |
| **Bass** | Follows the melody at a lower octave, half the speed |
| **Kick drum** | Density follows motion (camera movement = busier beat) |
| **Snare** | Offset from the kick — shifts with red/warm tones |
| **Hi-hat** | Dense pattern, reacts to movement |
| **Sampler** | Load your own audio file or record 15 s from the mic |

The sequencer runs a **17-step probabilistic cycle** — because 17 is prime, the pattern never exactly repeats, and shifts gradually as the camera signals change.

---

## Controls

### Sound tab
- **Tempo** — set the base BPM (40–160)
- **BPM Response** — how strongly camera motion changes the tempo (1 = very reactive, 30 = stable)
- **Voice Mix** — four vertical faders for Melody, Bass, Drums and Sampler
- **Step Grid** — live display showing which steps fire for each voice

### Signal Channels panel (≋ button, top right)
Seven live thumbnails showing what the camera is extracting:
Luminance · Chroma Blue · Chroma Red · H. Profile · V. Profile · Luma↔Blue · Motion

### Settings → Signal Routing
A matrix that connects any of the **18 camera signals** to any sound parameter.  
Each cell has two controls:
- **Scale** (green bar) — how much the signal amplifies the parameter; negative = inverted
- **Bias** (amber marker) — shifts the output up or down regardless of the camera

Good starting point: leave the defaults and just play with the BPM and Voice Mix first.

---

## Browser requirements

| Feature | Chrome | Edge | Firefox | Safari |
|---|---|---|---|---|
| Camera + audio | ✅ | ✅ | ✅ | ✅ |
| Web MIDI | ✅ | ✅ | ❌ | ❌ |

MIDI output (to external synths) works in Chrome and Edge only. Everything else works in any modern browser.

---

## Beta feedback

This is an early beta — things may break.  
Please report issues or ideas at **[github.com/synestize/synestizer/issues](https://github.com/synestize/synestizer/issues)**  
or email **synestizer@gmail.com**

Things we know are rough right now:
- Signal Routing matrix is powerful but complex — a simpler UI is planned
- Mobile support is partial (no MIDI, camera orientation may vary)
- Sampler files larger than 30 MB will be rejected

---

## Privacy

The camera feed is analysed entirely inside your browser using a Web Worker.  
**No image, audio, or personal data is ever transmitted.**

---

## Credits

**Kaspar König** — concept, sound design, project lead *(Zurich University of the Arts / ZHdK)*  
**Dan MacKinlay** — coding, technical architecture *(UNSW Sydney)*  
**Christoph Stähli** — development

Institutional support: ZHdK · UNSW Sydney · Maastricht University (Sonic Skills) · Johannes Gutenberg University Mainz

---

## Previous versions

| Version | URL |
|---|---|
| listentocolors.net (2015) | [listentocolors.net](https://www.listentocolors.net) |
| Blue (stable) | [synestize.github.io/blue](https://synestize.github.io/blue/) |
| Original prototype | [synestizer.com](http://www.synestizer.com) |
| All source code | [github.com/synestize](https://github.com/synestize) |

Open source under the GPL licence.
