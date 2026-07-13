import React from 'react';

const css = `
.bdl-alert{ display:flex; gap:0.75rem; font-family:var(--font-sans); padding:var(--space-4);
  border-radius:var(--radius-md); border:1px solid; align-items:flex-start; }
.bdl-alert__icon{ flex:none; margin-top:1px; display:flex; }
.bdl-alert__body{ display:flex; flex-direction:column; gap:2px; font-size:var(--text-sm); line-height:var(--leading-snug); }
.bdl-alert__title{ font-weight:var(--weight-bold); font-size:var(--text-base); color:var(--text-strong); }
.bdl-alert__msg{ color:var(--text-body); }
.bdl-alert--info{ background:var(--info-soft); border-color:#bcd3d6; color:var(--teal-600); }
.bdl-alert--success{ background:var(--success-soft); border-color:#c4d9c0; color:var(--success-strong); }
.bdl-alert--warning{ background:var(--warning-soft); border-color:#e7d09a; color:var(--gold-700); }
.bdl-alert--danger{ background:var(--danger-soft); border-color:#ecc4be; color:var(--danger-strong); }
.bdl-alert--brand{ background:var(--brand-soft); border-color:var(--brand-soft-border); color:var(--terracotta-700); }
`;

function useStyleOnce(id, text){
  React.useEffect(() => {
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id; el.textContent = text; document.head.appendChild(el);
  }, []);
}

const ICONS = {
  info:    'M10 9v5M10 6.2h.01M10 18a8 8 0 110-16 8 8 0 010 16z',
  success: 'M6 10.5l2.6 2.6L14.5 7M10 18a8 8 0 110-16 8 8 0 010 16z',
  warning: 'M10 7.5v3.6M10 14.2h.01M8.6 3.2L2.3 14a1.6 1.6 0 001.4 2.4h12.6A1.6 1.6 0 0017.7 14L11.4 3.2a1.6 1.6 0 00-2.8 0z',
  danger:  'M10 7v4M10 14.5h.01M10 18a8 8 0 110-16 8 8 0 010 16z',
  brand:   'M10 9v5M10 6.2h.01M10 18a8 8 0 110-16 8 8 0 010 16z',
};

export function Alert({ children, variant = 'info', title, icon, className = '', ...rest }) {
  useStyleOnce('bdl-alert-css', css);
  return (
    <div className={['bdl-alert', `bdl-alert--${variant}`, className].filter(Boolean).join(' ')} role="status" {...rest}>
      <span className="bdl-alert__icon" aria-hidden="true">
        {icon || <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d={ICONS[variant]} stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>}
      </span>
      <div className="bdl-alert__body">
        {title && <span className="bdl-alert__title">{title}</span>}
        {children && <span className="bdl-alert__msg">{children}</span>}
      </div>
    </div>
  );
}
