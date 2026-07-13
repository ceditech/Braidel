import React from 'react';

const css = `
.bdl-switch{ display:inline-flex; align-items:center; gap:0.65rem; font-family:var(--font-sans);
  cursor:pointer; user-select:none; color:var(--text-body); font-size:var(--text-base); }
.bdl-switch input{ position:absolute; opacity:0; width:0; height:0; }
.bdl-switch__track{ flex:none; width:42px; height:24px; border-radius:var(--radius-pill);
  background:var(--sand-300); padding:2px; transition:background var(--dur-base) var(--ease-out); }
.bdl-switch__thumb{ width:20px; height:20px; border-radius:50%; background:#fff; box-shadow:var(--shadow-sm);
  transform:translateX(0); transition:transform var(--dur-base) var(--ease-spring); }
.bdl-switch input:checked + .bdl-switch__track{ background:var(--brand); }
.bdl-switch input:checked + .bdl-switch__track .bdl-switch__thumb{ transform:translateX(18px); }
.bdl-switch input:focus-visible + .bdl-switch__track{ box-shadow:var(--shadow-focus); }
.bdl-switch input:disabled + .bdl-switch__track{ opacity:0.5; }
.bdl-switch--sm .bdl-switch__track{ width:34px; height:20px; }
.bdl-switch--sm .bdl-switch__thumb{ width:16px; height:16px; }
.bdl-switch--sm input:checked + .bdl-switch__track .bdl-switch__thumb{ transform:translateX(14px); }
`;

function useStyleOnce(id, text){
  React.useEffect(() => {
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id; el.textContent = text; document.head.appendChild(el);
  }, []);
}

export function Switch({ label, size = 'md', className = '', ...rest }) {
  useStyleOnce('bdl-switch-css', css);
  return (
    <label className={['bdl-switch', size === 'sm' && 'bdl-switch--sm', className].filter(Boolean).join(' ')}>
      <input type="checkbox" role="switch" {...rest} />
      <span className="bdl-switch__track" aria-hidden="true"><span className="bdl-switch__thumb" /></span>
      {label && <span>{label}</span>}
    </label>
  );
}
