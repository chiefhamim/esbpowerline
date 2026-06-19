/* ========================================
   ESB PowerLine — Bangladesh Energy & Power News Portal
   Application Logic
   ======================================== */

// ============================================================
// 1. DATA STORE INTEGRATION
// ============================================================
let newsArticles = [];
if (typeof ESBDataStore !== 'undefined') {
  // Use datastore for articles
  newsArticles = ESBDataStore.Articles.getPublished().sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Update UI when articles change
  ESBDataStore.on('articles_changed', () => {
    newsArticles = ESBDataStore.Articles.getPublished().sort((a, b) => new Date(b.date) - new Date(a.date));
    if (typeof ArticleRenderer !== 'undefined') {
      const activeCategory = document.querySelector('.category-pill.active')?.dataset.category || 'all';
      ArticleRenderer.filterByCategory(activeCategory);
      if (typeof TickerController !== 'undefined') TickerController.init();
      if (typeof HeroController !== 'undefined') HeroController.init();
    }
  });
}

// ============================================================
// 2. UTILITY FUNCTIONS
// ============================================================
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function truncateText(text, length = 120) {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

function throttle(fn, limit = 100) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

function generateId() {
  return 'id-' + Math.random().toString(36).substr(2, 9);
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    return true;
  }
}

// ============================================================
// 3. APP STATE
// ============================================================
const state = {
  currentCategory: 'all',
  currentSort: 'date',
  currentView: 'grid',
  currentPage: 1,
  articlesPerPage: 6,
  currentArticleIndex: -1,
  theme: 'dark',
  fontSize: 'medium',
  animations: true,
  autoRefresh: true,
  recentSearches: [],
  dashboardInterval: null
};

// ============================================================
// 4. THEME MANAGER
// ============================================================
const ThemeManager = {
  init() {
    const saved = localStorage.getItem('esb-theme');
    if (saved === 'light' || saved === 'dark') {
      this.set(saved);
    } else if (saved === 'system' || !saved) {
      this.setSystem();
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (state.theme === 'system') this.setSystem();
    });
  },

  set(theme) {
    state.theme = theme;
    if (theme === 'system') {
      this.setSystem();
      return;
    }
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('esb-theme', theme);
    this.updateSettingsUI();
  },

  setSystem() {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    state.theme = 'system';
    localStorage.setItem('esb-theme', 'system');
    this.updateSettingsUI();
  },

  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    this.set(current === 'dark' ? 'light' : 'dark');
  },

  updateSettingsUI() {
    document.querySelectorAll('[data-setting="theme"]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.value === state.theme);
    });
  }
};

