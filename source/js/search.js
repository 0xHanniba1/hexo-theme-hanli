/**
 * Search command palette — fetches /search.json from hexo-generator-searchdb,
 * derives tag buckets, wires scope tabs, previews selected row.
 */
(function () {
  'use strict';

  var overlay  = document.getElementById('sp-overlay');
  var input    = document.getElementById('sp-input');
  var resultsEl = document.getElementById('sp-results');
  var previewEl = document.getElementById('sp-preview');
  var closeBtn = document.getElementById('sp-close');
  var countEl  = document.getElementById('sp-count');
  var scopeEl  = document.getElementById('sp-scope');

  if (!overlay || !input || !resultsEl) return;

  // Static pages, extracted from nav. Hardcoded fallback keeps it working even if nav changes.
  var PAGES = [
    { t: '首页',   en: 'Home',       href: '/',           ic: '宅' },
    { t: '归档',   en: 'Archive',    href: '/archive/',   ic: '檔' },
    { t: '标签',   en: 'Tags',       href: '/tags/',      ic: '籤' },
    { t: '分类',   en: 'Categories', href: '/categories/',ic: '類' },
    { t: '周志',   en: 'Weekly',     href: '/tags/2026zk/', ic: '週' },
    { t: '关于',   en: 'About',      href: '/about/',     ic: '自' }
  ];

  var POSTS = [];
  var TAGS = [];
  var dataLoaded = false;
  var loadingPromise = null;

  var scope = 'all';
  var rows = [];
  var sel = 0;
  var recent = loadRecent();

  function loadRecent() {
    try {
      var v = localStorage.getItem('sp_recent');
      return v ? JSON.parse(v).slice(0, 6) : [];
    } catch (_) { return []; }
  }
  function saveRecent(q) {
    if (!q) return;
    recent = [q].concat(recent.filter(function (r) { return r !== q; })).slice(0, 6);
    try { localStorage.setItem('sp_recent', JSON.stringify(recent)); } catch (_) {}
  }

  function loadData() {
    if (dataLoaded) return Promise.resolve();
    if (loadingPromise) return loadingPromise;

    var path = window.searchPath || '/search.json';
    loadingPromise = fetch(path)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        POSTS = (data || []).map(function (p) {
          var tags = (p.tags || []).map(function (t) {
            return typeof t === 'string' ? t : (t && t.name) || '';
          }).filter(Boolean);
          var date = extractDate(p.url);
          return {
            title: p.title || '',
            url: p.url || '#',
            content: (p.content || '').replace(/\s+/g, ' ').trim(),
            tags: tags,
            date: date,
            read: readTime(p.content || '')
          };
        });
        var counts = {};
        POSTS.forEach(function (p) {
          p.tags.forEach(function (t) { counts[t] = (counts[t] || 0) + 1; });
        });
        TAGS = Object.keys(counts).map(function (name) {
          return { name: name, n: counts[name] };
        }).sort(function (a, b) { return b.n - a.n; });
        dataLoaded = true;
      })
      .catch(function (err) { console.error('Search data failed:', err); });
    return loadingPromise;
  }

  function extractDate(url) {
    var m = /\/(\d{4})\/(\d{1,2})\//.exec(url || '');
    return m ? (m[1] + '-' + ('0' + m[2]).slice(-2)) : '';
  }
  function readTime(content) {
    var n = (content || '').replace(/\s+/g, '').length;
    return Math.max(1, Math.round(n / 400)) + ' min';
  }

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function hi(txt, q) {
    var safe = escapeHtml(txt);
    if (!q) return safe;
    var re = new RegExp('(' + q.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + ')', 'ig');
    return safe.replace(re, '<mark>$1</mark>');
  }
  function snippet(content, q, len) {
    len = len || 140;
    if (!content) return '';
    if (!q) return content.slice(0, len);
    var i = content.toLowerCase().indexOf(q.toLowerCase());
    if (i < 0) return content.slice(0, len);
    var start = Math.max(0, i - 40);
    var end = Math.min(content.length, i + q.length + len - 40);
    return (start > 0 ? '…' : '') + content.slice(start, end) + (end < content.length ? '…' : '');
  }

  function open() {
    overlay.hidden = false;
    requestAnimationFrame(function () { overlay.classList.add('open'); });
    document.body.style.overflow = 'hidden';
    setTimeout(function () { input.focus(); }, 80);
    loadData().then(function () { render(input.value); });
  }
  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(function () { overlay.hidden = true; }, 200);
  }

  document.querySelectorAll('.search-trigger, .search').forEach(function (el) {
    el.addEventListener('click', function (e) { e.preventDefault(); open(); });
  });
  closeBtn && closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });

  document.addEventListener('keydown', function (e) {
    var meta = e.metaKey || e.ctrlKey;
    if (meta && e.key.toLowerCase() === 'k') { e.preventDefault(); overlay.classList.contains('open') ? close() : open(); return; }
    if (!overlay.classList.contains('open')) {
      if (e.key === '/' && !isTextInput(e.target)) { e.preventDefault(); open(); }
      return;
    }
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp')   { e.preventDefault(); move(-1); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      var r = rows[sel];
      if (r && r.dataset.href && r.dataset.href !== '#') {
        saveRecent(input.value.trim());
        location.href = r.dataset.href;
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      cycleScope(e.shiftKey ? -1 : 1);
    }
  });

  function isTextInput(t) {
    return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
  }

  // Scope tabs
  if (scopeEl) {
    scopeEl.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-scope]');
      if (!b) return;
      setScope(b.dataset.scope);
    });
  }
  function cycleScope(delta) {
    var order = ['all', 'post', 'tag', 'page'];
    var i = order.indexOf(scope);
    setScope(order[(i + delta + order.length) % order.length]);
  }
  function setScope(s) {
    scope = s;
    if (scopeEl) {
      scopeEl.querySelectorAll('button[data-scope]').forEach(function (b) {
        b.classList.toggle('on', b.dataset.scope === s);
      });
    }
    sel = 0;
    render(input.value);
  }

  var searchTimeout;
  input.addEventListener('input', function () {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(function () {
      sel = 0;
      render(input.value);
    }, 120);
  });

  function match(s, Q) {
    return !Q || String(s || '').toLowerCase().indexOf(Q) !== -1;
  }

  function render(q) {
    q = (q || '').trim();
    var Q = q.toLowerCase();

    var postMatches = POSTS.filter(function (p) {
      return match(p.title, Q) || match(p.content, Q) || p.tags.some(function (t) { return match(t, Q); });
    });
    var tagMatches = TAGS.filter(function (t) { return match(t.name, Q); });
    var pageMatches = PAGES.filter(function (p) { return match(p.t, Q) || match(p.en, Q); });

    // Rank: title hits first
    postMatches.sort(function (a, b) {
      var at = match(a.title, Q) ? 0 : 1;
      var bt = match(b.title, Q) ? 0 : 1;
      return at - bt;
    });

    // Update scope counts
    if (scopeEl) {
      var counts = {
        all:  postMatches.length + tagMatches.length + pageMatches.length,
        post: postMatches.length,
        tag:  tagMatches.length,
        page: pageMatches.length
      };
      scopeEl.querySelectorAll('button[data-scope]').forEach(function (b) {
        var n = b.querySelector('.n');
        if (n) n.textContent = counts[b.dataset.scope] || 0;
      });
    }

    // Apply scope
    if (scope === 'post') { tagMatches = []; pageMatches = []; }
    else if (scope === 'tag')  { postMatches = []; pageMatches = []; }
    else if (scope === 'page') { postMatches = []; tagMatches = []; }

    var total = postMatches.length + tagMatches.length + pageMatches.length;
    if (countEl) {
      countEl.innerHTML = '<span class="num">' + total + '</span> / ' + POSTS.length;
    }

    var out = '';
    if (!q) {
      // Empty state: recent + quick jump + hot tags + suggested posts
      if (recent.length) {
        out += group('最近搜索', 'Recent', recent.length,
          recent.map(function (rq, i) {
            return rowRecent(rq);
          }).join('')
        );
      }
      if (tagMatches.length) {
        out += group('热门标签', 'Hot tags', Math.min(tagMatches.length, 4),
          tagMatches.slice(0, 4).map(function (t) { return rowTag(t, ''); }).join(''));
      }
      if (postMatches.length) {
        out += group('最近文章', 'Recent posts', Math.min(postMatches.length, 4),
          postMatches.slice(0, 4).map(function (p) { return rowPost(p, ''); }).join(''));
      }
    } else if (total === 0) {
      out = '<div class="sp-empty">' +
        '<div class="glyph">無</div>' +
        '<div class="ti">没找到与「' + escapeHtml(q) + '」相关的内容</div>' +
        '<div class="sb">换个关键词试试，或者：</div>' +
        '<div class="suggest">' +
          TAGS.slice(0, 4).map(function (t) {
            return '<a href="#" data-fill="' + escapeHtml(t.name) + '">' + escapeHtml(t.name) + '</a>';
          }).join('') +
        '</div></div>';
    } else {
      if (postMatches.length) {
        out += group('文章', 'Posts', postMatches.length,
          postMatches.slice(0, 12).map(function (p) { return rowPost(p, q); }).join(''));
      }
      if (tagMatches.length) {
        out += group('标签', 'Tags', tagMatches.length,
          tagMatches.slice(0, 6).map(function (t) { return rowTag(t, q); }).join(''));
      }
      if (pageMatches.length) {
        out += group('页面', 'Pages', pageMatches.length,
          pageMatches.map(rowPage).join(''));
      }
    }

    resultsEl.innerHTML = out;

    resultsEl.querySelectorAll('[data-fill]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        input.value = a.dataset.fill;
        input.dispatchEvent(new Event('input'));
      });
    });

    rows = Array.prototype.slice.call(resultsEl.querySelectorAll('.sp-row'));
    rows.forEach(function (r, i) {
      r.addEventListener('mouseenter', function () { sel = i; updateSelection(); });
      r.addEventListener('click', function (e) {
        if (r.dataset.href && r.dataset.href !== '#') {
          saveRecent(q);
        } else {
          // recent-search row: refill query
          e.preventDefault();
          input.value = decodeURIComponent(r.dataset.q || '');
          input.dispatchEvent(new Event('input'));
        }
      });
    });
    updateSelection();
  }

  function group(han, en, n, innerHTML) {
    if (!innerHTML) return '';
    return '<div class="sp-group"><div class="sp-group-head">' +
      '<span class="han">' + han + '</span>' +
      '<span>' + en + '</span>' +
      '<span class="num">' + n + '</span>' +
      '<span class="rule"></span>' +
      '</div>' + innerHTML + '</div>';
  }

  function rowPost(p, q) {
    var titleHtml = hi(p.title, q);
    var ex = snippet(p.content, q, 140);
    return '<a class="sp-row" data-kind="post"' +
      ' data-href="' + escapeHtml(p.url) + '"' +
      ' data-t="' + encodeURIComponent(p.title) + '"' +
      ' data-ex="' + encodeURIComponent(ex) + '"' +
      ' data-q="' + encodeURIComponent(q || '') + '"' +
      ' data-date="' + escapeHtml(p.date) + '"' +
      ' data-read="' + escapeHtml(p.read) + '"' +
      ' data-tags="' + escapeHtml(p.tags.join(',')) + '">' +
      '<span class="sp-row-ic">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 4h10l4 4v12H6z"/><path d="M14 4v4h4"/><path d="M9 13h8M9 17h6"/></svg>' +
      '</span>' +
      '<div class="sp-row-main">' +
        '<div class="sp-row-title">' + titleHtml + '</div>' +
        '<div class="sp-row-sub">' +
          (p.date ? '<span>' + escapeHtml(p.date) + '</span><span class="dot"></span>' : '') +
          '<span>' + escapeHtml(p.read) + '</span>' +
          (p.tags.length ? '<span class="dot"></span>' + p.tags.slice(0, 2).map(function (tg) { return '<span class="tg">' + escapeHtml(tg) + '</span>'; }).join('') : '') +
        '</div>' +
      '</div>' +
      '<div class="sp-row-meta"></div>' +
      '<div class="sp-row-kbd"><span class="kk">⏎</span></div>' +
      '</a>';
  }

  function rowTag(t, q) {
    var href = '/tags/' + encodeURIComponent(t.name) + '/';
    return '<a class="sp-row tag" data-kind="tag"' +
      ' data-href="' + href + '"' +
      ' data-t="' + encodeURIComponent(t.name) + '"' +
      ' data-n="' + t.n + '">' +
      '<span class="sp-row-ic">#</span>' +
      '<div class="sp-row-main">' +
        '<div class="sp-row-title">' + hi(t.name, q) + '</div>' +
        '<div class="sp-row-sub"><span class="cat">TAG</span><span class="dot"></span><span>' + t.n + ' 篇</span></div>' +
      '</div>' +
      '<div class="sp-row-meta"><span class="count">' + t.n + '</span><span>篇</span></div>' +
      '<div class="sp-row-kbd"><span class="kk">⏎</span></div>' +
      '</a>';
  }

  function rowPage(p) {
    return '<a class="sp-row page" data-kind="page"' +
      ' data-href="' + escapeHtml(p.href) + '"' +
      ' data-t="' + encodeURIComponent(p.t) + '"' +
      ' data-en="' + escapeHtml(p.en) + '">' +
      '<span class="sp-row-ic">' + escapeHtml(p.ic) + '</span>' +
      '<div class="sp-row-main">' +
        '<div class="sp-row-title">' + escapeHtml(p.t) + ' <span class="en">' + escapeHtml(p.en) + '</span></div>' +
        '<div class="sp-row-sub"><span class="cat">NAV</span><span class="dot"></span><span>' + escapeHtml(p.href) + '</span></div>' +
      '</div>' +
      '<div class="sp-row-meta"></div>' +
      '<div class="sp-row-kbd"><span class="kk">⏎</span></div>' +
      '</a>';
  }

  function rowRecent(rq) {
    return '<a class="sp-row" data-kind="recent"' +
      ' data-href="#"' +
      ' data-q="' + encodeURIComponent(rq) + '"' +
      ' data-t="' + encodeURIComponent(rq) + '">' +
      '<span class="sp-row-ic">史</span>' +
      '<div class="sp-row-main">' +
        '<div class="sp-row-title">' + escapeHtml(rq) + '</div>' +
        '<div class="sp-row-sub"><span class="cat">QUERY</span><span class="dot"></span><span>最近搜索</span></div>' +
      '</div>' +
      '<div class="sp-row-meta"></div>' +
      '<div class="sp-row-kbd"><span class="kk">⏎</span></div>' +
      '</a>';
  }

  function move(delta) {
    if (!rows.length) return;
    sel = (sel + delta + rows.length) % rows.length;
    updateSelection();
  }
  function updateSelection() {
    rows.forEach(function (r, i) { r.classList.toggle('on', i === sel); });
    var r = rows[sel];
    if (!r) { previewEl && (previewEl.innerHTML = ''); return; }
    var rt = r.offsetTop, rb = rt + r.offsetHeight;
    var pt = resultsEl.scrollTop, pb = pt + resultsEl.clientHeight;
    if (rt < pt) resultsEl.scrollTop = rt - 8;
    else if (rb > pb) resultsEl.scrollTop = rb - resultsEl.clientHeight + 8;
    renderPreview(r);
  }

  function renderPreview(r) {
    if (!previewEl) return;
    var kind = r.dataset.kind;
    var t = decodeURIComponent(r.dataset.t || '');
    var ex = decodeURIComponent(r.dataset.ex || '');
    var html = '';
    if (kind === 'post') {
      var tags = (r.dataset.tags || '').split(',').filter(Boolean);
      var q = decodeURIComponent(r.dataset.q || '');
      html =
        '<div class="sp-preview-lbl">预览 · Preview</div>' +
        '<div class="sp-prev-card">' +
          '<div class="sp-prev-kicker">' + escapeHtml(r.dataset.date || '') + ' · ' + escapeHtml(r.dataset.read || '') + '</div>' +
          '<div class="sp-prev-title">' + hi(t, q) + '</div>' +
          (ex ? '<div class="sp-prev-excerpt">' + hi(ex, q) + '</div>' : '') +
          (tags.length ? '<div class="sp-prev-meta">' +
            tags.map(function (tg) { return '<span class="mtag">#' + escapeHtml(tg) + '</span>'; }).join('') +
          '</div>' : '') +
        '</div>';
    } else if (kind === 'tag') {
      html =
        '<div class="sp-preview-lbl">标签 · Tag</div>' +
        '<div class="sp-prev-card">' +
          '<div class="sp-prev-kicker">TAG · ' + (r.dataset.n || 0) + ' 篇</div>' +
          '<div class="sp-prev-title">#' + escapeHtml(t) + '</div>' +
          '<div class="sp-prev-excerpt">查看所有带有 <mark>' + escapeHtml(t) + '</mark> 标签的文章。</div>' +
          '<div class="sp-prev-meta">' +
            '<span class="mtag">⏎ 打开</span>' +
            '<span class="mtag">' + escapeHtml(r.dataset.href || '') + '</span>' +
          '</div>' +
        '</div>';
    } else if (kind === 'page') {
      html =
        '<div class="sp-preview-lbl">导航 · Navigate</div>' +
        '<div class="sp-prev-card">' +
          '<div class="sp-prev-kicker">NAV · 内链</div>' +
          '<div class="sp-prev-title">' + escapeHtml(t) + ' <span class="en">' + escapeHtml(r.dataset.en || '') + '</span></div>' +
          '<div class="sp-prev-excerpt">前往 ' + escapeHtml(r.dataset.href || '') + '</div>' +
          '<div class="sp-prev-meta"><span class="mtag">⏎ 跳转</span></div>' +
        '</div>';
    } else {
      html =
        '<div class="sp-preview-lbl">最近搜索</div>' +
        '<div class="sp-prev-card">' +
          '<div class="sp-prev-kicker">QUERY HISTORY</div>' +
          '<div class="sp-prev-title">' + escapeHtml(t) + '</div>' +
          '<div class="sp-prev-excerpt">点击或按 ⏎ 重新检索。</div>' +
        '</div>';
    }
    previewEl.innerHTML = html;
  }
})();
