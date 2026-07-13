// Messaging — conversation list + thread
function Messages({ role }) {
  const { Avatar, Badge, Button, Input } = window.BraidelDesignSystem_a13fae;
  const Icon = window.Icon;
  const convos = role === 'salon'
    ? [['Imani Carter', 'Yes, I can start next Saturday!', '2m', true, 0],
       ['Zola Adeyemi', 'Thanks for shortlisting me 🙏', '1h', false, 1],
       ['Nia Robinson', 'Sounds great, see you then.', '3h', false, 2],
       ['Tasha Bell', 'What hair brand do you provide?', '1d', false, 3]]
    : [['Crown & Coils', 'Can you start next Saturday?', '2m', true, 0],
       ['Halo Studio', 'We loved your portfolio!', '1h', false, 1],
       ['The Braid Bar', 'Following up on your application', '5h', false, 2]];
  const [sel, setSel] = React.useState(0);
  const thread = [
    { me: false, t: role === 'salon' ? 'Hi! I saw your knotless opportunity — I have 5 years of experience and full weekend availability.' : 'Hi! Thanks for applying. Your portfolio looks amazing — are you available weekends?', time: '10:24' },
    { me: true, t: role === 'salon' ? 'Your portfolio is beautiful. Could you start next Saturday at 9am?' : 'Yes! I have full weekend availability and can start right away.', time: '10:31' },
    { me: false, t: role === 'salon' ? 'Yes, I can start next Saturday!' : 'Perfect — can you start next Saturday at 9am?', time: '10:33' },
  ];
  const active = convos[sel];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', height: 'calc(100vh - 0px)' }}>
      {/* List */}
      <div style={{ borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', background: 'var(--surface-card)' }}>
        <div style={{ padding: '18px 18px 12px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, margin: '0 0 12px' }}>Messages</h2>
          <Input size="sm" placeholder="Search conversations" iconLeft={<Icon name="search" size={16} />} />
        </div>
        <div style={{ overflow: 'auto', flex: 1 }}>
          {convos.map(([n, msg, time, unread, av], i) => (
            <div key={n} onClick={() => setSel(i)} style={{ display: 'flex', gap: 12, padding: '14px 18px', cursor: 'pointer',
              background: sel === i ? 'var(--bg-subtle)' : 'transparent', borderLeft: sel === i ? '3px solid var(--brand)' : '3px solid transparent' }}>
              <Avatar name={n} size="md" status={i === 0 ? 'online' : undefined} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-strong)', fontSize: 15 }}>{n}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-subtle)' }}>{time}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, color: unread ? 'var(--text-body)' : 'var(--text-muted)', fontWeight: unread ? 600 : 400,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg}</span>
                  {unread && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--brand)', flex: 'none' }}></span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Thread */}
      <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg-page)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--surface-card)' }}>
          <Avatar name={active[0]} size="md" status="online" />
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-strong)' }}>{active[0]}</div>
            <div style={{ fontSize: 13, color: 'var(--success-strong)' }}>● Online</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <Badge variant="brand">{role === 'salon' ? 'Knotless specialist' : 'Crown & Coils'}</Badge>
            <Button size="sm" variant="outline">View {role === 'salon' ? 'profile' : 'opportunity'}</Button>
          </div>
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '26px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}>Today</div>
          {thread.map((m, i) => (
            <div key={i} style={{ alignSelf: m.me ? 'flex-end' : 'flex-start', maxWidth: '62%' }}>
              <div style={{ padding: '11px 15px', borderRadius: m.me ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: m.me ? 'var(--brand)' : 'var(--surface-card)', color: m.me ? 'var(--cream-50)' : 'var(--text-body)',
                border: m.me ? 'none' : '1px solid var(--border-subtle)', fontSize: 15, lineHeight: 1.5, boxShadow: 'var(--shadow-xs)' }}>{m.t}</div>
              <div style={{ fontSize: 11, color: 'var(--text-subtle)', marginTop: 4, textAlign: m.me ? 'right' : 'left' }}>{m.time}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: '14px 24px 20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 10, alignItems: 'center', background: 'var(--surface-card)' }}>
          <div style={{ flex: 1 }}><Input placeholder="Write a message…" /></div>
          <Button icon aria-label="Send"><Icon name="send" size={18} /></Button>
        </div>
      </div>
    </div>
  );
}
window.Messages = Messages;
