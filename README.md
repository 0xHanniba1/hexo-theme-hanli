# hexo-theme-hanli

[中文文档](README_zh.md)

A minimalist Hexo theme with an **ink / paper** palette, command-palette search, and a three-column reading layout. Built for bloggers who value typography and calm.

> **Hanli** · 韩立 — a theme that values simplicity, rhythm, and readability.

## Features

- **Ink / Paper themes** — Deep-ink navy (`ink`) and warm paper (`paper`) palettes, toggled from the topbar. Preference persists in `localStorage` and applies **before first paint** to avoid FOUC.
- **Command-palette search** — `⌘K` / `Ctrl+K` / `/` opens a full-screen modal with scope tabs (文章 / 标签 / 页面), live-highlighted results, per-row preview rail, and `↑↓⏎` keyboard navigation. Recent queries are remembered.
- **Three-column layout** — 232 px left rail (nav + tag cloud + year heatmap) · fluid reading stream · 200 px right aside (vertical slogan + now-playing widget + stats + links). Collapses gracefully on tablet / mobile.
- **Tweaks panel** — Floating gear in the corner lets readers switch the accent color (`暖金 / 青瓷 / 朱砂`) and page texture (`点阵 / 格纹 / 无`). Settings persist per visitor.
- **Custom about page** — Hero-card layout with seal, handle, tagline, and contact chips. Zero boilerplate.
- **Weekly / archive aware** — Dedicated `archive`, `tag-index`, `category-index` layouts. The "周志" (weekly) nav entry auto-derives its `W##` badge from the latest post in a configured tag.
- **Typography-first** — Noto Serif SC + Inter + JetBrains Mono from Google Fonts. Backtick-style inline code highlighting in titles (e.g. `` `CLI` ``) and `YYYY-Wnn` auto-formatting.
- **Built on Hexo primitives** — No runtime framework. Pug templates, CSS variables, a tiny bit of vanilla JS.

## Quickstart — 5 minutes to a running blog

Copy-paste friendly. Replace `<yourname>` / `<your-title>` as you go.

```bash
# 1. Scaffold a new Hexo site
npx hexo init my-blog && cd my-blog
npm install

# 2. Install required plugins
npm i hexo-renderer-pug hexo-renderer-marked hexo-generator-searchdb

# 3. Clone the theme
git clone https://github.com/0xHanniba1/hexo-theme-hanli.git themes/hanli

# 4. Point the site at the theme + enable search (site _config.yml)
cat >> _config.yml <<'YAML'

theme: hanli
search:
  path: search.json
  field: post
  content: true
YAML

# 5. Fill in the theme config — open themes/hanli/_config.yml and set
#    title_primary / title_secondary / github at minimum.

# 6. Create tag + category index pages
hexo new page tags
hexo new page categories
# Then set `layout: tag-index` / `layout: category-index` in each frontmatter.

# 7. (Optional) About page — create source/about/index.md, copy the
#    frontmatter from the "About page" section below.

# 8. Go
npx hexo server
```

> **Working with an AI assistant?** This repo ships a [`CLAUDE.md`](CLAUDE.md) agent guide. Point Claude Code / Cursor / any agent-friendly IDE at the theme directory and it will know the file layout, configuration surface, and common tasks without you re-explaining.

## Requirements

```bash
npm install hexo-renderer-pug hexo-renderer-marked hexo-generator-searchdb --save
```

| Plugin | Purpose |
|---|---|
| `hexo-renderer-pug` | **Required** — Pug template renderer |
| `hexo-renderer-marked` | **Required** — Markdown renderer |
| `hexo-generator-searchdb` | **Required** — Generates `search.json` for the command palette |
| `hexo-generator-archive` / `-category` / `-tag` / `-feed` / `-index` | Recommended — standard Hexo generators |

In your site `_config.yml`:

```yaml
search:
  path: search.json
  field: post
  content: true
```

## Installation

```bash
cd your-hexo-site
git clone https://github.com/0xHanniba1/hexo-theme-hanli.git themes/hanli
```

Then in your site `_config.yml`:

```yaml
theme: hanli
```

## Theme Configuration

Edit `themes/hanli/_config.yml`:

```yaml
# Site title (sidebar + vertical slogan)
title_primary: "Your Blog Title"
title_secondary: "Your Blog Subtitle"

# Social links (leave blank to hide)
github: yourusername
twitter: yourusername
rss: atom.xml

# Command-palette search (⌘K / Ctrl+K / /)
search:
  enable: true
  placeholder: "搜索文章、标签、页面 · Search everything…"

# Default theme on first visit: light (paper) / dark (ink)
themeStyle: light

# Left-rail nav — optional entries
nav:
  weekly_url: /tags/2026zk/     # /tags/<weekly-tag>/ → "周志" entry
  weekly_tag: 2026zk            # used to compute the W## badge
  about_url: /about/

# Right-aside now-playing widget (leave blank to hide)
now_playing:
  title: 渔舟唱晚
  artist: 古琴 · 李祥霆
  cover: /images/np.jpg
```

## Index pages

Hanli expects `tags` and `categories` index pages. Create them once:

```bash
hexo new page tags
hexo new page categories
```

```markdown
---
title: Tags
layout: tag-index
---
```

```markdown
---
title: Categories
layout: category-index
---
```

## About page

Create `source/about/index.md`:

```markdown
---
title: 关于
layout: about
handle: '@yourhandle'
tagline: 慢就是快 · 自律 · 坚持
contact:
  - { icon: github,  label: yourhandle, url: 'https://github.com/yourhandle' }
  - { icon: twitter, label: '@yourhandle', url: 'https://twitter.com/yourhandle' }
  - { icon: rss,     label: RSS, url: /atom.xml }
---
```

Icons use Font Awesome 4 (bundled with the theme) — `github / twitter / rss / envelope / link` etc.

## Post-title niceties

- Wrap inline code with backticks: `` 每日记录 `2026-W10` `` renders the backtick portion as monospace.
- `YYYY-Wnn` segments (e.g. `2026-W10`) automatically render in the mono family.

## Custom CSS

Drop your overrides in `source/css/custom.css`. It's loaded after `typo.css`, so your selectors win without `!important`.

## Keyboard shortcuts

| Key | Action |
|---|---|
| `⌘K` / `Ctrl+K` / `/` | Open search |
| `↑ / ↓` | Navigate results |
| `Tab` | Cycle scope tabs |
| `⏎` | Open selected row |
| `Esc` | Close modal |

## Example project

`_example/` contains a runnable demo. Link it in and start:

```bash
cd _example
npm install

mkdir -p themes/hanli
ln -sfn ../../layout themes/hanli/layout
ln -sfn ../../source themes/hanli/source
ln -sfn ../../languages themes/hanli/languages
ln -sfn ../../_config.yml themes/hanli/_config.yml
ln -sfn ../../package.json themes/hanli/package.json

npx hexo server
```

## Credits

- Originally forked from [Typography](https://github.com/SumiMakito/hexo-theme-typography) by [Makito](https://www.keep.moe)
- Rebuilt from the ground up for the **ink / paper** design
- Powered by [Hexo](https://hexo.io)

## License

[MIT](LICENSE)
