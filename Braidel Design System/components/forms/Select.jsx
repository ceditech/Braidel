import React from 'react';

const css = `
.bdl-selwrap{ position:relative; display:flex; flex-direction:column; gap:0.4rem; font-family:var(--font-sans); }
.bdl-sel__label{ font-size:var(--text-sm); font-weight:var(--weight-semibold); color:var(--text-strong); }
.bdl-sel__field{ position:relative; display:flex; align-items:center; }
.bdl-sel{
  appearance:none; -webkit-appearance:none; width:100%; font-family:inherit;
  font-size:var(--text-base); color:var(--text-strong); background:var(--surface-raised);
  border:1.5px solid var(--border-default); border-radius:var(--radius-md);
  height:var(--control-md); padding:0 2.5rem 0 0.875rem; cursor:pointer;
  transition:border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out);
}
.bdl-sel:hover{ border-color:var(--border-strong); }
.bdl-sel:focus{ outline:none; border-color:var(--brand); box-shadow:var(--shadow-focus); }
.bdl-sel--sm{ height:var(--control-sm); font-size:var(--text-sm); }
.bdl-sel[disabled]{ background:var(--bg-subtle); color:var(--text-muted); cursor:not-allowed; }
.bdl-sel__chev{ position:absolute; right:0.9rem; pointer-events:none; color:var(--text-muted); display:flex; }
`;

function useStyleOnce(id, text){
  React.useEffect(() => {
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id; el.textContent = text; document.head.appendChild(el);
  }, []);
}

let _sid = 0;

export function Select({ label, size = 'md', options, children, id: idProp, className = '', ...rest }) {
  useStyleOnce('bdl-select-css', css);
  const [id] = React.useState(() => idProp || `bdl-s-${++_sid}`);
  return (
    <div className="bdl-selwrap">
      {label && <label className="bdl-sel__label" htmlFor={id}>{label}</label>}
      <div className="bdl-sel__field">
        <select id={id} className={['bdl-sel', size !== 'md' && `bdl-sel--${size}`, className].filter(Boolean).join(' ')} {...rest}>
          {options
            ? options.map((o) => {
                const opt = typeof o === 'string' ? { value: o, label: o } : o;
                return <option key={opt.value} value={opt.value}>{opt.label}</option>;
              })
            : children}
        </select>
        <span className="bdl-sel__chev" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
      </div>
    </div>
  );
}
