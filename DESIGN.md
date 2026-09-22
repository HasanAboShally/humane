---
name: Humane
description: Built visual system for the Humane website.
colors:
  ground: "#eef1e8"
  surface: "#f8faf3"
  surface-soft: "#e3e9dc"
  ink: "#18382c"
  muted: "#526459"
  line: "#bcc9b8"
  strong-line: "#748974"
  action: "#254e3b"
  action-ink: "#f5f8eb"
  accent: "#c8df9f"
  accent-ink: "#274032"
  focus: "#3d6240"
  selection: "#c8df9f"
  selected-ink: "#18382c"
  lens-a: "#b6cc88"
  lens-b: "#2c6950"
  lens-c: "#759b7c"
  dark-ground: "#11281f"
  dark-surface: "#173327"
  dark-surface-soft: "#1c3c2c"
  dark-paper: "#33513e"
  dark-paper-back: "#6a8064"
  dark-paper-shadow: "#07150e"
  dark-ink: "#eaf2df"
  dark-muted: "#bacbb3"
  dark-line: "#3e5a44"
  dark-strong-line: "#8aa77e"
  dark-action: "#d0e7aa"
  dark-action-ink: "#193625"
  dark-accent: "#d0e7aa"
  dark-accent-ink: "#193625"
  dark-focus: "#d4e9b0"
  dark-selection: "#d0e7aa"
  dark-selected-ink: "#193625"
  dark-lens-a: "#e6f0a7"
  dark-lens-b: "#91b58b"
  dark-lens-c: "#3d6c4e"
typography:
  body:
    { fontFamily: "Manrope, sans-serif", fontSize: "1rem", lineHeight: 1.65 }
  display:
    {
      fontSize: "clamp(3rem, 5.55vw, 5.25rem)",
      fontWeight: 540,
      lineHeight: 1.06,
      letterSpacing: "-0.04em",
    }
  headline:
    {
      fontSize: "clamp(2.25rem, 3.7vw, 3.7rem)",
      fontWeight: 550,
      lineHeight: 1.13,
      letterSpacing: "-0.04em",
    }
  result-title:
    {
      fontSize: "1.65rem",
      fontWeight: 600,
      lineHeight: 1.22,
      letterSpacing: "-0.025em",
    }
  button: { fontSize: "0.92rem", fontWeight: 650, lineHeight: 1.4 }
  command:
    {
      fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace",
      fontSize: "0.86rem",
      fontWeight: 500,
      lineHeight: 1.7,
    }
rounded:
  radius: "16px"
  pill: "999px"
  instruction-field: "12px"
  paper: "2px"
  circle: "50%"
components:
  button-primary:
    {
      backgroundColor: "{colors.action}",
      textColor: "{colors.action-ink}",
      rounded: "{rounded.pill}",
      padding: "0.88rem 1.5rem",
      typography: "{typography.button}",
    }
  button-secondary:
    {
      backgroundColor: "transparent",
      textColor: "{colors.ink}",
      rounded: "{rounded.pill}",
      padding: "0.88rem 1.5rem",
    }
  output:
    {
      backgroundColor: "{colors.surface}",
      rounded: "{rounded.paper}",
      padding: "2.6rem 2.8rem",
    }
  source-document:
    {
      backgroundColor: "{colors.surface}",
      rounded: "{rounded.paper}",
      padding: "0 1.4rem",
    }
---

# Humane design

## Overview

The built direction is an **optical comparison bench**: mineral green, pine ink, open lettering, fine geometric threads, and quiet rounded controls. A visitor can inspect a document example, then take the skill into an existing assistant. Shape and typography carry the future-facing character, not glow or invented product data.

This is a source-based snapshot dated 17 September 2026. Product truth lives in [PRODUCT.md](PRODUCT.md); page intent in [notes/site-brief.md](notes/site-brief.md); implementation in [site/styles.css](site/styles.css), [site/page.mjs](site/page.mjs), and [site/main.js](site/main.js); asset origins in [site/asset-provenance.json](site/asset-provenance.json).

The site is lightweight static HTML/CSS/JavaScript. On 22 September 2026 the owner approved the public repository, experimental v0.1.0 release, and GitHub Pages site. Local previews remain unindexed. Publication changes availability and setup wording, not the approved visual design.

The owner approved this appearance and requested English-only, more direct copy. The current page has four main sections: purpose, examples, setup, and three questions. The repeated product-description strip, care-principles section, and decorative slogans were removed. Visible text lives in [site/content.json](site/content.json); there is no locale layer or language switch.

