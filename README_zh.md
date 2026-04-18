# hexo-theme-hanli

[English](README.md)

一款极简风 Hexo 主题，使用 **墨色 / 宣纸** 双色盘、命令面板式搜索、三栏阅读布局。为注重排版与宁静感的写作者设计。

> **Hanli** · 韩立 —— 崇尚简洁、节奏感与可读性的博客主题。

## 特性

- **墨色 / 宣纸双主题** — 深色 `ink`（墨色）与暖色 `paper`（宣纸）两种调色板，顶栏一键切换。偏好存于 `localStorage`，并在**首次绘制前**生效，杜绝闪屏。
- **命令面板搜索** — `⌘K` / `Ctrl+K` / `/` 呼出全屏弹窗，支持 scope 切换（文章 / 标签 / 页面）、实时关键词高亮、右侧预览栏、`↑↓⏎` 键盘导航，自动记住最近搜索词。
- **三栏布局** — 232 px 左栏（导航 + 标签云 + 年度热力图） · 流式阅读区 · 200 px 右栏（竖排标语 + Now Playing + 数据面板 + 外链）。平板 / 手机自动折叠。
- **Tweaks 微调面板** — 悬浮齿轮图标，读者可自行切换强调色（`暖金 / 青瓷 / 朱砂`）和底纹（`点阵 / 格纹 / 无`），选项持久化。
- **Now Playing 小组件** — 右栏卡片显示曲名 + 艺人 + 均衡条动画。配上本地音频文件即可变成"点击播放"——均衡条仅在真正播放时才跳动。
- **自定义关于页** — Hero 卡片式排版，支持印章、handle、标语、联系方式小组件，零模板代码。
- **周志 / 归档感知** — 独立的 `archive` / `tag-index` / `category-index` 版式。"周志"导航项会根据配置的 tag 自动读取最新一篇的 `W##` 徽标。
- **排版优先** — Noto Serif SC + Inter + JetBrains Mono（Google Fonts 加载）。标题里 `` ` ` `` 包裹的行内代码会自动使用等宽字体，`YYYY-Wnn` 格式同理。
- **基于 Hexo 原语** — 不引入运行时框架。Pug 模板 + CSS 变量 + 少量原生 JS。

## Quickstart · 5 分钟从零跑起来

复制即用，记得把 `<你的名字>` / `<你的标题>` 换掉：

```bash
# 1. 新建 Hexo 站点
npx hexo init my-blog && cd my-blog
npm install

# 2. 安装必需插件
npm i hexo-renderer-pug hexo-renderer-marked hexo-generator-searchdb

# 3. 克隆主题
git clone https://github.com/0xHanniba1/hexo-theme-hanli.git themes/hanli

# 4. 站点 _config.yml 挂上主题 + 打开搜索
cat >> _config.yml <<'YAML'

theme: hanli
search:
  path: search.json
  field: post
  content: true
YAML

# 5. 填主题 _config.yml —— 打开 themes/hanli/_config.yml，至少改
#    title_primary / title_secondary / github。

# 6. 建标签 + 分类索引页
hexo new page tags
hexo new page categories
# 然后把两个 md 文件 frontmatter 里分别加 layout: tag-index / layout: category-index

# 7. （可选）关于页 —— 新建 source/about/index.md，frontmatter 参考下方
#    "关于页"章节。

# 8. 起飞
npx hexo server
```

> **让 AI 帮你跑？** 仓库里有一份给 AI 助手（Claude Code / Cursor 等）的工作手册 [`CLAUDE.md`](CLAUDE.md)。把主题目录指给 AI，它就能自己读懂文件结构、配置项、常见任务，不用你每次重新解释。

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
  placeholder: "搜索文章、标签、页面 · Search everything…"  # 模态框输入框里的文案
  trigger_hint: "搜索 · Search"                              # 顶栏 pill 里的文案（记得短一点）

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
  audio_url: /audio/yuzhouchangwan.mp3    # 可选 —— 点击卡片播放 / 暂停
```

> 把 MP3 放到 Hexo 站点的 `source/audio/` 目录下，构建时 Hexo 会自动拷到 `public/`。浏览器禁止无交互自动播放，所以组件默认是暂停状态，需要读者点一下封面才开始播。

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
