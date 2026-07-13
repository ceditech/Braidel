import React from 'react';

const css = `
.bdl-check{ display:inline-flex; align-items:flex-start; gap:0.6rem; font-family:var(--font-sans);
  cursor:pointer; user-select:none; color:var(--text-body); font-size:var(--text-base); }
.bdl-check input{ position:absolute; opacity:0; width:0; height:0; }
.bdl-check__box{ flex:none; width:20px; height:20px; margin-top:1px;
  border:1.5px solid var(--border-strong); background:var(--surface-raised);
  border-radius:6px; display:grid; place-items:center; color:#fff;
  transition:background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out); }
.bdl-check--radio .bdl-check__box{ border-radius:50%; }
.bdl-check__box svg{ opacity:0; transform:scale(0.6); transition:all var(--dur-fast) var(--ease-spring); }
.bdl-check input:checked + .bdl-check__box{ background:var(--brand); border-color:var(--brand); }
.bdl-check input:checked + .bdl-check__box svg{ opacity:1; transform:scale(1); }
.bdl-check input:focus-visible + .bdl-check__box{ box-shadow:var(--shadow-focus); }
.bdl-check:hover .bdl-check__box{ border-color:var(--brand); }
.bdl-check input:disabled + .bdl-check__box{ opacity:0.5; }
.bdl-check__dot{ width:8px; height:8px; border-radius:50%; background:#fff; opacity:0; transform:scale(0.4);
  transition:all var(--dur-fast) var(--ease-spring); }
.bdl-check input:checked + .bdl-check__box .bdl-check__dot{ opacity:1; transform:scale(1); }
.bdl-check__text{ display:flex; flex-direction:column; gap:1px; line-height:var(--leading-snug); padding-top:1px; }
.bdl-check__desc{ font-size:var(--text-sm); color:var(--text-muted); }
`;

function useStyleOnce(id, text){
  React.useEffect(() => {
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id; el.textContent = text; document.head.appendChild(el);
  }, []);
}

export function Checkbox({ label, description, radio = false, className = '', ...rest }) {
  useStyleOnce('bdl-check-css', css);
  return (
    <label className={['bdl-check', radio && 'bdl-check--radio', className].filter(Boolean).join(' ')}>
      <input type={radio ? 'radio' : 'checkbox'} {...rest} />
      <span className="bdl-check__box" aria-hidden="true">
        {radio
          ? <span className="bdl-check__dot" />
          : <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 6.8l2.6 2.6 5-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>}
      </span>
      {(label || description) && (
        <span className="bdl-check__text">
          {label}
          {description && <span className="bdl-check__desc">{description}</span>}
        </span>
      )}
    </label>
  );
}
