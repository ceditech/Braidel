import React from 'react';

const css = `
.bdl-avatar{ position:relative; display:inline-flex; flex:none; align-items:center; justify-content:center;
  border-radius:50%; overflow:hidden; font-family:var(--font-display); font-weight:var(--weight-semibold);
  color:var(--cream-50); background:var(--brown-500); user-select:none; }
.bdl-avatar img{ width:100%; height:100%; object-fit:cover; }
.bdl-avatar--ring{ box-shadow:0 0 0 2px var(--surface-card), 0 0 0 4px var(--brand); }
.bdl-avatar--xs{ width:28px; height:28px; font-size:0.7rem; }
.bdl-avatar--sm{ width:36px; height:36px; font-size:0.82rem; }
.bdl-avatar--md{ width:48px; height:48px; font-size:1.05rem; }
.bdl-avatar--lg{ width:64px; height:64px; font-size:1.4rem; }
.bdl-avatar--xl{ width:96px; height:96px; font-size:2rem; }
.bdl-avatar__status{ position:absolute; right:0; bottom:0; width:28%; height:28%;
  border-radius:50%; border:2px solid var(--surface-card); background:var(--success); }
.bdl-avatar__status--off{ background:var(--text-subtle); }
.bdl-grp{ display:inline-flex; }
.bdl-grp .bdl-avatar{ box-shadow:0 0 0 2px var(--surface-card); margin-left:-10px; }
.bdl-grp .bdl-avatar:first-child{ margin-left:0; }
`;

const TONES = ['var(--brown-500)','var(--terracotta-500)','var(--gold-600)','var(--sage-500)','var(--teal-500)','var(--espresso-700)'];
function toneFor(str = ''){ let h = 0; for (let i=0;i<str.length;i++) h = (h*31 + str.charCodeAt(i)) >>> 0; return TONES[h % TONES.length]; }
function initials(name = ''){ return name.trim().split(/\s+/).slice(0,2).map(w => w[0]||'').join('').toUpperCase(); }

function useStyleOnce(id, text){
  React.useEffect(() => {
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id; el.textContent = text; document.head.appendChild(el);
  }, []);
}

export function Avatar({ src, name = '', size = 'md', ring = false, status, className = '', ...rest }) {
  useStyleOnce('bdl-avatar-css', css);
  const cls = ['bdl-avatar', `bdl-avatar--${size}`, ring && 'bdl-avatar--ring', className].filter(Boolean).join(' ');
  return (
    <span className={cls} style={!src ? { background: toneFor(name) } : undefined} {...rest}>
      {src ? <img src={src} alt={name} /> : initials(name)}
      {status && <span className={`bdl-avatar__status${status === 'offline' ? ' bdl-avatar__status--off' : ''}`} />}
    </span>
  );
}

export function AvatarGroup({ children, className = '' }) {
  useStyleOnce('bdl-avatar-css', css);
  return <span className={['bdl-grp', className].filter(Boolean).join(' ')}>{children}</span>;
}
