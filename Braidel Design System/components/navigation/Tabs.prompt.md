Horizontal tab switcher with optional count badges.

```jsx
<Tabs
  items={[
    { value: 'all', label: 'All applicants', count: 12 },
    { value: 'new', label: 'New', count: 3 },
    { value: 'shortlist', label: 'Shortlisted' },
  ]}
  value={tab} onChange={setTab}
/>
```

`variant="underline"` (default) for page sections; `variant="pill"` for a compact segmented control. Controlled via `value`/`onChange`, or uncontrolled if you omit `value`.
