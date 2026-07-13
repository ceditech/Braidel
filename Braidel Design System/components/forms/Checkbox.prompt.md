Checkbox (or radio) with an optional label and description line.

```jsx
<Checkbox label="Available for new clients" defaultChecked />
<Checkbox label="Knotless braids" description="2–6 hrs · from $160" />
<Checkbox radio name="role" label="I'm a braider" />
```

Set `radio` for a round radio control; give grouped radios the same `name`. Forwards native props (checked, defaultChecked, onChange, disabled).
