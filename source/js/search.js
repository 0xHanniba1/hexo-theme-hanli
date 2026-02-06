/**
 * Search functionality for hexo-theme-hanli
 * Requires hexo-generator-searchdb plugin
 */
(function() {
  'use strict';

  var searchModal = document.getElementById('search-modal');
  var searchInput = document.getElementById('search-input');
  var searchResults = document.getElementById('search-results');
  var searchData = null;
  var activeIndex = -1;

  // Exit if search is not enabled
  if (!searchModal || !searchInput) return;

  // Load search data
  function loadSearchData() {
    if (searchData) return Promise.resolve(searchData);

    var searchPath = window.searchPath || '/search.json';
    return fetch(searchPath)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        searchData = data;
        return data;
      })
      .catch(function(err) {
        console.error('Failed to load search data:', err);
        return [];
      });
  }

  // Open search modal
  function openSearch() {
    searchModal.classList.add('active');
    searchInput.focus();
    document.body.style.overflow = 'hidden';
    loadSearchData();
  }

  // Close search modal
  function closeSearch() {
    searchModal.classList.remove('active');
    searchInput.value = '';
    searchResults.innerHTML = '<div class="search-empty">输入关键词开始搜索</div>';
    activeIndex = -1;
    document.body.style.overflow = '';
  }

  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Highlight matching text
  function highlightText(text, keyword) {
    if (!text || !keyword) return escapeHtml(text || '');
    var escaped = escapeHtml(text);
    var regex = new RegExp('(' + keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    return escaped.replace(regex, '<span class="search-highlight">$1</span>');
  }

  // Extract content snippet around keyword
  function getSnippet(content, keyword, length) {
    length = length || 150;
    if (!content || !keyword) return content ? content.substring(0, length) : '';

    var lowerContent = content.toLowerCase();
    var lowerKeyword = keyword.toLowerCase();
    var index = lowerContent.indexOf(lowerKeyword);

    if (index === -1) {
      return content.substring(0, length);
    }

    var start = Math.max(0, index - 30);
    var end = Math.min(content.length, index + keyword.length + length - 30);
    var snippet = content.substring(start, end);

    if (start > 0) snippet = '...' + snippet;
    if (end < content.length) snippet = snippet + '...';

    return snippet;
  }

  // Perform search
  function performSearch(keyword) {
    if (!keyword || keyword.trim().length < 1) {
      searchResults.innerHTML = '<div class="search-empty">输入关键词开始搜索</div>';
      activeIndex = -1;
      return;
    }

    keyword = keyword.trim().toLowerCase();

    loadSearchData().then(function(data) {
      var results = [];

      data.forEach(function(item) {
        var titleMatch = item.title && item.title.toLowerCase().indexOf(keyword) !== -1;
        var contentMatch = item.content && item.content.toLowerCase().indexOf(keyword) !== -1;
        var tagMatch = item.tags && item.tags.some(function(tag) {
          return tag.name && tag.name.toLowerCase().indexOf(keyword) !== -1;
        });

        if (titleMatch || contentMatch || tagMatch) {
          results.push({
            title: item.title,
            content: item.content,
            url: item.url,
            tags: item.tags || [],
            titleMatch: titleMatch,
            contentMatch: contentMatch,
            tagMatch: tagMatch
          });
        }
      });

      // Sort: title matches first, then content matches
      results.sort(function(a, b) {
        if (a.titleMatch && !b.titleMatch) return -1;
        if (!a.titleMatch && b.titleMatch) return 1;
        return 0;
      });

      renderResults(results, keyword);
    });
  }

  // Render search results
  function renderResults(results, keyword) {
    activeIndex = -1;

    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-no-result"><i class="fa fa-search"></i>没有找到相关结果</div>';
      return;
    }

    var html = results.slice(0, 20).map(function(item, index) {
      var snippet = getSnippet(item.content, keyword, 120);
      var tagsHtml = item.tags.slice(0, 3).map(function(tag) {
        return '<span class="search-result-tag">' + escapeHtml(tag.name) + '</span>';
      }).join('');

      return '<a class="search-result-item" href="' + item.url + '" data-index="' + index + '">' +
        '<div class="search-result-title">' + highlightText(item.title, keyword) + '</div>' +
        '<div class="search-result-content">' + highlightText(snippet, keyword) + '</div>' +
        (tagsHtml ? '<div class="search-result-meta">' + tagsHtml + '</div>' : '') +
      '</a>';
    }).join('');

    searchResults.innerHTML = html;
  }

  // Navigate results with keyboard
  function navigateResults(direction) {
    var items = searchResults.querySelectorAll('.search-result-item');
    if (items.length === 0) return;

    if (activeIndex >= 0 && activeIndex < items.length) {
      items[activeIndex].classList.remove('active');
    }

    if (direction === 'down') {
      activeIndex = activeIndex < items.length - 1 ? activeIndex + 1 : 0;
    } else {
      activeIndex = activeIndex > 0 ? activeIndex - 1 : items.length - 1;
    }

    items[activeIndex].classList.add('active');
    items[activeIndex].scrollIntoView({ block: 'nearest' });
  }

  // Select current result
  function selectResult() {
    var items = searchResults.querySelectorAll('.search-result-item');
    if (activeIndex >= 0 && activeIndex < items.length) {
      window.location.href = items[activeIndex].href;
    }
  }

  // Event: Click search trigger
  document.querySelectorAll('.search-trigger').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.preventDefault();
      openSearch();
    });
  });

  // Event: Close button
  var closeBtn = searchModal.querySelector('.search-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeSearch);
  }

  // Event: Click overlay to close
  var overlay = searchModal.querySelector('.search-modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', closeSearch);
  }

  // Event: Input search
  var searchTimeout;
  searchInput.addEventListener('input', function() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(function() {
      performSearch(searchInput.value);
    }, 200);
  });

  // Event: Keyboard navigation
  searchInput.addEventListener('keydown', function(e) {
    switch(e.key) {
      case 'ArrowDown':
        e.preventDefault();
        navigateResults('down');
        break;
      case 'ArrowUp':
        e.preventDefault();
        navigateResults('up');
        break;
      case 'Enter':
        e.preventDefault();
        selectResult();
        break;
      case 'Escape':
        closeSearch();
        break;
    }
  });

  // Event: Global keyboard shortcut (Ctrl+K or Cmd+K)
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (searchModal.classList.contains('active')) {
        closeSearch();
      } else {
        openSearch();
      }
    }

    // ESC to close
    if (e.key === 'Escape' && searchModal.classList.contains('active')) {
      closeSearch();
    }
  });

  // Event: Click result item
  searchResults.addEventListener('click', function(e) {
    var item = e.target.closest('.search-result-item');
    if (item) {
      // Let the natural link behavior work
    }
  });

})();
