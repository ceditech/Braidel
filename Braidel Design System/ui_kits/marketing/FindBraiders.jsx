// Find braiders — search + filters + results grid
function FindBraiders({ go }) {
  const { Button, Card, CardBody, Badge, Rating, Tag, Input, Select } = window.BraidelDesignSystem_a13fae;
  const { Photo, BRAIDERS, SPECIALTIES } = window;
  const Icon = window.Icon;
  const [active, setActive] = React.useState(['Knotless']);
  const toggle = (s) => setActive(a => a.includes(s) ? a.filter(x => x !== s) : [...a, s]);
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '34px 24px 0' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 38, margin: 0, color: 'var(--charcoal-900)' }}>Find braiders</h1>
      <p style={{ color: 'var(--text-muted)', marginTop: 6 }}>Browse vetted braiders near you. {BRAIDERS.length} of 12,480 shown.</p>

      {/* Search bar */}
      <div style={{ display: 'flex', gap: 12, marginTop: 22, padding: 14, background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)',
        position: 'sticky', top: 70, zIndex: 10, flexWrap: 'wrap' }}>
        <div style={{ flex: '2 1 240px' }}><Input placeholder="Style, name or salon" iconLeft={<Icon name="search" size={18} />} /></div>
        <div style={{ flex: '1 1 160px' }}><Input placeholder="City or ZIP" iconLeft={<Icon name="map-pin" size={18} />} /></div>
        <div style={{ flex: '1 1 150px' }}><Select options={['Sort: Nearest', 'Sort: Top rated', 'Sort: Price low–high']} /></div>
        <Button iconLeft={<Icon name="sliders" size={17} />}>Filters</Button>
      </div>

      {/* Specialty chips */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '20px 0 24px' }}>
        {SPECIALTIES.map(s => <Tag key={s} selected={active.includes(s)} onClick={() => toggle(s)}>{s}</Tag>)}
      </div>

      {/* Results */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22, paddingBottom: 20 }}>
        {BRAIDERS.map(b => (
          <Card key={b.id} interactive onClick={() => go('braider')}>
            <div style={{ position: 'relative' }}>
              <Photo seed={b.tone} aspect="4/3" />
              <button style={{ position: 'absolute', top: 12, right: 12, width: 38, height: 38, borderRadius: '50%',
                border: 'none', background: 'rgba(251,247,241,.9)', backdropFilter: 'blur(4px)', cursor: 'pointer',
                display: 'grid', placeItems: 'center', color: 'var(--brown-600)' }}
                onClick={(e) => e.stopPropagation()}><Icon name="heart" size={18} /></button>
            </div>
            <CardBody>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--charcoal-900)' }}>{b.name}</span>
                <Badge variant={b.badge === 'New' ? 'gold' : 'brand'} dot={b.badge === 'Verified'}>{b.badge}</Badge>
              </div>
              <span style={{ fontSize: 14, color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <Icon name="map-pin" size={14} />{b.city}</span>
              <div style={{ display: 'flex', gap: 6, margin: '4px 0 2px', flexWrap: 'wrap' }}>{b.specs.map(s => <Tag key={s}>{s}</Tag>)}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8,
                paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
                <Rating value={parseFloat(b.rate)} count={b.rev} size="0.92rem" />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-strong)' }}>{b.price}</span>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
window.FindBraiders = FindBraiders;
