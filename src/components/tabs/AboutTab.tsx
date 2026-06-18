import type { ReactNode } from 'react';

export function AboutTab() {
  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 680 }}>

      <Section title="What is Synestizer?">
        <p>
          Synestizer does the opposite of a music visualiser — it turns live camera
          imagery into sound. Point your camera at anything: a painting, a window, a
          moving crowd. Colour, brightness and motion are analysed in real time and
          drive a rhythm and melody that changes as the image changes.
        </p>
        <p style={{ marginTop: 8 }}>
          This version (Indigo) uses YCbCr colour analysis, spatial brightness
          profiles, motion detection, and a probabilistic 17-step sequencer — the
          Bubble Machine — to generate patterns that never exactly repeat.
        </p>
      </Section>

      <Section title="Quick start">
        <ol style={{ paddingLeft: 18, lineHeight: 2 }}>
          <li>
            Allow <strong style={{ color: '#fff' }}>camera access</strong> when the browser asks —
            your image is processed locally and never sent anywhere.
          </li>
          <li>
            Press <strong style={{ color: '#fff' }}>Start</strong>. You will hear a rhythm
            and melody generated from what the camera sees.
          </li>
          <li>
            Move around or hold up coloured objects — the music follows brightness,
            colour and motion in real time.
          </li>
          <li>
            Open the <strong style={{ color: '#fff' }}>≋ Signal Channels</strong> panel
            (top-right button) to see a live breakdown of what the camera is extracting.
          </li>
          <li>
            Use the <strong style={{ color: '#fff' }}>Sound tab</strong> to adjust tempo,
            voice volumes and BPM response.
          </li>
          <li>
            Advanced: <strong style={{ color: '#fff' }}>Settings → Signal Routing</strong> lets
            you connect any of the 18 camera signals to any sound or MIDI parameter.
          </li>
        </ol>
      </Section>

      <Section title="What you are hearing">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
          <tbody>
            {[
              ['Melody',   '#818cf8', 'Note pattern shifts with blue / cool tones in the image'],
              ['Bass',     '#34d399', 'Follows the melody at a lower octave, half the speed'],
              ['Kick',     '#f97316', 'Density follows camera motion — more movement = busier beat'],
              ['Snare',    '#f87171', 'Offset from kick, shifts with red / warm tones'],
              ['Hi-hat',   '#94a3b8', 'Dense pattern, reacts to movement'],
              ['Sampler',  '#facc15', 'Load any audio file or record 15 s from your microphone'],
            ].map(([voice, color, desc]) => (
              <tr key={voice} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <td style={{ padding: '5px 8px 5px 0', fontWeight: 600, color, whiteSpace: 'nowrap', width: 70 }}>{voice}</td>
                <td style={{ padding: '5px 0', color: 'rgba(255,255,255,0.5)' }}>{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="Beta — feedback welcome">
        <p>
          This is an early beta release. Things we know are rough right now:
        </p>
        <ul style={{ paddingLeft: 18, marginTop: 6, lineHeight: 1.9 }}>
          <li>Signal Routing matrix is powerful but complex — a simpler UI is planned</li>
          <li>Mobile support is partial (no MIDI, camera orientation may vary)</li>
          <li>Sampler files larger than 30 MB are rejected</li>
        </ul>
        <p style={{ marginTop: 10 }}>
          Please report issues or ideas at{' '}
          <ExternalLink href="https://github.com/synestize/synestizer/issues" label="github.com/synestize/synestizer/issues" />
          {' '}or email{' '}
          <span style={{ color: '#a5b4fc', userSelect: 'all' }}>synestizer@gmail.com</span>
        </p>
        <p style={{ marginTop: 6 }}>
          Full instructions and source code:{' '}
          <ExternalLink href="https://github.com/synestize/synestizer" label="github.com/synestize/synestizer" />
        </p>
      </Section>

      <Section title="Credits">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Credit name="Kaspar König"     role="Concept, sound design, project lead" org="Zurich University of the Arts (ZHdK)" />
          <Credit name="Dan MacKinlay"   role="Coding, technical architecture"       org="UNSW Sydney" />
          <Credit name="Christoph Stähli" role="Development" />
        </div>
        <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>
          <p style={{ fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Institutional support</p>
          <p>Zurich University of the Arts (ZHdK)</p>
          <p>UNSW Sydney</p>
          <p>Sonic Skills research project — Maastricht University (Prof. Karin Bijsterveld)</p>
          <p>Johannes Gutenberg University, Mainz</p>
        </div>
      </Section>

      <Section title="Previous versions">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.78rem' }}>
          <LinkRow href="https://www.listentocolors.net"       label="listentocolors.net"         desc="2015 prototype — MIDI connectivity and colour analysis" />
          <LinkRow href="http://www.synestizer.com"            label="synestizer.com"             desc="Original prototype" />
          <LinkRow href="https://synestize.github.io/blue/"   label="synestize.github.io/blue"   desc="Blue branch — latest stable release" />
          <LinkRow href="https://github.com/synestize"        label="github.com/synestize"       desc="All source code, open source under GPL" />
        </div>
      </Section>

      <div style={{ paddingTop: 8, paddingBottom: 24, fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)' }}>
        <p>Privacy: the camera feed is processed entirely in your browser. No image data, audio, or personal information is transmitted.</p>
        <p style={{ marginTop: 4 }}>Built with React · Tone.js · Web Audio API · Web MIDI API</p>
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
    <div>
      <span style={{ fontWeight: 600, color: '#fff' }}>{name}</span>
      <span style={{ color: 'rgba(255,255,255,0.45)' }}> — {role}</span>
      {org && <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{org}</div>}
    </div>
  );
}

function ExternalLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#a5b4fc', textDecoration: 'none' }}
      onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
      onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
    >
      {label}
    </a>
  );
}

function LinkRow({ href, label, desc }: { href: string; label: string; desc: string }) {
  return (
    <div>
      <ExternalLink href={href} label={label} />
      <span style={{ color: 'rgba(255,255,255,0.3)' }}> — {desc}</span>
    </div>
  );
}
