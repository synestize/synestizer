import type { ReactNode } from 'react';

export function AboutTab() {
  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 680 }}>

      <Section title="What is Synestizer?">
        <p>
          Synestizer does the opposite of a music visualiser — it converts live camera
          imagery into sound. Red, Green, and Blue values from your camera feed are
          analysed frame by frame and mapped to audio synthesis parameters, creating a
          direct link between what you see and what you hear.
        </p>
        <p className="mt-2">
          This version (Indigo) adds deeper colour analysis in YCbCr space, spatial
          brightness profiles, motion detection, and a probabilistic note sequencer
          (the Bubble Machine) that generates minimal-music patterns driven by the image.
        </p>
      </Section>

      <Section title="How to use">
        <ol className="space-y-2 list-decimal list-inside marker:text-indigo-400">
          <li>
            Allow camera access when the browser asks — your image is processed
            locally and never sent anywhere.
          </li>
          <li>
            Press <strong className="text-white">Start</strong>. You will hear two
            continuous tones whose pitch and timbre follow the brightness and colour
            of the camera image.
          </li>
          <li>
            Open the <strong className="text-white">≋ Signal Channels</strong> panel
            (top right) to see a live breakdown of what the camera is extracting —
            luminance, chroma, horizontal/vertical profiles, and motion.
          </li>
          <li>
            Go to <strong className="text-white">Settings → Signal Routing</strong> to
            map any of the 18 camera signals to any audio or MIDI parameter. Use the
            Scale slider to set the influence strength, Bias to shift the baseline.
          </li>
          <li>
            Switch to <strong className="text-white">Performance</strong> for a
            full-screen camera view with no distractions.
          </li>
          <li>
            Connect a MIDI device before pressing Start to send control changes to
            external synthesisers. Note output and device selection arrive in the next
            update.
          </li>
        </ol>
      </Section>

      <Section title="Credits">
        <div className="space-y-3">
          <Credit name="Kaspar König" role="Concept, sound design, project lead" org="Zurich University of the Arts (ZHdK)" />
          <Credit name="Dan MacKinlay" role="Coding, technical architecture" org="UNSW Sydney" />
          <Credit name="Christoph Stähli" role="Development" />
        </div>
        <div className="mt-4 pt-3 border-t border-gray-700 text-sm text-gray-400 space-y-1">
          <p className="font-medium text-gray-300">Institutional support</p>
          <p>Zurich University of the Arts (ZHdK)</p>
          <p>UNSW Sydney</p>
          <p>Sonic Skills research project — Maastricht University (Prof. Karin Bijsterveld)</p>
          <p>Johannes Gutenberg University, Mainz</p>
        </div>
      </Section>

      <Section title="Previous versions &amp; related work">
        <div className="space-y-2 text-sm">
          <ExternalLink href="https://www.listentocolors.net" label="listentocolors.net" description="2015 prototype — enhanced MIDI connectivity and colour analysis" />
          <ExternalLink href="http://www.synestizer.com" label="synestizer.com" description="Original prototype" />
          <ExternalLink href="https://synestize.github.io/blue/" label="synestize.github.io/blue" description="Latest stable release (Blue branch)" />
          <ExternalLink href="https://github.com/synestize" label="github.com/synestize" description="All source code, open source under GPL" />
        </div>
      </Section>

      <Section title="Audio sample credits">
        <p className="text-sm text-gray-400">
          Built-in samples derived from Freesound.org under copyleft licences:
        </p>
        <ul className="mt-2 space-y-1 text-sm text-gray-400 list-disc list-inside marker:text-gray-600">
          <li>Goblet — "Goblet_G_Loud.wav" by <em>acclivity</em> (Feb 2007)</li>
          <li>Kayageum — "kayageum1_B4.wav" by <em>spt3125</em> (Oct 2006)</li>
          <li>Tabla — pack by <em>ajaysm</em> (Attribution licence)</li>
        </ul>
      </Section>

      <Section title="Contact">
        <div className="space-y-1 text-sm">
          <p>
            <span className="text-gray-400">Email </span>
            <span className="text-indigo-300 select-all">synestizer@gmail.com</span>
          </p>
          <p>
            <span className="text-gray-400">Also </span>
            <span className="text-indigo-300 select-all">info@kultkat.com</span>
          </p>
        </div>
      </Section>

      <div className="pt-2 pb-6 text-xs text-gray-600 space-y-1">
        <p>
          Privacy: the camera feed is processed entirely in your browser.
          No image data, audio, or personal information is transmitted.
        </p>
        <p>Built with React · Tone.js · Web Audio API · Web MIDI API</p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="glass-section">
      <div className="glass-section-header">{title}</div>
      <div style={{ padding: '10px 16px', fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.65 }}>{children}</div>
    </div>
  );
}

function Credit({ name, role, org }: { name: string; role: string; org?: string }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <span style={{ fontWeight: 600, color: '#fff' }}>{name}</span>
      <span style={{ color: 'rgba(255,255,255,0.45)' }}> — {role}</span>
      {org && <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{org}</div>}
    </div>
  );
}

function ExternalLink({ label, description }: { href: string; label: string; description: string }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <span style={{ color: '#a5b4fc' }}>{label}</span>
      <span style={{ color: 'rgba(255,255,255,0.3)' }}> — {description}</span>
    </div>
  );
}
