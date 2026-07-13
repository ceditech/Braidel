/* @ds-bundle: {"format":3,"namespace":"BraidelDesignSystem_a13fae","components":[{"name":"Avatar","sourcePath":"components/display/Avatar.jsx"},{"name":"AvatarGroup","sourcePath":"components/display/Avatar.jsx"},{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"CardBody","sourcePath":"components/display/Card.jsx"},{"name":"CardMedia","sourcePath":"components/display/Card.jsx"},{"name":"Rating","sourcePath":"components/display/Rating.jsx"},{"name":"Tag","sourcePath":"components/display/Tag.jsx"},{"name":"Alert","sourcePath":"components/feedback/Alert.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/display/Avatar.jsx":"e92a33bf5a0a","components/display/Badge.jsx":"d32e11bf9d5f","components/display/Card.jsx":"1def3dd320c6","components/display/Rating.jsx":"7f8294bc183b","components/display/Tag.jsx":"c6db366843dd","components/feedback/Alert.jsx":"b1bfb151f780","components/forms/Button.jsx":"f4acb210b440","components/forms/Checkbox.jsx":"e5f11887ef7f","components/forms/Input.jsx":"95cd3b539c5f","components/forms/Select.jsx":"0732df3f099d","components/forms/Switch.jsx":"ec9d2f2540b3","components/navigation/Tabs.jsx":"469ff752318b","ui_kits/app/BraiderScreens.jsx":"b82371568e7c","ui_kits/app/Dashboards.jsx":"202fa444264d","ui_kits/app/Messages.jsx":"b4797267d00d","ui_kits/app/SalonScreens.jsx":"582614eb421e","ui_kits/app/shell.jsx":"03afa385fd57","ui_kits/marketing/BraiderProfile.jsx":"80ffa2422305","ui_kits/marketing/FindBraiders.jsx":"c142df4b2b27","ui_kits/marketing/Landing.jsx":"34dc22046b2a","ui_kits/marketing/chrome.jsx":"70196af2cf5e","ui_kits/shared/Icon.jsx":"490ef66c236b"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.BraidelDesignSystem_a13fae = window.BraidelDesignSystem_a13fae || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/display/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const css = `
.bdl-avatar{ position:relative; display:inline-flex; flex:none; align-items:center; justify-content:center;
  border-radius:50%; overflow:hidden; font-family:var(--font-display); font-weight:var(--weight-semibold);
  color:var(--cream-50); background:var(--brown-500); user-select:none; }
.bdl-avatar img{ width:100%; height:100%; object-fit:cover; }
.bdl-avatar--ring{ box-shadow:0 0 0 2px var(--surface-card), 0 0 0 4px var(--brand); }
.bdl-avatar--xs{ width:28px; height:28px; font-size:0.7rem; }
.bdl-avatar--sm{ width:36px; height:36px; font-size:0.82rem; }
.bdl-avatar--md{ width:48px; height:48px; font-size:1.05rem; }
.bdl-avatar--lg{ width:64px; height:64px; font-size:1.4rem; }
.bdl-avatar--xl{ width:96px; height:96px; font-size:2rem; }
.bdl-avatar__status{ position:absolute; right:0; bottom:0; width:28%; height:28%;
  border-radius:50%; border:2px solid var(--surface-card); background:var(--success); }
.bdl-avatar__status--off{ background:var(--text-subtle); }
.bdl-grp{ display:inline-flex; }
.bdl-grp .bdl-avatar{ box-shadow:0 0 0 2px var(--surface-card); margin-left:-10px; }
.bdl-grp .bdl-avatar:first-child{ margin-left:0; }
`;
const TONES = ['var(--brown-500)', 'var(--terracotta-500)', 'var(--gold-600)', 'var(--sage-500)', 'var(--teal-500)', 'var(--espresso-700)'];
function toneFor(str = '') {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = h * 31 + str.charCodeAt(i) >>> 0;
  return TONES[h % TONES.length];
}
function initials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0] || '').join('').toUpperCase();
}
function useStyleOnce(id, text) {
  React.useEffect(() => {
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = text;
    document.head.appendChild(el);
  }, []);
}
function Avatar({
  src,
  name = '',
  size = 'md',
  ring = false,
  status,
  className = '',
  ...rest
}) {
  useStyleOnce('bdl-avatar-css', css);
  const cls = ['bdl-avatar', `bdl-avatar--${size}`, ring && 'bdl-avatar--ring', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls,
    style: !src ? {
      background: toneFor(name)
    } : undefined
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name
  }) : initials(name), status && /*#__PURE__*/React.createElement("span", {
    className: `bdl-avatar__status${status === 'offline' ? ' bdl-avatar__status--off' : ''}`
  }));
}
function AvatarGroup({
  children,
  className = ''
}) {
  useStyleOnce('bdl-avatar-css', css);
  return /*#__PURE__*/React.createElement("span", {
    className: ['bdl-grp', className].filter(Boolean).join(' ')
  }, children);
}
Object.assign(__ds_scope, { Avatar, AvatarGroup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/display/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const css = `
.bdl-badge{ display:inline-flex; align-items:center; gap:0.35em; font-family:var(--font-sans);
  font-weight:var(--weight-semibold); font-size:var(--text-xs); line-height:1;
  letter-spacing:var(--tracking-snug); padding:0.35em 0.7em; border-radius:var(--radius-pill);
  white-space:nowrap; border:1px solid transparent; }
.bdl-badge__dot{ width:6px; height:6px; border-radius:50%; background:currentColor; }
.bdl-badge--neutral{ background:var(--bg-sunken); color:var(--espresso-700); }
.bdl-badge--brand{ background:var(--brand-soft); color:var(--terracotta-700); border-color:var(--brand-soft-border); }
.bdl-badge--gold{ background:var(--gold-50); color:var(--gold-700); border-color:var(--gold-100); }
.bdl-badge--success{ background:var(--success-soft); color:var(--success-strong); }
.bdl-badge--warning{ background:var(--warning-soft); color:var(--gold-700); }
.bdl-badge--danger{ background:var(--danger-soft); color:var(--danger-strong); }
.bdl-badge--info{ background:var(--info-soft); color:var(--teal-600); }
.bdl-badge--solid{ background:var(--brand); color:var(--brand-on); border-color:transparent; }
.bdl-badge--outline{ background:transparent; color:var(--text-body); border-color:var(--border-strong); }
`;
function useStyleOnce(id, text) {
  React.useEffect(() => {
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = text;
    document.head.appendChild(el);
  }, []);
}
function Badge({
  children,
  variant = 'neutral',
  dot = false,
  className = '',
  ...rest
}) {
  useStyleOnce('bdl-badge-css', css);
  return /*#__PURE__*/React.createElement("span", _extends({
    className: ['bdl-badge', `bdl-badge--${variant}`, className].filter(Boolean).join(' ')
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    className: "bdl-badge__dot",
    "aria-hidden": "true"
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function useStyleOnce(id, text) {
  React.useEffect(() => {
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = text;
    document.head.appendChild(el);
  }, []);
}
function Card({
  children,
  variant = 'default',
  padded = false,
  interactive = false,
  as = 'div',
  className = '',
  ...rest
}) {
  useStyleOnce('bdl-card-css', css);
  const Tag = as;
  const cls = ['bdl-card', variant !== 'default' && `bdl-card--${variant}`, padded && 'bdl-card--pad', interactive && 'bdl-card--interactive', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls
  }, rest), children);
}
function CardBody({
  children,
  className = '',
  ...rest
}) {
  useStyleOnce('bdl-card-css', css);
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ['bdl-card__body', className].filter(Boolean).join(' ')
  }, rest), children);
}
function CardMedia({
  src,
  alt = '',
  className = '',
  ...rest
}) {
  useStyleOnce('bdl-card-css', css);
  return /*#__PURE__*/React.createElement("img", _extends({
    className: ['bdl-card__media', className].filter(Boolean).join(' '),
    src: src,
    alt: alt
  }, rest));
}
Object.assign(__ds_scope, { Card, CardBody, CardMedia });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/Rating.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const css = `
.bdl-rating{ display:inline-flex; align-items:center; gap:0.5rem; font-family:var(--font-sans); }
.bdl-rating__stars{ display:inline-flex; gap:1px; color:var(--gold-500); }
.bdl-rating__stars svg{ display:block; }
.bdl-rating__empty{ color:var(--sand-300); }
.bdl-rating__val{ font-weight:var(--weight-bold); color:var(--text-strong); font-size:0.95em;
  font-variant-numeric:tabular-nums; }
.bdl-rating__count{ color:var(--text-muted); font-size:0.85em; }
`;
function useStyleOnce(id, text) {
  React.useEffect(() => {
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = text;
    document.head.appendChild(el);
  }, []);
}
const STAR_PATH = 'M10 1.6l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.2l-4.95 2.6.94-5.5-4-3.9 5.53-.8z';
function Star({
  fill
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-block',
      width: '1em',
      height: '1em',
      lineHeight: 0
    },
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "1em",
    height: "1em",
    viewBox: "0 0 20 20",
    style: {
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: STAR_PATH,
    className: "bdl-rating__empty",
    fill: "currentColor"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      inset: 0,
      width: `${Math.max(0, Math.min(1, fill)) * 100}%`,
      overflow: 'hidden',
      lineHeight: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "1em",
    height: "1em",
    viewBox: "0 0 20 20",
    style: {
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: STAR_PATH,
    fill: "currentColor"
  }))));
}
function Rating({
  value = 0,
  count,
  size = '1.05rem',
  showValue = true,
  className = '',
  ...rest
}) {
  useStyleOnce('bdl-rating-css', css);
  const stars = [0, 1, 2, 3, 4].map(i => Math.max(0, Math.min(1, value - i)));
  return /*#__PURE__*/React.createElement("span", _extends({
    className: ['bdl-rating', className].filter(Boolean).join(' '),
    style: {
      fontSize: size
    },
    role: "img",
    "aria-label": `${value} out of 5`
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "bdl-rating__stars"
  }, stars.map((f, i) => /*#__PURE__*/React.createElement(Star, {
    key: i,
    fill: f
  }))), showValue && /*#__PURE__*/React.createElement("span", {
    className: "bdl-rating__val"
  }, value.toFixed(1)), count != null && /*#__PURE__*/React.createElement("span", {
    className: "bdl-rating__count"
  }, "(", count, ")"));
}
Object.assign(__ds_scope, { Rating });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Rating.jsx", error: String((e && e.message) || e) }); }

