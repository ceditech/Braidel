Primary action control — use for any clickable command; terracotta fill by default.

```jsx
<Button variant="primary" size="md">Book now</Button>
<Button variant="outline" iconLeft={<PlusIcon/>}>Post a job</Button>
<Button variant="ghost" size="sm">Cancel</Button>
<Button icon aria-label="Settings"><GearIcon/></Button>
```

Variants: `primary` (terracotta) · `secondary` (gold) · `outline` · `ghost` · `danger`.
Sizes: `sm` (36) · `md` (44, default) · `lg` (52). Add `block` to fill width, `pill` for rounded, `loading` for spinner, `icon` for square icon-only. Render links with `as="a" href="…"`.
