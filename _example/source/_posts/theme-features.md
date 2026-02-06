---
title: Theme Features Showcase
date: 2026-01-02 00:00:00
tags:
  - Theme
  - Features
  - Markdown
categories:
  - Guide
---

This post showcases all the features supported by the **hanli** theme.

## Typography

The theme is designed for **readability**. It uses clean fonts and generous spacing to make your content shine.

*Italic text*, **bold text**, ~~strikethrough~~, and `inline code`.

> This is a blockquote. It can span multiple lines and is styled with a subtle left border.

## Headings

### Third Level

#### Fourth Level

##### Fifth Level

## Code Blocks

JavaScript example:

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
  return true;
}

greet('World');
```

Python example:

```python
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

for num in fibonacci(10):
    print(num)
```

## Lists

### Unordered List

- First item
- Second item
  - Nested item A
  - Nested item B
- Third item

### Ordered List

1. Step one
2. Step two
3. Step three

## Tables

| Feature | Status | Description |
|---------|--------|-------------|
| Dark Mode | Supported | Toggle with topbar button |
| Search | Supported | Press `Ctrl+K` to open |
| Categories | Supported | Auto-generated index page |
| Tags | Supported | Auto-generated index page |
| Comments | Supported | LiveRe / Disqus |
| RSS | Supported | Atom feed |

## Images

You can include images in your posts:

```markdown
![Alt text](image-url.jpg)
```

## Links

- [Hexo Documentation](https://hexo.io/docs/)
- [Theme Repository](https://github.com/0xHanniba1/hexo-theme-hanli)

## Dark Mode

Click the sun/moon icon in the top-right corner of the navigation bar to toggle between light and dark modes. Your preference is automatically saved.

## Search

Press `Ctrl+K` or click the search icon in the topbar to open the search modal. Start typing to search through all your posts.

## Horizontal Rule

---

That's it! Enjoy writing with the **hanli** theme.
