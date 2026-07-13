Surface container for Braidel's card-based layouts. Compose with `CardMedia` and `CardBody`.

```jsx
<Card interactive as="a" href="/braider/ amara">
  <CardMedia src="/work.jpg" alt="Knotless braids" />
  <CardBody>
    <strong>Amara O.</strong>
    <span>Atlanta, GA · Knotless specialist</span>
  </CardBody>
</Card>

<Card padded variant="raised">…stat panel…</Card>
```

Variants: `default` (soft shadow) · `flat` (no shadow) · `raised` (floating). Add `interactive` for hover-lift, `padded` for uniform inner padding, `as="a"` to make the whole card a link.
