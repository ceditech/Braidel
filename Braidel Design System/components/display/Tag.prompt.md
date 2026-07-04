Chip for specialties, filters and selectable tokens.

```jsx
<Tag>Knotless</Tag>
<Tag selected onClick={toggle}>Box braids</Tag>
<Tag onRemove={() => drop('locs')}>Locs</Tag>
```

Becomes a clickable `<button>` when `onClick` is passed — combine with `selected` for filter pills. `onRemove` adds a dismiss × for input tokens. `variant="solid"` for a dark filled chip.
