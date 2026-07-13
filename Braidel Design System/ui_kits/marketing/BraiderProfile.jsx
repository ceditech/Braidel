// Braider profile — portfolio gallery, bio, ratings, apply/contact
function BraiderProfile({ go }) {
  const { Button, Card, CardBody, Badge, Rating, Tag, Avatar, Tabs } = window.BraidelDesignSystem_a13fae;
  const { Photo } = window;
  const Icon = window.Icon;
  const [tab, setTab] = React.useState('portfolio');
  const b = window.BRAIDERS[0];
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px 0' }}>
      <a onClick={() => go('braiders')} style={{ cursor: 'pointer', color: 'var(--text-muted)', fontSize: 14,
        display: 'inline-flex', alignItems: 'center', gap: 5, marginBottom: 18 }}>
        <span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}><Icon name="chevron-right" size={16} /></span>Back to braiders</a>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32, alignItems: 'start' }}>
        <div>
          {/* Header */}
          <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
            <Avatar name={b.name} size="xl" ring />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 32, margin: 0, color: 'var(--charcoal-900)' }}>{b.name}</h1>
                <Badge variant="brand" dot>Verified</Badge>
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 8, color: 'var(--text-muted)', fontSize: 15, flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="map-pin" size={15} />{b.city}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="clock" size={15} />Replies in ~1 hr</span>
                <Rating value={parseFloat(b.rate)} count={b.rev} size="0.95rem" />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 18, flexWrap: 'wrap' }}>
            {['Knotless', 'Box braids', 'Feed-in', 'Goddess braids', 'Kids welcome'].map(s => <Tag key={s}>{s}</Tag>)}
          </div>

          <div style={{ marginTop: 26 }}>
            <Tabs value={tab} onChange={setTab} items={[
              { value: 'portfolio', label: 'Portfolio' }, { value: 'about', label: 'About' },
              { value: 'reviews', label: 'Reviews', count: b.rev },
            ]} />
          </div>

          {tab === 'portfolio' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginTop: 22 }}>
              {['Knotless waist','Jumbo box','Feed-in','Goddess','Bohemian','Stitch'].map((l, i) =>
                <Photo key={l} seed={i} label={l} aspect="1/1" radius="14px" />)}
            </div>
          )}
          {tab === 'about' && (
            <div style={{ marginTop: 22, maxWidth: 580 }}>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--text-body)' }}>
                Atlanta-based braider with 9 years behind the chair, specializing in knotless and feed-in styles that
                protect your edges and last. Gentle, scalp-first technique and a calm studio — kids and first-timers welcome.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 18 }}>
                {[['Experience','9 years'],['Travels to you','Within 15 mi'],['Hair provided','Optional'],['Languages','English, Yoruba']].map(([k,v]) =>
                  <div key={k} style={{ padding: 14, background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{k}</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-strong)', marginTop: 2 }}>{v}</div>
                  </div>)}
              </div>
            </div>
          )}
          {tab === 'reviews' && (
            <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 600 }}>
              {[['Destiny W.','Knotless braids','My braids came out flawless and my scalp never hurt. Booking again!'],
                ['Maya T.','Feed-in ponytail','So gentle and quick — and the part work is unreal.']].map(([n, s, t]) => (
                <div key={n} style={{ padding: 18, background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar name={n} size="sm" />
                    <div><div style={{ fontWeight: 600 }}>{n}</div><div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s}</div></div>
                    <div style={{ marginLeft: 'auto' }}><Rating value={5} showValue={false} size="0.85rem" /></div>
                  </div>
                  <p style={{ margin: '12px 0 0', color: 'var(--text-body)', lineHeight: 1.6 }}>{t}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sticky booking card */}
        <Card padded style={{ position: 'sticky', top: 86 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, color: 'var(--charcoal-900)' }}>{b.price}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>· per style</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
            <Button block size="lg" iconLeft={<Icon name="calendar" size={18} />}>Book appointment</Button>
            <Button block variant="outline" iconLeft={<Icon name="message" size={18} />}>Message</Button>
          </div>
          <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--border-subtle)',
            display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14, color: 'var(--text-body)' }}>
            {[['shield','Identity verified'],['dollar','Secure payments'],['clock','Free cancellation 48h']].map(([ic, t]) =>
              <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
                <span style={{ color: 'var(--success)' }}><Icon name={ic} size={17} /></span>{t}</span>)}
          </div>
        </Card>
      </div>
    </div>
  );
}
window.BraiderProfile = BraiderProfile;
