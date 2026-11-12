# Layout audit — 2026-11-12

Verified in Orca's Chromium browser; Tesla hardware remains untested.

- Empty layouts: 1920, 1280, 1024, 820, 672, 390, 320 CSS-pixel widths; main, demo, recap, diagnostics, resume, end surfaces.
- Populated layouts: 12 collected phrases, six course blocks, two completed blocks; 1920×1200, 1280×720, 820×600, 390×844, 320×568; main, recap, diagnostics and end surfaces. Verified the fixture actually rendered 12 phrase rows before accepting the result.
- Checked document overflow and button/row/heading/container bounds. Subject and episode strips intentionally scroll horizontally.
- Inspected screenshots of desktop main, mobile main, demo and populated recap. Long recap content scrolls; dismiss control remains visible after scrolling to the bottom.
- Repeated audio timeupdate events preserve the same summary row DOM node when data is unchanged, preventing repeated entry animations.
- Fixed mobile header wrapping, transport overflow, narrow timeline labels, popup button wrapping, native checkbox appearance, recap animation flicker and long-dialog dismiss accessibility.
- Versioned CSS and app script URLs so normal reloads load these fixes.

Limits: not a pixel-identical Android render; narrow screens intentionally reflow. No claim about Tesla-specific browser behavior or all browser engines.
