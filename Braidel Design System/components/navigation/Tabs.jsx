import React from 'react';

const css = `
.bdl-tabs{ display:flex; gap:0.25rem; font-family:var(--font-sans); border-bottom:1.5px solid var(--border-subtle); }
.bdl-tab{ position:relative; appearance:none; border:none; background:none; cursor:pointer;
  font-family:inherit; font-size:var(--text-base); font-weight:var(--weight-semibold);
  color:var(--text-muted); padding:0.75rem 0.9rem; margin-bottom:-1.5px; display:inline-flex; align-items:center; gap:0.45rem;
  border-bottom:2.5px solid transparent; transition:color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out); }
.bdl-tab:hover{ color:var(--text-strong); }
.bdl-tab--active{ color:var(--brand); border-bottom-color:var(--brand); }
.bdl-tab:focus-visible{ outline:none; box-shadow:var(--shadow-focus); border-radius:var(--radius-xs); }
.bdl-tab__count{ font-size:var(--text-xs); font-weight:var(--weight-bold); background:var(--bg-sunken);
  color:var(--espresso-700); border-radius:var(--radius-pill); padding:0.1em 0.5em; min-width:1.6em; text-align:center; }
.bdl-tab--active .bdl-tab__count{ background:var(--brand-soft); color:var(--terracotta-700); }
/* pill style */
.bdl-tabs--pill{ border:none; gap:0.4rem; background:var(--bg-sunken); padding:4px; border-radius:var(--radius-pill); display:inline-flex; }
.bdl-tabs--pill .bdl-tab{ border:none; margin:0; border-radius:var(--radius-pill); padding:0.5rem 1rem; }
.bdl-tabs--pill .bdl-tab--active{ background:var(--surface-raised); color:var(--text-strong); box-shadow:var(--shadow-sm); }
`;

function useStyleOnce(id, text){
  React.useEffect(() => {
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id; el.textContent = text; document.head.appendChild(el);
  }, []);
}

export function Tabs({ items = [], value, onChange, variant = 'underline', className = '' }) {
  useStyleOnce('bdl-tabs-css', css);
  const [internal, setInternal] = React.useState(value ?? items[0]?.value);
  const active = value !== undefined ? value : internal;
  const select = (v) => { if (value === undefined) setInternal(v); onChange && onChange(v); };
  return (
    <div className={['bdl-tabs', variant === 'pill' && 'bdl-tabs--pill', className].filter(Boolean).join(' ')} role="tablist">
      {items.map((it) => (
        <button key={it.value} role="tab" aria-selected={active === it.value} type="button"
                className={['bdl-tab', active === it.value && 'bdl-tab--active'].filter(Boolean).join(' ')}
                onClick={() => select(it.value)}>
          {it.icon}{it.label}
          {it.count != null && <span className="bdl-tab__count">{it.count}</span>}
        </button>
      ))}
    </div>
  );
}
