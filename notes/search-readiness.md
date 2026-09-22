# Search and agent-reading readiness

Prepared 17 September 2026; release policy updated 22 September. The owner approved the public repository, experimental v0.1.0 release, and GitHub Pages site and downloads. Local/default builds remain unindexed; only the approved public workflow enables indexing. The [launch record](release-v0.1.0.md) distinguishes pre-publication checks from live outcomes. Robots rules and noindex are crawler controls, not access control.

## What is implemented

- A descriptive title naming Humane and Agent Skill, the existing factual description, one canonical URL, complete Open Graph and Twitter image metadata, and the visible creator's name.
- JSON-LD describes a WebPage, WebSite, Person, and a CreativeWork in Markdown. The skill is not mislabeled as a hosted SoftwareApplication. No ratings, review counts, prices, invented dates, or affiliation claims are added. JSON serialization is tested against script termination.
- All important content is in the initial HTML. Original examples, their fictional status, questions, compatibility limits and source references are readable without running a model or JavaScript.
- Stable question fragments open the appropriate native disclosure. Installation links directly to the unchanged Markdown skill. The footer and alternate-format link expose the generated Markdown page.
- The builder produces a full Markdown page and a small optional agent index from the same content object as HTML. They include access and privacy limits; they do not expose repository notes, tests, environment files or evaluation records. The agent index links to the skill rather than asserting authority over agents that encounter it.
- A sitemap is generated only for an explicitly indexable build. It contains the canonical homepage only, with no fabricated modification dates or duplicate exports. Rebuilding as a preview removes any stale sitemap.
- The loopback server returns correct Markdown/XML types, redirects the duplicate HTML index URL to the canonical route, exposes its block rule at the host root, and returns a real, styled noindex 404 for missing pages. Its noindex response header remains unconditional, even when inspecting future indexable artifacts locally.

The implementation is in [site/discovery.mjs](../site/discovery.mjs), [site/page.mjs](../site/page.mjs), and [scripts/build-site.mjs](../scripts/build-site.mjs). No new dependency, tracking script or hosted service was added.

## Discovery-build evidence

The measurements in this section belong to the discovery build ea9922c, before the later restoration of the original subtle animation. Search and agent-reading behavior is unchanged by that restoration; its current checks are in [verification.md](verification.md). The Lighthouse scores and homepage byte count below were not remeasured for it.

37 Node checks and 54 Chromium/WebKit browser tests passed. They cover URL consistency at domain roots and project subpaths, JSON-LD round trips, content and source parity, private-data exclusions, opt-in indexing and stale-file cleanup, actual GET/HEAD routes, FAQ fragments, no-JavaScript content, motion and existing accessibility behavior.

One Lighthouse 13.4.1 mobile run on the final preview returned performance 99, accessibility 100, best practices 100 and SEO 66. LCP was 1.8 seconds, CLS 0, total blocking time 20 milliseconds. The **only failed automated SEO audit was indexing**, identifying the deliberate noindex meta tag, noindex header and root robots block. These are local lab results, not live search inclusion, traffic, human comprehension or complete accessibility certification. Online rich-result tools were not given private site content.

The SVG's exact plotted vertices were preserved while its markup fell from 80,261 to 59,882 bytes. With the new metadata included, homepage HTML fell from 122,054 to 105,568 bytes. The generated Markdown page is 5,939 bytes and the agent index 1,886 bytes. Those are file sizes, not a claim that every host uses the same transfer compression or caching.

## What GEO does and does not mean here

Google's AI Overviews and AI Mode use the same search fundamentals: accessible, useful textual content, truthful metadata and an indexable page. Google explicitly says no special AI file or schema is required. Meeting the requirements does not guarantee indexing or citation.

The optional agent index follows the proposal commonly called llms.txt. It is a convenience for tools that choose to fetch it, not a standard all agents obey, a training permission, or an established ranking factor. The ordinary HTML and source links remain the primary content. Neither the index nor a structured-data block proves that the model understands or recommends the project correctly.

OpenAI search crawling and training crawling are separate choices. OAI-SearchBot is associated with ChatGPT search; GPTBot is associated with model training. User-initiated fetches can follow different rules. No crawler-policy changes have been made on a public host, and no guaranteed AI-discovery claim is made.

## Only after public-launch approval

The v0.1.0 approval covers both the source repository and the website with its included skill downloads. Current release copy reflects anonymous public access and an experimental release, not a proven effectiveness claim. This permission is separate from SEO and is not a billing workaround.

Use the actual HTTPS base URL through `HUMANE_SITE_URL`. The manually approved Pages workflow now sets `HUMANE_SITE_INDEXABLE=true` for the release build to emit index/follow metadata and the sitemap. The default outside that workflow is false and invalid flag values fail. This setting changes generated files; it does not deploy them or change repository visibility.

At a GitHub Pages project subpath, the generated project-level robots file **does not govern the host**. Crawlers read the origin-root robots URL. Review that root policy separately with its owner, including the distinction between search access and training access. The local Node server's headers are not deployed to Pages; verify the actual hosting response headers, redirects, missing-page status, canonical address, downloads and robots behavior after release. Domain-root agent-index discovery may likewise require host-root ownership; the page's ordinary Markdown link does not depend on it.

Search Console or Bing Webmaster verification and sitemap submission are optional follow-up work requiring access and separate approval. They are not part of this launch, and neither indexing nor search/AI referrals is promised. No root-policy edits, DNS changes, tracking, or search-account configuration is included.

## Sources consulted

- [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- [Google: robots file scope](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec)
- [Google: blocking indexing](https://developers.google.com/search/docs/crawling-indexing/block-indexing)
- [OpenAI crawler roles](https://developers.openai.com/api/docs/bots)
- [Open Graph protocol](https://ogp.me/)
- [Schema.org CreativeWork](https://schema.org/CreativeWork)
- [Optional agent-index proposal](https://llmstxt.org/)
- [GitHub Pages hosting](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages)
