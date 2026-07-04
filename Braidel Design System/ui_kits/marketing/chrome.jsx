// Marketing site chrome: top nav, footer, photo placeholder, sample data.
// Exports to window for the screen scripts.

const TONES = [
  ['#E8C9A8', '#C98A5A'], ['#D9A98A', '#B06A45'], ['#E3CFA6', '#C2922F'],
  ['#CBB89C', '#8B6B50'], ['#E9B79A', '#C75D3F'], ['#D6C2A0', '#A2781F'],
];
function Photo({ seed = 0, label, aspect = '4/3', radius = '0', style }) {
  const [a, b] = TONES[seed % TONES.length];
  return (
    <div style={{ aspectRatio: aspect, background: `linear-gradient(145deg, ${a}, ${b})`,
      borderRadius: radius, position: 'relative', display: 'grid', placeItems: 'center',
      overflow: 'hidden', ...style }}>
      <svg width="34%" height="34%" viewBox="0 0 48 48" fill="none" style={{ opacity: .28 }}>
        <path d="M15 6C15 15 33 17 33 24 33 31 15 33 15 42" stroke="#fff" strokeWidth="5" strokeLinecap="round"/>
        <path d="M33 6C33 15 15 17 15 24 15 31 33 33 33 42" stroke="#fff" strokeWidth="5" strokeLinecap="round"/>
      </svg>
      {label && <span style={{ position: 'absolute', bottom: 10, left: 12, fontFamily: 'var(--font-mono)',
        fontSize: 11, color: 'rgba(255,255,255,.92)', background: 'rgba(0,0,0,.22)', padding: '2px 7px',
        borderRadius: 6 }}>{label}</span>}
    </div>
  );
}

const Mark = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path d="M15 6C15 15 33 17 33 24 33 31 15 33 15 42" stroke="#C75D3F" strokeWidth="5.2" strokeLinecap="round"/>
    <path d="M33 6C33 15 15 17 15 24 15 31 33 33 33 42" stroke="#C2922F" strokeWidth="5.2" strokeLinecap="round"/>
  </svg>
);
const Wordmark = ({ light }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontFamily: 'var(--font-display)',
    fontWeight: 700, fontSize: 22, letterSpacing: '-0.02em', color: light ? 'var(--cream-50)' : 'var(--charcoal-900)' }}>
    <Mark size={28} /><span>Braide<span style={{ color: 'var(--terracotta-500)' }}>l</span></span>
  </span>
);

function Nav({ go, active }) {
  const { Button } = window.BraidelDesignSystem_a13fae;
  const links = [['braiders', 'Find braiders'], ['salons', 'Find salons'], ['jobs', 'Job opportunities']];
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(251,247,241,.82)',
      backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '14px 24px', display: 'flex',
        alignItems: 'center', gap: 28 }}>
        <a onClick={() => go('landing')} style={{ cursor: 'pointer' }}><Wordmark /></a>
        <nav style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
          {links.map(([k, l]) => (
            <a key={k} onClick={() => go(k)} style={{ cursor: 'pointer', padding: '8px 14px',
              borderRadius: 'var(--radius-sm)', fontSize: 15, fontWeight: 600,
              color: active === k ? 'var(--brand)' : 'var(--text-body)' }}>{l}</a>
          ))}
        </nav>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center' }}>
          <a onClick={() => go('app')} style={{ cursor: 'pointer', fontWeight: 600, fontSize: 15 }}>Log in</a>
          <Button size="sm" onClick={() => go('app')}>Get started</Button>
        </div>
      </div>
    </header>
  );
}

function Footer({ go }) {
  const cols = [
    ['For braiders', ['Find work', 'Build your profile', 'Browse salons']],
    ['For salons', ['Post an opportunity', 'Find braiders', 'Pricing']],
    ['For clients', ['Book a style', 'Gift cards', 'How it works']],
    ['Company', ['About', 'Careers', 'Contact']],
  ];
  return (
    <footer style={{ background: 'var(--charcoal-900)', color: 'var(--cream-100)', marginTop: 80 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 24px 40px', display: 'grid',
        gridTemplateColumns: '1.4fr repeat(4, 1fr)', gap: 32 }}>
        <div><Wordmark light /><p style={{ marginTop: 14, fontSize: 14, color: 'var(--taupe-400)', maxWidth: 240,
          lineHeight: 1.6 }}>The marketplace built for the braiding industry — salons, braiders, and the clients who love their work.</p></div>
        {cols.map(([h, items]) => (
          <div key={h}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase',
              letterSpacing: '.14em', color: 'var(--gold-400)', marginBottom: 14 }}>{h}</div>
            {items.map(i => <a key={i} style={{ display: 'block', fontSize: 14, color: 'var(--cream-200)',
              padding: '5px 0', cursor: 'pointer' }}>{i}</a>)}
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,.1)', padding: '20px 24px', maxWidth: 1200,
        margin: '0 auto', fontSize: 13, color: 'var(--taupe-400)' }}>© 2026 Braidel. Made for the culture.</div>
    </footer>
  );
}

const BRAIDERS = [
  { id: 'amara', name: 'Amara Okafor', city: 'Atlanta, GA', specs: ['Knotless', 'Box braids'], rate: '4.9', rev: 128, badge: 'Verified', price: '$160–$280', tone: 0 },
  { id: 'tasha', name: 'Tasha Bell', city: 'Houston, TX', specs: ['Box braids', 'Feed-in'], rate: '4.8', rev: 96, badge: 'Top rated', price: '$140–$240', tone: 1 },
  { id: 'lina', name: 'Lina Mensah', city: 'Newark, NJ', specs: ['Locs', 'Faux locs'], rate: '5.0', rev: 54, badge: 'New', price: '$180–$320', tone: 2 },
  { id: 'imani', name: 'Imani Carter', city: 'Chicago, IL', specs: ['Cornrows', 'Stitch'], rate: '4.9', rev: 210, badge: 'Verified', price: '$120–$220', tone: 3 },
  { id: 'zola', name: 'Zola Adeyemi', city: 'Brooklyn, NY', specs: ['Senegalese', 'Twists'], rate: '4.7', rev: 73, badge: 'Top rated', price: '$170–$300', tone: 4 },
  { id: 'nia', name: 'Nia Robinson', city: 'Atlanta, GA', specs: ['Knotless', 'Goddess'], rate: '4.9', rev: 142, badge: 'Verified', price: '$190–$340', tone: 5 },
];
const SPECIALTIES = ['Knotless', 'Box braids', 'Locs', 'Cornrows', 'Senegalese twists', 'Feed-in', 'Faux locs', 'Goddess braids', 'Stitch braids'];

Object.assign(window, { Photo, Mark, Wordmark, Nav, Footer, BRAIDERS, SPECIALTIES });
