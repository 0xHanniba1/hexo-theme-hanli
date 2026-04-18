# hexo-theme-hanli

[English](README.md)

一款极简风 Hexo 主题，使用 **墨色 / 宣纸** 双色盘、命令面板式搜索、三栏阅读布局。为注重排版与宁静感的写作者设计。

> **Hanli** · 韩立 —— 崇尚简洁、节奏感与可读性的博客主题。

## 特性

- **墨色 / 宣纸双主题** — 深色 `ink`（墨色）与暖色 `paper`（宣纸）两种调色板，顶栏一键切换。偏好存于 `localStorage`，并在**首次绘制前**生效，杜绝闪屏。
- **命令面板搜索** — `⌘K` / `Ctrl+K` / `/` 呼出全屏弹窗，支持 scope 切换（文章 / 标签 / 页面）、实时关键词高亮、右侧预览栏、`↑↓⏎` 键盘导航，自动记住最近搜索词。
- **三栏布局** — 232 px 左栏（导航 + 标签云 + 年度热力图） · 流式阅读区 · 200 px 右栏（竖排标语 + Now Playing + 数据面板 + 外链）。平板 / 手机自动折叠。
- **Tweaks 微调面板** — 悬浮齿轮图标，读者可自行切换强调色（`暖金 / 青瓷 / 朱砂`）和底纹（`点阵 / 格纹 / 无`），选项持久化。
- **自定义关于页** — Hero 卡片式排版，支持印章、handle、标语、联系方式小组件，零模板代码。
- **周志 / 归档感知** — 独立的 `archive` / `tag-index` / `category-index` 版式。"周志"导航项会根据配置的 tag 自动读取最新一篇的 `W##` 徽标。
- **排版优先** — Noto Serif SC + Inter + JetBrains Mono（Google Fonts 加载）。标题里 `` ` ` `` 包裹的行内代码会自动使用等宽字体，`YYYY-Wnn` 格式同理。
- **基于 Hexo 原语** — 不引入运行时框架。Pug 模板 + CSS 变量 + 少量原生 JS。

## 依赖

```bash
npm install hexo-renderer-pug hexo-renderer-marked hexo-generator-searchdb --save
```

| 插件 | 用途 |
|---|---|
| `hexo-renderer-pug` | **必需** — Pug 模板渲染 |
| `hexo-renderer-marked` | **必需** — Markdown 渲染 |
| `hexo-generator-searchdb` | **必需** — 生成命令面板所用 `search.json` |
| `hexo-generator-archive` / `-category` / `-tag` / `-feed` / `-index` | 推荐 — Hexo 标准生成器 |

站点 `_config.yml` 中加：

```yaml
search:
  path: search.json
  field: post
  content: true
```

## 安装

```bash
cd your-hexo-site
git clone https://github.com/0xHanniba1/hexo-theme-hanli.git themes/hanli
```

然后在站点 `_config.yml`：

```yaml
theme: hanli
```

## 主题配置

编辑 `themes/hanli/_config.yml`：

```yaml
# 站点标题（侧栏 + 右侧竖排标语）
title_primary: "博客标题"
title_secondary: "博客副标题"

# 社交链接（留空即隐藏）
github: yourusername
twitter: yourusername
rss: atom.xml

# 命令面板搜索（⌘K / Ctrl+K / /）
search:
  enable: true
  placeholder: "搜索文章、标签、页面 · Search everything…"

# 默认主题：light（宣纸）/ dark（墨色）
themeStyle: light

# 左栏导航 — 可选项
nav:
  weekly_url: /tags/2026zk/     # /tags/<weekly-tag>/  —— "周志"入口
  weekly_tag: 2026zk            # 用于计算 W## 徽标
  about_url: /about/

# 右栏 Now Playing 小组件（字段留空即隐藏整块）
now_playing:
  title: 渔舟唱晚
  artist: 古琴 · 李祥霆
  cover: /images/np.jpg
```

## 标签 / 分类索引页

Hanli 需要 `tags` 与 `categories` 索引页，首次创建即可：

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

## 关于页

新建 `source/about/index.md`：

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

图标走 Font Awesome 4（主题内置）—— `github / twitter / rss / envelope / link` 等皆可。

## 标题小语法

- 反引号包裹的内容会自动等宽字体：`` 每日记录 `2026-W10` ``
- `YYYY-Wnn` 格式（如 `2026-W10`）会自动以 mono 字体呈现

## 自定义 CSS

改写 `source/css/custom.css` 即可，加载顺序在 `typo.css` 之后，不用 `!important` 就能覆盖。

## 键盘快捷键

| 按键 | 功能 |
|---|---|
| `⌘K` / `Ctrl+K` / `/` | 呼出搜索 |
| `↑ / ↓` | 结果上下移动 |
| `Tab` | 切换 scope |
| `⏎` | 打开选中行 |
| `Esc` | 关闭弹窗 |

## 示例项目

`_example/` 目录是一个可运行的示例博客，链接进来即可启动：

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

## 致谢

- 源自 [Typography](https://github.com/SumiMakito/hexo-theme-typography) · [Makito](https://www.keep.moe)
- 围绕 **墨色 / 宣纸** 设计从头重写
- 由 [Hexo](https://hexo.io) 驱动

## 许可证

[MIT](LICENSE)
