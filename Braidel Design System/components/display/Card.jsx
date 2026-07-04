import React from 'react';

const css = `
.bdl-card{ background:var(--surface-card); border:1px solid var(--border-subtle);
  border-radius:var(--radius-lg); box-shadow:var(--shadow-sm); overflow:hidden;
  display:flex; flex-direction:column; font-family:var(--font-sans); color:var(--text-body);
  transition:transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out),
             border-color var(--dur-base) var(--ease-out); }
.bdl-card--pad{ padding:var(--space-6); }
.bdl-card--flat{ box-shadow:none; }
.bdl-card--raised{ box-shadow:var(--shadow-md); border-color:transparent; }
a.bdl-card, .bdl-card--interactive{ cursor:pointer; text-decoration:none; }
a.bdl-card:hover, .bdl-card--interactive:hover{
  transform:translateY(-3px); box-shadow:var(--shadow-lg); border-color:var(--border-default); }
.bdl-card__media{ display:block; width:100%; aspect-ratio:4/3; object-fit:cover; background:var(--bg-sunken); }
.bdl-card__body{ padding:var(--space-5); display:flex; flex-direction:column; gap:var(--space-2); flex:1; }
`;

function useStyleOnce(id, text){
  React.useEffect(() => {
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id; el.textContent = text; document.head.appendChild(el);
  }, []);
}

export function Card({
  children, variant = 'default', padded = false, interactive = false,
  as = 'div', className = '', ...rest
}) {
  useStyleOnce('bdl-card-css', css);
  const Tag = as;
  const cls = [
    'bdl-card', variant !== 'default' && `bdl-card--${variant}`,
    padded && 'bdl-card--pad', interactive && 'bdl-card--interactive', className,
  ].filter(Boolean).join(' ');
  return <Tag className={cls} {...rest}>{children}</Tag>;
}

export function CardBody({ children, className = '', ...rest }) {
  useStyleOnce('bdl-card-css', css);
  return <div className={['bdl-card__body', className].filter(Boolean).join(' ')} {...rest}>{children}</div>;
}

export function CardMedia({ src, alt = '', className = '', ...rest }) {
  useStyleOnce('bdl-card-css', css);
  return <img className={['bdl-card__media', className].filter(Boolean).join(' ')} src={src} alt={alt} {...rest} />;
}
