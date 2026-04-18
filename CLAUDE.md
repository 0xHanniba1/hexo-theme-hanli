# CLAUDE.md

Instructions for AI agents (Claude Code, Cursor, etc.) working in this repo or helping users set up a blog with **hexo-theme-hanli**.

## What this repo is

A Hexo 7 theme. Pug templates + CSS variables + vanilla JS. No build step — the theme is used in place from `themes/hanli/` inside a Hexo site.

**Not** a blog. To deploy a site that looks like the screenshots, a user needs:

1. A Hexo 7.x site (see Quickstart below)
2. This theme cloned into `themes/hanli/`
3. `hexo-renderer-pug`, `hexo-renderer-marked`, `hexo-generator-searchdb` installed
4. Site `_config.yml` set to `theme: hanli` plus a `search:` block
5. Theme `_config.yml` filled in (title, github, nav, now_playing)
6. `source/tags/index.md`, `source/categories/index.md`, `source/about/index.md` created

## File map

```
_config.yml              # Theme config template (user copies + customizes)
layout/
  index.pug              # Post list (home + paginated)
  archive.pug            # /archive/ — grouped-by-year timeline
  tag.pug / tag-index.pug
  category.pug / category-index.pug
  post.pug               # Single post view
  page.pug               # Static page (about uses a custom layout)
  about.pug              # Hero-card "关于" page
  mixins.pug             # Shared: beautifyTitle, make_post, make_pager, postList, tagList, categoryList
  partial/
    layout.pug           # Outer shell — includes head, topbar, sidebar, aside, search modal, tweaks
    head.pug             # <head>, Google Fonts, CSS links, FOUC-prevention script (!)
    topbar.pug           # Sticky topbar: brand, search pill, RSS/GH icons, theme toggle
    sidebar.pug          # Left rail: nav, high-freq tag cloud, year heatmap
    aside.pug            # Right rail: vertical slogan, now-playing, stats, social links
    nav.pug              # Hardcoded zh-CN labels (首页/归档/标签/分类/周志/关于)
    search.pug           # Command-palette DOM skeleton
    tweaks.pug           # Floating gear + panel for accent/texture switching
    footer.pug
    comments.pug         # LiveRe / Disqus
source/
  css/
    typo.css             # MAIN design CSS (~1800 lines) — tokens, layout, components, responsive
    search.css           # Command-palette modal styles
    custom.css           # Empty override file for end-users (loads AFTER typo.css)
    blog_basic.css, style*.css   # Legacy files kept for post-content fallback
    font-awesome.min.css # FA 4 bundled
  js/
    search.js            # Fetches /search.json, renders results + preview + scope tabs
    theme-toggle.js      # Ink / paper toggle
    tweaks.js            # Accent + texture persistence
  fonts/, images/
languages/               # en, ko, zh-cn, zh-tw — mostly unused; nav is hardcoded zh
_example/                # Runnable demo site (symlinks to ../layout, ../source, ...)
```

## Configuration surface

Everything user-facing lives in **theme `_config.yml`**. Do not hardcode values in templates.

| Key | Effect when blank | Required shape |
|---|---|---|
| `title_primary` / `title_secondary` | Sidebar/vertical-slogan falls back to site `config.title` | string |
| `github` | GH icon in topbar hidden; search-footer brand shows `0XHANNIBA1` fallback (in demo) | string |
| `rss` | RSS icon hidden | path relative to site root, e.g. `atom.xml` |
| `search.enable` | Entire search modal + topbar pill hidden | boolean |
| `search.placeholder` | Default placeholder used | string (shown inside the modal input) |
| `search.trigger_hint` | Defaults to `搜索 · Search` | string (shown in the topbar pill; keep it short) |
| `themeStyle` | `light` (paper) is default | `light` \| `dark` |
| `nav.weekly_url` | "周志 / W##" entry in left rail hidden | path like `/tags/2026zk/` |
| `nav.weekly_tag` | W## badge won't update | tag slug (must match a tag actually used) |
| `nav.about_url` | "关于" entry hidden | path like `/about/` |
| `now_playing.title` + `artist` | Now-playing card hidden | strings |
| `now_playing.cover` | Cover art swatch uses placeholder color | image path |
| `now_playing.audio_url` | Card is decorative (static bars, not clickable) | audio path, e.g. `/audio/track.mp3` — enables click-to-play, bars animate on play |

Site-level `_config.yml` must also have:

```yaml
search:
  path: search.json
  field: post
  content: true
```

Without this, `search.js` will fetch `/search.json` and get a 404.

## Common tasks (AI playbook)

When a user asks one of these, follow the mapped steps.

### "Help me set up a blog with this theme"

1. Check if they have a Hexo site. If not, run `npx hexo init <dir>` + `npm install`.
2. `cd <dir> && git clone https://github.com/0xHanniba1/hexo-theme-hanli.git themes/hanli`
3. Install required plugins: `npm i hexo-renderer-pug hexo-renderer-marked hexo-generator-searchdb`
4. Edit site `_config.yml`:
   - `theme: hanli`
   - `title:` / `author:` / `language: zh-CN` (or their preference)
   - Add the `search:` block shown above
