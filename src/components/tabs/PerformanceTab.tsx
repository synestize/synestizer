export function PerformanceTab() {
  return (
    <div className="p-4 space-y-4">
      <Section title="MIDI Output">
        <Placeholder text="Note + CC output with trigger / continuous modes — coming in Phase 3" />
      </Section>
      <Section title="Transport">
        <Placeholder text="BPM, start/stop, sync — coming in Phase 2.5" />
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      <div className="px-4 py-2 bg-gray-700 text-sm font-semibold text-gray-200">
        {title}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function Placeholder({ text }: { text: string }) {
  return (
    <p className="text-sm text-gray-500 italic">{text}</p>
  );
}
