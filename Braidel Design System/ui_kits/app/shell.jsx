// App shell: collapsible sidebar + top bar, role-aware. Exports to window.
const Mark2 = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path d="M15 6C15 15 33 17 33 24 33 31 15 33 15 42" stroke="#C75D3F" strokeWidth="5.2" strokeLinecap="round"/>
    <path d="M33 6C33 15 15 17 15 24 15 31 33 33 33 42" stroke="#C2922F" strokeWidth="5.2" strokeLinecap="round"/>
  </svg>
);

function Sidebar({ role, route, go, setRole }) {
  const Icon = window.Icon;
  const salonNav = [['dash', 'Dashboard', 'layout-grid'], ['posts', 'Opportunities', 'briefcase'],
    ['applicants', 'Applicants', 'users'], ['messages', 'Messages', 'message'], ['settings', 'Settings', 'settings']];
  const braiderNav = [['dash', 'Dashboard', 'layout-grid'], ['posts', 'Find work', 'briefcase'],
    ['applicants', 'Applications', 'inbox'], ['messages', 'Messages', 'message'], ['settings', 'Settings', 'settings']];
  const nav = role === 'salon' ? salonNav : braiderNav;
  return (
    <aside style={{ width: 248, flex: 'none', background: 'var(--charcoal-900)', color: 'var(--cream-100)',
      display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '20px 20px 18px',
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20 }}>
        <Mark2 /><span>Braide<span style={{ color: 'var(--terracotta-400)' }}>l</span></span>
      </div>
      {/* Role switch */}
      <div style={{ margin: '0 16px 16px', background: 'rgba(255,255,255,.06)', borderRadius: 'var(--radius-pill)',
        padding: 4, display: 'flex', gap: 4 }}>
        {[['salon', 'Salon'], ['braider', 'Braider']].map(([k, l]) => (
          <button key={k} onClick={() => setRole(k)} style={{ flex: 1, border: 'none', cursor: 'pointer',
            borderRadius: 'var(--radius-pill)', padding: '7px 0', fontFamily: 'var(--font-sans)', fontWeight: 600,
            fontSize: 13, background: role === k ? 'var(--terracotta-500)' : 'transparent',
            color: role === k ? '#fff' : 'var(--taupe-400)' }}>{l}</button>
        ))}
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '0 12px' }}>
        {nav.map(([k, l, ic]) => (
          <a key={k} onClick={() => go(k)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 11,
            padding: '11px 13px', borderRadius: 'var(--radius-md)', fontSize: 15, fontWeight: 500,
            color: route === k ? '#fff' : 'var(--cream-200)',
            background: route === k ? 'rgba(255,255,255,.08)' : 'transparent' }}>
            <span style={{ color: route === k ? 'var(--terracotta-400)' : 'var(--taupe-400)' }}><Icon name={ic} size={19} /></span>{l}
          </a>
        ))}
      </nav>
      <div style={{ marginTop: 'auto', padding: 16, display: 'flex', alignItems: 'center', gap: 10,
        borderTop: '1px solid rgba(255,255,255,.08)' }}>
        <window.AppAvatar />
        <div style={{ lineHeight: 1.2, overflow: 'hidden' }}>
          <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap' }}>{role === 'salon' ? 'Crown & Coils' : 'Amara Okafor'}</div>
          <div style={{ fontSize: 12, color: 'var(--taupe-400)' }}>{role === 'salon' ? 'Salon owner' : 'Braider'}</div>
        </div>
      </div>
    </aside>
  );
}

function AppAvatar() {
  const { Avatar } = window.BraidelDesignSystem_a13fae;
  return <Avatar name="Amara Okafor" size="sm" />;
}

function Topbar({ title, sub, action }) {
  const Icon = window.Icon;
  const { Button } = window.BraidelDesignSystem_a13fae;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '24px 32px 18px',
      borderBottom: '1px solid var(--border-subtle)', position: 'sticky', top: 0, zIndex: 5,
      background: 'rgba(251,247,241,.85)', backdropFilter: 'blur(10px)' }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 27, margin: 0, color: 'var(--charcoal-900)' }}>{title}</h1>
        {sub && <p style={{ margin: '3px 0 0', color: 'var(--text-muted)', fontSize: 14 }}>{sub}</p>}
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)',
          background: 'var(--surface-card)', cursor: 'pointer', display: 'grid', placeItems: 'center',
          color: 'var(--brown-600)', position: 'relative' }}>
          <Icon name="bell" size={19} />
          <span style={{ position: 'absolute', top: 9, right: 10, width: 8, height: 8, borderRadius: '50%',
            background: 'var(--terracotta-500)', border: '2px solid var(--surface-card)' }}></span>
        </button>
        {action}
      </div>
    </div>
  );
}

function Stat({ icon, label, value, delta, tone = 'brand' }) {
  const Icon = window.Icon;
  const bg = { brand: 'var(--brand-soft)', gold: 'var(--gold-50)', sage: 'var(--success-soft)', teal: 'var(--info-soft)' }[tone];
  const fg = { brand: 'var(--terracotta-600)', gold: 'var(--gold-700)', sage: 'var(--success-strong)', teal: 'var(--teal-600)' }[tone];
  return (
    <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
      padding: 20, boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: bg, color: fg, display: 'grid', placeItems: 'center' }}>
        <Icon name={icon} size={20} /></div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 30, color: 'var(--charcoal-900)', marginTop: 14 }}>{value}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{label}</span>
        {delta && <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--success-strong)' }}>{delta}</span>}
      </div>
    </div>
  );
}

Object.assign(window, { Sidebar, Topbar, Stat, AppAvatar, Mark2 });

// Shared placeholder + data for app screens
const APP_TONES = [['#E8C9A8','#C98A5A'],['#D9A98A','#B06A45'],['#E3CFA6','#C2922F'],['#CBB89C','#8B6B50'],['#E9B79A','#C75D3F'],['#D6C2A0','#A2781F']];
function AppPhoto({ seed = 0, aspect = '1/1' }) {
  const [a, b] = APP_TONES[seed % APP_TONES.length];
  return (
    <div style={{ aspectRatio: aspect, width: '100%', height: '100%', background: `linear-gradient(145deg, ${a}, ${b})`,
      display: 'grid', placeItems: 'center' }}>
      <svg width="40%" height="40%" viewBox="0 0 48 48" fill="none" style={{ opacity: .3 }}>
        <path d="M15 6C15 15 33 17 33 24 33 31 15 33 15 42" stroke="#fff" strokeWidth="5" strokeLinecap="round"/>
        <path d="M33 6C33 15 15 17 15 24 15 31 33 33 33 42" stroke="#fff" strokeWidth="5" strokeLinecap="round"/>
      </svg>
    </div>
  );
}
window.Photo = AppPhoto;
window.SPECIALTIES = ['Knotless', 'Box braids', 'Locs', 'Cornrows', 'Senegalese twists', 'Feed-in', 'Faux locs', 'Goddess braids', 'Stitch braids'];