The subsequent example-only request called for a more recognizable document example, suggesting floating A4 pages. That section now uses a tinted desk, layered source sheets, and a portrait response page. This is a local material exception to the otherwise flat site: all actual text remains upright, with only empty backing sheets tilted.

The paper/theme follow-up made light the default while retaining explicit saved choices, and gave dark sheets distinct front/back tones and deeper shadows. Later owner feedback rejected the hero's defensive non-service disclaimer and generic description. The current introduction names the reading burden, the free Agent Skill, and a concrete result: one explanation across documents with a way back to the originals. MIT licensing and experimental-release status remain a separate line. The artwork, layout, example wording, installation, FAQ, and theme behavior are preserved; the skill's sender guidance was revised separately to address the writing failure.

The owner rejected the repeated zoom and offered a return to the original subtle animation. The site now restores the original 1.3-second rotation/fade entrance, then stays still. Replay text remains absent; the looping controller and its pause/resume button are removed. The headline and introduction remain still and selectable. Search metadata, plain-Markdown reading links, stable FAQ fragments, and the styled 404 are preserved. Discovery files still share the visible content rather than introducing a separate marketing account of the product.

## Colors

Unprefixed frontmatter colors match the light CSS variables; `dark-` entries record their dark overrides, not extra CSS variable names. Component references describe the light baseline and follow the same variable roles in dark appearance.

The owner tried neutral light surfaces, found the page too gray, and requested a full rollback of that palette change. The original green-tinted page, paper, sections and dividers are restored, along with matching social-card and browser-chrome backgrounds. The dark palette and all other design behavior remain unchanged.

- `ground` is the page field and example tab track; `surface` supplies light document paper and read-only fields; `surface-soft` marks the light example desk and installation section. Scoped `--desk`, `--paper`, and `--paper-back` roles preserve that light appearance. In dark appearance the desk uses `dark-surface`, front paper uses `dark-paper`, and the exposed backing uses `dark-paper-back`. This keeps the sheets distinguishable without a bright white surface inside dark appearance.
- `ink` carries primary text; `muted` carries supporting text and the second hero line. Dark appearance uses a deep-pine field with pale text, not neon.
- `action` / `action-ink` identify primary actions and selected tabs. `selection` / `selected-ink` control selected text. The declared accent pair is not separately applied by current components.
- `line` separates content; `strong-line` outlines secondary actions; `focus` marks keyboard focus and source targets. The three lens colors belong only to the decorative SVG gradient.
- Light is the default, regardless of the operating-system theme, including when JavaScript or storage is unavailable. A valid saved `humane-appearance` choice of light or dark restores before CSS. The toggle saves only explicit choices and updates its action label, the color-scheme metadata, and browser theme color. OS preference changes do not override the site. Invalid stored values are ignored without rewriting them; a failed write still allows the current-page toggle to work.

## Typography

Manrope is the self-hosted Latin variable font (weights 200–800), with `sans-serif` fallback. It uses a local WOFF2 asset, `font-display: swap`, and SIL Open Font License licensing; there are no external font requests. Manrope is preloaded on the single English page. The unused Arabic font dependency and asset were removed.

The frontmatter describes base desktop roles: hero display, example-section headline, result title, body, button, and command. Headings balance their lines; prose uses pretty wrapping. The hero introduction is capped at 31rem, requests at 34ch, and source/FAQ prose at 65ch. A wrapping 0.82rem licensing line under the introduction identifies the MIT open-source license and experimental release; its link has a 24px minimum target height. Code uses the system monospace stack, not a third webfont.

## Layout

