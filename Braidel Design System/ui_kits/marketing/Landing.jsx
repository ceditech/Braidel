// Landing page
function Landing({ go }) {
  const { Button, Card, CardBody, Badge, Rating, Tag } = window.BraidelDesignSystem_a13fae;
  const { Photo, BRAIDERS } = window;
  const Icon = window.Icon;
  return (
    <div>
      {/* Hero */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 24px 40px',
        display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 56, alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '.16em', color: 'var(--brand)', marginBottom: 18 }}>The braiding marketplace</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(42px,5vw,68px)',
            lineHeight: 1.04, letterSpacing: '-0.022em', color: 'var(--charcoal-900)', margin: 0 }}>
            Braid your craft<br />into work you love.
          </h1>
          <p style={{ fontSize: 19, lineHeight: 1.55, color: 'var(--text-body)', maxWidth: 480, marginTop: 20 }}>
            Braidel connects salon owners with skilled braiders — and helps clients discover and book the styles they love.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
            <Button size="lg" onClick={() => go('braiders')} iconRight={<Icon name="arrow-right" size={18} />}>Find braiders</Button>
            <Button size="lg" variant="outline" onClick={() => go('app')}>I'm a braider</Button>
          </div>
          <div style={{ display: 'flex', gap: 26, marginTop: 34 }}>
            {[['12k+', 'braiders'], ['3.4k', 'salons'], ['4.9★', 'avg rating']].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, color: 'var(--charcoal-900)' }}>{n}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Hero collage */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Photo seed={4} label="Knotless" aspect="3/4" radius="20px" />
          <div style={{ display: 'grid', gap: 14 }}>
            <Photo seed={2} label="Locs" aspect="4/3" radius="20px" />
            <Photo seed={0} label="Box braids" aspect="4/3" radius="20px" />
          </div>
        </div>
      </section>

      {/* Two-sided value props */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
        {[
          { t: 'For salon owners', d: 'Post staffing opportunities, review portfolios, and hire vetted braiders fast — fill your chairs without the guesswork.', c: 'Post an opportunity', tone: 'var(--charcoal-900)', fg: 'var(--cream-50)', icon: 'briefcase' },
          { t: 'For braiders', d: 'Build a portfolio, set your availability, and find paid work at salons near you — on your terms.', c: 'Join as a braider', tone: 'var(--terracotta-500)', fg: 'var(--cream-50)', icon: 'users' },
        ].map(p => (
          <div key={p.t} style={{ background: p.tone, color: p.fg, borderRadius: 'var(--radius-xl)', padding: 36 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,.14)',
              display: 'grid', placeItems: 'center', marginBottom: 20 }}><Icon name={p.icon} size={24} /></div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 27, margin: 0 }}>{p.t}</h3>
            <p style={{ fontSize: 16, lineHeight: 1.6, opacity: .9, marginTop: 12, maxWidth: 380 }}>{p.d}</p>
            <button onClick={() => go('app')} style={{ marginTop: 22, background: 'var(--cream-50)', color: 'var(--charcoal-900)',
              border: 'none', borderRadius: 'var(--radius-md)', height: 46, padding: '0 22px', fontFamily: 'var(--font-sans)',
              fontWeight: 600, fontSize: 15, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              {p.c}<Icon name="arrow-right" size={17} />
            </button>
          </div>
        ))}
      </section>

      {/* Featured braiders */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '44px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 22 }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 32, margin: 0, color: 'var(--charcoal-900)' }}>Featured braiders</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: 6 }}>Top-rated professionals taking new clients now.</p>
          </div>
          <a onClick={() => go('braiders')} style={{ cursor: 'pointer', color: 'var(--brand)', fontWeight: 600,
            display: 'inline-flex', alignItems: 'center', gap: 6 }}>See all<Icon name="arrow-right" size={16} /></a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }}>
          {BRAIDERS.slice(0, 3).map(b => (
            <Card key={b.id} interactive onClick={() => go('braider')}>
              <Photo seed={b.tone} aspect="4/3" />
              <CardBody>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--charcoal-900)' }}>{b.name}</span>
                  <Badge variant={b.badge === 'New' ? 'gold' : 'brand'}>{b.badge}</Badge>
                </div>
                <span style={{ fontSize: 14, color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <Icon name="map-pin" size={14} />{b.city}</span>
                <div style={{ display: 'flex', gap: 6, margin: '4px 0 2px' }}>{b.specs.map(s => <Tag key={s}>{s}</Tag>)}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                  <Rating value={parseFloat(b.rate)} count={b.rev} size="0.92rem" />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-strong)' }}>{b.price}</span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
window.Landing = Landing;
