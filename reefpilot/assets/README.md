# Assets

These are generated from a single SVG mark (a teal water droplet + compass
needle on deep-ocean navy) — the "pilot for your reef" concept.

| File | Size | Use |
| --- | --- | --- |
| `icon.png` | 1024×1024 | iOS/Play app icon. Opaque (no alpha), as the App Store requires. |
| `adaptive-icon.png` | 1024×1024 | Android adaptive foreground (transparent; bg is set in `app.config.ts`). |
| `splash-icon.png` | 1024×1024 | Splash mark (transparent); background painted by the splash plugin. |
| `notification-icon.png` | 96×96 | Android status-bar icon (white silhouette on transparent). |
| `favicon.png` | 48×48 | Web favicon. |

## Regenerating

The generator lives in the scratchpad (`gen-assets.mjs`, uses `sharp`). To tweak
the mark, edit the SVG in that script and re-run it, or drop in your own PNGs at
the sizes above.

## Branding

- **Palette:** navy `#0B1622` (bg), teal `#21C0A6` (primary), amber `#F5A623` (accent).
- **Tone:** calm, precise, trustworthy — a dependable instrument, not a toy.