- The centered base shell is `min(100% - 6rem, 1320px)`. At viewport widths ≤1150px it becomes `calc(100% - 4rem)`; ≤767px, `calc(100% - 2.5rem)`; ≤380px, `calc(100% - 2rem)`.
- Desktop column ratios are hero 1.18/0.82, installation 1.25/1, and FAQ 1/1.2. The example sources and result instead use centered, shrinking columns capped at 27rem and 34rem, separated by 4rem. This bounds the physical sheet scale instead of stretching it across a wide monitor. Installation and FAQ gaps are 6rem; smaller breakpoints reduce them.
- The example desk has 2rem/3rem/3.5rem top/inline/bottom padding. A result sheet has a preferred 210:297 ratio and a content-based minimum height, with read-coverage notes at the foot. It never clips text to preserve a paper ratio. At an example-container width ≤65rem, gutters contract; ≤48rem, sources precede the result in one column, the arrow disappears, and the ratio becomes content-driven. At ≤24rem, desk gutters are 12px and backing sheets become upright with 0.35rem visible below the fronts; ≤18rem, result padding is 16px. Native source expansion has no fixed height or internal scrollbar.
- Hero minimum height is 610px, 660px from 1500px, and 550px at ≤1150px. At ≤767px the fixed minimum disappears, text precedes the artwork, and the other grids become single-column. Major 6–7rem section spacing contracts to roughly 3.5–4rem.
- The header is not sticky. Its minimum height steps through 96px, 80px, and 76px. At a header-container width ≤44rem it wraps and hides the section navigation, retaining the brand, GitHub link and enhanced appearance control; no mobile menu is invented. No motion button remains for the brief, non-repeating entrance.
- The hero, example section, installation shell, and FAQ are inline-size containers. At ≤18rem, headings shrink, example tabs stack with 12px corners, result padding becomes 16px, and the command/copy controls wrap.
- Headings can wrap long words; controls use shrinking flex/grid children. Clip only the decorative hero artwork, not page text. Example tabs wrap even outside the smallest container rule. These are implemented reflow measures, not a claim that every zoom/device combination was audited.

## Elevation & Depth

Outside the example desk, surfaces remain flat, separated by tone, space, and thin rules. The owner's paper request adds two scoped elevations: `--paper-shadow` (`0 2px 4px #11281f0d, 0 12px 28px #11281f14`) for source sheets and backing paper, and `--paper-lift` (`0 4px 8px #11281f12, 0 24px 48px #11281f1a`) for the result. These offset, soft pine shadows do not include a border or halo. The temporary copy notice keeps its existing shadow (`0 10px 35px #11281f20`). The hero linework remains unchanged.

Dark sheets need more than the light shadow copied onto a dark field. Their source shadow uses `inset 0 1px 0 #bacbb326, 0 3px 8px #07150e66, 0 14px 32px #07150e66`; the result uses `inset 0 1px 0 #bacbb333, 0 5px 12px #07150e77, 0 26px 52px #07150e99`. The inset highlight marks only the top paper edge; there is no glowing outline. Distinct backing color carries the layering even where a shadow alone would be weak. Forced colors removes this decoration.

## Shapes

The example desk, command rows, and copy notices use the base radius; action buttons and the example-picker track use the pill radius. Document sheets alone use the new 2px paper radius, an intentional response to the owner's request for physical pages rather than rounded content cards. The instruction textarea and narrow stacked tabs use 12px corners. The appearance control is circular. Most dividers and outlined controls use 1px strokes.

The original SVG is an open band of 62 fine strands with a dotted orbit, rotated −9° at rest. It is `aria-hidden`, nonfocusable decoration, not a diagram, model output, or app screenshot. Its desktop width deliberately extends into the hero gutter; mobile art fits the column. Relative path serialization preserves every one of the 6,510 original 0.1px vertices, with a checksum test against the previous geometry; no path smoothing or point removal is involved. The SVG falls from 80,261 to 59,882 bytes. Icons are build-time Lucide SVGs, without an icon runtime or CDN.

With motion permitted, the outer SVG plays the original `lens-arrive` once over 1.3 seconds using `cubic-bezier(.16,1,.3,1)`: rotation −14°/scale 0.98/opacity 0.65 settles to rotation −9°/scale 1/opacity 1. There is no repeated scaling, strand animation, observer, motion event controller, or permanent `will-change`. Scrolling, theme changes and page restoration do not replay a completed entrance. The text remains static. Reduced motion or unavailable JavaScript leaves the original still illustration; forced colors hides the artwork. No animation library was added.

## Components

