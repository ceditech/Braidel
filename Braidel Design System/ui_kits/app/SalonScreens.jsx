// Salon: Post an opportunity form + Manage applicants
function PostOpportunity({ go }) {
  const { Card, Input, Select, Button, Tag, Checkbox } = window.BraidelDesignSystem_a13fae;
  const Icon = window.Icon;
  const [specs, setSpecs] = React.useState(['Knotless']);
  const toggle = s => setSpecs(a => a.includes(s) ? a.filter(x => x !== s) : [...a, s]);
  return (
    <div style={{ padding: 32, maxWidth: 760, margin: '0 auto' }}>
      <Card padded>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 21, margin: '0 0 4px' }}>Post an opportunity</h3>
        <p style={{ color: 'var(--text-muted)', margin: '0 0 22px', fontSize: 14 }}>Describe the role — braiders near you will be matched automatically.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Input label="Title" placeholder="e.g. Weekend knotless specialist" required defaultValue="Weekend knotless specialist" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Select label="Employment type" options={['Part-time', 'Full-time', 'Contract', 'Single event']} />
            <Select label="Experience" options={['Any', '1+ years', '3+ years', '5+ years']} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Input label="Compensation" placeholder="$28–35 / hr" iconLeft={<Icon name="dollar" size={17} />} defaultValue="28–35 / hr" />
            <Input label="Location" placeholder="Atlanta, GA" iconLeft={<Icon name="map-pin" size={17} />} defaultValue="Atlanta, GA" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-strong)', marginBottom: 8 }}>Specialties needed</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {window.SPECIALTIES.map(s => <Tag key={s} selected={specs.includes(s)} onClick={() => toggle(s)}>{s}</Tag>)}
            </div>
          </div>
          <Input label="Description" textarea placeholder="Tell braiders about the role, schedule, and your salon…"
            defaultValue="Busy, welcoming Atlanta salon looking for a knotless specialist for Saturdays. Steady clientele, clean stations, and supportive team." />
          <Checkbox label="Show my salon name publicly on this post" defaultChecked />
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: 18 }}>
            <Button variant="ghost" onClick={() => go('dash')}>Save draft</Button>
            <Button onClick={() => go('applicants')} iconRight={<Icon name="arrow-right" size={17} />}>Publish opportunity</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ManageApplicants({ go }) {
  const { Card, Avatar, Badge, Button, Rating, Tabs, Tag } = window.BraidelDesignSystem_a13fae;
  const Icon = window.Icon;
  const [tab, setTab] = React.useState('all');
  const rows = [
    { n: 'Imani Carter', exp: '5 yrs', specs: ['Knotless', 'Feed-in'], r: 4.9, rev: 210, st: 'New', v: 'warning' },
    { n: 'Zola Adeyemi', exp: '7 yrs', specs: ['Senegalese'], r: 4.7, rev: 73, st: 'Shortlisted', v: 'info' },
    { n: 'Nia Robinson', exp: '4 yrs', specs: ['Goddess', 'Knotless'], r: 4.9, rev: 142, st: 'Matched', v: 'success' },
    { n: 'Tasha Bell', exp: '6 yrs', specs: ['Box braids'], r: 4.8, rev: 96, st: 'New', v: 'warning' },
  ];
  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 18 }}>
        <Tabs value={tab} onChange={setTab} items={[
          { value: 'all', label: 'All', count: 12 }, { value: 'new', label: 'New', count: 5 },
          { value: 'short', label: 'Shortlisted', count: 4 }, { value: 'matched', label: 'Matched', count: 3 },
        ]} />
      </div>
      <Card>
        {rows.map((a, i) => (
          <div key={a.n} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 22px',
            borderTop: i ? '1px solid var(--border-subtle)' : 'none' }}>
            <Avatar name={a.n} size="md" />
            <div style={{ width: 200 }}>
              <div style={{ fontWeight: 600, color: 'var(--text-strong)' }}>{a.n}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{a.exp} experience</div>
            </div>
            <div style={{ display: 'flex', gap: 6, flex: 1 }}>{a.specs.map(s => <Tag key={s}>{s}</Tag>)}</div>
            <Rating value={a.r} count={a.rev} size="0.9rem" />
            <div style={{ width: 110, textAlign: 'center' }}><Badge variant={a.v} dot>{a.st}</Badge></div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button size="sm" variant="outline" onClick={() => go('messages')} iconLeft={<Icon name="message" size={15} />}>Message</Button>
              <Button size="sm">Shortlist</Button>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
window.PostOpportunity = PostOpportunity;
window.ManageApplicants = ManageApplicants;