// components/display/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function useStyleOnce(id, text) {
  React.useEffect(() => {
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = text;
    document.head.appendChild(el);
  }, []);
}
function Tag({
  children,
  selected = false,
  variant = 'default',
  icon,
  onRemove,
  className = '',
  ...rest
}) {
  useStyleOnce('bdl-tag-css', css);
  const Tag = rest.onClick ? 'button' : 'span';
  const cls = ['bdl-tag', selected && 'bdl-tag--selected', variant === 'solid' && 'bdl-tag--solid', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls
  }, Tag === 'button' ? {
    type: 'button'
  } : {}, rest), icon && /*#__PURE__*/React.createElement("span", {
    className: "bdl-tag__ico",
    "aria-hidden": "true"
  }, icon), children, onRemove && /*#__PURE__*/React.createElement("span", {
    className: "bdl-tag__x",
    role: "button",
    "aria-label": "Remove",
    onClick: e => {
      e.stopPropagation();
      onRemove(e);
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "10",
    height: "10",
    viewBox: "0 0 10 10",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 1l8 8M9 1l-8 8",
    stroke: "currentColor",
    "stroke-width": "1.6",
    "stroke-linecap": "round"
  }))));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Alert.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function useStyleOnce(id, text) {
  React.useEffect(() => {
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = text;
    document.head.appendChild(el);
  }, []);
}
const ICONS = {
  info: 'M10 9v5M10 6.2h.01M10 18a8 8 0 110-16 8 8 0 010 16z',
  success: 'M6 10.5l2.6 2.6L14.5 7M10 18a8 8 0 110-16 8 8 0 010 16z',
  warning: 'M10 7.5v3.6M10 14.2h.01M8.6 3.2L2.3 14a1.6 1.6 0 001.4 2.4h12.6A1.6 1.6 0 0017.7 14L11.4 3.2a1.6 1.6 0 00-2.8 0z',
  danger: 'M10 7v4M10 14.5h.01M10 18a8 8 0 110-16 8 8 0 010 16z',
  brand: 'M10 9v5M10 6.2h.01M10 18a8 8 0 110-16 8 8 0 010 16z'
};
function Alert({
  children,
  variant = 'info',
  title,
  icon,
  className = '',
  ...rest
}) {
  useStyleOnce('bdl-alert-css', css);
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ['bdl-alert', `bdl-alert--${variant}`, className].filter(Boolean).join(' '),
    role: "status"
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "bdl-alert__icon",
    "aria-hidden": "true"
  }, icon || /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 20 20",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: ICONS[variant],
    stroke: "currentColor",
    "stroke-width": "1.6",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "bdl-alert__body"
  }, title && /*#__PURE__*/React.createElement("span", {
    className: "bdl-alert__title"
  }, title), children && /*#__PURE__*/React.createElement("span", {
    className: "bdl-alert__msg"
  }, children)));
}
Object.assign(__ds_scope, { Alert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Alert.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function useStyleOnce(id, text) {
  React.useEffect(() => {
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = text;
    document.head.appendChild(el);
  }, []);
}
function Button({
  children,
  variant = 'primary',
  size = 'md',
  as = 'button',
  block = false,
  pill = false,
  icon = false,
  loading = false,
  disabled = false,
  iconLeft,
  iconRight,
  className = '',
  ...rest
}) {
  useStyleOnce('bdl-button-css', css);
  const Tag = as;
  const cls = ['bdl-btn', `bdl-btn--${variant}`, `bdl-btn--${size}`, block && 'bdl-btn--block', pill && 'bdl-btn--pill', icon && 'bdl-btn--icon', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls,
    disabled: Tag === 'button' ? disabled || loading : undefined,
    "aria-disabled": disabled || loading || undefined
  }, rest), loading && /*#__PURE__*/React.createElement("span", {
    className: "bdl-btn__spin",
    "aria-hidden": "true"
  }), !loading && iconLeft, !icon && children, icon && !loading && children, !loading && iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function useStyleOnce(id, text) {
  React.useEffect(() => {
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = text;
    document.head.appendChild(el);
  }, []);
}
function Checkbox({
  label,
  description,
  radio = false,
  className = '',
  ...rest
}) {
  useStyleOnce('bdl-check-css', css);
  return /*#__PURE__*/React.createElement("label", {
    className: ['bdl-check', radio && 'bdl-check--radio', className].filter(Boolean).join(' ')
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: radio ? 'radio' : 'checkbox'
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "bdl-check__box",
    "aria-hidden": "true"
  }, radio ? /*#__PURE__*/React.createElement("span", {
    className: "bdl-check__dot"
  }) : /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 13 13",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2.5 6.8l2.6 2.6 5-6",
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  }))), (label || description) && /*#__PURE__*/React.createElement("span", {
    className: "bdl-check__text"
  }, label, description && /*#__PURE__*/React.createElement("span", {
    className: "bdl-check__desc"
  }, description)));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function useStyleOnce(id, text) {
  React.useEffect(() => {
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = text;
    document.head.appendChild(el);
  }, []);
}
let _uid = 0;
function useId(provided) {
  const [id] = React.useState(() => provided || `bdl-f-${++_uid}`);
  return id;
}
function Input({
  label,
  hint,
  error,
  required = false,
  size = 'md',
  iconLeft,
  iconRight,
  textarea = false,
  id: idProp,
  className = '',
  ...rest
}) {
  useStyleOnce('bdl-input-css', css);
  const id = useId(idProp);
  const Tag = textarea ? 'textarea' : 'input';
  const inputCls = ['bdl-input', size !== 'md' && `bdl-input--${size}`, iconLeft && 'bdl-input--has-left', iconRight && 'bdl-input--has-right', error && 'bdl-input--error', textarea && 'bdl-input--ta', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", {
    className: "bdl-field"
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "bdl-field__label",
    htmlFor: id
  }, label, required && /*#__PURE__*/React.createElement("span", {
    className: "bdl-field__req"
  }, "*")), /*#__PURE__*/React.createElement("div", {
    className: "bdl-inputwrap"
  }, iconLeft && /*#__PURE__*/React.createElement("span", {
    className: "bdl-inputwrap__icon bdl-inputwrap__icon--l",
    "aria-hidden": "true"
  }, iconLeft), /*#__PURE__*/React.createElement(Tag, _extends({
    id: id,
    className: inputCls,
    "aria-invalid": !!error || undefined
  }, rest)), iconRight && /*#__PURE__*/React.createElement("span", {
    className: "bdl-inputwrap__icon bdl-inputwrap__icon--r",
    "aria-hidden": "true"
  }, iconRight)), error ? /*#__PURE__*/React.createElement("span", {
    className: "bdl-field__hint bdl-field__hint--error"
  }, error) : hint && /*#__PURE__*/React.createElement("span", {
    className: "bdl-field__hint"
  }, hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function useStyleOnce(id, text) {
  React.useEffect(() => {
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = text;
    document.head.appendChild(el);
  }, []);
}
let _sid = 0;
function Select({
  label,
  size = 'md',
  options,
  children,
  id: idProp,
  className = '',
  ...rest
}) {
  useStyleOnce('bdl-select-css', css);
  const [id] = React.useState(() => idProp || `bdl-s-${++_sid}`);
  return /*#__PURE__*/React.createElement("div", {
    className: "bdl-selwrap"
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "bdl-sel__label",
    htmlFor: id
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "bdl-sel__field"
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: id,
    className: ['bdl-sel', size !== 'md' && `bdl-sel--${size}`, className].filter(Boolean).join(' ')
  }, rest), options ? options.map(o => {
    const opt = typeof o === 'string' ? {
      value: o,
      label: o
    } : o;
    return /*#__PURE__*/React.createElement("option", {
      key: opt.value,
      value: opt.value
    }, opt.label);
  }) : children), /*#__PURE__*/React.createElement("span", {
    className: "bdl-sel__chev",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 6l4 4 4-4",
    stroke: "currentColor",
    "stroke-width": "1.6",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  })))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function useStyleOnce(id, text) {
  React.useEffect(() => {
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = text;
    document.head.appendChild(el);
  }, []);
}
function Switch({
  label,
  size = 'md',
  className = '',
  ...rest
}) {
  useStyleOnce('bdl-switch-css', css);
  return /*#__PURE__*/React.createElement("label", {
    className: ['bdl-switch', size === 'sm' && 'bdl-switch--sm', className].filter(Boolean).join(' ')
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    role: "switch"
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "bdl-switch__track",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bdl-switch__thumb"
  })), label && /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
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
function useStyleOnce(id, text) {
  React.useEffect(() => {
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = text;
    document.head.appendChild(el);
  }, []);
}
function Tabs({
  items = [],
  value,
  onChange,
  variant = 'underline',
  className = ''
}) {
  useStyleOnce('bdl-tabs-css', css);
  const [internal, setInternal] = React.useState(value ?? items[0]?.value);
  const active = value !== undefined ? value : internal;
  const select = v => {
    if (value === undefined) setInternal(v);
    onChange && onChange(v);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: ['bdl-tabs', variant === 'pill' && 'bdl-tabs--pill', className].filter(Boolean).join(' '),
    role: "tablist"
  }, items.map(it => /*#__PURE__*/React.createElement("button", {
    key: it.value,
    role: "tab",
    "aria-selected": active === it.value,
    type: "button",
    className: ['bdl-tab', active === it.value && 'bdl-tab--active'].filter(Boolean).join(' '),
    onClick: () => select(it.value)
  }, it.icon, it.label, it.count != null && /*#__PURE__*/React.createElement("span", {
    className: "bdl-tab__count"
  }, it.count))));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/BraiderScreens.jsx