- **Actions:** primary fill uses the action pair and brightens on hover (`brightness(1.08)`); outlined secondary actions gain the surface fill. Buttons move down 1px when pressed. Main actions have a 52px minimum height, falling to 48px on mobile; utility and source-link targets differ, so do not describe every control as 44px.
- **Focus:** links, buttons, fields, and summaries use a 2px focus outline with 5px offset. A targeted source has a separate 1px outline with 8px offset. The skip link appears on focus. Ordinary navigation/text links underline on hover; source links are already underlined and darken on hover.
- **Repository access:** the header keeps a compact GitHub text link with the existing Lucide external-arrow icon beside the appearance control. It uses the canonical repository URL, a descriptive accessible name, a 44px minimum height and the shared text-link hover/focus styles. It remains visible on mobile and without JavaScript, follows normal same-tab link behavior, and adds no dependency. The footer keeps its existing repository link.
- **Examples:** JavaScript adds a tablist with selected state, roving tab stops, focusable panels, Arrow keys, Home, and End. “Summarize documents” is initially selected; “Rewrite a draft” shows the other example. “Example documents” and “Original notes” name the respective source columns. The desk groups these sources and their result; a decorative desktop arrow reinforces that relationship. Empty backing sheets have no pointer events and introduce no focus stops or animations. Selection changes prewritten fictional content; it does not call a model.
- **Disclosures:** sources and FAQs use native `details` / `summary`, with rotating disclosure icons. The first source in each example is open in the HTML so a visitor immediately sees a complete original rather than a file-name list. Other originals can expand independently. Source links open the matching disclosure; hash navigation also selects its example, focuses its summary, and scrolls it into view. A return link leads to the exact originating citation, or the result heading for a direct source visit. Re-selecting the current fragment still restores focus. Keep the source text inspectable beside the result.
- **Reading links:** installation includes a direct Markdown skill link; the footer links to the generated Markdown version of the whole page. Stable question fragments open and focus the appropriate FAQ. A separate 404 uses the same type, palette and home action while retaining an actual 404 status and noindex metadata.
- **Fields and copy:** the install command is a wrapping, selectable `pre` / `code` block rather than a clipped single-line input. The full instruction textarea is read-only, 20rem tall and vertically resizable; neither is an upload form. Copy sets `aria-busy` / `aria-disabled`, keeps the button focusable, dims it to 0.65, and prevents duplicate requests. Success gives context-specific next steps. Failure selects text only while the reader has not moved focus elsewhere; otherwise it announces recovery instructions without interrupting them. Older copy results cannot overwrite newer feedback. The notice clears after nine seconds.
- **Language:** the page declares English and LTR. Locale routes, alternate-language metadata, Arabic typography, and RTL-specific rules were removed. Logical CSS properties remain useful layout conventions, not a promise of multilingual website support.
- **Without JavaScript:** the page stays light and the artwork stays still; both examples, native disclosures, manual text selection, Markdown and ZIP links remain usable. Tabs, copy, and theme buttons stay hidden until enhancement completes. Do not replace this baseline with JavaScript-only content.
- **Other presentations:** forced colors restore system-colored control/document borders and source links, remove paper shadows, and hide the decorative backing sheets. Print also removes the desk, backing sheets, ratio, shadows, and arrow while retaining text; it still hides navigation, hero artwork, installation, and action controls. Print is not a separate fully reviewed document layout.

## Do's and Don'ts

- Do use direct English and useful action labels. Preserve conditions, unresolved disagreements, source links, and honest read coverage rather than shortening away meaning. Remove repeated slogans and abstract labels that make the reader guess.
- Do name the product as an Agent Skill and preserve its reader-first purpose. Prefer a concrete explanation of what someone gets over a feature inventory or defensive statements about what the product is not. Setup explains use in an existing assistant. Keep the MIT license and experimental-release status distinct; neither is a claim of effectiveness.
- Do explain installer prerequisites next to the command. The optional installer uses Node.js and Git, but the public repository needs no GitHub sign-in. ZIP support and invocation depend on the assistant. Copying the instructions already displayed on the page is a separate chat-only route, not an installation.
- Do label the examples as authored fictional material, not live AI responses. Their budgets, volunteer counts, and dates are illustration content, not product results or customer proof.
- Don't invent testimonials, customer logos, usage figures, measured time savings, a human-reader study, universal compatibility, or a guarantee that the skill preserves every fact. Model smoke responses are distinct from browser checks and neither proves human benefit.
- Don't imply local document processing merely because a preview is local. The chosen assistant handles material under its own privacy rules; Humane adds no account, hosted model, document-upload endpoint, backend, or analytics. Keep the footer to the creator credit rather than speculative affiliation disclaimers.
- Don't enable Pages, publish a release, change repository visibility, register a domain, or upload assets publicly without fresh permission. `noindex, nofollow` is not access control. No fake proof or public availability should be implied by the design.

The historical copy-simplification round passed 30 Playwright tests. Current example-section checks and limits are recorded in [notes/verification.md](notes/verification.md). Browser scans and AI screenshot reviews are not a full-site audit, standards-compliance certification, or human comprehension study.

Search/GEO preparation is documented in [notes/search-readiness.md](notes/search-readiness.md). The current preview stays noindex, even with complete metadata and an optional agent-readable index. No schema, text export, or local audit guarantees search ranking or AI citation.