// ============================================================
// 5. NAVIGATION CONTROLLER
// ============================================================
const NavController = {
  init() {
    const hamburger = document.getElementById('hamburgerBtn');
    const mobileNav = document.getElementById('mobileNav');
    const mobileClose = document.getElementById('mobileNavClose');
    const mobileSearchBtn = document.getElementById('mobileSearchBtn');

    hamburger?.addEventListener('click', () => this.toggleMobile());
    mobileClose?.addEventListener('click', () => this.closeMobile());
    mobileNav?.addEventListener('click', (e) => {
      if (e.target === mobileNav) this.closeMobile();
    });
    mobileSearchBtn?.addEventListener('click', () => {
      this.closeMobile();
      SearchController.open();
    });

    // Mobile nav links
    document.querySelectorAll('.mobile-nav__link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = link.dataset.category;
        ArticleRenderer.filterByCategory(category);
        this.closeMobile();
        // Update active state
        document.querySelectorAll('.mobile-nav__link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });

    // Scroll handling
    window.addEventListener('scroll', throttle(() => this.onScroll(), 50));
  },

  toggleMobile() {
    const mobileNav = document.getElementById('mobileNav');
    const hamburger = document.getElementById('hamburgerBtn');
    mobileNav?.classList.toggle('active');
    hamburger?.classList.toggle('active');
    document.body.style.overflow = mobileNav?.classList.contains('active') ? 'hidden' : '';
  },

  closeMobile() {
    document.getElementById('mobileNav')?.classList.remove('active');
    document.getElementById('hamburgerBtn')?.classList.remove('active');
    document.body.style.overflow = '';
  },

  onScroll() {
    const navbar = document.getElementById('navbar');
    const scrollTop = window.scrollY;
    navbar?.classList.toggle('scrolled', scrollTop > 50);

    // Scroll to top button
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    scrollTopBtn?.classList.toggle('visible', scrollTop > 300);

    // Reading progress
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    const progressBar = document.getElementById('readingProgressBar');
    if (progressBar) progressBar.style.width = progress + '%';
  }
};

// ============================================================
// 6. BREAKING NEWS TICKER
// ============================================================
const TickerController = {
  init() {
    const track = document.getElementById('tickerTrack');
    if (!track) return;

    const breakingNews = newsArticles.filter(a => a.isBreaking);
    if (breakingNews.length === 0) {
      document.getElementById('breakingTicker')?.classList.add('hidden');
      return;
    }

    const items = breakingNews.map(a =>
      `<span class="ticker__item" data-id="${a.id}">${a.title}</span>`
    ).join('');

    // Duplicate for seamless loop
    track.innerHTML = items + items;

    // Click handlers
    track.querySelectorAll('.ticker__item').forEach(item => {
      item.addEventListener('click', () => {
        const article = newsArticles.find(a => a.id === item.dataset.id);
        if (article) ArticleModal.open(article);
      });
    });
  }
};

// ============================================================
// 7. ARTICLE RENDERER
// ============================================================
const ArticleRenderer = {
  init() {
    this.renderHero();
    this.renderArticles();
    this.renderTrending();
    this.setupEventListeners();
  },

  renderHero() {
    const heroMain = document.getElementById('heroMain');
    const heroSide = document.getElementById('heroSide');
    const featured = newsArticles.filter(a => a.isFeatured);

    if (featured.length > 0 && heroMain) {
      const main = featured[0];
      heroMain.innerHTML = `
        <img class="hero__main-image" src="${main.imageUrl}" alt="${main.title}" loading="eager">
        <div class="hero__main-overlay">
          <span class="hero__main-category">${main.category}</span>
          <h1 class="hero__main-title">${main.title}</h1>
          <p class="hero__main-excerpt">${main.excerpt}</p>
          <div class="hero__main-meta">
            <span><i data-lucide="user"></i> ${main.author}</span>
            <span><i data-lucide="clock"></i> ${formatDate(main.date)}</span>
            <span><i data-lucide="book-open"></i> ${main.readTime} min read</span>
          </div>
        </div>
      `;
      heroMain.addEventListener('click', () => ArticleModal.open(main));
    }

    if (heroSide && featured.length > 1) {
      heroSide.innerHTML = featured.slice(1, 3).map(a => `
        <article class="hero__side-card" data-id="${a.id}">
          <img class="hero__side-card-image" src="${a.imageUrl}" alt="${a.title}" loading="eager">
          <div class="hero__side-card-overlay">
            <span class="hero__side-card-category">${a.category}</span>
            <h2 class="hero__side-card-title">${a.title}</h2>
            <div class="hero__side-card-meta">
              <span>${formatDate(a.date)}</span>
              <span>${a.readTime} min read</span>
            </div>
          </div>
        </article>
      `).join('');

      heroSide.querySelectorAll('.hero__side-card').forEach(card => {
        card.addEventListener('click', () => {
          const article = newsArticles.find(a => a.id === card.dataset.id);
          if (article) ArticleModal.open(article);
        });
      });
    }

    // Re-init Lucide icons
    if (typeof lucide !== 'undefined') lucide.createIcons();
  },

  getFilteredArticles() {
    let articles = [...newsArticles];

    // Filter by category
    if (state.currentCategory !== 'all') {
      articles = articles.filter(a => a.category === state.currentCategory);
    }

    // Sort
    switch (state.currentSort) {
      case 'views':
        articles.sort((a, b) => b.views - a.views);
        break;
      case 'relevance':
        articles.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || b.views - a.views);
        break;
      case 'date':
      default:
        articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return articles;
  },

  renderArticles(append = false) {
    const grid = document.getElementById('articlesGrid');
    const noResults = document.getElementById('noResults');
    const loadMore = document.getElementById('loadMore');
    if (!grid) return;

    const filtered = this.getFilteredArticles();
    const start = append ? (state.currentPage - 1) * state.articlesPerPage : 0;
    const end = state.currentPage * state.articlesPerPage;
    const toShow = filtered.slice(start, end);

    if (filtered.length === 0) {
      grid.innerHTML = '';
      noResults?.classList.remove('hidden');
      loadMore?.classList.add('hidden');
      return;
    }

    noResults?.classList.add('hidden');

    const html = toShow.map((a, i) => `
      <article class="article-card" data-id="${a.id}" style="animation-delay: ${i * 0.08}s">
        <div class="article-card__image-wrapper">
          <img class="article-card__image" src="${a.imageUrl}" alt="${a.title}" loading="lazy">
          <span class="article-card__category">${a.category}</span>
        </div>
        <div class="article-card__body">
          <h3 class="article-card__title">${a.title}</h3>
          <p class="article-card__excerpt">${a.excerpt}</p>
          <div class="article-card__footer">
            <span class="article-card__author">
              <i data-lucide="user"></i> ${a.author}
            </span>
            <div class="article-card__stats">
              <span><i data-lucide="clock"></i> ${formatDate(a.date)}</span>
              <span><i data-lucide="eye"></i> ${formatNumber(a.views)}</span>
            </div>
          </div>
        </div>
      </article>
    `).join('');

    if (append) {
      grid.insertAdjacentHTML('beforeend', html);
    } else {
      grid.innerHTML = html;
    }

    // Show/hide load more
    if (end >= filtered.length) {
      loadMore?.classList.add('hidden');
    } else {
      loadMore?.classList.remove('hidden');
    }

    // Apply view mode
    grid.classList.toggle('list-view', state.currentView === 'list');

    // Attach click handlers
    grid.querySelectorAll('.article-card').forEach(card => {
      card.addEventListener('click', () => {
        const article = newsArticles.find(a => a.id === card.dataset.id);
        if (article) ArticleModal.open(article);
      });
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
  },

  filterByCategory(category) {
    state.currentCategory = category;
    state.currentPage = 1;

    // Update nav active state
    document.querySelectorAll('.navbar__link').forEach(link => {
      link.classList.toggle('active', link.dataset.category === category);
    });

    // Update category pills
    document.querySelectorAll('.category-pill').forEach(pill => {
      pill.classList.toggle('active', pill.dataset.category === category);
    });

    // Update section title
    const title = document.getElementById('articlesSectionTitle');
    if (title) {
      const icon = title.querySelector('i, svg');
      title.innerHTML = '';
      if (icon) title.appendChild(icon);
      title.append(` ${category === 'all' ? 'Latest News' : category}`);
    }
    root.style.setProperty('--color-primary-bg', `rgba(${hexToRgb(theme.p)}, 0.1)`);

    this.renderArticles();
    if (typeof lucide !== 'undefined') lucide.createIcons();
  },

  renderTrending() {
    const container = document.getElementById('trendingList');
    if (!container) return;

    const trending = [...newsArticles]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    container.innerHTML = trending.map((a, i) => `
      <div class="trending-item" data-id="${a.id}">
        <span class="trending-item__rank">${String(i + 1).padStart(2, '0')}</span>
        <div class="trending-item__info">
          <h4 class="trending-item__title">${a.title}</h4>
          <span class="trending-item__meta">${a.category} · ${formatDate(a.date)}</span>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.trending-item').forEach(item => {
      item.addEventListener('click', () => {
        const article = newsArticles.find(a => a.id === item.dataset.id);
        if (article) ArticleModal.open(article);
      });
    });
  },

  setupEventListeners() {
    // Category pills
    document.querySelectorAll('.category-pill').forEach(pill => {
      pill.addEventListener('click', () => this.filterByCategory(pill.dataset.category));
    });

    // Navbar category links
    document.querySelectorAll('.navbar__link[data-category]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.filterByCategory(link.dataset.category);
      });
    });

    // Dropdown items
    document.querySelectorAll('.navbar__dropdown-item[data-category]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.filterByCategory(link.dataset.category);
      });
    });

    // Sort select
    const sortSelect = document.getElementById('sortSelect');
    sortSelect?.addEventListener('change', () => {
      state.currentSort = sortSelect.value;
      state.currentPage = 1;
      this.renderArticles();
    });

    // Load more button
    document.getElementById('loadMoreBtn')?.addEventListener('click', () => {
      state.currentPage++;
      this.renderArticles(true);
    });

    // Clear filters
    document.getElementById('clearFiltersBtn')?.addEventListener('click', () => {
      this.filterByCategory('all');
    });

    // View toggle
    document.querySelectorAll('.view-toggle__btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.currentView = btn.dataset.view;
        document.querySelectorAll('.view-toggle__btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const grid = document.getElementById('articlesGrid');
        grid?.classList.toggle('list-view', state.currentView === 'list');
      });
    });
  }
};

// ============================================================
// 8. SEARCH CONTROLLER
// ============================================================
const SearchController = {
  init() {
    const searchToggle = document.getElementById('searchToggle');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');
    const searchOverlay = document.getElementById('searchOverlay');

    searchToggle?.addEventListener('click', () => this.open());
    searchClose?.addEventListener('click', () => this.close());
    searchOverlay?.addEventListener('click', (e) => {
      if (e.target === searchOverlay) this.close();
    });

    searchInput?.addEventListener('input', debounce(() => this.search(searchInput.value), 300));

    // Trending tags
    document.querySelectorAll('.tag[data-search]').forEach(tag => {
      tag.addEventListener('click', () => {
        searchInput.value = tag.dataset.search;
        this.search(tag.dataset.search);
      });
    });

    // Load recent searches
    this.loadRecentSearches();
  },

  open() {
    const overlay = document.getElementById('searchOverlay');
    overlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('searchInput')?.focus(), 100);
  },

  close() {
    const overlay = document.getElementById('searchOverlay');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
    document.getElementById('searchInput').value = '';
    document.getElementById('searchResults').innerHTML = '';
  },

  search(query) {
    const results = document.getElementById('searchResults');
    const suggestions = document.getElementById('searchSuggestions');
    if (!query || query.trim().length < 2) {
      results.innerHTML = '';
      suggestions.style.display = '';
      return;
    }

    suggestions.style.display = 'none';
    const q = query.toLowerCase();
    const matches = newsArticles.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.tags.some(t => t.toLowerCase().includes(q)) ||
      a.category.toLowerCase().includes(q)
    );

    if (matches.length === 0) {
      results.innerHTML = `
        <div class="no-results" style="padding: 2rem 0;">
          <p style="color: var(--text-muted);">No articles found for "${query}"</p>
        </div>
      `;
      return;
    }

    results.innerHTML = `
      <h4>${matches.length} result${matches.length > 1 ? 's' : ''} found</h4>
      ${matches.map(a => `
        <div class="search-result-card" data-id="${a.id}">
          <img class="search-result-card__image" src="${a.imageUrl}" alt="${a.title}" loading="lazy">
          <div class="search-result-card__info">
            <h5 class="search-result-card__title">${a.title}</h5>
            <span class="search-result-card__meta">${a.category} · ${formatDate(a.date)}</span>
          </div>
        </div>
      `).join('')}
    `;

    // Save to recent
    this.saveRecentSearch(query);

    // Click handlers
    results.querySelectorAll('.search-result-card').forEach(card => {
      card.addEventListener('click', () => {
        const article = newsArticles.find(a => a.id === card.dataset.id);
        if (article) {
          this.close();
          ArticleModal.open(article);
        }
      });
    });
  },

  saveRecentSearch(query) {
    let recent = JSON.parse(localStorage.getItem('esb-recent-searches') || '[]');
    recent = recent.filter(s => s !== query);
    recent.unshift(query);
    recent = recent.slice(0, 5);
    localStorage.setItem('esb-recent-searches', JSON.stringify(recent));
  },

  loadRecentSearches() {
    const list = document.getElementById('recentSearchList');
    const recent = JSON.parse(localStorage.getItem('esb-recent-searches') || '[]');
    if (!list) return;

    if (recent.length === 0) {
      document.getElementById('recentSearches')?.classList.add('hidden');
      return;
    }

    document.getElementById('recentSearches')?.classList.remove('hidden');
    list.innerHTML = recent.map(s => `<span class="tag" data-search="${s}">${s}</span>`).join('');

    list.querySelectorAll('.tag').forEach(tag => {
      tag.addEventListener('click', () => {
        const input = document.getElementById('searchInput');
        input.value = tag.dataset.search;
        this.search(tag.dataset.search);
      });
    });
  }
};

// ============================================================
// 9. ARTICLE MODAL
// ============================================================
const ArticleModal = {
  init() {
    const close = document.getElementById('articleModalClose');
    const overlay = document.getElementById('articleModalOverlay');
    const shareBtn = document.getElementById('modalShareBtn');
    const prevBtn = document.getElementById('modalPrevBtn');
    const nextBtn = document.getElementById('modalNextBtn');

    close?.addEventListener('click', () => this.close());
    overlay?.addEventListener('click', () => this.close());
    shareBtn?.addEventListener('click', () => this.share());
    prevBtn?.addEventListener('click', () => this.navigate(-1));
    nextBtn?.addEventListener('click', () => this.navigate(1));
  },

  open(article) {
    const modal = document.getElementById('articleModal');
    const content = document.getElementById('articleModalContent');
    if (!modal || !content) return;

    state.currentArticleIndex = newsArticles.findIndex(a => a.id === article.id);

    content.innerHTML = `
      <img class="modal-article__image" src="${article.imageUrl}" alt="${article.title}">
      <span class="modal-article__category">${article.category}</span>
      <h2 class="modal-article__title">${article.title}</h2>
      <div class="modal-article__meta">
        <span><i data-lucide="user"></i> ${article.author}</span>
        <span><i data-lucide="calendar"></i> ${new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        <span><i data-lucide="clock"></i> ${article.readTime} min read</span>
        <span><i data-lucide="eye"></i> ${formatNumber(article.views)} views</span>
      </div>
      <div class="modal-article__body">
        ${article.content}
      </div>
      <div class="modal-article__tags">
        ${article.tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
    `;

    // Related articles
    this.renderRelated(article);

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Scroll to top of modal content
    modal.querySelector('.article-modal__container')?.scrollTo(0, 0);

    if (typeof lucide !== 'undefined') lucide.createIcons();
  },

  close() {
    document.getElementById('articleModal')?.classList.remove('active');
    document.body.style.overflow = '';
    state.currentArticleIndex = -1;
  },

  navigate(direction) {
    const articles = ArticleRenderer.getFilteredArticles();
    let newIndex = state.currentArticleIndex + direction;
    if (newIndex < 0) newIndex = articles.length - 1;
    if (newIndex >= articles.length) newIndex = 0;
    // Find the article in the original array
    const article = newsArticles[newIndex] || articles[0];
    if (article) this.open(article);
  },

  share() {
    const article = newsArticles[state.currentArticleIndex];
    if (!article) return;
    const text = `${article.title} - ESB PowerLine`;
    copyToClipboard(text).then(() => {
      ToastManager.show('Link copied to clipboard!', 'success');
    });
  },

  renderRelated(article) {
    const container = document.getElementById('modalRelatedList');
    if (!container) return;

    const related = newsArticles
      .filter(a => a.id !== article.id && (a.category === article.category || a.tags.some(t => article.tags.includes(t))))
      .slice(0, 3);

    container.innerHTML = related.map(a => `
      <div class="related-card" data-id="${a.id}">
        <img class="related-card__image" src="${a.imageUrl}" alt="${a.title}" loading="lazy">
        <h5 class="related-card__title">${a.title}</h5>
      </div>
    `).join('');

    container.querySelectorAll('.related-card').forEach(card => {
      card.addEventListener('click', () => {
        const relArticle = newsArticles.find(a => a.id === card.dataset.id);
        if (relArticle) this.open(relArticle);
      });
    });
  }
};

// ============================================================
// 10. ENERGY DASHBOARD
// ============================================================
const Dashboard = {
  targets: {
    generation: 25514,
    demand: 15230,
    renewable: 4.2,
    loss: 8.1
  },

  init() {
    // Use IntersectionObserver to trigger animation
    const dashboard = document.getElementById('energyDashboard');
    if (!dashboard) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(dashboard);

    // Auto-refresh
    if (state.autoRefresh) {
      state.dashboardInterval = setInterval(() => this.refreshData(), 30000);
    }
  },

  animateCounters() {
    this.animateCounter('statGeneration', 0, this.targets.generation, 2000, false);
    this.animateCounter('statDemand', 0, this.targets.demand, 2000, false);
    this.animateCounter('statRenewable', 0, this.targets.renewable, 1500, true);
    this.animateCounter('statLoss', 0, this.targets.loss, 1500, true);
  },

  animateCounter(elementId, start, end, duration, isDecimal) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const startTime = performance.now();
    const step = (timestamp) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = start + (end - start) * eased;
      el.textContent = isDecimal ? current.toFixed(1) : formatNumber(Math.round(current));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  },

  refreshData() {
    // Simulate fluctuations
    const variation = (base, range) => base + (Math.random() - 0.5) * range;
    this.targets.generation = Math.round(variation(25514, 500));
    this.targets.demand = Math.round(variation(15230, 800));
    this.targets.renewable = parseFloat(variation(4.2, 0.5).toFixed(1));
    this.targets.loss = parseFloat(variation(8.1, 0.4).toFixed(1));

    // Update values with animation
    this.animateCounter('statGeneration', parseInt(document.getElementById('statGeneration')?.textContent.replace(/,/g, '') || 0), this.targets.generation, 800, false);
    this.animateCounter('statDemand', parseInt(document.getElementById('statDemand')?.textContent.replace(/,/g, '') || 0), this.targets.demand, 800, false);
    this.animateCounter('statRenewable', parseFloat(document.getElementById('statRenewable')?.textContent || 0), this.targets.renewable, 600, true);
    this.animateCounter('statLoss', parseFloat(document.getElementById('statLoss')?.textContent || 0), this.targets.loss, 600, true);
  }
};

// ============================================================
// 11. TOAST MANAGER
// ============================================================
const ToastManager = {
  show(message, type = 'info', duration = 4000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const iconMap = {
      success: 'check-circle',
      error: 'x-circle',
      warning: 'alert-triangle',
      info: 'info'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      <i data-lucide="${iconMap[type] || 'info'}" class="toast__icon"></i>
      <span class="toast__message">${message}</span>
      <button class="toast__close"><i data-lucide="x"></i></button>
    `;

    container.appendChild(toast);
    if (typeof lucide !== 'undefined') lucide.createIcons();

    toast.querySelector('.toast__close')?.addEventListener('click', () => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    });

    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
      }
    }, duration);
  }
};

// ============================================================
// 12. NEWSLETTER
// ============================================================
const Newsletter = {
  init() {
    const form = document.getElementById('newsletterForm');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('newsletterEmail')?.value;
      if (email && this.validateEmail(email)) {
        const subscribers = JSON.parse(localStorage.getItem('esb-subscribers') || '[]');
        if (subscribers.includes(email)) {
          ToastManager.show('You are already subscribed!', 'warning');
        } else {
          subscribers.push(email);
          localStorage.setItem('esb-subscribers', JSON.stringify(subscribers));
          ToastManager.show('Successfully subscribed! Welcome aboard ⚡', 'success');
          document.getElementById('newsletterEmail').value = '';
        }
      } else {
        ToastManager.show('Please enter a valid email address.', 'error');
      }
    });
  },

  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
};

// ============================================================
// 13. SETTINGS PANEL
// ============================================================
const SettingsPanel = {
  init() {
    const toggle = document.getElementById('settingsToggle');
    const close = document.getElementById('settingsPanelClose');
    const overlay = document.getElementById('settingsPanelOverlay');
    const resetBtn = document.getElementById('resetSettingsBtn');

    toggle?.addEventListener('click', () => this.toggle());
    close?.addEventListener('click', () => this.close());
    overlay?.addEventListener('click', () => this.close());
    resetBtn?.addEventListener('click', () => this.reset());

    // Settings options
    document.querySelectorAll('.settings-option').forEach(opt => {
      opt.addEventListener('click', () => {
        const setting = opt.dataset.setting;
        const value = opt.dataset.value;

        // Update active state
        document.querySelectorAll(`[data-setting="${setting}"]`).forEach(o => o.classList.remove('active'));
        opt.classList.add('active');

        this.applySetting(setting, value);
      });
    });

    // Toggle switches
    document.getElementById('animationsToggle')?.addEventListener('change', (e) => {
      state.animations = e.target.checked;
      localStorage.setItem('esb-animations', state.animations);
      document.body.style.setProperty('--transition-base', state.animations ? '0.3s ease' : '0s');
    });

    document.getElementById('autoRefreshToggle')?.addEventListener('change', (e) => {
      state.autoRefresh = e.target.checked;
      localStorage.setItem('esb-autoRefresh', state.autoRefresh);
      if (state.autoRefresh) {
        state.dashboardInterval = setInterval(() => Dashboard.refreshData(), 30000);
      } else {
        clearInterval(state.dashboardInterval);
      }
    });

    // Load saved settings
    this.loadSettings();
  },

  toggle() {
    document.getElementById('settingsPanel')?.classList.toggle('active');
  },

  close() {
    document.getElementById('settingsPanel')?.classList.remove('active');
  },

  applySetting(setting, value) {
    switch (setting) {
      case 'theme':
        ThemeManager.set(value);
        break;
      case 'fontSize':
        state.fontSize = value;
        document.documentElement.setAttribute('data-font-size', value);
        localStorage.setItem('esb-fontSize', value);
        break;
      case 'layout':
        state.currentView = value;
        const grid = document.getElementById('articlesGrid');
        grid?.classList.toggle('list-view', value === 'list');
        document.querySelectorAll('.view-toggle__btn').forEach(btn => {
          btn.classList.toggle('active', btn.dataset.view === value);
        });
        localStorage.setItem('esb-layout', value);
        break;
    }
  },

  loadSettings() {
    const fontSize = localStorage.getItem('esb-fontSize');
    if (fontSize) {
      state.fontSize = fontSize;
      document.documentElement.setAttribute('data-font-size', fontSize);
      document.querySelectorAll('[data-setting="fontSize"]').forEach(o => {
        o.classList.toggle('active', o.dataset.value === fontSize);
      });
    }

    const layout = localStorage.getItem('esb-layout');
    if (layout) {
      state.currentView = layout;
    }

    const animations = localStorage.getItem('esb-animations');
    if (animations !== null) {
      state.animations = animations === 'true';
      const toggle = document.getElementById('animationsToggle');
      if (toggle) toggle.checked = state.animations;
    }

    const autoRefresh = localStorage.getItem('esb-autoRefresh');
    if (autoRefresh !== null) {
      state.autoRefresh = autoRefresh === 'true';
      const toggle = document.getElementById('autoRefreshToggle');
      if (toggle) toggle.checked = state.autoRefresh;
    }
  },

  reset() {
    localStorage.removeItem('esb-theme');
    localStorage.removeItem('esb-fontSize');
    localStorage.removeItem('esb-layout');
    localStorage.removeItem('esb-animations');
    localStorage.removeItem('esb-autoRefresh');
    ThemeManager.set('dark');
    document.documentElement.removeAttribute('data-font-size');
    state.fontSize = 'medium';
    state.currentView = 'grid';
    state.animations = true;
    state.autoRefresh = true;
    document.querySelectorAll('.settings-option').forEach(o => o.classList.remove('active'));
    document.querySelector('[data-setting="theme"][data-value="dark"]')?.classList.add('active');
    document.querySelector('[data-setting="fontSize"][data-value="medium"]')?.classList.add('active');
    document.querySelector('[data-setting="layout"][data-value="grid"]')?.classList.add('active');
    const animToggle = document.getElementById('animationsToggle');
    if (animToggle) animToggle.checked = true;
    const arToggle = document.getElementById('autoRefreshToggle');
    if (arToggle) arToggle.checked = true;
    ToastManager.show('Settings reset to defaults', 'info');
  }
};

// ============================================================
// 14. SCROLL EFFECTS
// ============================================================
const ScrollEffects = {
  init() {
    // Scroll to top
    document.getElementById('scrollTopBtn')?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Animate on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
  }
};

// ============================================================
// 15. KEYBOARD SHORTCUTS
// ============================================================
const KeyboardShortcuts = {
  init() {
    document.addEventListener('keydown', (e) => {
      // Don't trigger if typing in input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        if (e.key === 'Escape') {
          SearchController.close();
          e.target.blur();
        }
        return;
      }

      switch (e.key) {
        case 's':
        case 'S':
        case '/':
          e.preventDefault();
          SearchController.open();
          break;
        case 'k':
        case 'K':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            SearchController.open();
          }
          break;
        case 'Escape':
          ArticleModal.close();
          SearchController.close();
          SettingsPanel.close();
          NavController.closeMobile();
          break;
        case 'd':
        case 'D':
          ThemeManager.toggle();
          break;
        case 'ArrowLeft':
          if (document.getElementById('articleModal')?.classList.contains('active')) {
            e.preventDefault();
            ArticleModal.navigate(-1);
          }
          break;
        case 'ArrowRight':
          if (document.getElementById('articleModal')?.classList.contains('active')) {
            e.preventDefault();
            ArticleModal.navigate(1);
          }
          break;
      }
    });
  }
};

