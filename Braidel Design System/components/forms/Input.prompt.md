Labeled text input with optional hint, error state and icon adornments.

```jsx
<Input label="Email" type="email" placeholder="you@salon.com" required
       iconLeft={<MailIcon/>} hint="We never share this." />
<Input label="Bio" textarea placeholder="Tell clients about your work…" />
<Input label="City" error="Please choose a city." />
```

Sizes `sm | md | lg`. Pass `textarea` for multi-line. `error` overrides `hint` and reddens the border. Any native input attribute (type, value, onChange, maxLength…) passes through.