try { (() => {
// Braider: Find work list + Applications tracker
function FindWork({
  go
}) {
  const {
    Card,
    Badge,
    Button,
    Input,
    Select,
    Tag
  } = window.BraidelDesignSystem_a13fae;
  const {
    Photo
  } = window;
  const Icon = window.Icon;
  const jobs = [{
    t: 'Weekend knotless specialist',
    salon: 'Crown & Coils',
    city: 'Atlanta, GA',
    pay: '$28–35/hr',
    d: '2.3 mi',
    type: 'Part-time',
    specs: ['Knotless', 'Feed-in'],
    tone: 0,
    posted: '2h ago'
  }, {
    t: 'Senior braider — full time',
    salon: 'The Braid Bar',
    city: 'Decatur, GA',
    pay: '$45k–60k',
    d: '5.1 mi',
    type: 'Full-time',
    specs: ['Box braids', 'Locs'],
    tone: 2,
    posted: '1d ago'
  }, {
    t: 'Event braider (1 day)',
    salon: 'Halo Studio',
    city: 'Atlanta, GA',
    pay: '$320 flat',
    d: '3.8 mi',
    type: 'Single event',
    specs: ['Goddess'],
    tone: 4,
    posted: '3d ago'
  }, {
    t: 'Apprentice braider',
    salon: 'Roots & Crowns',
    city: 'Smyrna, GA',
    pay: '$18–24/hr',
    d: '7.2 mi',
    type: 'Part-time',
    specs: ['Cornrows', 'Stitch'],
    tone: 3,
    posted: '4d ago'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginBottom: 22,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '2 1 240px'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Role, salon or style",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 18
    })
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 150px'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Within 10 mi",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "map-pin",
      size: 18
    })
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 150px'
    }
  }, /*#__PURE__*/React.createElement(Select, {
    options: ['Any type', 'Part-time', 'Full-time', 'Single event']
  })), /*#__PURE__*/React.createElement(Button, {
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "sliders",
      size: 17
    })
  }, "Filters")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 18
    }
  }, jobs.map(j => /*#__PURE__*/React.createElement(Card, {
    key: j.t,
    padded: true,
    interactive: true,
    onClick: () => go('messages')
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 52,
      height: 52,
      borderRadius: 14,
      overflow: 'hidden',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    seed: j.tone,
    aspect: "1/1"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 17,
      color: 'var(--charcoal-900)'
    }
  }, j.t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--text-muted)'
    }
  }, j.salon, " \xB7 ", j.city)), /*#__PURE__*/React.createElement(Badge, {
    variant: "neutral"
  }, j.type)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      margin: '14px 0'
    }
  }, j.specs.map(s => /*#__PURE__*/React.createElement(Tag, {
    key: s
  }, s))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 14,
      borderTop: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      color: 'var(--text-strong)'
    }
  }, j.pay), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map-pin",
    size: 13
  }), j.d), /*#__PURE__*/React.createElement("span", null, j.posted)), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: e => {
      e.stopPropagation();
      go('messages');
    }
  }, "Apply now"))))));
}
function Applications() {
  const {
    Card,
    Avatar,
    Badge,
    Button,
    Tabs
  } = window.BraidelDesignSystem_a13fae;
  const Icon = window.Icon;
  const apps = [{
    t: 'Lead stylist',
    salon: 'Halo Studio',
    when: 'Applied 2 days ago',
    st: 'Shortlisted',
    v: 'info',
    tone: 4
  }, {
    t: 'Weekend braider',
    salon: 'Crown & Coils',
    when: 'Applied 3 days ago',
    st: 'Under review',
    v: 'warning',
    tone: 0
  }, {
    t: 'Full-time braider',
    salon: 'The Braid Bar',
    when: 'Applied 1 week ago',
    st: 'Not selected',
    v: 'danger',
    tone: 2
  }, {
    t: 'Event braider',
    salon: 'Roots & Crowns',
    when: 'Applied 1 week ago',
    st: 'Matched',
    v: 'success',
    tone: 3
  }];
  const {
    Photo
  } = window;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 32,
      maxWidth: 820,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Card, null, apps.map((a, i) => /*#__PURE__*/React.createElement("div", {
    key: a.t,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '18px 22px',
      borderTop: i ? '1px solid var(--border-subtle)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 46,
      height: 46,
      borderRadius: 12,
      overflow: 'hidden',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    seed: a.tone,
    aspect: "1/1"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, a.t, " \xB7 ", a.salon), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, a.when)), /*#__PURE__*/React.createElement(Badge, {
    variant: a.v,
    dot: true
  }, a.st), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 15
    })
  }, "View")))));
}
window.FindWork = FindWork;
window.Applications = Applications;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/BraiderScreens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Dashboards.jsx
try { (() => {
// Salon + Braider dashboard home screens
function SalonDashboard({
  go
}) {
  const {
    Card,
    Badge,
    Button,
    Avatar,
    Rating
  } = window.BraidelDesignSystem_a13fae;
  const {
    Stat
  } = window;
  const Icon = window.Icon;
  const applicants = [{
    n: 'Imani Carter',
    s: 'Knotless · 5 yrs',
    r: 4.9,
    st: 'New',
    v: 'warning'
  }, {
    n: 'Zola Adeyemi',
    s: 'Senegalese · 7 yrs',
    r: 4.7,
    st: 'Shortlisted',
    v: 'info'
  }, {
    n: 'Nia Robinson',
    s: 'Goddess · 4 yrs',
    r: 4.9,
    st: 'Matched',
    v: 'success'
  }];
  const posts = [{
    t: 'Weekend knotless specialist',
    a: 9,
    type: 'Part-time',
    pay: '$28–35/hr'
  }, {
    t: 'Full-time senior braider',
    a: 14,
    type: 'Full-time',
    pay: '$45k–60k'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 32,
      display: 'flex',
      flexDirection: 'column',
      gap: 26
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(Stat, {
    icon: "briefcase",
    label: "Open opportunities",
    value: "3",
    tone: "brand"
  }), /*#__PURE__*/React.createElement(Stat, {
    icon: "users",
    label: "New applicants",
    value: "12",
    delta: "+5 today",
    tone: "gold"
  }), /*#__PURE__*/React.createElement(Stat, {
    icon: "check",
    label: "Matches made",
    value: "48",
    tone: "sage"
  }), /*#__PURE__*/React.createElement(Stat, {
    icon: "calendar",
    label: "Chairs filled",
    value: "86%",
    tone: "teal"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.3fr 1fr',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padded: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 19,
      margin: 0
    }
  }, "Your opportunities"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    onClick: () => go('posts'),
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 16
    })
  }, "Post")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, posts.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.t,
    onClick: () => go('applicants'),
    style: {
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: 14,
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, p.t), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      marginTop: 5
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: "neutral"
  }, p.type), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, p.pay))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 20,
      color: 'var(--brand)'
    }
  }, p.a), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, "applicants")), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 18
  }))))), /*#__PURE__*/React.createElement(Card, {
    padded: true
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 19,
      margin: '0 0 16px'
    }
  }, "Recent applicants"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, applicants.map(a => /*#__PURE__*/React.createElement("div", {
    key: a.n,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: a.n,
    size: "md"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, a.n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, a.s)), /*#__PURE__*/React.createElement(Badge, {
    variant: a.v
  }, a.st)))), /*#__PURE__*/React.createElement(Button, {
    block: true,
    variant: "ghost",
    style: {
      marginTop: 16
    },
    onClick: () => go('applicants')
  }, "View all applicants"))));
}
function BraiderDashboard({
  go
}) {
  const {
    Card,
    Badge,
    Button,
    Rating,
    Alert,
    Tag
  } = window.BraidelDesignSystem_a13fae;
  const {
    Stat,
    Photo
  } = window;
  const Icon = window.Icon;
  const jobs = [{
    t: 'Weekend knotless specialist',
    salon: 'Crown & Coils',
    city: 'Atlanta, GA',
    pay: '$28–35/hr',
    d: '2.3 mi',
    tone: 0
  }, {
    t: 'Senior braider — full time',
    salon: 'The Braid Bar',
    city: 'Decatur, GA',
    pay: '$45k–60k',
    d: '5.1 mi',
    tone: 2
  }, {
    t: 'Event braider (1 day)',
    salon: 'Halo Studio',
    city: 'Atlanta, GA',
    pay: '$320 flat',
    d: '3.8 mi',
    tone: 4
  }];
  const apps = [['Lead stylist — Halo Studio', 'Shortlisted', 'info'], ['Weekend braider — Coils', 'Under review', 'warning']];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 32,
      display: 'flex',
      flexDirection: 'column',
      gap: 26
    }
  }, /*#__PURE__*/React.createElement(Alert, {
    variant: "brand",
    title: "Your profile is 80% complete"
  }, "Add 2 more portfolio photos to rank higher in salon searches."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(Stat, {
    icon: "briefcase",
    label: "Jobs near you",
    value: "24",
    tone: "brand"
  }), /*#__PURE__*/React.createElement(Stat, {
    icon: "send",
    label: "Applications",
    value: "6",
    tone: "gold"
  }), /*#__PURE__*/React.createElement(Stat, {
    icon: "message",
    label: "Salon replies",
    value: "3",
    delta: "2 new",
    tone: "sage"
  }), /*#__PURE__*/React.createElement(Stat, {
    icon: "dollar",
    label: "Avg offer",
    value: "$32/hr",
    tone: "teal"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.3fr 1fr',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padded: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 19,
      margin: 0
    }
  }, "Work near you"), /*#__PURE__*/React.createElement("a", {
    onClick: () => go('posts'),
    style: {
      cursor: 'pointer',
      color: 'var(--brand)',
      fontWeight: 600,
      fontSize: 14
    }
  }, "See all")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, jobs.map(j => /*#__PURE__*/React.createElement("div", {
    key: j.t,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: 14,
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 46,
      height: 46,
      borderRadius: 12,
      overflow: 'hidden',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    seed: j.tone,
    aspect: "1/1"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, j.t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, j.salon, " \xB7 ", j.city, " \xB7 ", j.d)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      color: 'var(--text-strong)'
    }
  }, j.pay), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: () => go('posts')
  }, "Apply"))))), /*#__PURE__*/React.createElement(Card, {
    padded: true
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 19,
      margin: '0 0 16px'
    }
  }, "Your applications"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, apps.map(([t, st, v]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      padding: 14,
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      color: 'var(--text-strong)',
      fontSize: 14
    }
  }, t), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: v,
    dot: true
  }, st))))))));
}
window.SalonDashboard = SalonDashboard;
window.BraiderDashboard = BraiderDashboard;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Dashboards.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Messages.jsx
try { (() => {
// Messaging — conversation list + thread
function Messages({
  role
}) {
  const {
    Avatar,
    Badge,
    Button,
    Input
  } = window.BraidelDesignSystem_a13fae;
  const Icon = window.Icon;
  const convos = role === 'salon' ? [['Imani Carter', 'Yes, I can start next Saturday!', '2m', true, 0], ['Zola Adeyemi', 'Thanks for shortlisting me 🙏', '1h', false, 1], ['Nia Robinson', 'Sounds great, see you then.', '3h', false, 2], ['Tasha Bell', 'What hair brand do you provide?', '1d', false, 3]] : [['Crown & Coils', 'Can you start next Saturday?', '2m', true, 0], ['Halo Studio', 'We loved your portfolio!', '1h', false, 1], ['The Braid Bar', 'Following up on your application', '5h', false, 2]];
  const [sel, setSel] = React.useState(0);
  const thread = [{
    me: false,
    t: role === 'salon' ? 'Hi! I saw your knotless opportunity — I have 5 years of experience and full weekend availability.' : 'Hi! Thanks for applying. Your portfolio looks amazing — are you available weekends?',
    time: '10:24'
  }, {
    me: true,
    t: role === 'salon' ? 'Your portfolio is beautiful. Could you start next Saturday at 9am?' : 'Yes! I have full weekend availability and can start right away.',
    time: '10:31'
  }, {
    me: false,
    t: role === 'salon' ? 'Yes, I can start next Saturday!' : 'Perfect — can you start next Saturday at 9am?',
    time: '10:33'
  }];
  const active = convos[sel];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '320px 1fr',
      height: 'calc(100vh - 0px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--surface-card)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 18px 12px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 22,
      margin: '0 0 12px'
    }
  }, "Messages"), /*#__PURE__*/React.createElement(Input, {
    size: "sm",
    placeholder: "Search conversations",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 16
    })
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: 'auto',
      flex: 1
    }
  }, convos.map(([n, msg, time, unread, av], i) => /*#__PURE__*/React.createElement("div", {
    key: n,
    onClick: () => setSel(i),
    style: {
      display: 'flex',
      gap: 12,
      padding: '14px 18px',
      cursor: 'pointer',
      background: sel === i ? 'var(--bg-subtle)' : 'transparent',
      borderLeft: sel === i ? '3px solid var(--brand)' : '3px solid transparent'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: n,
    size: "md",
    status: i === 0 ? 'online' : undefined
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      color: 'var(--text-strong)',
      fontSize: 15
    }
  }, n), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--text-subtle)'
    }
  }, time)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: unread ? 'var(--text-body)' : 'var(--text-muted)',
      fontWeight: unread ? 600 : 400,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, msg), unread && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'var(--brand)',
      flex: 'none'
    }
  }))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-page)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '16px 24px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--surface-card)'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: active[0],
    size: "md",
    status: "online"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      color: 'var(--text-strong)'
    }
  }, active[0]), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--success-strong)'
    }
  }, "\u25CF Online")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: "brand"
  }, role === 'salon' ? 'Knotless specialist' : 'Crown & Coils'), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline"
  }, "View ", role === 'salon' ? 'profile' : 'opportunity'))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto',
      padding: '26px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      fontSize: 12,
      color: 'var(--text-subtle)',
      fontFamily: 'var(--font-mono)'
    }
  }, "Today"), thread.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      alignSelf: m.me ? 'flex-end' : 'flex-start',
      maxWidth: '62%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '11px 15px',
      borderRadius: m.me ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
      background: m.me ? 'var(--brand)' : 'var(--surface-card)',
      color: m.me ? 'var(--cream-50)' : 'var(--text-body)',
      border: m.me ? 'none' : '1px solid var(--border-subtle)',
      fontSize: 15,
      lineHeight: 1.5,
      boxShadow: 'var(--shadow-xs)'
    }
  }, m.t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--text-subtle)',
      marginTop: 4,
      textAlign: m.me ? 'right' : 'left'
    }
  }, m.time)))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 24px 20px',
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex',
      gap: 10,
      alignItems: 'center',
      background: 'var(--surface-card)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Write a message\u2026"
  })), /*#__PURE__*/React.createElement(Button, {
    icon: true,
    "aria-label": "Send"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "send",
    size: 18
  })))));
}
window.Messages = Messages;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Messages.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/SalonScreens.jsx
try { (() => {
// Salon: Post an opportunity form + Manage applicants
function PostOpportunity({
  go
}) {
  const {
    Card,
    Input,
    Select,
    Button,
    Tag,
    Checkbox
  } = window.BraidelDesignSystem_a13fae;
  const Icon = window.Icon;
  const [specs, setSpecs] = React.useState(['Knotless']);
  const toggle = s => setSpecs(a => a.includes(s) ? a.filter(x => x !== s) : [...a, s]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 32,
      maxWidth: 760,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padded: true
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 21,
      margin: '0 0 4px'
    }
  }, "Post an opportunity"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted)',
      margin: '0 0 22px',
      fontSize: 14
    }
  }, "Describe the role \u2014 braiders near you will be matched automatically."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Title",
    placeholder: "e.g. Weekend knotless specialist",
    required: true,
    defaultValue: "Weekend knotless specialist"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Select, {
    label: "Employment type",
    options: ['Part-time', 'Full-time', 'Contract', 'Single event']
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Experience",
    options: ['Any', '1+ years', '3+ years', '5+ years']
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Compensation",
    placeholder: "$28\u201335 / hr",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "dollar",
      size: 17
    }),
    defaultValue: "28\u201335 / hr"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Location",
    placeholder: "Atlanta, GA",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "map-pin",
      size: 17
    }),
    defaultValue: "Atlanta, GA"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--text-strong)',
      marginBottom: 8
    }
  }, "Specialties needed"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, window.SPECIALTIES.map(s => /*#__PURE__*/React.createElement(Tag, {
    key: s,
    selected: specs.includes(s),
    onClick: () => toggle(s)
  }, s)))), /*#__PURE__*/React.createElement(Input, {
    label: "Description",
    textarea: true,
    placeholder: "Tell braiders about the role, schedule, and your salon\u2026",
    defaultValue: "Busy, welcoming Atlanta salon looking for a knotless specialist for Saturdays. Steady clientele, clean stations, and supportive team."
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "Show my salon name publicly on this post",
    defaultChecked: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      justifyContent: 'flex-end',
      borderTop: '1px solid var(--border-subtle)',
      paddingTop: 18
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: () => go('dash')
  }, "Save draft"), /*#__PURE__*/React.createElement(Button, {
    onClick: () => go('applicants'),
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 17
    })
  }, "Publish opportunity")))));
}
function ManageApplicants({
  go
}) {
  const {
    Card,
    Avatar,
    Badge,
    Button,
    Rating,
    Tabs,
    Tag
  } = window.BraidelDesignSystem_a13fae;
  const Icon = window.Icon;
  const [tab, setTab] = React.useState('all');
  const rows = [{
    n: 'Imani Carter',
    exp: '5 yrs',
    specs: ['Knotless', 'Feed-in'],
    r: 4.9,
    rev: 210,
    st: 'New',
    v: 'warning'
  }, {
    n: 'Zola Adeyemi',
    exp: '7 yrs',
    specs: ['Senegalese'],
    r: 4.7,
    rev: 73,
    st: 'Shortlisted',
    v: 'info'
  }, {
    n: 'Nia Robinson',
    exp: '4 yrs',
    specs: ['Goddess', 'Knotless'],
    r: 4.9,
    rev: 142,
    st: 'Matched',
    v: 'success'
  }, {
    n: 'Tasha Bell',
    exp: '6 yrs',
    specs: ['Box braids'],
    r: 4.8,
    rev: 96,
    st: 'New',
    v: 'warning'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    value: tab,
    onChange: setTab,
    items: [{
      value: 'all',
      label: 'All',
      count: 12
    }, {
      value: 'new',
      label: 'New',
      count: 5
    }, {
      value: 'short',
      label: 'Shortlisted',
      count: 4
    }, {
      value: 'matched',
      label: 'Matched',
      count: 3
    }]
  })), /*#__PURE__*/React.createElement(Card, null, rows.map((a, i) => /*#__PURE__*/React.createElement("div", {
    key: a.n,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '16px 22px',
      borderTop: i ? '1px solid var(--border-subtle)' : 'none'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: a.n,
    size: "md"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 200
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, a.n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, a.exp, " experience")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      flex: 1
    }
  }, a.specs.map(s => /*#__PURE__*/React.createElement(Tag, {
    key: s
  }, s))), /*#__PURE__*/React.createElement(Rating, {
    value: a.r,
    count: a.rev,
    size: "0.9rem"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 110,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: a.v,
    dot: true
  }, a.st)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    onClick: () => go('messages'),
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "message",
      size: 15
    })
  }, "Message"), /*#__PURE__*/React.createElement(Button, {
    size: "sm"
  }, "Shortlist"))))));
}
window.PostOpportunity = PostOpportunity;
window.ManageApplicants = ManageApplicants;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/SalonScreens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/shell.jsx
try { (() => {
// App shell: collapsible sidebar + top bar, role-aware. Exports to window.
const Mark2 = ({
  size = 28
}) => /*#__PURE__*/React.createElement("svg", {
  width: size,
  height: size,
  viewBox: "0 0 48 48",
  fill: "none"
}, /*#__PURE__*/React.createElement("path", {
  d: "M15 6C15 15 33 17 33 24 33 31 15 33 15 42",
  stroke: "#C75D3F",
  strokeWidth: "5.2",
  strokeLinecap: "round"
}), /*#__PURE__*/React.createElement("path", {
  d: "M33 6C33 15 15 17 15 24 15 31 33 33 33 42",
  stroke: "#C2922F",
  strokeWidth: "5.2",
  strokeLinecap: "round"
}));
function Sidebar({
  role,
  route,
  go,
  setRole
}) {
  const Icon = window.Icon;
  const salonNav = [['dash', 'Dashboard', 'layout-grid'], ['posts', 'Opportunities', 'briefcase'], ['applicants', 'Applicants', 'users'], ['messages', 'Messages', 'message'], ['settings', 'Settings', 'settings']];
  const braiderNav = [['dash', 'Dashboard', 'layout-grid'], ['posts', 'Find work', 'briefcase'], ['applicants', 'Applications', 'inbox'], ['messages', 'Messages', 'message'], ['settings', 'Settings', 'settings']];
  const nav = role === 'salon' ? salonNav : braiderNav;
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 248,
      flex: 'none',
      background: 'var(--charcoal-900)',
      color: 'var(--cream-100)',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      height: '100vh'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      padding: '20px 20px 18px',
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 20
    }
  }, /*#__PURE__*/React.createElement(Mark2, null), /*#__PURE__*/React.createElement("span", null, "Braide", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--terracotta-400)'
    }
  }, "l"))), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '0 16px 16px',
      background: 'rgba(255,255,255,.06)',
      borderRadius: 'var(--radius-pill)',
      padding: 4,
      display: 'flex',
      gap: 4
    }
  }, [['salon', 'Salon'], ['braider', 'Braider']].map(([k, l]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    onClick: () => setRole(k),
    style: {
      flex: 1,
      border: 'none',
      cursor: 'pointer',
      borderRadius: 'var(--radius-pill)',
      padding: '7px 0',
      fontFamily: 'var(--font-sans)',
      fontWeight: 600,
      fontSize: 13,
      background: role === k ? 'var(--terracotta-500)' : 'transparent',
      color: role === k ? '#fff' : 'var(--taupe-400)'
    }
  }, l))), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      padding: '0 12px'
    }
  }, nav.map(([k, l, ic]) => /*#__PURE__*/React.createElement("a", {
    key: k,
    onClick: () => go(k),
    style: {
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      padding: '11px 13px',
      borderRadius: 'var(--radius-md)',
      fontSize: 15,
      fontWeight: 500,
      color: route === k ? '#fff' : 'var(--cream-200)',
      background: route === k ? 'rgba(255,255,255,.08)' : 'transparent'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: route === k ? 'var(--terracotta-400)' : 'var(--taupe-400)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 19
  })), l))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      padding: 16,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      borderTop: '1px solid rgba(255,255,255,.08)'
    }
  }, /*#__PURE__*/React.createElement(window.AppAvatar, null), /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: 1.2,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: 14,
      whiteSpace: 'nowrap'
    }
  }, role === 'salon' ? 'Crown & Coils' : 'Amara Okafor'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--taupe-400)'
    }
  }, role === 'salon' ? 'Salon owner' : 'Braider'))));
}
function AppAvatar() {
  const {
    Avatar
  } = window.BraidelDesignSystem_a13fae;
  return /*#__PURE__*/React.createElement(Avatar, {
    name: "Amara Okafor",
    size: "sm"
  });
}
function Topbar({
  title,
  sub,
  action
}) {
  const Icon = window.Icon;
  const {
    Button
  } = window.BraidelDesignSystem_a13fae;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '24px 32px 18px',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 5,
      background: 'rgba(251,247,241,.85)',
      backdropFilter: 'blur(10px)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 27,
      margin: 0,
      color: 'var(--charcoal-900)'
    }
  }, title), sub && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '3px 0 0',
      color: 'var(--text-muted)',
      fontSize: 14
    }
  }, sub)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      width: 42,
      height: 42,
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-default)',
      background: 'var(--surface-card)',
      cursor: 'pointer',
      display: 'grid',
      placeItems: 'center',
      color: 'var(--brown-600)',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bell",
    size: 19
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 9,
      right: 10,
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'var(--terracotta-500)',
      border: '2px solid var(--surface-card)'
    }
  })), action));
}
function Stat({
  icon,
  label,
  value,
  delta,
  tone = 'brand'
}) {
  const Icon = window.Icon;
  const bg = {
    brand: 'var(--brand-soft)',
    gold: 'var(--gold-50)',
    sage: 'var(--success-soft)',
    teal: 'var(--info-soft)'
  }[tone];
  const fg = {
    brand: 'var(--terracotta-600)',
    gold: 'var(--gold-700)',
    sage: 'var(--success-strong)',
    teal: 'var(--teal-600)'
  }[tone];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: 20,
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 12,
      background: bg,
      color: fg,
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 30,
      color: 'var(--charcoal-900)',
      marginTop: 14
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--text-muted)'
    }
  }, label), delta && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: 'var(--success-strong)'
    }
  }, delta)));
}
Object.assign(window, {
  Sidebar,
  Topbar,
  Stat,
  AppAvatar,
  Mark2
});

