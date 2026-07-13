import React from 'react';

const css = `
.bdl-field{ display:flex; flex-direction:column; gap:0.4rem; font-family:var(--font-sans); }
.bdl-field__label{ font-size:var(--text-sm); font-weight:var(--weight-semibold);
  color:var(--text-strong); letter-spacing:var(--tracking-snug); }
.bdl-field__req{ color:var(--brand); margin-left:2px; }
.bdl-field__hint{ font-size:var(--text-xs); color:var(--text-muted); }
.bdl-field__hint--error{ color:var(--danger-strong); font-weight:var(--weight-medium); }
.bdl-inputwrap{ position:relative; display:flex; align-items:center; }
.bdl-input{
  width:100%; font-family:inherit; font-size:var(--text-base); color:var(--text-strong);
  background:var(--surface-raised); border:1.5px solid var(--border-default);
  border-radius:var(--radius-md); height:var(--control-md); padding:0 0.875rem;
  transition:border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out);
}
.bdl-input::placeholder{ color:var(--text-subtle); }
.bdl-input:hover{ border-color:var(--border-strong); }
.bdl-input:focus{ outline:none; border-color:var(--brand); box-shadow:var(--shadow-focus); }
.bdl-input--sm{ height:var(--control-sm); font-size:var(--text-sm); border-radius:var(--radius-sm); }
.bdl-input--lg{ height:var(--control-lg); font-size:var(--text-lead); }
.bdl-input[disabled]{ background:var(--bg-subtle); color:var(--text-muted); cursor:not-allowed; }
.bdl-input--has-left{ padding-left:2.5rem; }
.bdl-input--has-right{ padding-right:2.5rem; }
.bdl-input--error{ border-color:var(--danger); }
.bdl-input--error:focus{ box-shadow:0 0 0 3px var(--danger-soft); }
.bdl-input--ta{ height:auto; min-height:7rem; padding:0.65rem 0.875rem; line-height:var(--leading-normal); resize:vertical; }
.bdl-inputwrap__icon{ position:absolute; display:flex; color:var(--text-muted); pointer-events:none; }
.bdl-inputwrap__icon--l{ left:0.85rem; }
.bdl-inputwrap__icon--r{ right:0.85rem; }
`;

function useStyleOnce(id, text){
  React.useEffect(() => {
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id; el.textContent = text; document.head.appendChild(el);
  }, []);
}

let _uid = 0;
function useId(provided){
  const [id] = React.useState(() => provided || `bdl-f-${++_uid}`);
  return id;
}

export function Input({
  label, hint, error, required = false, size = 'md',
  iconLeft, iconRight, textarea = false, id: idProp, className = '', ...rest
}) {
  useStyleOnce('bdl-input-css', css);
  const id = useId(idProp);
  const Tag = textarea ? 'textarea' : 'input';
  const inputCls = [
    'bdl-input', size !== 'md' && `bdl-input--${size}`,
    iconLeft && 'bdl-input--has-left', iconRight && 'bdl-input--has-right',
    error && 'bdl-input--error', textarea && 'bdl-input--ta', className,
  ].filter(Boolean).join(' ');
  return (
    <div className="bdl-field">
      {label && (
        <label className="bdl-field__label" htmlFor={id}>
          {label}{required && <span className="bdl-field__req">*</span>}
        </label>
      )}
      <div className="bdl-inputwrap">
        {iconLeft && <span className="bdl-inputwrap__icon bdl-inputwrap__icon--l" aria-hidden="true">{iconLeft}</span>}
        <Tag id={id} className={inputCls} aria-invalid={!!error || undefined} {...rest} />
        {iconRight && <span className="bdl-inputwrap__icon bdl-inputwrap__icon--r" aria-hidden="true">{iconRight}</span>}
      </div>
      {error
        ? <span className="bdl-field__hint bdl-field__hint--error">{error}</span>
        : hint && <span className="bdl-field__hint">{hint}</span>}
    </div>
  );
}