// ============================================================
// 16. INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  ThemeManager.init();
  NavController.init();
  TickerController.init();
  ArticleRenderer.init();
  SearchController.init();
  ArticleModal.init();
  Dashboard.init();
  Newsletter.init();
  SettingsPanel.init();
  ScrollEffects.init();
  KeyboardShortcuts.init();
  InteractiveFeatures.init();

  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Welcome toast (first visit)
  if (!localStorage.getItem('esb-visited')) {
    setTimeout(() => {
      ToastManager.show('Welcome to ESB PowerLine! Press S to search, D to toggle theme.', 'info', 6000);
      localStorage.setItem('esb-visited', 'true');
    }, 2000);
  }

  console.log('%c⚡ ESB PowerLine', 'font-size: 24px; font-weight: bold; color: #0066FF;');
  console.log('%cBangladesh Energy & Power News Portal', 'font-size: 14px; color: #94A3B8;');

  // Initialize Vanilla Tilt if available
  /* if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('.dashboard__card'), {
      max: 10,
      speed: 400,
      glare: true,
      'max-glare': 0.15
    });
    VanillaTilt.init(document.querySelectorAll('.dashboard__chart-container'), {
      max: 3,
      speed: 600,
      glare: true,
      'max-glare': 0.05
    });
    VanillaTilt.init(document.querySelectorAll('.newsletter-card'), {
      max: 10,
      speed: 400,
      glare: true,
      'max-glare': 0.1
    });
  }
}); */


