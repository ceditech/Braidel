Styled native dropdown with a custom chevron.

```jsx
<Select label="Specialty" options={['Knotless', 'Box braids', 'Locs', 'Cornrows']} />
<Select label="Sort by"><option>Nearest</option><option>Top rated</option></Select>
```

Use `options` for a quick array (strings or `{value,label}`), or pass `<option>` children. Sizes `sm | md`.
