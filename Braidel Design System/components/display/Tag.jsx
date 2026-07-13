import React from 'react';

const css = `
.bdl-tag{ display:inline-flex; align-items:center; gap:0.4em; font-family:var(--font-sans);
  font-weight:var(--weight-medium); font-size:var(--text-sm); line-height:1; color:var(--text-body);
  background:var(--surface-raised); border:1.5px solid var(--border-default);
  border-radius:var(--radius-pill); padding:0.45em 0.85em; white-space:nowrap;
  transition:all var(--dur-fast) var(--ease-out); }
button.bdl-tag{ cursor:pointer; }
button.bdl-tag:hover{ border-color:var(--brown-500); background:var(--bg-subtle); }
.bdl-tag--selected{ background:var(--brand-soft); border-color:var(--brand); color:var(--terracotta-700);
  font-weight:var(--weight-semibold); }
button.bdl-tag--selected:hover{ background:var(--terracotta-100); }
.bdl-tag--solid{ background:var(--charcoal-900); border-color:var(--charcoal-900); color:var(--cream-50); }
.bdl-tag__x{ display:grid; place-items:center; width:16px; height:16px; border-radius:50%;
  margin-right:-0.2em; opacity:0.6; }
.bdl-tag__x:hover{ opacity:1; background:rgba(0,0,0,0.08); }
.bdl-tag__ico{ display:flex; color:var(--text-muted); }
.bdl-tag--selected .bdl-tag__ico{ color:var(--brand); }
`;

function useStyleOnce(id, text){
  React.useEffect(() => {
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id; el.textContent = text; document.head.appendChild(el);
  }, []);
}

export function Tag({ children, selected = false, variant = 'default', icon, onRemove, className = '', ...rest }) {
  useStyleOnce('bdl-tag-css', css);
  const Tag = rest.onClick ? 'button' : 'span';
  const cls = ['bdl-tag', selected && 'bdl-tag--selected', variant === 'solid' && 'bdl-tag--solid', className].filter(Boolean).join(' ');
  return (
    <Tag className={cls} {...(Tag === 'button' ? { type: 'button' } : {})} {...rest}>
      {icon && <span className="bdl-tag__ico" aria-hidden="true">{icon}</span>}
      {children}
      {onRemove && (
        <span className="bdl-tag__x" role="button" aria-label="Remove"
              onClick={(e) => { e.stopPropagation(); onRemove(e); }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
        </span>
      )}
    </Tag>
  );
}
