# hexo-theme-hanli

A clean, elegant Hexo theme with dark mode, full-text search, and responsive navigation. Based on [Typography](https://github.com/SumiMakito/hexo-theme-typography) by Makito.

> **Hanli** (韩吏) — a theme that values simplicity and readability.

## Features

- **Dark / Light Mode** — Toggle between themes with one click; preference is saved in localStorage
- **Full-text Search** — Built-in search modal with keyboard shortcuts (`Ctrl+K`) powered by `hexo-generator-searchdb`
- **Responsive Top Bar** — Fixed navigation bar with favicon, search trigger, and theme toggle
- **Sidebar Navigation** — Vertical site title with navigation links and social icons
- **Categories & Tags** — Dedicated index pages for categories and tags
- **Social Links** — GitHub, Twitter, Instagram, Weibo, RSS
- **Comment System** — LiveRe / Disqus support
- **Multi-language** — English, Simplified Chinese, Traditional Chinese, Korean
- **SCSS Source** — Easily customizable with SCSS source files included

## Preview

<!-- Add your screenshots here -->
<!-- ![Light Mode](screenshots/light.png) -->
<!-- ![Dark Mode](screenshots/dark.png) -->

## Installation

### Method 1: Git Clone

```bash
cd your-hexo-site
git clone https://github.com/0xHanniba1/hexo-theme-hanli.git themes/hanli
```

### Method 2: Git Submodule

```bash
cd your-hexo-site
git submodule add https://github.com/0xHanniba1/hexo-theme-hanli.git themes/hanli
```

Then set the theme in your site `_config.yml`:

```yaml
theme: hanli
```

## Required Plugins

Install the following Hexo plugins in your site root:

```bash
npm install hexo-renderer-pug hexo-renderer-marked hexo-generator-searchdb --save
```

Full list of recommended plugins:

| Plugin | Purpose |
|--------|---------|
| `hexo-renderer-pug` | **Required** — Pug template rendering |
| `hexo-renderer-marked` | **Required** — Markdown rendering |
| `hexo-generator-searchdb` | **Required** — Full-text search data generation |
| `hexo-generator-archive` | Archive page generation |
| `hexo-generator-category` | Category page generation |
| `hexo-generator-tag` | Tag page generation |
| `hexo-generator-feed` | RSS/Atom feed generation |

### Search Configuration

Add to your site `_config.yml`:

```yaml
search:
  path: search.json
  field: post
  content: true
```

## Theme Configuration

Edit `themes/hanli/_config.yml`:

```yaml
# Site Title (displayed in sidebar)
title_primary: "Your Blog Title"       # the bigger text
title_secondary: "Your Blog Subtitle"  # the smaller text

# Social Links
github: yourusername
twitter: yourusername
instagram: yourusername
rss: atom.xml

# Search
search:
  enable: true
  placeholder: "Search posts..."

# Color scheme: light / dark
themeStyle: light

# Show category/tags on post list
showCategories: true
showTags: true

# Comments (choose one)
disqus: your-shortname
# livere: your-data-uid
```

## Tags & Categories Pages

Create a tags index page:

```bash
hexo new page tags
```

Edit `source/tags/index.md`:

```markdown
---
title: Tags
layout: tag-index
---
```

Create a categories index page:

```bash
hexo new page categories
```

Edit `source/categories/index.md`:

```markdown
---
title: Categories
layout: category-index
---
```

## Customization

### SCSS

SCSS source files are in `raw/scss/`. After modifying, build CSS:

```bash
cd themes/hanli
npm install
npm run build
```

### Custom CSS

Add your custom styles to `source/css/custom.css` — this file is loaded after all other styles.

## Example Project

A complete example blog is provided in the `_example/` directory. To try it:

```bash
cd _example
npm install

# Link theme subdirectories (avoids circular symlink)
mkdir -p themes/hanli
ln -sfn ../../layout themes/hanli/layout
ln -sfn ../../source themes/hanli/source
ln -sfn ../../languages themes/hanli/languages
ln -sfn ../../_config.yml themes/hanli/_config.yml
ln -sfn ../../package.json themes/hanli/package.json

hexo server
```

## Credits

- Based on [Typography](https://github.com/SumiMakito/hexo-theme-typography) by [Makito](https://www.keep.moe)
- Powered by [Hexo](https://hexo.io)

## License

[MIT](LICENSE)
