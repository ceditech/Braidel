import React from 'react';

const css = `
.bdl-btn{
  --_bg: var(--brand); --_fg: var(--brand-on); --_bd: transparent;
  display:inline-flex; align-items:center; justify-content:center; gap:0.5em;
  font-family:var(--font-sans); font-weight:var(--weight-semibold);
  line-height:1; letter-spacing:var(--tracking-snug); white-space:nowrap;
  border:1.5px solid var(--_bd); background:var(--_bg); color:var(--_fg);
  border-radius:var(--radius-md); cursor:pointer; text-decoration:none;
  transition:transform var(--dur-fast) var(--ease-out),
             background var(--dur-fast) var(--ease-out),
             box-shadow var(--dur-fast) var(--ease-out),
             border-color var(--dur-fast) var(--ease-out);
  -webkit-tap-highlight-color:transparent; user-select:none;
}
.bdl-btn:focus-visible{ outline:none; box-shadow:var(--shadow-focus); }
.bdl-btn:active{ transform:translateY(1px) scale(0.99); }
.bdl-btn[disabled],.bdl-btn[aria-disabled="true"]{
  opacity:0.5; cursor:not-allowed; pointer-events:none;
}
/* sizes */
.bdl-btn--sm{ height:var(--control-sm); padding:0 0.875rem; font-size:var(--text-sm); border-radius:var(--radius-sm); }
.bdl-btn--md{ height:var(--control-md); padding:0 1.25rem; font-size:var(--text-base); }
.bdl-btn--lg{ height:var(--control-lg); padding:0 1.6rem; font-size:var(--text-lead); }
.bdl-btn--block{ width:100%; }
.bdl-btn--pill{ border-radius:var(--radius-pill); }
/* variants */
.bdl-btn--primary{ box-shadow:var(--shadow-sm); }
.bdl-btn--primary:hover{ --_bg:var(--brand-hover); box-shadow:var(--shadow-md); }
.bdl-btn--secondary{ --_bg:var(--secondary); --_fg:var(--charcoal-900); box-shadow:var(--shadow-sm); }
.bdl-btn--secondary:hover{ --_bg:var(--secondary-hover); --_fg:var(--cream-50); }
.bdl-btn--outline{ --_bg:transparent; --_fg:var(--text-strong); --_bd:var(--border-strong); }
.bdl-btn--outline:hover{ --_bg:var(--bg-subtle); --_bd:var(--brown-500); }
.bdl-btn--ghost{ --_bg:transparent; --_fg:var(--text-body); }
.bdl-btn--ghost:hover{ --_bg:var(--bg-subtle); }
.bdl-btn--danger{ --_bg:var(--danger); --_fg:#fff; }
.bdl-btn--danger:hover{ --_bg:var(--danger-strong); }
.bdl-btn--icon{ padding:0; aspect-ratio:1; }
.bdl-btn__spin{ width:1em; height:1em; border-radius:50%;
  border:2px solid currentColor; border-top-color:transparent;
  animation:bdl-spin 0.6s linear infinite; }
@keyframes bdl-spin{ to{ transform:rotate(360deg); } }
`;

function useStyleOnce(id, text){
  React.useEffect(() => {
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id; el.textContent = text;
    document.head.appendChild(el);
  }, []);
}

export function Button({
  children, variant = 'primary', size = 'md', as = 'button',
  block = false, pill = false, icon = false, loading = false,
  disabled = false, iconLeft, iconRight, className = '', ...rest
}) {
  useStyleOnce('bdl-button-css', css);
  const Tag = as;
  const cls = [
    'bdl-btn', `bdl-btn--${variant}`, `bdl-btn--${size}`,
    block && 'bdl-btn--block', pill && 'bdl-btn--pill', icon && 'bdl-btn--icon',
    className,
  ].filter(Boolean).join(' ');
  return (
    <Tag className={cls} disabled={Tag === 'button' ? (disabled || loading) : undefined}
         aria-disabled={disabled || loading || undefined} {...rest}>
      {loading && <span className="bdl-btn__spin" aria-hidden="true" />}
      {!loading && iconLeft}
      {!icon && children}
      {icon && !loading && children}
      {!loading && iconRight}
    </Tag>
  );
}