// ============================================================
// MAP & CALCULATOR LOGIC
// ============================================================
const InteractiveFeatures = {
    init() {
        this.initMap();
        this.initCalculator();
    },

    initMap() {
        const plants = {
            'rooppur': { name: 'Rooppur Nuclear Power Plant', type: 'Nuclear', capacity: '2,400 MW', status: 'Commissioning', color: 'var(--info)' },
            'matarbari': { name: 'Matarbari Power Plant', type: 'Coal (Ultra-supercritical)', capacity: '1,200 MW', status: 'Operational', color: 'var(--danger)' },
            'payra': { name: 'Payra Thermal Power Plant', type: 'Coal', capacity: '1,320 MW', status: 'Operational', color: 'var(--danger)' },
            'kaptai': { name: 'Kaptai Hydroelectric', type: 'Hydro', capacity: '230 MW', status: 'Operational', color: 'var(--primary)' },
            'ghorashal': { name: 'Ghorashal Power Station', type: 'Natural Gas', capacity: '950 MW', status: 'Operational', color: 'var(--warning)' }
        };

        const panel = document.getElementById('mapInfoPanel');
        document.querySelectorAll('.map-marker').forEach(marker => {
            marker.addEventListener('click', (e) => {
                const id = marker.dataset.plant;
                const data = plants[id];
                if(data && panel) {
                    panel.innerHTML = `
                        <h3 style="color:${data.color}">${data.name}</h3>
                        <p>Type: <strong>${data.type}</strong></p>
                        <div class="stat-grid">
                            <div class="stat-box">
                                <div class="stat-label">Capacity</div>
                                <div class="stat-value">${data.capacity}</div>
                            </div>
                            <div class="stat-box">
                                <div class="stat-label">Status</div>
                                <div class="stat-value" style="color:${data.status === 'Operational' ? 'var(--success)' : 'var(--warning)'}">${data.status}</div>
                            </div>
                        </div>
                    `;
                    
                    // Add animation
                    panel.style.transform = 'scale(0.95)';
                    setTimeout(() => panel.style.transform = 'scale(1)', 150);
                }
            });
        });
    },

    initCalculator() {
        const btn = document.getElementById('btnCalculate');
        if(!btn) return;

        btn.addEventListener('click', () => {
            const units = parseFloat(document.getElementById('calcUnits').value);
            if(isNaN(units) || units < 0) return;

            let energyCharge = 0;
            let u = units;

            // Simple slab calculation
            if(u > 0) { const slab = Math.min(u, 50); energyCharge += slab * 4.35; u -= slab; }
            if(u > 0) { const slab = Math.min(u, 25); energyCharge += slab * 4.85; u -= slab; } // 51-75
            if(u > 0) { const slab = Math.min(u, 125); energyCharge += slab * 6.63; u -= slab; } // 76-200
            if(u > 0) { const slab = Math.min(u, 100); energyCharge += slab * 6.95; u -= slab; } // 201-300
            if(u > 0) { const slab = Math.min(u, 100); energyCharge += slab * 7.34; u -= slab; } // 301-400
            if(u > 0) { const slab = Math.min(u, 200); energyCharge += slab * 11.51; u -= slab; } // 401-600
            if(u > 0) { energyCharge += u * 13.26; } // >600

            const demandCharge = 35;
            const vat = (energyCharge + demandCharge) * 0.05;
            const total = energyCharge + demandCharge + vat;

            document.getElementById('resEnergy').innerText = '৳ ' + energyCharge.toFixed(2);
            document.getElementById('resVat').innerText = '৳ ' + vat.toFixed(2);
            document.getElementById('resTotal').innerText = '৳ ' + total.toFixed(2);
            
            document.getElementById('calcResults').classList.remove('hidden');
        });
    }
};
