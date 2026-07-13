import React from 'react';

const css = `
.bdl-badge{ display:inline-flex; align-items:center; gap:0.35em; font-family:var(--font-sans);
  font-weight:var(--weight-semibold); font-size:var(--text-xs); line-height:1;
  letter-spacing:var(--tracking-snug); padding:0.35em 0.7em; border-radius:var(--radius-pill);
  white-space:nowrap; border:1px solid transparent; }
.bdl-badge__dot{ width:6px; height:6px; border-radius:50%; background:currentColor; }
.bdl-badge--neutral{ background:var(--bg-sunken); color:var(--espresso-700); }
.bdl-badge--brand{ background:var(--brand-soft); color:var(--terracotta-700); border-color:var(--brand-soft-border); }
.bdl-badge--gold{ background:var(--gold-50); color:var(--gold-700); border-color:var(--gold-100); }
.bdl-badge--success{ background:var(--success-soft); color:var(--success-strong); }
.bdl-badge--warning{ background:var(--warning-soft); color:var(--gold-700); }
.bdl-badge--danger{ background:var(--danger-soft); color:var(--danger-strong); }
.bdl-badge--info{ background:var(--info-soft); color:var(--teal-600); }
.bdl-badge--solid{ background:var(--brand); color:var(--brand-on); border-color:transparent; }
.bdl-badge--outline{ background:transparent; color:var(--text-body); border-color:var(--border-strong); }
`;

function useStyleOnce(id, text){
  React.useEffect(() => {
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id; el.textContent = text; document.head.appendChild(el);
  }, []);
}

export function Badge({ children, variant = 'neutral', dot = false, className = '', ...rest }) {
  useStyleOnce('bdl-badge-css', css);
  return (
    <span className={['bdl-badge', `bdl-badge--${variant}`, className].filter(Boolean).join(' ')} {...rest}>
      {dot && <span className="bdl-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
