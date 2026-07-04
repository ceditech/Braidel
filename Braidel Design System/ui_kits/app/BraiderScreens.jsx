// Braider: Find work list + Applications tracker
function FindWork({ go }) {
  const { Card, Badge, Button, Input, Select, Tag } = window.BraidelDesignSystem_a13fae;
  const { Photo } = window; const Icon = window.Icon;
  const jobs = [
    { t: 'Weekend knotless specialist', salon: 'Crown & Coils', city: 'Atlanta, GA', pay: '$28–35/hr', d: '2.3 mi', type: 'Part-time', specs: ['Knotless', 'Feed-in'], tone: 0, posted: '2h ago' },
    { t: 'Senior braider — full time', salon: 'The Braid Bar', city: 'Decatur, GA', pay: '$45k–60k', d: '5.1 mi', type: 'Full-time', specs: ['Box braids', 'Locs'], tone: 2, posted: '1d ago' },
    { t: 'Event braider (1 day)', salon: 'Halo Studio', city: 'Atlanta, GA', pay: '$320 flat', d: '3.8 mi', type: 'Single event', specs: ['Goddess'], tone: 4, posted: '3d ago' },
    { t: 'Apprentice braider', salon: 'Roots & Crowns', city: 'Smyrna, GA', pay: '$18–24/hr', d: '7.2 mi', type: 'Part-time', specs: ['Cornrows', 'Stitch'], tone: 3, posted: '4d ago' },
  ];
  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 22, flexWrap: 'wrap' }}>
        <div style={{ flex: '2 1 240px' }}><Input placeholder="Role, salon or style" iconLeft={<Icon name="search" size={18} />} /></div>
        <div style={{ flex: '1 1 150px' }}><Input placeholder="Within 10 mi" iconLeft={<Icon name="map-pin" size={18} />} /></div>
        <div style={{ flex: '1 1 150px' }}><Select options={['Any type', 'Part-time', 'Full-time', 'Single event']} /></div>
        <Button iconLeft={<Icon name="sliders" size={17} />}>Filters</Button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        {jobs.map(j => (
          <Card key={j.t} padded interactive onClick={() => go('messages')}>
            <div style={{ display: 'flex', gap: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, overflow: 'hidden', flex: 'none' }}><Photo seed={j.tone} aspect="1/1" /></div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--charcoal-900)' }}>{j.t}</div>
                    <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>{j.salon} · {j.city}</div>
                  </div>
                  <Badge variant="neutral">{j.type}</Badge>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, margin: '14px 0' }}>{j.specs.map(s => <Tag key={s}>{s}</Tag>)}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', gap: 14, fontSize: 13, color: 'var(--text-muted)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-strong)' }}>{j.pay}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="map-pin" size={13} />{j.d}</span>
                <span>{j.posted}</span>
              </div>
              <Button size="sm" onClick={(e) => { e.stopPropagation(); go('messages'); }}>Apply now</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Applications() {
  const { Card, Avatar, Badge, Button, Tabs } = window.BraidelDesignSystem_a13fae;
  const Icon = window.Icon;
  const apps = [
    { t: 'Lead stylist', salon: 'Halo Studio', when: 'Applied 2 days ago', st: 'Shortlisted', v: 'info', tone: 4 },
    { t: 'Weekend braider', salon: 'Crown & Coils', when: 'Applied 3 days ago', st: 'Under review', v: 'warning', tone: 0 },
    { t: 'Full-time braider', salon: 'The Braid Bar', when: 'Applied 1 week ago', st: 'Not selected', v: 'danger', tone: 2 },
    { t: 'Event braider', salon: 'Roots & Crowns', when: 'Applied 1 week ago', st: 'Matched', v: 'success', tone: 3 },
  ];
  const { Photo } = window;
  return (
    <div style={{ padding: 32, maxWidth: 820, margin: '0 auto' }}>
      <Card>
        {apps.map((a, i) => (
          <div key={a.t} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 22px',
            borderTop: i ? '1px solid var(--border-subtle)' : 'none' }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, overflow: 'hidden', flex: 'none' }}><Photo seed={a.tone} aspect="1/1" /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: 'var(--text-strong)' }}>{a.t} · {a.salon}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{a.when}</div>
            </div>
            <Badge variant={a.v} dot>{a.st}</Badge>
            <Button size="sm" variant="outline" iconRight={<Icon name="chevron-right" size={15} />}>View</Button>
          </div>
        ))}
      </Card>
    </div>
  );
}
window.FindWork = FindWork;
window.Applications = Applications;
