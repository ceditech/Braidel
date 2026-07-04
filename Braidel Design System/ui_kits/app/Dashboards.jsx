// Salon + Braider dashboard home screens
function SalonDashboard({ go }) {
  const { Card, Badge, Button, Avatar, Rating } = window.BraidelDesignSystem_a13fae;
  const { Stat } = window; const Icon = window.Icon;
  const applicants = [
    { n: 'Imani Carter', s: 'Knotless · 5 yrs', r: 4.9, st: 'New', v: 'warning' },
    { n: 'Zola Adeyemi', s: 'Senegalese · 7 yrs', r: 4.7, st: 'Shortlisted', v: 'info' },
    { n: 'Nia Robinson', s: 'Goddess · 4 yrs', r: 4.9, st: 'Matched', v: 'success' },
  ];
  const posts = [
    { t: 'Weekend knotless specialist', a: 9, type: 'Part-time', pay: '$28–35/hr' },
    { t: 'Full-time senior braider', a: 14, type: 'Full-time', pay: '$45k–60k' },
  ];
  return (
    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 26 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
        <Stat icon="briefcase" label="Open opportunities" value="3" tone="brand" />
        <Stat icon="users" label="New applicants" value="12" delta="+5 today" tone="gold" />
        <Stat icon="check" label="Matches made" value="48" tone="sage" />
        <Stat icon="calendar" label="Chairs filled" value="86%" tone="teal" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 22 }}>
        {/* Opportunities */}
        <Card padded>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19, margin: 0 }}>Your opportunities</h3>
            <Button size="sm" variant="outline" onClick={() => go('posts')} iconLeft={<Icon name="plus" size={16} />}>Post</Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {posts.map(p => (
              <div key={p.t} onClick={() => go('applicants')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
                padding: 14, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-strong)' }}>{p.t}</div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 5 }}>
                    <Badge variant="neutral">{p.type}</Badge>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)' }}>{p.pay}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--brand)' }}>{p.a}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>applicants</div>
                </div>
                <Icon name="chevron-right" size={18} />
              </div>
            ))}
          </div>
        </Card>

        {/* Recent applicants */}
        <Card padded>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19, margin: '0 0 16px' }}>Recent applicants</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {applicants.map(a => (
              <div key={a.n} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar name={a.n} size="md" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-strong)' }}>{a.n}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{a.s}</div>
                </div>
                <Badge variant={a.v}>{a.st}</Badge>
              </div>
            ))}
          </div>
          <Button block variant="ghost" style={{ marginTop: 16 }} onClick={() => go('applicants')}>View all applicants</Button>
        </Card>
      </div>
    </div>
  );
}

function BraiderDashboard({ go }) {
  const { Card, Badge, Button, Rating, Alert, Tag } = window.BraidelDesignSystem_a13fae;
  const { Stat, Photo } = window; const Icon = window.Icon;
  const jobs = [
    { t: 'Weekend knotless specialist', salon: 'Crown & Coils', city: 'Atlanta, GA', pay: '$28–35/hr', d: '2.3 mi', tone: 0 },
    { t: 'Senior braider — full time', salon: 'The Braid Bar', city: 'Decatur, GA', pay: '$45k–60k', d: '5.1 mi', tone: 2 },
    { t: 'Event braider (1 day)', salon: 'Halo Studio', city: 'Atlanta, GA', pay: '$320 flat', d: '3.8 mi', tone: 4 },
  ];
  const apps = [['Lead stylist — Halo Studio', 'Shortlisted', 'info'], ['Weekend braider — Coils', 'Under review', 'warning']];
  return (
    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 26 }}>
      <Alert variant="brand" title="Your profile is 80% complete">Add 2 more portfolio photos to rank higher in salon searches.</Alert>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
        <Stat icon="briefcase" label="Jobs near you" value="24" tone="brand" />
        <Stat icon="send" label="Applications" value="6" tone="gold" />
        <Stat icon="message" label="Salon replies" value="3" delta="2 new" tone="sage" />
        <Stat icon="dollar" label="Avg offer" value="$32/hr" tone="teal" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 22 }}>
        <Card padded>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19, margin: 0 }}>Work near you</h3>
            <a onClick={() => go('posts')} style={{ cursor: 'pointer', color: 'var(--brand)', fontWeight: 600, fontSize: 14 }}>See all</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {jobs.map(j => (
              <div key={j.t} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14,
                border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, overflow: 'hidden', flex: 'none' }}><Photo seed={j.tone} aspect="1/1" /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-strong)' }}>{j.t}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{j.salon} · {j.city} · {j.d}</div>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-strong)' }}>{j.pay}</span>
                <Button size="sm" onClick={() => go('posts')}>Apply</Button>
              </div>
            ))}
          </div>
        </Card>
        <Card padded>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19, margin: '0 0 16px' }}>Your applications</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {apps.map(([t, st, v]) => (
              <div key={t} style={{ padding: 14, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontWeight: 600, color: 'var(--text-strong)', fontSize: 14 }}>{t}</div>
                <div style={{ marginTop: 8 }}><Badge variant={v} dot>{st}</Badge></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
window.SalonDashboard = SalonDashboard;
window.BraiderDashboard = BraiderDashboard;
