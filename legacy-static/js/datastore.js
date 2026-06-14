/* ========================================
   ESB PowerLine — Shared Data Store
   Central data layer used by Admin, CMS, and Public Website
   Persists everything in localStorage with cross-tab sync
   ======================================== */

const ESBDataStore = (() => {
  'use strict';

  // ── Storage Keys ──────────────────────────────
  const KEYS = {
    ARTICLES:   'esb_articles',
    USERS:      'esb_users',
    MEDIA:      'esb_media',
    COMMENTS:   'esb_comments',
    CATEGORIES: 'esb_categories',
    TAGS:       'esb_tags',
    SETTINGS:   'esb_settings',
    LOGS:       'esb_logs',
    SESSION:    'esb_session',
    PAGES:      'esb_pages',
    ADS:        'esb_ads',
    NEWSLETTER: 'esb_newsletter',
    REVISIONS:  'esb_revisions'
  };

  // ── Helpers ───────────────────────────────────
  function _get(key) {
    try { return JSON.parse(localStorage.getItem(key)) || null; }
    catch { return null; }
  }

  function _set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function _generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  function _now() {
    return new Date().toISOString();
  }

  function _slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  // ── Event Bus for cross-component sync ────────
  const _listeners = {};

  function on(event, callback) {
    if (!_listeners[event]) _listeners[event] = [];
    _listeners[event].push(callback);
  }

  function emit(event, data) {
    if (_listeners[event]) {
      _listeners[event].forEach(cb => cb(data));
    }
  }

  // Cross-tab sync via storage events
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
      if (e.key && e.key.startsWith('esb_')) {
        emit('sync', { key: e.key, newValue: e.newValue });
      }
    });
  }

  // ═══════════════════════════════════════════════
  // USERS & AUTHENTICATION
  // ═══════════════════════════════════════════════
  const Users = {
    ROLES: {
      SUPER_ADMIN: { name: 'Super Admin', level: 100, color: '#ff3b6f' },
      ADMIN:       { name: 'Admin',       level: 80,  color: '#8b5cf6' },
      EDITOR:      { name: 'Editor',      level: 60,  color: '#3b82f6' },
      AUTHOR:      { name: 'Author',      level: 40,  color: '#10b981' },
      CONTRIBUTOR: { name: 'Contributor', level: 20,  color: '#f59e0b' },
      SUBSCRIBER:  { name: 'Subscriber',  level: 10,  color: '#6b7280' }
    },

    getAll() {
      return _get(KEYS.USERS) || [];
    },

    getById(id) {
      return this.getAll().find(u => u.id === id) || null;
    },

    getByEmail(email) {
      return this.getAll().find(u => u.email === email) || null;
    },

    create(userData) {
      const users = this.getAll();
      const user = {
        id: _generateId('user'),
        name: userData.name,
        email: userData.email,
        password: userData.password, // In production, this would be hashed
        role: userData.role || 'AUTHOR',
        avatar: userData.avatar || null,
        bio: userData.bio || '',
        phone: userData.phone || '',
        socialLinks: userData.socialLinks || {},
        status: userData.status || 'active', // active, suspended, pending
        articlesCount: 0,
        totalViews: 0,
        lastLogin: null,
        createdAt: _now(),
        updatedAt: _now()
      };
      users.push(user);
      _set(KEYS.USERS, users);
      Logs.add('user_created', `User "${user.name}" created with role ${user.role}`, user.id);
      emit('users_changed', user);
      return user;
    },

    update(id, updates) {
      const users = this.getAll();
      const idx = users.findIndex(u => u.id === id);
      if (idx === -1) return null;
      users[idx] = { ...users[idx], ...updates, updatedAt: _now() };
      _set(KEYS.USERS, users);
      emit('users_changed', users[idx]);
      return users[idx];
    },

    delete(id) {
      const users = this.getAll().filter(u => u.id !== id);
      _set(KEYS.USERS, users);
      Logs.add('user_deleted', `User ${id} deleted`);
      emit('users_changed', { id, deleted: true });
    },

    authenticate(email, password) {
      const user = this.getByEmail(email);
      if (!user) return { success: false, error: 'User not found' };
      if (user.password !== password) return { success: false, error: 'Invalid password' };
      if (user.status === 'suspended') return { success: false, error: 'Account suspended' };
      if (user.status === 'pending') return { success: false, error: 'Account pending approval' };

      this.update(user.id, { lastLogin: _now() });
      const session = { userId: user.id, role: user.role, loginAt: _now() };
      _set(KEYS.SESSION, session);
      Logs.add('user_login', `User "${user.name}" logged in`, user.id);
      return { success: true, user, session };
    },

    logout() {
      const session = this.getSession();
      if (session) {
        Logs.add('user_logout', 'User logged out', session.userId);
      }
      localStorage.removeItem(KEYS.SESSION);
    },

    getSession() {
      return _get(KEYS.SESSION);
    },

    getCurrentUser() {
      const session = this.getSession();
      if (!session) return null;
      return this.getById(session.userId);
    },

    hasPermission(action) {
      const user = this.getCurrentUser();
      if (!user) return false;
      const role = this.ROLES[user.role];
      if (!role) return false;

      const permissions = {
        // Article permissions
        'article.create':       10,
        'article.edit_own':     20,
        'article.edit_any':     60,
        'article.delete_own':   40,
        'article.delete_any':   80,
        'article.publish':      40,
        'article.feature':      60,
        'article.breaking':     60,
        // Media permissions
        'media.upload':         20,
        'media.delete_own':     40,
        'media.delete_any':     80,
        // Comment permissions
        'comment.moderate_own': 40,
        'comment.moderate_any': 60,
        'comment.delete_any':   80,
        // User permissions
        'user.view':            60,
        'user.create':          80,
        'user.edit':            80,
        'user.delete':          100,
        'user.change_role':     100,
        // Settings
        'settings.view':        80,
        'settings.edit':        80,
        // Logs
        'logs.view':            80,
        // Categories
        'category.manage':      60,
        // Analytics
        'analytics.view_own':   20,
        'analytics.view_all':   60,
        // Ads
        'ads.manage':           80,
        // Pages
        'page.manage':          80
      };

      return role.level >= (permissions[action] || 100);
    },

    getStats() {
      const users = this.getAll();
      return {
        total: users.length,
        active: users.filter(u => u.status === 'active').length,
        suspended: users.filter(u => u.status === 'suspended').length,
        pending: users.filter(u => u.status === 'pending').length,
        byRole: Object.keys(this.ROLES).reduce((acc, role) => {
          acc[role] = users.filter(u => u.role === role).length;
          return acc;
        }, {})
      };
    }
  };

  // ═══════════════════════════════════════════════
  // ARTICLES
  // ═══════════════════════════════════════════════
  const Articles = {
    STATUSES: ['published', 'draft', 'scheduled', 'archived', 'trash'],

    getAll() {
      return _get(KEYS.ARTICLES) || [];
    },

    getPublished() {
      return this.getAll().filter(a => a.status === 'published');
    },

    getByStatus(status) {
      return this.getAll().filter(a => a.status === status);
    },

    getById(id) {
      return this.getAll().find(a => a.id === id) || null;
    },

    getBySlug(slug) {
      return this.getAll().find(a => a.slug === slug) || null;
    },

    getByAuthor(authorId) {
      return this.getAll().filter(a => a.authorId === authorId);
    },

    getByCategory(category) {
      return this.getAll().filter(a => a.category === category);
    },

    getFeatured() {
      return this.getPublished().filter(a => a.isFeatured);
    },

    getBreaking() {
      return this.getPublished().filter(a => a.isBreaking);
    },

    create(articleData) {
      const articles = this.getAll();
      const article = {
        id: _generateId('art'),
        title: articleData.title || 'Untitled Article',
        slug: articleData.slug || _slugify(articleData.title || 'untitled'),
        excerpt: articleData.excerpt || '',
        content: articleData.content || '',
        author: articleData.author || '',
        authorId: articleData.authorId || '',
        date: articleData.date || _now(),
        publishDate: articleData.publishDate || null,
        category: articleData.category || 'Uncategorized',
        imageUrl: articleData.imageUrl || '',
        readTime: articleData.readTime || 1,
        views: articleData.views || 0,
        likes: articleData.likes || 0,
        isFeatured: articleData.isFeatured || false,
        isBreaking: articleData.isBreaking || false,
        isPinned: articleData.isPinned || false,
        status: articleData.status || 'draft',
        tags: articleData.tags || [],
        seo: {
          metaTitle: articleData.seo?.metaTitle || '',
          metaDescription: articleData.seo?.metaDescription || '',
          focusKeyword: articleData.seo?.focusKeyword || '',
          ogImage: articleData.seo?.ogImage || ''
        },
        createdAt: _now(),
        updatedAt: _now(),
        version: 1
      };

      // Calculate reading time from content
      if (article.content) {
        const wordCount = article.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
        article.readTime = Math.max(1, Math.ceil(wordCount / 200));
      }

      articles.push(article);
      _set(KEYS.ARTICLES, articles);

      // Save revision
      Revisions.save(article.id, article.content, article.authorId, 'Created');

      // Update author stats
      if (article.authorId) {
        const user = Users.getById(article.authorId);
        if (user) Users.update(user.id, { articlesCount: (user.articlesCount || 0) + 1 });
      }

      Logs.add('article_created', `Article "${article.title}" created`, article.authorId);
      emit('articles_changed', article);
      return article;
    },

    update(id, updates) {
      const articles = this.getAll();
      const idx = articles.findIndex(a => a.id === id);
      if (idx === -1) return null;

      const oldArticle = { ...articles[idx] };
      articles[idx] = { ...articles[idx], ...updates, updatedAt: _now(), version: (articles[idx].version || 1) + 1 };

      // Recalculate read time if content changed
      if (updates.content) {
        const wordCount = updates.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
        articles[idx].readTime = Math.max(1, Math.ceil(wordCount / 200));
      }

      _set(KEYS.ARTICLES, articles);

      // Save revision if content changed
      if (updates.content && updates.content !== oldArticle.content) {
        const session = Users.getSession();
        Revisions.save(id, updates.content, session?.userId || '', 'Updated');
      }

      Logs.add('article_updated', `Article "${articles[idx].title}" updated`, articles[idx].authorId);
      emit('articles_changed', articles[idx]);
      return articles[idx];
    },

    delete(id) {
      const articles = this.getAll();
      const article = articles.find(a => a.id === id);
      if (article) {
        Logs.add('article_deleted', `Article "${article.title}" deleted`, article.authorId);
      }
      _set(KEYS.ARTICLES, articles.filter(a => a.id !== id));
      emit('articles_changed', { id, deleted: true });
    },

    bulkUpdate(ids, updates) {
      const articles = this.getAll();
      ids.forEach(id => {
        const idx = articles.findIndex(a => a.id === id);
        if (idx !== -1) {
          articles[idx] = { ...articles[idx], ...updates, updatedAt: _now() };
        }
      });
      _set(KEYS.ARTICLES, articles);
      emit('articles_changed', { bulk: true, ids });
    },

    incrementViews(id) {
      const articles = this.getAll();
      const idx = articles.findIndex(a => a.id === id);
      if (idx !== -1) {
        articles[idx].views = (articles[idx].views || 0) + 1;
        _set(KEYS.ARTICLES, articles);
      }
    },

    search(query) {
      const q = query.toLowerCase();
      return this.getPublished().filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q)) ||
        a.category.toLowerCase().includes(q)
      );
    },

    getStats() {
      const articles = this.getAll();
      return {
        total: articles.length,
        published: articles.filter(a => a.status === 'published').length,
        draft: articles.filter(a => a.status === 'draft').length,
        scheduled: articles.filter(a => a.status === 'scheduled').length,
        archived: articles.filter(a => a.status === 'archived').length,
        totalViews: articles.reduce((sum, a) => sum + (a.views || 0), 0),
        totalLikes: articles.reduce((sum, a) => sum + (a.likes || 0), 0),
        featured: articles.filter(a => a.isFeatured).length,
        breaking: articles.filter(a => a.isBreaking).length,
        byCategory: articles.reduce((acc, a) => {
          acc[a.category] = (acc[a.category] || 0) + 1;
          return acc;
        }, {}),
        recentlyUpdated: [...articles].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5)
      };
    }
  };

  // ═══════════════════════════════════════════════
  // REVISIONS (Article Version History)
  // ═══════════════════════════════════════════════
  const Revisions = {
    getAll() {
      return _get(KEYS.REVISIONS) || [];
    },

    getByArticle(articleId) {
      return this.getAll()
        .filter(r => r.articleId === articleId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    save(articleId, content, userId, note = '') {
      const revisions = this.getAll();
      revisions.push({
        id: _generateId('rev'),
        articleId,
        content,
        userId,
        note,
        createdAt: _now()
      });
      // Keep only last 50 revisions per article
      const articleRevisions = revisions.filter(r => r.articleId === articleId);
      if (articleRevisions.length > 50) {
        const oldest = articleRevisions.slice(0, articleRevisions.length - 50);
        oldest.forEach(r => {
          const idx = revisions.findIndex(rev => rev.id === r.id);
          if (idx !== -1) revisions.splice(idx, 1);
        });
      }
      _set(KEYS.REVISIONS, revisions);
    },

    restore(revisionId) {
      const revision = this.getAll().find(r => r.id === revisionId);
      if (!revision) return null;
      return Articles.update(revision.articleId, { content: revision.content });
    }
  };

  // ═══════════════════════════════════════════════
  // CATEGORIES
  // ═══════════════════════════════════════════════
  const Categories = {
    getAll() {
      return _get(KEYS.CATEGORIES) || [];
    },

    getById(id) {
      return this.getAll().find(c => c.id === id) || null;
    },

    getByName(name) {
      return this.getAll().find(c => c.name === name) || null;
    },

    create(data) {
      const categories = this.getAll();
      const category = {
        id: _generateId('cat'),
        name: data.name,
        slug: _slugify(data.name),
        description: data.description || '',
        icon: data.icon || 'folder',
        color: data.color || '#3b82f6',
        parentId: data.parentId || null,
        order: data.order || categories.length,
        articleCount: 0,
        createdAt: _now()
      };
      categories.push(category);
      _set(KEYS.CATEGORIES, categories);
      emit('categories_changed', category);
      return category;
    },

    update(id, updates) {
      const categories = this.getAll();
      const idx = categories.findIndex(c => c.id === id);
      if (idx === -1) return null;
      categories[idx] = { ...categories[idx], ...updates };
      _set(KEYS.CATEGORIES, categories);
      emit('categories_changed', categories[idx]);
      return categories[idx];
    },

    delete(id) {
      _set(KEYS.CATEGORIES, this.getAll().filter(c => c.id !== id));
      emit('categories_changed', { id, deleted: true });
    },

    getWithCounts() {
      const articles = Articles.getAll();
      return this.getAll().map(cat => ({
        ...cat,
        articleCount: articles.filter(a => a.category === cat.name).length
      }));
    }
  };

  // ═══════════════════════════════════════════════
  // TAGS
  // ═══════════════════════════════════════════════
  const Tags = {
    getAll() {
      return _get(KEYS.TAGS) || [];
    },

    create(name) {
      const tags = this.getAll();
      if (tags.find(t => t.name.toLowerCase() === name.toLowerCase())) return null;
      const tag = { id: _generateId('tag'), name, slug: _slugify(name), createdAt: _now() };
      tags.push(tag);
      _set(KEYS.TAGS, tags);
      return tag;
    },

    delete(id) {
      _set(KEYS.TAGS, this.getAll().filter(t => t.id !== id));
    },

    getPopular(limit = 20) {
      const articles = Articles.getAll();
      const tagCounts = {};
      articles.forEach(a => {
        (a.tags || []).forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      });
      return Object.entries(tagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([name, count]) => ({ name, count }));
    }
  };

  // ═══════════════════════════════════════════════
  // MEDIA LIBRARY
  // ═══════════════════════════════════════════════
  const Media = {
    getAll() {
      return _get(KEYS.MEDIA) || [];
    },

    getById(id) {
      return this.getAll().find(m => m.id === id) || null;
    },

    add(mediaData) {
      const media = this.getAll();
      const item = {
        id: _generateId('media'),
        name: mediaData.name || 'Untitled',
        url: mediaData.url, // base64 or external URL
        type: mediaData.type || 'image', // image, video, document
        mimeType: mediaData.mimeType || 'image/jpeg',
        size: mediaData.size || 0,
        width: mediaData.width || 0,
        height: mediaData.height || 0,
        altText: mediaData.altText || '',
        caption: mediaData.caption || '',
        uploadedBy: mediaData.uploadedBy || '',
        usedIn: [], // article IDs
        createdAt: _now()
      };
      media.push(item);
      _set(KEYS.MEDIA, media);
      emit('media_changed', item);
      return item;
    },

    update(id, updates) {
      const media = this.getAll();
      const idx = media.findIndex(m => m.id === id);
      if (idx === -1) return null;
      media[idx] = { ...media[idx], ...updates };
      _set(KEYS.MEDIA, media);
      return media[idx];
    },

    delete(id) {
      _set(KEYS.MEDIA, this.getAll().filter(m => m.id !== id));
      emit('media_changed', { id, deleted: true });
    },

    getByUploader(userId) {
      return this.getAll().filter(m => m.uploadedBy === userId);
    },

    getStats() {
      const media = this.getAll();
      return {
        total: media.length,
        totalSize: media.reduce((s, m) => s + (m.size || 0), 0),
        images: media.filter(m => m.type === 'image').length,
        videos: media.filter(m => m.type === 'video').length,
        documents: media.filter(m => m.type === 'document').length
      };
    }
  };

  // ═══════════════════════════════════════════════
  // COMMENTS
  // ═══════════════════════════════════════════════
  const Comments = {
    STATUSES: ['approved', 'pending', 'spam', 'trash'],

    getAll() {
      return _get(KEYS.COMMENTS) || [];
    },

    getByArticle(articleId) {
      return this.getAll().filter(c => c.articleId === articleId && c.status === 'approved');
    },

    getByStatus(status) {
      return this.getAll().filter(c => c.status === status);
    },

    create(data) {
      const comments = this.getAll();
      const comment = {
        id: _generateId('cmt'),
        articleId: data.articleId,
        parentId: data.parentId || null,
        authorName: data.authorName,
        authorEmail: data.authorEmail || '',
        authorAvatar: data.authorAvatar || null,
        content: data.content,
        status: data.status || 'pending',
        likes: 0,
        createdAt: _now()
      };
      comments.push(comment);
      _set(KEYS.COMMENTS, comments);
      emit('comments_changed', comment);
      return comment;
    },

    updateStatus(id, status) {
      const comments = this.getAll();
      const idx = comments.findIndex(c => c.id === id);
      if (idx === -1) return null;
      comments[idx].status = status;
      _set(KEYS.COMMENTS, comments);
      emit('comments_changed', comments[idx]);
      return comments[idx];
    },

    delete(id) {
      _set(KEYS.COMMENTS, this.getAll().filter(c => c.id !== id));
    },

    bulkUpdateStatus(ids, status) {
      const comments = this.getAll();
      ids.forEach(id => {
        const idx = comments.findIndex(c => c.id === id);
        if (idx !== -1) comments[idx].status = status;
      });
      _set(KEYS.COMMENTS, comments);
    },

    getStats() {
      const comments = this.getAll();
      return {
        total: comments.length,
        approved: comments.filter(c => c.status === 'approved').length,
        pending: comments.filter(c => c.status === 'pending').length,
        spam: comments.filter(c => c.status === 'spam').length,
        trash: comments.filter(c => c.status === 'trash').length
      };
    }
  };

  // ═══════════════════════════════════════════════
  // SITE SETTINGS
  // ═══════════════════════════════════════════════
  const Settings = {
    defaults: {
      siteName: 'ESB PowerLine',
      siteTagline: 'Bangladesh Energy & Power News',
      siteDescription: 'Bangladesh\'s premier energy and power sector news portal.',
      siteUrl: '',
      logo: '⚡',
      favicon: '⚡',
      defaultTheme: 'dark',
      articlesPerPage: 6,
      showBreakingTicker: true,
      showDashboard: true,
      showNewsletter: true,
      enableComments: true,
      commentModeration: true,
      socialLinks: {
        facebook: '#',
        twitter: '#',
        linkedin: '#',
        youtube: '#'
      },
      seo: {
        defaultTitle: 'ESB PowerLine — Bangladesh Energy & Power News Portal',
        defaultDescription: 'Your trusted source for Bangladesh\'s energy and power sector news, analysis, and insights.',
        defaultKeywords: 'Bangladesh energy, power sector, renewable energy, nuclear energy'
      },
      footer: {
        copyright: '© 2026 ESB PowerLine. All rights reserved.',
        showSocial: true
      },
      analytics: {
        enabled: true,
        trackViews: true
      },
      maintenance: {
        enabled: false,
        message: 'We are currently performing maintenance. Please check back shortly.'
      }
    },

    get() {
      return { ...this.defaults, ...(_get(KEYS.SETTINGS) || {}) };
    },

    update(updates) {
      const settings = this.get();
      const merged = { ...settings, ...updates };
      _set(KEYS.SETTINGS, merged);
      Logs.add('settings_updated', 'Site settings updated');
      emit('settings_changed', merged);
      return merged;
    },

    reset() {
      _set(KEYS.SETTINGS, this.defaults);
      emit('settings_changed', this.defaults);
      return this.defaults;
    }
  };

  // ═══════════════════════════════════════════════
  // ACTIVITY LOGS
  // ═══════════════════════════════════════════════
  const Logs = {
    getAll() {
      return _get(KEYS.LOGS) || [];
    },

    add(type, message, userId = null) {
      const logs = this.getAll();
      logs.unshift({
        id: _generateId('log'),
        type,
        message,
        userId,
        timestamp: _now()
      });
      // Keep last 500 logs
      if (logs.length > 500) logs.splice(500);
      _set(KEYS.LOGS, logs);
    },

    getRecent(count = 20) {
      return this.getAll().slice(0, count);
    },

    getByType(type) {
      return this.getAll().filter(l => l.type === type);
    },

    getByUser(userId) {
      return this.getAll().filter(l => l.userId === userId);
    },

    clear() {
      _set(KEYS.LOGS, []);
    }
  };

  // ═══════════════════════════════════════════════
  // NEWSLETTER SUBSCRIBERS
  // ═══════════════════════════════════════════════
  const Newsletter = {
    getAll() {
      return _get(KEYS.NEWSLETTER) || [];
    },

    subscribe(email) {
      const subs = this.getAll();
      if (subs.find(s => s.email === email)) return null;
      const sub = { id: _generateId('sub'), email, subscribedAt: _now(), status: 'active' };
      subs.push(sub);
      _set(KEYS.NEWSLETTER, subs);
      return sub;
    },

    unsubscribe(email) {
      _set(KEYS.NEWSLETTER, this.getAll().filter(s => s.email !== email));
    },

    getStats() {
      const subs = this.getAll();
      return {
        total: subs.length,
        active: subs.filter(s => s.status === 'active').length
      };
    }
  };

  // ═══════════════════════════════════════════════
  // PAGES (About, Contact, etc.)
  // ═══════════════════════════════════════════════
  const Pages = {
    getAll() {
      return _get(KEYS.PAGES) || [];
    },

    getById(id) {
      return this.getAll().find(p => p.id === id) || null;
    },

    getBySlug(slug) {
      return this.getAll().find(p => p.slug === slug) || null;
    },

    create(data) {
      const pages = this.getAll();
      const page = {
        id: _generateId('page'),
        title: data.title,
        slug: data.slug || _slugify(data.title),
        content: data.content || '',
        status: data.status || 'draft',
        template: data.template || 'default',
        seo: data.seo || {},
        createdAt: _now(),
        updatedAt: _now()
      };
      pages.push(page);
      _set(KEYS.PAGES, pages);
      return page;
    },

    update(id, updates) {
      const pages = this.getAll();
      const idx = pages.findIndex(p => p.id === id);
      if (idx === -1) return null;
      pages[idx] = { ...pages[idx], ...updates, updatedAt: _now() };
      _set(KEYS.PAGES, pages);
      return pages[idx];
    },

    delete(id) {
      _set(KEYS.PAGES, this.getAll().filter(p => p.id !== id));
    }
  };

  // ═══════════════════════════════════════════════
  // AD MANAGEMENT
  // ═══════════════════════════════════════════════
  const Ads = {
    POSITIONS: ['header', 'sidebar', 'between_articles', 'footer', 'article_body'],

    getAll() {
      return _get(KEYS.ADS) || [];
    },

    create(data) {
      const ads = this.getAll();
      const ad = {
        id: _generateId('ad'),
        name: data.name,
        position: data.position,
        content: data.content, // HTML or image URL
        link: data.link || '#',
        isActive: data.isActive !== false,
        impressions: 0,
        clicks: 0,
        startDate: data.startDate || null,
        endDate: data.endDate || null,
        createdAt: _now()
      };
      ads.push(ad);
      _set(KEYS.ADS, ads);
      return ad;
    },

    update(id, updates) {
      const ads = this.getAll();
      const idx = ads.findIndex(a => a.id === id);
      if (idx === -1) return null;
      ads[idx] = { ...ads[idx], ...updates };
      _set(KEYS.ADS, ads);
      return ads[idx];
    },

    delete(id) {
      _set(KEYS.ADS, this.getAll().filter(a => a.id !== id));
    },

    getActiveByPosition(position) {
      return this.getAll().filter(a => a.position === position && a.isActive);
    }
  };

  // ═══════════════════════════════════════════════
  // ANALYTICS (Simulated)
  // ═══════════════════════════════════════════════
  const Analytics = {
    getOverview() {
      const articles = Articles.getStats();
      const users = Users.getStats();
      const comments = Comments.getStats();
      const newsletter = Newsletter.getStats();
      const media = Media.getStats();

      return {
        articles,
        users,
        comments,
        newsletter,
        media,
        totalPageViews: articles.totalViews,
        avgViewsPerArticle: articles.total > 0 ? Math.round(articles.totalViews / articles.total) : 0
      };
    },

    getTrafficData(days = 30) {
      // Simulate traffic data for charts
      const data = [];
      const now = new Date();
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        data.push({
          date: date.toISOString().split('T')[0],
          views: Math.floor(Math.random() * 5000) + 2000,
          visitors: Math.floor(Math.random() * 2000) + 800,
          bounceRate: (Math.random() * 30 + 30).toFixed(1)
        });
      }
      return data;
    },

    getTopArticles(limit = 10) {
      return Articles.getPublished()
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, limit);
    },

    getCategoryPerformance() {
      const categories = Categories.getAll();
      const articles = Articles.getAll();
      return categories.map(cat => {
        const catArticles = articles.filter(a => a.category === cat.name);
        return {
          name: cat.name,
          color: cat.color,
          articles: catArticles.length,
          views: catArticles.reduce((sum, a) => sum + (a.views || 0), 0),
          avgViews: catArticles.length > 0
            ? Math.round(catArticles.reduce((sum, a) => sum + (a.views || 0), 0) / catArticles.length)
            : 0
        };
      }).sort((a, b) => b.views - a.views);
    },

    getTrafficSources() {
      return [
        { name: 'Direct', value: 35, color: '#3b82f6' },
        { name: 'Google', value: 28, color: '#10b981' },
        { name: 'Social Media', value: 20, color: '#8b5cf6' },
        { name: 'Referral', value: 12, color: '#f59e0b' },
        { name: 'Email', value: 5, color: '#ef4444' }
      ];
    },

    getGeoData() {
      return [
        { country: 'Bangladesh', visits: 65000, percentage: 72 },
        { country: 'India', visits: 8500, percentage: 9.4 },
        { country: 'United States', visits: 5200, percentage: 5.8 },
        { country: 'United Kingdom', visits: 3100, percentage: 3.4 },
        { country: 'UAE', visits: 2800, percentage: 3.1 },
        { country: 'Saudi Arabia', visits: 2100, percentage: 2.3 },
        { country: 'Malaysia', visits: 1800, percentage: 2.0 },
        { country: 'Others', visits: 1800, percentage: 2.0 }
      ];
    }
  };

  // ═══════════════════════════════════════════════
  // SEED DATA (runs only once on first load)
  // ═══════════════════════════════════════════════
  function seed() {
    if (_get('esb_seeded')) return;

    // Seed default users
    const adminUser = Users.create({
      name: 'Admin',
      email: 'admin@esbpowerline.com',
      password: 'esbpowerline007',
      role: 'SUPER_ADMIN',
      bio: 'System administrator',
      status: 'active'
    });

    const editorUser = Users.create({
      name: 'Chief Editor',
      email: 'editor@esbpowerline.com',
      password: 'esbpowerline007',
      role: 'EDITOR',
      bio: 'Chief Editor at ESB PowerLine. Covers all energy sector developments.',
      status: 'active'
    });

    const authorUsers = [
      { name: 'Dr. Aminul Haque', email: 'aminul@esbpowerline.com', password: 'author123', role: 'AUTHOR', bio: 'Nuclear energy specialist' },
      { name: 'Farhana Rahman', email: 'farhana@esbpowerline.com', password: 'author123', role: 'AUTHOR', bio: 'Renewable energy correspondent' },
      { name: 'Engr. Kamal Uddin', email: 'kamal@esbpowerline.com', password: 'author123', role: 'AUTHOR', bio: 'Grid & transmission expert' },
      { name: 'Mehedi Hassan', email: 'mehedi@esbpowerline.com', password: 'author123', role: 'AUTHOR', bio: 'Power generation reporter' },
      { name: 'Sharif Uddin Khan', email: 'sharif@esbpowerline.com', password: 'author123', role: 'AUTHOR', bio: 'LNG & gas sector analyst' },
      { name: 'Nadia Begum', email: 'nadia@esbpowerline.com', password: 'author123', role: 'CONTRIBUTOR', bio: 'Energy policy analyst' }
    ];

    const createdAuthors = {};
    authorUsers.forEach(u => {
      const created = Users.create(u);
      createdAuthors[u.name] = created.id;
    });

    // Seed categories
    const defaultCategories = [
      { name: 'Power Generation', icon: 'factory', color: '#ef4444', description: 'News about power plants and generation capacity' },
      { name: 'Renewable Energy', icon: 'wind', color: '#10b981', description: 'Solar, wind, and other renewable energy news' },
      { name: 'LNG & Gas', icon: 'flame', color: '#f59e0b', description: 'Liquefied natural gas and gas sector updates' },
      { name: 'Nuclear Energy', icon: 'atom', color: '#8b5cf6', description: 'Nuclear power development in Bangladesh' },
      { name: 'Grid & Transmission', icon: 'zap', color: '#3b82f6', description: 'Power grid and transmission infrastructure' },
      { name: 'Energy Policy', icon: 'file-text', color: '#6366f1', description: 'Government policies and regulations' },
      { name: 'Rural Electrification', icon: 'sun-medium', color: '#14b8a6', description: 'Rural power access and development' },
      { name: 'Energy Efficiency', icon: 'leaf', color: '#84cc16', description: 'Energy conservation and efficiency measures' },
      { name: 'International', icon: 'globe', color: '#0ea5e9', description: 'International energy sector news' },
      { name: 'Market & Finance', icon: 'trending-up', color: '#ec4899', description: 'Energy market and financial news' }
    ];
    defaultCategories.forEach(c => Categories.create(c));

    // Seed sample comments
    const sampleComments = [
      { articleId: 'art-001', authorName: 'Rafiq Islam', content: 'This is a landmark achievement for Bangladesh!', status: 'approved' },
      { articleId: 'art-001', authorName: 'Sonia Akter', content: 'How will this affect electricity prices for consumers?', status: 'approved' },
      { articleId: 'art-002', authorName: 'Kamal Ahmed', content: 'Great news for the renewable energy sector. We need more projects like this.', status: 'approved' },
      { articleId: 'art-002', authorName: 'Anonymous', content: 'Check out my website for cheap solar panels!', status: 'spam' },
      { articleId: 'art-005', authorName: 'Jahangir Alam', content: 'Long term LNG contracts are essential for energy security.', status: 'pending' },
      { articleId: 'art-006', authorName: 'Rehana Parvin', content: 'The TOU pricing will heavily impact small businesses.', status: 'pending' }
    ];
    sampleComments.forEach(c => Comments.create(c));

    localStorage.setItem('esb_seeded', 'true');
    Logs.add('system', 'Data store initialized with seed data');
  }

  // ═══════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════
  function init() {
    seed();
  }

  // ═══════════════════════════════════════════════
  // PUBLIC API
  // ═══════════════════════════════════════════════
  return {
    init,
    on,
    emit,
    Users,
    Articles,
    Revisions,
    Categories,
    Tags,
    Media,
    Comments,
    Settings,
    Logs,
    Newsletter,
    Pages,
    Ads,
    Analytics,
    KEYS,
    _generateId,
    _slugify
  };
})();

// Auto-initialize when loaded
if (typeof window !== 'undefined') {
  ESBDataStore.init();
}
