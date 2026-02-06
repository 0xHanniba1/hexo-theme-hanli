# hexo-theme-hanli

[English](README.md)

一款简洁优雅的 Hexo 主题，支持深色模式、全文搜索和响应式导航。基于 [Typography](https://github.com/SumiMakito/hexo-theme-typography) 主题开发。

> **Hanli**（韩吏）—— 崇尚简洁与可读性的博客主题。

## 功能特性

- **深色 / 浅色模式** — 一键切换，偏好自动保存至 localStorage
- **全文搜索** — 内置搜索弹窗，支持键盘快捷键（`Ctrl+K`），基于 `hexo-generator-searchdb`
- **响应式顶栏** — 固定导航栏，包含站点图标、搜索入口和主题切换按钮
- **侧边栏导航** — 竖排站点标题，附带导航链接和社交图标
- **分类与标签** — 独立的分类和标签索引页
- **社交链接** — GitHub、Twitter、Instagram、微博、RSS
- **评论系统** — 支持 LiveRe / Disqus
- **多语言** — 英文、简体中文、繁体中文、韩文
- **SCSS 源码** — 提供 SCSS 源文件，方便自定义样式

## 预览

<!-- 在此添加截图 -->
<!-- ![浅色模式](screenshots/light.png) -->
<!-- ![深色模式](screenshots/dark.png) -->

## 安装

### 方式一：Git Clone

```bash
cd your-hexo-site
git clone https://github.com/0xHanniba1/hexo-theme-hanli.git themes/hanli
```

### 方式二：Git Submodule

```bash
cd your-hexo-site
git submodule add https://github.com/0xHanniba1/hexo-theme-hanli.git themes/hanli
```

然后在站点 `_config.yml` 中设置主题：

```yaml
theme: hanli
```

## 必需插件

在站点根目录安装以下 Hexo 插件：

```bash
npm install hexo-renderer-pug hexo-renderer-marked hexo-generator-searchdb --save
```

完整插件列表：

| 插件 | 用途 |
|------|------|
| `hexo-renderer-pug` | **必需** — Pug 模板渲染 |
| `hexo-renderer-marked` | **必需** — Markdown 渲染 |
| `hexo-generator-searchdb` | **必需** — 全文搜索数据生成 |
| `hexo-generator-archive` | 归档页生成 |
| `hexo-generator-category` | 分类页生成 |
| `hexo-generator-tag` | 标签页生成 |
| `hexo-generator-feed` | RSS/Atom 订阅源生成 |

### 搜索配置

在站点 `_config.yml` 中添加：

```yaml
search:
  path: search.json
  field: post
  content: true
```

## 主题配置

编辑 `themes/hanli/_config.yml`：

```yaml
# 站点标题（显示在侧边栏）
title_primary: "博客标题"        # 大字
title_secondary: "博客副标题"    # 小字

# 社交链接
github: yourusername
twitter: yourusername
instagram: yourusername
rss: atom.xml

# 搜索
search:
  enable: true
  placeholder: "搜索文章..."

# 配色方案：light / dark
themeStyle: light

# 文章列表显示分类/标签
showCategories: true
showTags: true

# 评论（二选一）
disqus: your-shortname
# livere: your-data-uid
```

## 标签与分类页

创建标签索引页：

```bash
hexo new page tags
```

编辑 `source/tags/index.md`：

```markdown
---
title: Tags
layout: tag-index
---
```

创建分类索引页：

```bash
hexo new page categories
```

编辑 `source/categories/index.md`：

```markdown
---
title: Categories
layout: category-index
---
```

## 自定义

### SCSS

SCSS 源文件位于 `raw/scss/`。修改后构建 CSS：

```bash
cd themes/hanli
npm install
npm run build
```

### 自定义 CSS

将自定义样式添加到 `source/css/custom.css`，该文件在所有其他样式之后加载。

## 示例项目

`_example/` 目录提供了一个完整的示例博客，可用于本地测试：

```bash
cd _example
npm install

# 链接主题子目录（避免循环符号链接）
mkdir -p themes/hanli
ln -sfn ../../layout themes/hanli/layout
ln -sfn ../../source themes/hanli/source
ln -sfn ../../languages themes/hanli/languages
ln -sfn ../../_config.yml themes/hanli/_config.yml
ln -sfn ../../package.json themes/hanli/package.json

hexo server
```

## 致谢

- 基于 [Typography](https://github.com/SumiMakito/hexo-theme-typography) 主题，作者 [Makito](https://www.keep.moe)
- 由 [Hexo](https://hexo.io) 驱动

## 许可证

[MIT](LICENSE)