// Shared placeholder + data for app screens
const APP_TONES = [['#E8C9A8', '#C98A5A'], ['#D9A98A', '#B06A45'], ['#E3CFA6', '#C2922F'], ['#CBB89C', '#8B6B50'], ['#E9B79A', '#C75D3F'], ['#D6C2A0', '#A2781F']];
function AppPhoto({
  seed = 0,
  aspect = '1/1'
}) {
  const [a, b] = APP_TONES[seed % APP_TONES.length];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: aspect,
      width: '100%',
      height: '100%',
      background: `linear-gradient(145deg, ${a}, ${b})`,
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "40%",
    height: "40%",
    viewBox: "0 0 48 48",
    fill: "none",
    style: {
      opacity: .3
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15 6C15 15 33 17 33 24 33 31 15 33 15 42",
    stroke: "#fff",
    strokeWidth: "5",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M33 6C33 15 15 17 15 24 15 31 33 33 33 42",
    stroke: "#fff",
    strokeWidth: "5",
    strokeLinecap: "round"
  })));
}
window.Photo = AppPhoto;
window.SPECIALTIES = ['Knotless', 'Box braids', 'Locs', 'Cornrows', 'Senegalese twists', 'Feed-in', 'Faux locs', 'Goddess braids', 'Stitch braids'];
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/shell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/BraiderProfile.jsx
try { (() => {
// Braider profile — portfolio gallery, bio, ratings, apply/contact
function BraiderProfile({
  go
}) {
  const {
    Button,
    Card,
    CardBody,
    Badge,
    Rating,
    Tag,
    Avatar,
    Tabs
  } = window.BraidelDesignSystem_a13fae;
  const {
    Photo
  } = window;
  const Icon = window.Icon;
  const [tab, setTab] = React.useState('portfolio');
  const b = window.BRAIDERS[0];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1100,
      margin: '0 auto',
      padding: '28px 24px 0'
    }
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => go('braiders'),
    style: {
      cursor: 'pointer',
      color: 'var(--text-muted)',
      fontSize: 14,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      transform: 'rotate(180deg)',
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 16
  })), "Back to braiders"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 320px',
      gap: 32,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 18,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: b.name,
    size: "xl",
    ring: true
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 32,
      margin: 0,
      color: 'var(--charcoal-900)'
    }
  }, b.name), /*#__PURE__*/React.createElement(Badge, {
    variant: "brand",
    dot: true
  }, "Verified")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      marginTop: 8,
      color: 'var(--text-muted)',
      fontSize: 15,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map-pin",
    size: 15
  }), b.city), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 15
  }), "Replies in ~1 hr"), /*#__PURE__*/React.createElement(Rating, {
    value: parseFloat(b.rate),
    count: b.rev,
    size: "0.95rem"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 18,
      flexWrap: 'wrap'
    }
  }, ['Knotless', 'Box braids', 'Feed-in', 'Goddess braids', 'Kids welcome'].map(s => /*#__PURE__*/React.createElement(Tag, {
    key: s
  }, s))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 26
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    value: tab,
    onChange: setTab,
    items: [{
      value: 'portfolio',
      label: 'Portfolio'
    }, {
      value: 'about',
      label: 'About'
    }, {
      value: 'reviews',
      label: 'Reviews',
      count: b.rev
    }]
  })), tab === 'portfolio' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 12,
      marginTop: 22
    }
  }, ['Knotless waist', 'Jumbo box', 'Feed-in', 'Goddess', 'Bohemian', 'Stitch'].map((l, i) => /*#__PURE__*/React.createElement(Photo, {
    key: l,
    seed: i,
    label: l,
    aspect: "1/1",
    radius: "14px"
  }))), tab === 'about' && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22,
      maxWidth: 580
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      lineHeight: 1.7,
      color: 'var(--text-body)'
    }
  }, "Atlanta-based braider with 9 years behind the chair, specializing in knotless and feed-in styles that protect your edges and last. Gentle, scalp-first technique and a calm studio \u2014 kids and first-timers welcome."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 14,
      marginTop: 18
    }
  }, [['Experience', '9 years'], ['Travels to you', 'Within 15 mi'], ['Hair provided', 'Optional'], ['Languages', 'English, Yoruba']].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      padding: 14,
      background: 'var(--bg-subtle)',
      borderRadius: 'var(--radius-md)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, k), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      color: 'var(--text-strong)',
      marginTop: 2
    }
  }, v))))), tab === 'reviews' && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22,
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      maxWidth: 600
    }
  }, [['Destiny W.', 'Knotless braids', 'My braids came out flawless and my scalp never hurt. Booking again!'], ['Maya T.', 'Feed-in ponytail', 'So gentle and quick — and the part work is unreal.']].map(([n, s, t]) => /*#__PURE__*/React.createElement("div", {
    key: n,
    style: {
      padding: 18,
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: n,
    size: "sm"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, s)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement(Rating, {
    value: 5,
    showValue: false,
    size: "0.85rem"
  }))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '12px 0 0',
      color: 'var(--text-body)',
      lineHeight: 1.6
    }
  }, t))))), /*#__PURE__*/React.createElement(Card, {
    padded: true,
    style: {
      position: 'sticky',
      top: 86
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 26,
      color: 'var(--charcoal-900)'
    }
  }, b.price), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)',
      fontSize: 14
    }
  }, "\xB7 per style")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement(Button, {
    block: true,
    size: "lg",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "calendar",
      size: 18
    })
  }, "Book appointment"), /*#__PURE__*/React.createElement(Button, {
    block: true,
    variant: "outline",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "message",
      size: 18
    })
  }, "Message")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      paddingTop: 16,
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      fontSize: 14,
      color: 'var(--text-body)'
    }
  }, [['shield', 'Identity verified'], ['dollar', 'Secure payments'], ['clock', 'Free cancellation 48h']].map(([ic, t]) => /*#__PURE__*/React.createElement("span", {
    key: t,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--success)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 17
  })), t))))));
}
window.BraiderProfile = BraiderProfile;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/BraiderProfile.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/FindBraiders.jsx
try { (() => {
// Find braiders — search + filters + results grid
function FindBraiders({
  go
}) {
  const {
    Button,
    Card,
    CardBody,
    Badge,
    Rating,
    Tag,
    Input,
    Select
  } = window.BraidelDesignSystem_a13fae;
  const {
    Photo,
    BRAIDERS,
    SPECIALTIES
  } = window;
  const Icon = window.Icon;
  const [active, setActive] = React.useState(['Knotless']);
  const toggle = s => setActive(a => a.includes(s) ? a.filter(x => x !== s) : [...a, s]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '34px 24px 0'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 38,
      margin: 0,
      color: 'var(--charcoal-900)'
    }
  }, "Find braiders"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted)',
      marginTop: 6
    }
  }, "Browse vetted braiders near you. ", BRAIDERS.length, " of 12,480 shown."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginTop: 22,
      padding: 14,
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)',
      position: 'sticky',
      top: 70,
      zIndex: 10,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '2 1 240px'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Style, name or salon",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 18
    })
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 160px'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "City or ZIP",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "map-pin",
      size: 18
    })
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 150px'
    }
  }, /*#__PURE__*/React.createElement(Select, {
    options: ['Sort: Nearest', 'Sort: Top rated', 'Sort: Price low–high']
  })), /*#__PURE__*/React.createElement(Button, {
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "sliders",
      size: 17
    })
  }, "Filters")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      margin: '20px 0 24px'
    }
  }, SPECIALTIES.map(s => /*#__PURE__*/React.createElement(Tag, {
    key: s,
    selected: active.includes(s),
    onClick: () => toggle(s)
  }, s))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 22,
      paddingBottom: 20
    }
  }, BRAIDERS.map(b => /*#__PURE__*/React.createElement(Card, {
    key: b.id,
    interactive: true,
    onClick: () => go('braider')
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    seed: b.tone,
    aspect: "4/3"
  }), /*#__PURE__*/React.createElement("button", {
    style: {
      position: 'absolute',
      top: 12,
      right: 12,
      width: 38,
      height: 38,
      borderRadius: '50%',
      border: 'none',
      background: 'rgba(251,247,241,.9)',
      backdropFilter: 'blur(4px)',
      cursor: 'pointer',
      display: 'grid',
      placeItems: 'center',
      color: 'var(--brown-600)'
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "heart",
    size: 18
  }))), /*#__PURE__*/React.createElement(CardBody, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 18,
      color: 'var(--charcoal-900)'
    }
  }, b.name), /*#__PURE__*/React.createElement(Badge, {
    variant: b.badge === 'New' ? 'gold' : 'brand',
    dot: b.badge === 'Verified'
  }, b.badge)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--text-muted)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map-pin",
    size: 14
  }), b.city), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      margin: '4px 0 2px',
      flexWrap: 'wrap'
    }
  }, b.specs.map(s => /*#__PURE__*/React.createElement(Tag, {
    key: s
  }, s))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
      paddingTop: 12,
      borderTop: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(Rating, {
    value: parseFloat(b.rate),
    count: b.rev,
    size: "0.92rem"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      color: 'var(--text-strong)'
    }
  }, b.price)))))));
}
window.FindBraiders = FindBraiders;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/FindBraiders.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Landing.jsx
try { (() => {
// Landing page
function Landing({
  go
}) {
  const {
    Button,
    Card,
    CardBody,
    Badge,
    Rating,
    Tag
  } = window.BraidelDesignSystem_a13fae;
  const {
    Photo,
    BRAIDERS
  } = window;
  const Icon = window.Icon;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '64px 24px 40px',
      display: 'grid',
      gridTemplateColumns: '1.05fr 0.95fr',
      gap: 56,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '.16em',
      color: 'var(--brand)',
      marginBottom: 18
    }
  }, "The braiding marketplace"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'clamp(42px,5vw,68px)',
      lineHeight: 1.04,
      letterSpacing: '-0.022em',
      color: 'var(--charcoal-900)',
      margin: 0
    }
  }, "Braid your craft", /*#__PURE__*/React.createElement("br", null), "into work you love."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 19,
      lineHeight: 1.55,
      color: 'var(--text-body)',
      maxWidth: 480,
      marginTop: 20
    }
  }, "Braidel connects salon owners with skilled braiders \u2014 and helps clients discover and book the styles they love."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginTop: 28
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => go('braiders'),
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 18
    })
  }, "Find braiders"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "outline",
    onClick: () => go('app')
  }, "I'm a braider")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 26,
      marginTop: 34
    }
  }, [['12k+', 'braiders'], ['3.4k', 'salons'], ['4.9★', 'avg rating']].map(([n, l]) => /*#__PURE__*/React.createElement("div", {
    key: l
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 26,
      color: 'var(--charcoal-900)'
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, l))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    seed: 4,
    label: "Knotless",
    aspect: "3/4",
    radius: "20px"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    seed: 2,
    label: "Locs",
    aspect: "4/3",
    radius: "20px"
  }), /*#__PURE__*/React.createElement(Photo, {
    seed: 0,
    label: "Box braids",
    aspect: "4/3",
    radius: "20px"
  })))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '40px 24px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 22
    }
  }, [{
    t: 'For salon owners',
    d: 'Post staffing opportunities, review portfolios, and hire vetted braiders fast — fill your chairs without the guesswork.',
    c: 'Post an opportunity',
    tone: 'var(--charcoal-900)',
    fg: 'var(--cream-50)',
    icon: 'briefcase'
  }, {
    t: 'For braiders',
    d: 'Build a portfolio, set your availability, and find paid work at salons near you — on your terms.',
    c: 'Join as a braider',
    tone: 'var(--terracotta-500)',
    fg: 'var(--cream-50)',
    icon: 'users'
  }].map(p => /*#__PURE__*/React.createElement("div", {
    key: p.t,
    style: {
      background: p.tone,
      color: p.fg,
      borderRadius: 'var(--radius-xl)',
      padding: 36
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 48,
      height: 48,
      borderRadius: 14,
      background: 'rgba(255,255,255,.14)',
      display: 'grid',
      placeItems: 'center',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: p.icon,
    size: 24
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 27,
      margin: 0
    }
  }, p.t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      lineHeight: 1.6,
      opacity: .9,
      marginTop: 12,
      maxWidth: 380
    }
  }, p.d), /*#__PURE__*/React.createElement("button", {
    onClick: () => go('app'),
    style: {
      marginTop: 22,
      background: 'var(--cream-50)',
      color: 'var(--charcoal-900)',
      border: 'none',
      borderRadius: 'var(--radius-md)',
      height: 46,
      padding: '0 22px',
      fontFamily: 'var(--font-sans)',
      fontWeight: 600,
      fontSize: 15,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8
    }
  }, p.c, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 17
  }))))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '44px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 32,
      margin: 0,
      color: 'var(--charcoal-900)'
    }
  }, "Featured braiders"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted)',
      marginTop: 6
    }
  }, "Top-rated professionals taking new clients now.")), /*#__PURE__*/React.createElement("a", {
    onClick: () => go('braiders'),
    style: {
      cursor: 'pointer',
      color: 'var(--brand)',
      fontWeight: 600,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }
  }, "See all", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 22
    }
  }, BRAIDERS.slice(0, 3).map(b => /*#__PURE__*/React.createElement(Card, {
    key: b.id,
    interactive: true,
    onClick: () => go('braider')
  }, /*#__PURE__*/React.createElement(Photo, {
    seed: b.tone,
    aspect: "4/3"
  }), /*#__PURE__*/React.createElement(CardBody, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 18,
      color: 'var(--charcoal-900)'
    }
  }, b.name), /*#__PURE__*/React.createElement(Badge, {
    variant: b.badge === 'New' ? 'gold' : 'brand'
  }, b.badge)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--text-muted)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map-pin",
    size: 14
  }), b.city), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      margin: '4px 0 2px'
    }
  }, b.specs.map(s => /*#__PURE__*/React.createElement(Tag, {
    key: s
  }, s))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement(Rating, {
    value: parseFloat(b.rate),
    count: b.rev,
    size: "0.92rem"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      color: 'var(--text-strong)'
    }
  }, b.price))))))));
}
window.Landing = Landing;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Landing.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/chrome.jsx
try { (() => {
// Marketing site chrome: top nav, footer, photo placeholder, sample data.
// Exports to window for the screen scripts.

const TONES = [['#E8C9A8', '#C98A5A'], ['#D9A98A', '#B06A45'], ['#E3CFA6', '#C2922F'], ['#CBB89C', '#8B6B50'], ['#E9B79A', '#C75D3F'], ['#D6C2A0', '#A2781F']];
function Photo({
  seed = 0,
  label,
  aspect = '4/3',
  radius = '0',
  style
}) {
  const [a, b] = TONES[seed % TONES.length];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: aspect,
      background: `linear-gradient(145deg, ${a}, ${b})`,
      borderRadius: radius,
      position: 'relative',
      display: 'grid',
      placeItems: 'center',
      overflow: 'hidden',
      ...style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "34%",
    height: "34%",
    viewBox: "0 0 48 48",
    fill: "none",
    style: {
      opacity: .28
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15 6C15 15 33 17 33 24 33 31 15 33 15 42",
    stroke: "#fff",
    strokeWidth: "5",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M33 6C33 15 15 17 15 24 15 31 33 33 33 42",
    stroke: "#fff",
    strokeWidth: "5",
    strokeLinecap: "round"
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      bottom: 10,
      left: 12,
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'rgba(255,255,255,.92)',
      background: 'rgba(0,0,0,.22)',
      padding: '2px 7px',
      borderRadius: 6
    }
  }, label));
}
const Mark = ({
  size = 30
}) => /*#__PURE__*/React.createElement("svg", {
  width: size,
  height: size,
  viewBox: "0 0 48 48",
  fill: "none"
}, /*#__PURE__*/React.createElement("path", {
  d: "M15 6C15 15 33 17 33 24 33 31 15 33 15 42",
  stroke: "#C75D3F",
  strokeWidth: "5.2",
  strokeLinecap: "round"
}), /*#__PURE__*/React.createElement("path", {
  d: "M33 6C33 15 15 17 15 24 15 31 33 33 33 42",
  stroke: "#C2922F",
  strokeWidth: "5.2",
  strokeLinecap: "round"
}));
const Wordmark = ({
  light
}) => /*#__PURE__*/React.createElement("span", {
  style: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 9,
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: 22,
    letterSpacing: '-0.02em',
    color: light ? 'var(--cream-50)' : 'var(--charcoal-900)'
  }
}, /*#__PURE__*/React.createElement(Mark, {
  size: 28
}), /*#__PURE__*/React.createElement("span", null, "Braide", /*#__PURE__*/React.createElement("span", {
  style: {
    color: 'var(--terracotta-500)'
  }
}, "l")));
function Nav({
  go,
  active
}) {
  const {
    Button
  } = window.BraidelDesignSystem_a13fae;
  const links = [['braiders', 'Find braiders'], ['salons', 'Find salons'], ['jobs', 'Job opportunities']];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 20,
      background: 'rgba(251,247,241,.82)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '14px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => go('landing'),
    style: {
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Wordmark, null)), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 4,
      marginLeft: 8
    }
  }, links.map(([k, l]) => /*#__PURE__*/React.createElement("a", {
    key: k,
    onClick: () => go(k),
    style: {
      cursor: 'pointer',
      padding: '8px 14px',
      borderRadius: 'var(--radius-sm)',
      fontSize: 15,
      fontWeight: 600,
      color: active === k ? 'var(--brand)' : 'var(--text-body)'
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      gap: 10,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => go('app'),
    style: {
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: 15
    }
  }, "Log in"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: () => go('app')
  }, "Get started"))));
}
function Footer({
  go
}) {
  const cols = [['For braiders', ['Find work', 'Build your profile', 'Browse salons']], ['For salons', ['Post an opportunity', 'Find braiders', 'Pricing']], ['For clients', ['Book a style', 'Gift cards', 'How it works']], ['Company', ['About', 'Careers', 'Contact']]];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--charcoal-900)',
      color: 'var(--cream-100)',
      marginTop: 80
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '56px 24px 40px',
      display: 'grid',
      gridTemplateColumns: '1.4fr repeat(4, 1fr)',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wordmark, {
    light: true
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 14,
      fontSize: 14,
      color: 'var(--taupe-400)',
      maxWidth: 240,
      lineHeight: 1.6
    }
  }, "The marketplace built for the braiding industry \u2014 salons, braiders, and the clients who love their work.")), cols.map(([h, items]) => /*#__PURE__*/React.createElement("div", {
    key: h
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: '.14em',
      color: 'var(--gold-400)',
      marginBottom: 14
    }
  }, h), items.map(i => /*#__PURE__*/React.createElement("a", {
    key: i,
    style: {
      display: 'block',
      fontSize: 14,
      color: 'var(--cream-200)',
      padding: '5px 0',
      cursor: 'pointer'
    }
  }, i))))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid rgba(255,255,255,.1)',
      padding: '20px 24px',
      maxWidth: 1200,
      margin: '0 auto',
      fontSize: 13,
      color: 'var(--taupe-400)'
    }
  }, "\xA9 2026 Braidel. Made for the culture."));
}
const BRAIDERS = [{
  id: 'amara',
  name: 'Amara Okafor',
  city: 'Atlanta, GA',
  specs: ['Knotless', 'Box braids'],
  rate: '4.9',
  rev: 128,
  badge: 'Verified',
  price: '$160–$280',
  tone: 0
}, {
  id: 'tasha',
  name: 'Tasha Bell',
  city: 'Houston, TX',
  specs: ['Box braids', 'Feed-in'],
  rate: '4.8',
  rev: 96,
  badge: 'Top rated',
  price: '$140–$240',
  tone: 1
}, {
  id: 'lina',
  name: 'Lina Mensah',
  city: 'Newark, NJ',
  specs: ['Locs', 'Faux locs'],
  rate: '5.0',
  rev: 54,
  badge: 'New',
  price: '$180–$320',
  tone: 2
}, {
  id: 'imani',
  name: 'Imani Carter',
  city: 'Chicago, IL',
  specs: ['Cornrows', 'Stitch'],
  rate: '4.9',
  rev: 210,
  badge: 'Verified',
  price: '$120–$220',
  tone: 3
}, {
  id: 'zola',
  name: 'Zola Adeyemi',
  city: 'Brooklyn, NY',
  specs: ['Senegalese', 'Twists'],
  rate: '4.7',
  rev: 73,
  badge: 'Top rated',
  price: '$170–$300',
  tone: 4
}, {
  id: 'nia',
  name: 'Nia Robinson',
  city: 'Atlanta, GA',
  specs: ['Knotless', 'Goddess'],
  rate: '4.9',
  rev: 142,
  badge: 'Verified',
  price: '$190–$340',
  tone: 5
}];
const SPECIALTIES = ['Knotless', 'Box braids', 'Locs', 'Cornrows', 'Senegalese twists', 'Feed-in', 'Faux locs', 'Goddess braids', 'Stitch braids'];
Object.assign(window, {
  Photo,
  Mark,
  Wordmark,
  Nav,
  Footer,
  BRAIDERS,
  SPECIALTIES
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/chrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/shared/Icon.jsx
try { (() => {
// Lucide-style inline icons (stroke 2, round joins) shared across Braidel UI kits.
// Exposed on window.Icon so each text/babel screen script can use it.
const ICON_PATHS = {
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  'map-pin': '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  sliders: '<line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="2" x2="6" y1="14" y2="14"/><line x1="10" x2="14" y1="8" y2="8"/><line x1="18" x2="22" y1="16" y2="16"/>',
  settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  'chevron-right': '<path d="m9 18 6-6-6-6"/>',
  'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  menu: '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  briefcase: '<rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  dollar: '<line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  home: '<path d="M3 9.5 12 3l9 6.5"/><path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10"/>',
  'layout-grid': '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  inbox: '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  filter: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
  send: '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
  camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
  'map': '<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M9 4v13"/><path d="M15 7v13"/>'
};
function Icon({
  name,
  size = 20,
  stroke = 2,
  className = '',
  style
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: className,
    style: style,
    "aria-hidden": "true",
    dangerouslySetInnerHTML: {
      __html: ICON_PATHS[name] || ''
    }
  });
}
window.Icon = Icon;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/shared/Icon.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.AvatarGroup = __ds_scope.AvatarGroup;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.CardBody = __ds_scope.CardBody;

__ds_ns.CardMedia = __ds_scope.CardMedia;

__ds_ns.Rating = __ds_scope.Rating;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Alert = __ds_scope.Alert;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
