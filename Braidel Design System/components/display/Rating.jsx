import React from 'react';

const css = `
.bdl-rating{ display:inline-flex; align-items:center; gap:0.5rem; font-family:var(--font-sans); }
.bdl-rating__stars{ display:inline-flex; gap:1px; color:var(--gold-500); }
.bdl-rating__stars svg{ display:block; }
.bdl-rating__empty{ color:var(--sand-300); }
.bdl-rating__val{ font-weight:var(--weight-bold); color:var(--text-strong); font-size:0.95em;
  font-variant-numeric:tabular-nums; }
.bdl-rating__count{ color:var(--text-muted); font-size:0.85em; }
`;

function useStyleOnce(id, text){
  React.useEffect(() => {
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id; el.textContent = text; document.head.appendChild(el);
  }, []);
}

const STAR_PATH = 'M10 1.6l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.2l-4.95 2.6.94-5.5-4-3.9 5.53-.8z';
function Star({ fill }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: '1em', height: '1em', lineHeight: 0 }} aria-hidden="true">
      <svg width="1em" height="1em" viewBox="0 0 20 20" style={{ display: 'block' }}>
        <path d={STAR_PATH} className="bdl-rating__empty" fill="currentColor" />
      </svg>
      <span style={{ position: 'absolute', inset: 0, width: `${Math.max(0, Math.min(1, fill)) * 100}%`, overflow: 'hidden', lineHeight: 0 }}>
        <svg width="1em" height="1em" viewBox="0 0 20 20" style={{ display: 'block' }}>
          <path d={STAR_PATH} fill="currentColor" />
        </svg>
      </span>
    </span>
  );
}

export function Rating({ value = 0, count, size = '1.05rem', showValue = true, className = '', ...rest }) {
  useStyleOnce('bdl-rating-css', css);
  const stars = [0,1,2,3,4].map((i) => Math.max(0, Math.min(1, value - i)));
  return (
    <span className={['bdl-rating', className].filter(Boolean).join(' ')} style={{ fontSize: size }}
          role="img" aria-label={`${value} out of 5`} {...rest}>
      <span className="bdl-rating__stars">{stars.map((f, i) => <Star key={i} fill={f} />)}</span>
      {showValue && <span className="bdl-rating__val">{value.toFixed(1)}</span>}
      {count != null && <span className="bdl-rating__count">({count})</span>}
    </span>
  );
}