5. Edit `themes/hanli/_config.yml`:
   - `title_primary` / `title_secondary`
   - `github`
   - If they want the weekly feature: `nav.weekly_url: /tags/<their-tag>/`, `nav.weekly_tag: <their-tag>`
   - If they want now-playing: fill in `now_playing.title` / `artist`
6. Create tag/category index pages:
   ```
   hexo new page tags       # then set layout: tag-index in the frontmatter
   hexo new page categories # then set layout: category-index
   ```
7. Create `source/about/index.md` — copy the frontmatter block from README.
8. `npx hexo server` to verify.

### "Change accent color / add a new accent"

The three accents (`gold / jade / seal`) are hardcoded in **two** places — keep them in sync:

- `source/js/tweaks.js` → `ACCENTS` map (hex pairs)
- `layout/partial/tweaks.pug` → buttons inside `.tw-opts[data-key="accent"]`

To add a new accent: add an entry to `ACCENTS`, add a button with `data-v="<name>"`, done. No CSS change needed (vars are set inline).

### "Make the now-playing widget actually play music"

The card supports click-to-play when `now_playing.audio_url` is set:

1. Drop an audio file under `source/audio/` (e.g. `source/audio/track.mp3`). Hexo copies files from `source/` verbatim into `public/`.
2. In theme `_config.yml`:
   ```yaml
   now_playing:
     title: Track Title
     artist: Artist Name
     audio_url: /audio/track.mp3
   ```
3. `source/js/now-playing.js` binds click + Enter/Space on `.now-playing.playable` to toggle `<audio>` play/pause. `audio` is `loop` + `preload="none"`, so nothing downloads until the user clicks.
4. The `.np-bars` eq animation is paused by default; adding `.playing` to the card (via the `audio` `play`/`pause` events) starts it. No CSS change needed when adding a new song — just update config.

Note: browsers block autoplay without a user gesture. The widget always starts paused. That's intentional.

### "Change the default theme (ink vs paper)"

Edit `layout/partial/head.pug`, inline FOUC script:

```pug
(function(){try{var t=localStorage.getItem('theme');if(t==='paper'||t==='ink'){document.documentElement.setAttribute('data-theme',t);}else{document.documentElement.setAttribute('data-theme','ink');}}catch(e){}})();
```

Change the last `'ink'` to `'paper'` to default to paper.

### "The heatmap is empty"

The year heatmap in `sidebar.pug` reads from `site.posts`. Heatmap is populated only after the user has actual dated posts in `source/_posts/`. If it looks broken, check that posts have valid `date:` frontmatter.

### "Add a new nav item"

Edit `layout/partial/nav.pug` directly — nav labels are hardcoded zh-CN (by design, i18n is not wired up). Add an `li > a(href=...)` block following the existing pattern. If the target path needs an active-state highlight, use `is_current(path)` — but beware prefix-matching ambiguity (see "标签 + 周志 double-highlighted" comment in the file).

### "Bump cache for CSS changes"

`layout/partial/head.pug` has `- var cssVersion = '...'`. Bump it when shipping CSS updates so readers get the new file. Format is a date + counter, e.g. `20260418-12`.

### "Add a custom style"

Write into `source/css/custom.css`. It's loaded **after** `typo.css` — no `!important` needed to override. Never modify `typo.css` for per-site customization; keep it theme-source.

## Invariants — do not break

- **FOUC script must stay inline in `head.pug` before any CSS link.** Moving it to an external JS file causes a flash of the wrong theme.
- **`typo.css` is the single source of truth for layout / design tokens.** Don't inline styles in Pug except for FOUC prevention.
- **Nav labels are intentionally hardcoded Chinese.** Do not replace with `__('...')` i18n calls without also fleshing out the `languages/` YAML files.
- **`.search-trigger` is the topbar button; `#sp-overlay` is the modal.** `search.js` binds to both names — keep the class on the trigger.
- **`_example/` uses symlinks** (`../../layout` etc.). Don't `cp` files into `_example/themes/hanli/` or they'll go out of sync.
- **Personal blog content must never land in this repo.** Only `_example/source/_posts/hello-world.md` and `theme-features.md` ship as demo posts.

## Test commands

From the theme directory, there's nothing to run. From a Hexo site that uses the theme:

```bash
npx hexo clean && npx hexo generate
grep -c "sp-overlay" public/index.html    # should be 1
grep -c "typo.css" public/index.html      # should be 1
npx hexo server                            # manual check at http://localhost:4000
```

To sanity-check a published site: open any page, press ⌘K — search modal should appear. Toggle theme pill — should persist across reload.

## References

- Design tokens: top of `source/css/typo.css` (`:root { --ink-850, --paper, --accent, --font-han, ... }`)
- Mixins used by index/archive/tag/category layouts: `layout/mixins.pug`
- Upstream: https://github.com/SumiMakito/hexo-theme-typography (credited; the current design is a rewrite)
