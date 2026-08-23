// Matches the @modal slot at exactly "/" (the root, zero segments) —
// without this, closing a spot's modal by navigating back to "/" leaves the
// last-rendered modal content visible: parallel routes keep showing a
// slot's last matched content on client-side navigation unless something
// explicitly matches the new URL and renders null for that slot.
export default function Default() {
  return null;
}
