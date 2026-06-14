document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // State
    const AppState = {
        currentUser: null,
        currentSection: 'dashboard',
        isDarkMode: true,
        editor: {
            currentArticleId: null,
            isSourceMode: false,
            isFullscreen: false
        }
    };

    // DOM Elements
    const elements = {
        loginScreen: document.getElementById('login-screen'),
        cmsApp: document.getElementById('cms-app'),
        loginForm: document.getElementById('login-form'),
        emailInput: document.getElementById('email'),
        passwordInput: document.getElementById('password'),
        loginError: document.getElementById('login-error'),
        
        sidebar: document.getElementById('sidebar'),
        toggleSidebar: document.getElementById('toggle-sidebar'),
        navItems: document.querySelectorAll('.nav-item[data-section]'),
        sections: document.querySelectorAll('.content-section'),
        currentSectionTitle: document.getElementById('current-section-title'),
        
        themeToggle: document.getElementById('theme-toggle'),
        logoutBtn: document.getElementById('logout-btn'),
        topbarName: document.getElementById('topbar-name'),
        topbarAvatar: document.getElementById('topbar-avatar'),
        
        // Editor
        editorWrapper: document.getElementById('editor-wrapper'),
        editorTitle: document.getElementById('editor-title'),
        richTextEditor: document.getElementById('rich-text-editor'),
        sourceEditor: document.getElementById('source-editor'),
        toolbarBtns: document.querySelectorAll('.toolbar-btn[data-command]'),
        toolbarSelects: document.querySelectorAll('.toolbar-select[data-command]'),
        toolbarColors: document.querySelectorAll('.toolbar-color[data-command]'),
        customBtns: document.querySelectorAll('.toolbar-btn[data-custom]'),
        
        // Editor Metadata
        metaStatus: document.getElementById('meta-status'),
        metaPublishDate: document.getElementById('meta-publish-date'),
        scheduleDateGroup: document.getElementById('schedule-date-group'),
        metaCategory: document.getElementById('meta-category'),
        metaTagsInput: document.getElementById('meta-tags-input'),
        tagsList: document.getElementById('tags-list'),
        featuredImagePreview: document.getElementById('featured-image-preview'),
        featuredImagePlaceholder: document.getElementById('featured-image-placeholder'),
        metaFeaturedImage: document.getElementById('meta-featured-image'),
        removeFeaturedImage: document.getElementById('remove-featured-image'),
        metaIsFeatured: document.getElementById('meta-is-featured'),
        metaIsBreaking: document.getElementById('meta-is-breaking'),
        metaExcerpt: document.getElementById('meta-excerpt'),
        btnGenerateExcerpt: document.getElementById('btn-generate-excerpt'),
        btnSaveArticle: document.getElementById('btn-save-article'),
        
        // SEO
        seoTitleCount: document.getElementById('seo-title-count'),
        seoDescCount: document.getElementById('seo-desc-count'),
        seoTitle: document.getElementById('seo-title'),
        seoDesc: document.getElementById('seo-description'),
        seoSlug: document.getElementById('seo-slug'),
        serpTitle: document.getElementById('serp-title'),
        serpDesc: document.getElementById('serp-desc'),
        serpSlug: document.getElementById('serp-slug'),

        // Preview
        previewOverlay: document.getElementById('preview-overlay'),
        btnClosePreview: document.getElementById('btn-close-preview'),
        previewDevices: document.querySelectorAll('.preview-devices .btn-icon'),
        previewContainer: document.getElementById('preview-container'),
        
        // Modals
        modals: document.querySelectorAll('.modal-backdrop'),
        modalCloseBtns: document.querySelectorAll('.modal-close, .modal-close-btn'),
        linkModal: document.getElementById('link-modal'),
        imageModal: document.getElementById('image-modal'),
        videoModal: document.getElementById('video-modal'),
        tableModal: document.getElementById('table-modal'),
        
        // Tab buttons
        tabBtns: document.querySelectorAll('.tab-btn')
    };

    // Initialize App
    function init() {
        checkAuth();
        setupEventListeners();
        loadCategories();
    }

    // --- Authentication ---
    function checkAuth() {
        const storedUser = sessionStorage.getItem('cms_user');
        if (storedUser) {
            AppState.currentUser = JSON.parse(storedUser);
            showApp();
        }
    }

    elements.loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = elements.emailInput.value;
        const password = elements.passwordInput.value;
        
        const user = ESBDataStore.Users.authenticate(email, password);
        if (user) {
            AppState.currentUser = user;
            sessionStorage.setItem('cms_user', JSON.stringify(user));
            elements.loginError.style.display = 'none';
            showApp();
            showToast('Welcome back, ' + user.firstName, 'success');
        } else {
            elements.loginError.textContent = 'Invalid email or password.';
            elements.loginError.style.display = 'block';
        }
    });

    elements.logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('cms_user');
        AppState.currentUser = null;
        elements.cmsApp.style.display = 'none';
        elements.loginScreen.classList.add('active');
        elements.loginScreen.style.display = 'block';
    });

    function showApp() {
        elements.loginScreen.classList.remove('active');
        elements.loginScreen.style.display = 'none';
        elements.cmsApp.style.display = 'flex';
        
        // Populate user data
        elements.topbarName.textContent = AppState.currentUser.firstName;
        elements.topbarAvatar.src = AppState.currentUser.avatar;
        
        // Setup initial view
        navigateTo(AppState.currentSection);
    }

    // --- Navigation & Layout ---
    function setupEventListeners() {
        // Sidebar Toggle
        elements.toggleSidebar.addEventListener('click', () => {
            elements.sidebar.classList.toggle('collapsed');
        });

        // Navigation
        elements.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.getAttribute('data-section');
                navigateTo(section);
            });
        });

        // Theme Toggle
        elements.themeToggle.addEventListener('click', () => {
            AppState.isDarkMode = !AppState.isDarkMode;
            document.body.className = AppState.isDarkMode ? 'dark-mode' : 'light-mode';
            elements.themeToggle.innerHTML = AppState.isDarkMode ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
            if (typeof lucide !== 'undefined') lucide.createIcons();
            
            // Re-render chart if active
            if (AppState.currentSection === 'dashboard' && viewsChart) {
                renderViewsChart();
            }
        });

        // Quick action buttons
        document.getElementById('btn-new-article-dash').addEventListener('click', openNewArticle);
        document.getElementById('btn-new-article-list').addEventListener('click', openNewArticle);

        setupEditorListeners();
        setupModalListeners();
        setupProfileListeners();
    }

    function navigateTo(sectionId) {
        // Update nav UI
        elements.navItems.forEach(item => {
            if (item.getAttribute('data-section') === sectionId) {
                item.classList.add('active');
                elements.currentSectionTitle.textContent = item.querySelector('span').textContent;
            } else {
                item.classList.remove('active');
            }
        });

        // Show section
        elements.sections.forEach(sec => {
            if (sec.id === sectionId) {
                sec.classList.add('active');
            } else {
                sec.classList.remove('active');
            }
        });

        AppState.currentSection = sectionId;

        // Initialize section specific data
        switch (sectionId) {
            case 'dashboard':
                loadDashboard();
                break;
            case 'articles':
                loadArticles();
                break;
            case 'media':
                loadMedia();
                break;
            case 'calendar':
                loadCalendar();
                break;
            case 'profile':
                loadProfile();
                break;
        }
    }

    // --- Dashboard ---
    let viewsChart = null;

    function loadDashboard() {
        document.getElementById('dashboard-welcome').textContent = `Good ${getTimeOfDay()}, ${AppState.currentUser.firstName}`;
        
        const articles = ESBDataStore.Articles.getAll();
        
        // Stats
        let published = 0, drafts = 0, scheduled = 0, totalViews = 0;
        
        // Count just for the current user unless they are admin
        const myArticles = AppState.currentUser.role === 'admin' 
            ? articles 
            : articles.filter(a => a.authorId === AppState.currentUser.id);

        myArticles.forEach(a => {
            if (a.status === 'published') published++;
            if (a.status === 'draft') drafts++;
            if (a.status === 'scheduled') scheduled++;
            totalViews += (a.views || 0);
        });

        document.getElementById('stat-published').textContent = published;
        document.getElementById('stat-drafts').textContent = drafts;
        document.getElementById('stat-scheduled').textContent = scheduled;
        document.getElementById('stat-views').textContent = formatNumber(totalViews);

        // Recent Drafts
        const recentDrafts = myArticles.filter(a => a.status === 'draft').sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5);
        const draftsList = document.getElementById('recent-drafts-list');
        draftsList.innerHTML = '';
        
        if (recentDrafts.length === 0) {
            draftsList.innerHTML = '<p class="text-muted">No recent drafts.</p>';
        } else {
            recentDrafts.forEach(draft => {
                const li = document.createElement('li');
                li.className = 'recent-item';
                li.innerHTML = `
                    <div class="recent-title"><a href="#" data-edit-id="${draft.id}">${draft.title || 'Untitled Draft'}</a></div>
                    <div class="recent-meta">Last edited: ${formatDate(draft.updatedAt)}</div>
                `;
                draftsList.appendChild(li);
            });

            // Bind edit clicks
            draftsList.querySelectorAll('[data-edit-id]').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    editArticle(e.target.getAttribute('data-edit-id'));
                });
            });
        }

        renderViewsChart();
    }

    function renderViewsChart() {
        const ctx = document.getElementById('views-chart').getContext('2d');
        if (viewsChart) {
            viewsChart.destroy();
        }

        // Mock data for last 7 days
        const labels = Array.from({length: 7}, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toLocaleDateString('en-US', { weekday: 'short' });
        });
        
        const data = [1200, 1900, 3000, 5000, 2400, 3200, 4500];
        
        const textColor = AppState.isDarkMode ? '#cbd5e1' : '#475569';
        const gridColor = AppState.isDarkMode ? '#334155' : '#e2e8f0';

        viewsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Page Views',
                    data: data,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        grid: { display: false, color: gridColor },
                        ticks: { color: textColor }
                    },
                    y: {
                        grid: { color: gridColor },
                        ticks: { color: textColor }
                    }
                }
            }
        });
    }

    // --- Articles List ---
    function loadArticles() {
        const articles = ESBDataStore.Articles.getAll();
        const tbody = document.getElementById('articles-tbody');
        tbody.innerHTML = '';

        const myArticles = AppState.currentUser.role === 'admin' 
            ? articles 
            : articles.filter(a => a.authorId === AppState.currentUser.id);

        myArticles.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        myArticles.forEach(article => {
            const tr = document.createElement('tr');
            
            // Status badge class
            const statusClass = article.status === 'published' ? 'status-published' : 
                              (article.status === 'draft' ? 'status-draft' : 'status-scheduled');
            
            tr.innerHTML = `
                <td>
                    <strong>${article.title || '(Untitled)'}</strong>
                    <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">
                        ${ESBDataStore.Categories.getById(article.categoryId)?.name || 'Uncategorized'}
                    </div>
                </td>
                <td><span class="status-badge ${statusClass}">${article.status}</span></td>
                <td>${formatDate(article.updatedAt)}</td>
                <td>${formatNumber(article.views || 0)}</td>
                <td>
                    <div class="action-btns">
                        <button class="btn-icon" data-edit-id="${article.id}" title="Edit"><i data-lucide="edit-2"></i></button>
                        <button class="btn-icon text-danger" data-delete-id="${article.id}" title="Delete"><i data-lucide="trash-2"></i></button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        if (typeof lucide !== 'undefined') lucide.createIcons();

        // Bind actions
        tbody.querySelectorAll('[data-edit-id]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                editArticle(e.currentTarget.getAttribute('data-edit-id'));
            });
        });

        tbody.querySelectorAll('[data-delete-id]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if(confirm('Are you sure you want to delete this article?')) {
                    ESBDataStore.Articles.delete(e.currentTarget.getAttribute('data-delete-id'));
                    showToast('Article deleted', 'success');
                    loadArticles();
                    loadDashboard();
                }
            });
        });
    }

    function openNewArticle() {
        // Reset Editor
        AppState.editor.currentArticleId = null;
        elements.editorTitle.value = '';
        elements.richTextEditor.innerHTML = '';
        elements.sourceEditor.value = '';
        
        // Reset Metadata
        elements.metaStatus.value = 'draft';
        elements.metaCategory.selectedIndex = 0;
        elements.metaTagsInput.value = '';
        elements.tagsList.innerHTML = '';
        elements.metaExcerpt.value = '';
        elements.metaIsFeatured.checked = false;
        elements.metaIsBreaking.checked = false;
        
        // Reset Image
        elements.metaFeaturedImage.value = '';
        elements.featuredImagePreview.style.display = 'none';
        elements.featuredImagePlaceholder.style.display = 'flex';
        elements.removeFeaturedImage.style.display = 'none';

        // Reset SEO
        elements.seoTitle.value = '';
        elements.seoDesc.value = '';
        elements.seoSlug.value = '';
        updateSeoPreview();
        
        navigateTo('editor');
    }

    function editArticle(id) {
        const article = ESBDataStore.Articles.getById(id);
        if (!article) return;
        
        AppState.editor.currentArticleId = article.id;
        
        // Populate Editor
        elements.editorTitle.value = article.title;
        elements.richTextEditor.innerHTML = article.content;
        
        // Populate Metadata
        elements.metaStatus.value = article.status;
        if(article.status === 'scheduled') {
            elements.scheduleDateGroup.style.display = 'block';
            if(article.publishedAt) {
                // Format for datetime-local
                const d = new Date(article.publishedAt);
                elements.metaPublishDate.value = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0,16);
            }
        } else {
            elements.scheduleDateGroup.style.display = 'none';
        }
        
        elements.metaCategory.value = article.categoryId;
        
        // Tags
        elements.tagsList.innerHTML = '';
        (article.tags || []).forEach(tagId => {
            const tag = ESBDataStore.Tags.getById(tagId);
            if(tag) addTagPill(tag.name, tag.id);
        });
        
        elements.metaExcerpt.value = article.excerpt || '';
        elements.metaIsFeatured.checked = article.isFeatured || false;
        elements.metaIsBreaking.checked = article.isBreaking || false;
        
        // Image
        if (article.featuredImage) {
            setFeaturedImage(article.featuredImage);
        } else {
            removeFeaturedImage();
        }

        // SEO
        elements.seoTitle.value = article.seoTitle || '';
        elements.seoDesc.value = article.seoDescription || '';
        elements.seoSlug.value = article.slug || '';
        updateSeoPreview();

        navigateTo('editor');
    }

    // --- Editor Initialization ---
    
    
    
    function setupEditorListeners() {
        // Standard commands
        elements.toolbarBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const command = btn.getAttribute('data-command');
                document.execCommand(command, false, null);
                elements.richTextEditor.focus();
                updateToolbarState();
            });
        });

        // Custom Dropdown Logic (Formatting)
        const dropdownToggle = document.getElementById('format-dropdown-toggle');
        const dropdownMenu = document.getElementById('format-dropdown-menu');
        const dropdownLabel = document.getElementById('format-dropdown-label');
        
        if (dropdownToggle && dropdownMenu) {
            dropdownToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdownMenu.classList.toggle('active');
            });
            
            document.addEventListener('click', () => {
                dropdownMenu.classList.remove('active');
            });
            
            const items = dropdownMenu.querySelectorAll('.dropdown-item');
            items.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const val = item.getAttribute('data-value');
                    const text = item.textContent;
                    
                    dropdownLabel.textContent = text;
                    dropdownMenu.classList.remove('active');
                    
                    document.execCommand('formatBlock', false, val.startsWith('H') ? val : 'P');
                    elements.richTextEditor.focus();
                });
            });
        }

        // Custom Colors
        const fgColor = document.getElementById('fg-color');
        const bgColor = document.getElementById('bg-color');
        if(fgColor) {
            fgColor.addEventListener('input', (e) => {
                document.execCommand('foreColor', false, e.target.value);
            });
        }
        if(bgColor) {
            bgColor.addEventListener('input', (e) => {
                document.execCommand('hiliteColor', false, e.target.value);
            });
        }

        // Keydown to prevent empty state bug
        elements.richTextEditor.addEventListener('keydown', (e) => {
            if(e.key === 'Backspace' || e.key === 'Delete') {
                const html = elements.richTextEditor.innerHTML.trim();
                if(html === '<p><br></p>' || html === '<br>' || html === '') {
                    e.preventDefault();
                }
            }
        });
        
        // Editor typing events
        elements.richTextEditor.addEventListener('input', () => {
            if(elements.richTextEditor.innerHTML.trim() === '') {
                elements.richTextEditor.innerHTML = '<p><br></p>';
            }
            if(elements.richTextEditor.innerText.trim() === '') {
                elements.richTextEditor.classList.add('is-empty');
            } else {
                elements.richTextEditor.classList.remove('is-empty');
            }
            updateEditorStats();
            triggerAutoSave();
        });

        // Update toolbar state on selection change
        document.addEventListener('selectionchange', () => {
            if(document.activeElement === elements.richTextEditor) {
                updateToolbarState();
            }
        });

    }

    
    function updateToolbarState() {
        if(AppState.editor.isSourceMode) return;
        try {
            const commands = ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'];
            commands.forEach(cmd => {
                const btn = document.querySelector(`.toolbar-btn[data-command="${cmd}"]`);
                if(btn) {
                    if(document.queryCommandState(cmd)) btn.classList.add('active');
                    else btn.classList.remove('active');
                }
            });
            const formatValue = document.queryCommandValue('formatBlock');
            const formatLabel = document.getElementById('format-dropdown-label');
            if (formatLabel) {
                let labelText = 'Paragraph';
                if (formatValue) {
                    switch(formatValue.toLowerCase()) {
                        case 'h1': labelText = 'Heading 1'; break;
                        case 'h2': labelText = 'Heading 2'; break;
                        case 'h3': labelText = 'Heading 3'; break;
                        case 'h4': labelText = 'Heading 4'; break;
                        case 'h5': labelText = 'Heading 5'; break;
                        case 'h6': labelText = 'Heading 6'; break;
                        case 'p': labelText = 'Paragraph'; break;
                    }
                }
                formatLabel.textContent = labelText;
            }
        } catch (e) {}
    }


    
    function handleCustomCommand(command) {
        switch(command) {
            case 'blockquote':
                document.execCommand('formatBlock', false, 'BLOCKQUOTE');
                break;
            case 'codeblock':
                const sel = window.getSelection();
                const range = sel.getRangeAt(0);
                const pre = document.createElement('pre');
                const code = document.createElement('code');
                code.textContent = range.toString() || 'Code goes here...';
                pre.appendChild(code);
                range.deleteContents();
                range.insertNode(pre);
                break;
            case 'checklist':
                document.execCommand('insertHTML', false, '<ul><li class="checklist-item">Item</li></ul>');
                break;
            case 'link':
                openModal(elements.linkModal);
                break;
            case 'image':
                openModal(elements.imageModal);
                document.getElementById('image-modal').setAttribute('data-target', 'editor');
                loadModalMediaLibrary();
                break;
            case 'video':
                openModal(elements.videoModal);
                break;
            case 'table':
                openModal(elements.tableModal);
                break;
            case 'specialchar':
                const char = prompt('Enter special character:');
                if(char) document.execCommand('insertText', false, char);
                break;
            case 'source':
                toggleSourceMode();
                break;
            case 'fullscreen':
            case 'zen':
                toggleZenMode();
                break;
            case 'preview':
                openPreview();
                break;
        }
    }


    function updateEditorStats() {
        const text = elements.richTextEditor.innerText || '';
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const chars = text.length;
        const readTime = Math.ceil(words / 200); // approx 200 words per minute

        document.getElementById('word-count').textContent = `${words} words`;
        document.getElementById('char-count').textContent = `${chars} characters`;
        document.getElementById('read-time').textContent = `${readTime} min read`;
    }

    let saveTimeout;
    function triggerAutoSave() {
        const statusEl = document.getElementById('save-status');
        statusEl.textContent = 'Saving...';
        
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            saveArticle(true);
            statusEl.textContent = 'Saved at ' + new Date().toLocaleTimeString();
        }, 3000); // Auto-save after 3 seconds of inactivity
    }

    function saveArticle(isAutoSave = false) {
        const title = elements.editorTitle.value.trim();
        if(!title && !isAutoSave) {
            showToast('Please enter an article title', 'error');
            return;
        }

        // Sync source mode if active
        let content = '';
        if(AppState.editor.isSourceMode) {
            content = elements.sourceEditor.value;
        } else {
            content = elements.richTextEditor.innerHTML;
        }

        // Collect tags
        const tags = Array.from(document.querySelectorAll('.tag-pill')).map(p => p.getAttribute('data-id'));

        const articleData = {
            title: title || 'Untitled',
            content: content,
            slug: elements.seoSlug.value || generateSlug(title),
            excerpt: elements.metaExcerpt.value,
            featuredImage: elements.metaFeaturedImage.value,
            status: elements.metaStatus.value,
            categoryId: elements.metaCategory.value,
            tags: tags,
            isFeatured: elements.metaIsFeatured.checked,
            isBreaking: elements.metaIsBreaking.checked,
            seoTitle: elements.seoTitle.value,
            seoDescription: elements.seoDesc.value,
            authorId: AppState.currentUser.id
        };

        if(elements.metaStatus.value === 'scheduled') {
            const pubDate = elements.metaPublishDate.value;
            if(pubDate) {
                articleData.publishedAt = new Date(pubDate).toISOString();
            } else if(!isAutoSave) {
                showToast('Please select a publish date for scheduled article', 'error');
                return;
            }
        } else if (elements.metaStatus.value === 'published') {
            articleData.publishedAt = articleData.publishedAt || new Date().toISOString();
        }

        if(AppState.editor.currentArticleId) {
            ESBDataStore.Articles.update(AppState.editor.currentArticleId, articleData);
            if(!isAutoSave) showToast('Article updated successfully', 'success');
        } else {
            const newArticle = ESBDataStore.Articles.create(articleData);
            AppState.editor.currentArticleId = newArticle.id;
            if(!isAutoSave) showToast('Article created successfully', 'success');
        }
    }

    function toggleSourceMode() {
        AppState.editor.isSourceMode = !AppState.editor.isSourceMode;
        const btn = document.querySelector('.toolbar-btn[data-custom="source"]');
        
        if(AppState.editor.isSourceMode) {
            btn.classList.add('active');
            elements.sourceEditor.value = elements.richTextEditor.innerHTML;
            elements.richTextEditor.style.display = 'none';
            elements.sourceEditor.style.display = 'block';
            // Disable formatting buttons
            elements.toolbarBtns.forEach(b => b.style.opacity = '0.5');
            elements.toolbarSelects.forEach(s => s.disabled = true);
        } else {
            btn.classList.remove('active');
            elements.richTextEditor.innerHTML = elements.sourceEditor.value;
            elements.sourceEditor.style.display = 'none';
            elements.richTextEditor.style.display = 'block';
            // Enable formatting buttons
            elements.toolbarBtns.forEach(b => b.style.opacity = '1');
            elements.toolbarSelects.forEach(s => s.disabled = false);
        }
    }

    function toggleZenMode() {
        AppState.editor.isFullscreen = !AppState.editor.isFullscreen;
        const btn = document.querySelector('.toolbar-btn[data-custom="zen"]') || document.querySelector('.toolbar-btn[data-custom="fullscreen"]');
        
        if(AppState.editor.isFullscreen) {
            if(btn) btn.classList.add('active');
            document.body.classList.add('zen-mode');
            showToast('Zen Mode Activated. Press Esc or click again to exit.', 'success');
        } else {
            if(btn) btn.classList.remove('active');
            document.body.classList.remove('zen-mode');
        }
    }

    function openPreview() {
        // Sync content
        let content = AppState.editor.isSourceMode ? elements.sourceEditor.value : elements.richTextEditor.innerHTML;
        
        document.getElementById('preview-title-render').textContent = elements.editorTitle.value || 'Untitled Article';
        document.getElementById('preview-author').textContent = `By ${AppState.currentUser.firstName} ${AppState.currentUser.lastName}`;
        document.getElementById('preview-date').textContent = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        
        const imgRender = document.getElementById('preview-image-render');
        if(elements.metaFeaturedImage.value) {
            imgRender.src = elements.metaFeaturedImage.value;
            imgRender.style.display = 'block';
        } else {
            imgRender.style.display = 'none';
        }

        document.getElementById('preview-body-render').innerHTML = content;
        
        elements.previewOverlay.style.display = 'flex';
    }

    // --- Editor Helpers ---
    function addTagPill(name, id) {
        const pill = document.createElement('div');
        pill.className = 'tag-pill';
        pill.setAttribute('data-id', id);
        pill.innerHTML = `<span>${name}</span> <i data-lucide="x"></i>`;
        
        pill.querySelector('i').addEventListener('click', () => {
            pill.remove();
        });
        
        elements.tagsList.appendChild(pill);
        if(typeof lucide !== 'undefined') lucide.createIcons();
    }

    function setFeaturedImage(url) {
        elements.metaFeaturedImage.value = url;
        elements.featuredImagePreview.src = url;
        elements.featuredImagePreview.style.display = 'block';
        elements.featuredImagePlaceholder.style.display = 'none';
        elements.removeFeaturedImage.style.display = 'flex';
    }

    function removeFeaturedImage() {
        elements.metaFeaturedImage.value = '';
        elements.featuredImagePreview.src = '';
        elements.featuredImagePreview.style.display = 'none';
        elements.featuredImagePlaceholder.style.display = 'flex';
        elements.removeFeaturedImage.style.display = 'none';
    }

    function updateSeoPreview() {
        const title = elements.seoTitle.value || elements.editorTitle.value || 'Article Title';
        const desc = elements.seoDesc.value || elements.metaExcerpt.value || 'Meta description will appear here...';
        const slug = elements.seoSlug.value || 'article-slug';

        elements.serpTitle.textContent = title;
        elements.serpDesc.textContent = desc;
        elements.serpSlug.textContent = slug;

        elements.seoTitleCount.textContent = `${title.length}/60`;
        elements.seoTitleCount.className = title.length > 60 ? 'char-counter limit' : 'char-counter';

        elements.seoDescCount.textContent = `${desc.length}/160`;
        elements.seoDescCount.className = desc.length > 160 ? 'char-counter limit' : 'char-counter';
    }

    function loadCategories() {
        const cats = ESBDataStore.Categories.getAll();
        elements.metaCategory.innerHTML = '';
        cats.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = c.name;
            elements.metaCategory.appendChild(opt);
        });
    }

    // --- Modals ---
    let savedSelection = null;

    function saveSelection() {
        if (window.getSelection) {
            const sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                return sel.getRangeAt(0);
            }
        }
        return null;
    }

    function restoreSelection(range) {
        if (range) {
            if (window.getSelection) {
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    }

    function openModal(modal) {
        savedSelection = saveSelection();
        modal.style.display = 'flex';
    }

    function closeModal() {
        elements.modals.forEach(m => m.style.display = 'none');
        if(savedSelection) {
            restoreSelection(savedSelection);
            savedSelection = null;
        }
    }

    function setupModalListeners() {
        elements.modalCloseBtns.forEach(btn => {
            btn.addEventListener('click', closeModal);
        });

        // Close on backdrop click
        elements.modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if(e.target === modal) closeModal();
            });
        });

        // Tabs in modals
        elements.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-tab');
                // Reset active states
                const parent = btn.closest('.modal-body');
                parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                parent.querySelectorAll('.tab-content').forEach(c => {
                    c.classList.remove('active');
                    c.style.display = 'none';
                });
                
                // Set active
                btn.classList.add('active');
                const content = document.getElementById(target);
                content.classList.add('active');
                content.style.display = 'block';
            });
        });

        // Link Insert
        document.getElementById('btn-insert-link').addEventListener('click', () => {
            const url = document.getElementById('link-url').value;
            const text = document.getElementById('link-text').value;
            const blank = document.getElementById('link-blank').checked;
            
            if(!url) return;
            
            restoreSelection(savedSelection);
            
            if(text) {
                const a = `<a href="${url}" ${blank ? 'target="_blank"' : ''}>${text}</a>`;
                document.execCommand('insertHTML', false, a);
            } else {
                document.execCommand('createLink', false, url);
                if(blank) {
                    // Find the newly created link to add target blank
                    // Simple hacky way:
                    const links = elements.richTextEditor.getElementsByTagName('a');
                    for(let i=0; i<links.length; i++) {
                        if(links[i].href === url) {
                            links[i].setAttribute('target', '_blank');
                        }
                    }
                }
            }
            
            // Reset and close
            document.getElementById('link-url').value = '';
            document.getElementById('link-text').value = '';
            closeModal();
        });

        // Image Insert
        document.getElementById('btn-insert-image').addEventListener('click', () => {
            const urlInput = document.getElementById('image-url').value;
            const activeTab = document.querySelector('#image-modal .tab-btn.active').getAttribute('data-tab');
            const target = document.getElementById('image-modal').getAttribute('data-target');
            
            let finalUrl = urlInput;

            if(activeTab === 'img-library') {
                const selected = document.querySelector('#modal-library-grid .library-item.selected');
                if(selected) {
                    finalUrl = selected.querySelector('img').src;
                }
            }

            if(!finalUrl) {
                showToast('Please select or provide an image URL', 'error');
                return;
            }

            if(target === 'featured') {
                setFeaturedImage(finalUrl);
            } else {
                restoreSelection(savedSelection);
                document.execCommand('insertImage', false, finalUrl);
            }

            document.getElementById('image-url').value = '';
            closeModal();
        });

        // Image Upload Simulation
        document.getElementById('image-upload-area').addEventListener('click', () => {
            document.getElementById('image-file-input').click();
        });

        document.getElementById('image-file-input').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if(file) {
                const reader = new FileReader();
                reader.onload = (evt) => {
                    document.getElementById('image-url').value = evt.target.result;
                    showToast('Image processed', 'success');
                };
                reader.readAsDataURL(file);
            }
        });

        // Video Insert
        document.getElementById('btn-insert-video').addEventListener('click', () => {
            const url = document.getElementById('video-url').value;
            if(!url) return;
            
            restoreSelection(savedSelection);
            
            // Simple youtube conversion
            let embedUrl = url;
            if(url.includes('youtube.com/watch?v=')) {
                embedUrl = url.replace('watch?v=', 'embed/');
            } else if(url.includes('youtu.be/')) {
                embedUrl = url.replace('youtu.be/', 'youtube.com/embed/');
            }
            
            const iframe = `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:1em 0;"><iframe src="${embedUrl}" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allowfullscreen></iframe></div><p><br></p>`;
            document.execCommand('insertHTML', false, iframe);
            
            document.getElementById('video-url').value = '';
            closeModal();
        });

        // Table Insert
        document.getElementById('btn-insert-table').addEventListener('click', () => {
            const rows = parseInt(document.getElementById('table-rows').value);
            const cols = parseInt(document.getElementById('table-cols').value);
            
            restoreSelection(savedSelection);
            
            let table = '<table border="1" style="width:100%;border-collapse:collapse;"><tbody>';
            for(let r=0; r<rows; r++) {
                table += '<tr>';
                for(let c=0; c<cols; c++) {
                    table += '<td style="padding:8px;border:1px solid #ccc;">Cell</td>';
                }
                table += '</tr>';
            }
            table += '</tbody></table><p><br></p>';
            
            document.execCommand('insertHTML', false, table);
            closeModal();
        });
    }

    function loadModalMediaLibrary() {
        const mediaList = ESBDataStore.Media.getAll().filter(m => m.type === 'image');
        const grid = document.getElementById('modal-library-grid');
        grid.innerHTML = '';
        
        mediaList.forEach(m => {
            const div = document.createElement('div');
            div.className = 'library-item';
            div.innerHTML = `<img src="${m.url}" alt="${m.altText || m.filename}">`;
            
            div.addEventListener('click', () => {
                grid.querySelectorAll('.library-item').forEach(i => i.classList.remove('selected'));
                div.classList.add('selected');
            });
            
            grid.appendChild(div);
        });
    }

    // --- Media Manager ---
    function loadMedia() {
        const mediaList = ESBDataStore.Media.getAll();
        const grid = document.getElementById('media-grid');
        grid.innerHTML = '';

        mediaList.forEach(m => {
            const div = document.createElement('div');
            div.className = 'media-item';
            
            let thumb = '';
            if(m.type === 'image') {
                thumb = `<img src="${m.url}" alt="${m.altText || m.filename}">`;
            } else {
                thumb = `<i data-lucide="file"></i>`;
            }

            let actions = '';
            if(m.type === 'image') {
                actions = `
                <div class="media-actions">
                    <button class="btn-edit-img" data-url="${m.url}" title="Edit Image"><i data-lucide="edit-2" style="width:14px; height:14px;"></i></button>
                </div>`;
            }

            div.innerHTML = `
                ${actions}
                <div class="media-thumb">
                    ${thumb}
                </div>
                <div class="media-info">
                    <div class="media-name" title="${m.filename}">${m.filename}</div>
                    <div class="media-meta">${m.type.toUpperCase()} • ${m.size ? formatBytes(m.size) : 'Unknown'}</div>
                </div>
            `;
            grid.appendChild(div);
        });
        
        // Add click listeners for edit
        const editBtns = document.querySelectorAll('.btn-edit-img');
        editBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                openImageEditor(e.currentTarget.getAttribute('data-url'));
            });
        });
        
        if (typeof lucide !== 'undefined') lucide.createIcons();

        // Main upload input
        const uploadInput = document.getElementById('media-upload-input');
        // Prevent multiple listeners
        const newUploadInput = uploadInput.cloneNode(true);
        uploadInput.parentNode.replaceChild(newUploadInput, uploadInput);
        
        newUploadInput.addEventListener('change', (e) => {
            const files = e.target.files;
            if(files && files.length > 0) {
                Array.from(files).forEach(file => {
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                        const newMedia = {
                            filename: file.name,
                            url: evt.target.result,
                            type: file.type.startsWith('image/') ? 'image' : 'document',
                            size: file.size,
                            uploadedBy: AppState.currentUser.id
                        };
                        ESBDataStore.Media.create(newMedia);
                    };
                    reader.readAsDataURL(file);
                });
                
                setTimeout(() => {
                    showToast(`${files.length} file(s) uploaded`, 'success');
                    loadMedia();
                }, 500);
            }
        });
    }

    // --- Calendar ---
    let currentCalDate = new Date();

    function loadCalendar() {
        renderCalendar(currentCalDate);
        
        document.getElementById('cal-prev').onclick = () => {
            currentCalDate.setMonth(currentCalDate.getMonth() - 1);
            renderCalendar(currentCalDate);
        };
        
        document.getElementById('cal-next').onclick = () => {
            currentCalDate.setMonth(currentCalDate.getMonth() + 1);
            renderCalendar(currentCalDate);
        };

        document.getElementById('cal-today').onclick = () => {
            currentCalDate = new Date();
            renderCalendar(currentCalDate);
        };
    }

    function renderCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        
        document.getElementById('cal-current-month').textContent = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const prevDays = new Date(year, month, 0).getDate();
        
        const grid = document.getElementById('full-calendar-grid');
        grid.innerHTML = '';
        
        const today = new Date();
        const articles = ESBDataStore.Articles.getAll();
        
        // Fill grid
        let cellCount = 0;
        
        // Prev month days
        for(let i = firstDay - 1; i >= 0; i--) {
            const dayNum = prevDays - i;
            grid.appendChild(createCalendarCell(dayNum, true));
            cellCount++;
        }
        
        // Current month days
        for(let i = 1; i <= daysInMonth; i++) {
            const isToday = i === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            
            // Find articles for this day
            const dayEvents = articles.filter(a => {
                if(!a.publishedAt) return false;
                const d = new Date(a.publishedAt);
                return d.getDate() === i && d.getMonth() === month && d.getFullYear() === year;
            });
            
            grid.appendChild(createCalendarCell(i, false, isToday, dayEvents));
            cellCount++;
        }
        
        // Next month days to complete grid (make it multiple of 7)
        const remaining = 42 - cellCount; // 6 rows * 7 days
        for(let i = 1; i <= remaining; i++) {
            grid.appendChild(createCalendarCell(i, true));
        }
    }

    function createCalendarCell(dayNum, isOtherMonth, isToday = false, events = []) {
        const cell = document.createElement('div');
        cell.className = `calendar-cell ${isOtherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`;
        
        let html = `<span class="calendar-date">${dayNum}</span>`;
        
        if(events.length > 0) {
            html += '<div class="cal-events-list">';
            events.forEach(e => {
                html += `<div class="cal-event ${e.status}" title="${e.title}" onclick="event.stopPropagation(); window.editArticleCallback('${e.id}')">${e.title || 'Untitled'}</div>`;
            });
            html += '</div>';
        }
        
        cell.innerHTML = html;
        return cell;
    }
    
    // Make editArticle accessible globally for inline onclick
    window.editArticleCallback = (id) => {
        editArticle(id);
    };

    // --- Profile ---
    function loadProfile() {
        const user = AppState.currentUser;
        document.getElementById('profile-name-display').textContent = `${user.firstName} ${user.lastName}`;
        document.getElementById('profile-role-display').textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
        document.getElementById('profile-avatar').src = user.avatar;
        
        document.getElementById('profile-name').value = `${user.firstName} ${user.lastName}`;
        document.getElementById('profile-email').value = user.email;
        // Mock bio/social as they aren't in datastore initially
        document.getElementById('profile-bio').value = user.bio || '';
    }

    function setupProfileListeners() {
        document.getElementById('profile-form').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameParts = document.getElementById('profile-name').value.split(' ');
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(' ');
            const password = document.getElementById('profile-password').value;
            
            const updates = {
                firstName: firstName,
                lastName: lastName,
                bio: document.getElementById('profile-bio').value
            };

            if(password) {
                updates.passwordHash = password; // simplistic
            }

            const updatedUser = ESBDataStore.Users.update(AppState.currentUser.id, updates);
            if(updatedUser) {
                AppState.currentUser = updatedUser;
                sessionStorage.setItem('cms_user', JSON.stringify(updatedUser));
                
                // Update UI
                elements.topbarName.textContent = updatedUser.firstName;
                document.getElementById('profile-name-display').textContent = `${updatedUser.firstName} ${updatedUser.lastName}`;
                
                document.getElementById('profile-password').value = '';
                showToast('Profile updated successfully', 'success');
            }
        });

        // Profile avatar upload
        document.getElementById('profile-avatar-upload').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if(file) {
                const reader = new FileReader();
                reader.onload = (evt) => {
                    const avatarUrl = evt.target.result;
                    ESBDataStore.Users.update(AppState.currentUser.id, { avatar: avatarUrl });
                    AppState.currentUser.avatar = avatarUrl;
                    sessionStorage.setItem('cms_user', JSON.stringify(AppState.currentUser));
                    
                    document.getElementById('profile-avatar').src = avatarUrl;
                    elements.topbarAvatar.src = avatarUrl;
                    showToast('Avatar updated', 'success');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // --- Utilities ---
    function showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = 'info';
        if(type === 'success') icon = 'check-circle';
        if(type === 'error') icon = 'alert-circle';
        
        toast.innerHTML = `<i data-lucide="${icon}"></i> <span>${message}</span>`;
        container.appendChild(toast);
        if(typeof lucide !== 'undefined') lucide.createIcons();
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function generateSlug(text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }

    function formatDate(isoString) {
        if(!isoString) return '';
        const d = new Date(isoString);
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    function formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }

    function formatBytes(bytes, decimals = 2) {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    }

    function getTimeOfDay() {
        const hour = new Date().getHours();
        if(hour < 12) return 'morning';
        if(hour < 18) return 'afternoon';
        return 'evening';
    }

    // --- Premium Features Setup ---

    // 1. Zen Mode Keyboard Shortcut
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'z') {
            e.preventDefault();
            toggleZenMode();
        }
        if (e.key === 'Escape' && AppState.editor.isFullscreen) {
            toggleZenMode();
        }
    });

    // 2. Export PDF / Markdown
    const btnExportPdf = document.getElementById('btn-export-pdf');
    const btnExportMd = document.getElementById('btn-export-md');
    
    if (btnExportPdf) {
        btnExportPdf.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('Generating PDF...', 'success');
            setTimeout(() => {
                // In a real app, you would use a library like html2pdf.js or an API
                // For now, trigger a print prompt for the editor content in preview mode
                const originalTitle = document.title;
                document.title = elements.editorTitle.value || 'Article';
                
                // Open preview then print
                openPreview();
                setTimeout(() => {
                    window.print();
                    document.title = originalTitle;
                    // Close preview
                    elements.previewOverlay.style.display = 'none';
                    showToast('PDF Export triggered', 'success');
                }, 500);
            }, 1000);
        });
    }

    if (btnExportMd) {
        btnExportMd.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('Converting to Markdown...', 'success');
            setTimeout(() => {
                // Basic conversion
                let html = elements.richTextEditor.innerHTML;
                let md = html
                    .replace(/<h1>(.*?)<\/h1>/gi, '# $1\n\n')
                    .replace(/<h2>(.*?)<\/h2>/gi, '## $1\n\n')
                    .replace(/<h3>(.*?)<\/h3>/gi, '### $1\n\n')
                    .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
                    .replace(/<b>(.*?)<\/b>/gi, '**$1**')
                    .replace(/<em>(.*?)<\/em>/gi, '*$1*')
                    .replace(/<i>(.*?)<\/i>/gi, '*$1*')
                    .replace(/<p>(.*?)<\/p>/gi, '$1\n\n')
                    .replace(/<br\s*[\/]?>/gi, '\n')
                    .replace(/<[^>]+>/g, '');
                
                const title = elements.editorTitle.value || 'Untitled';
                md = `# ${title}\n\n${md}`;
                
                // Create download link
                const blob = new Blob([md], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.md`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                showToast('Markdown downloaded', 'success');
            }, 500);
        });
    }

    // 3. Social Media Drafts
    const socialTwitter = document.getElementById('social-twitter');
    const socialTwitterCount = document.getElementById('social-twitter-count');
    if (socialTwitter && socialTwitterCount) {
        socialTwitter.addEventListener('input', () => {
            const count = socialTwitter.value.length;
            socialTwitterCount.textContent = `${count}/280`;
            if (count > 280) {
                socialTwitterCount.style.color = 'var(--danger)';
            } else {
                socialTwitterCount.style.color = 'inherit';
            }
        });
    }

    // 4. Image Editor Modal
    let currentEditingImage = null;
    let editTransform = { rotate: 0, flipH: 1, flipV: 1 };
    
    window.openImageEditor = function(imgSrc) {
        const modal = document.getElementById('image-edit-modal');
        const preview = document.getElementById('image-edit-preview');
        
        currentEditingImage = imgSrc;
        preview.src = imgSrc;
        
        // Reset transform
        editTransform = { rotate: 0, flipH: 1, flipV: 1 };
        applyImageTransform();
        
        modal.style.display = 'flex';
    };

    function applyImageTransform() {
        const preview = document.getElementById('image-edit-preview');
        if(preview) {
            preview.style.transform = `rotate(${editTransform.rotate}deg) scaleX(${editTransform.flipH}) scaleY(${editTransform.flipV})`;
        }
    }

    const btnImgRotateLeft = document.getElementById('btn-img-rotate-left');
    if(btnImgRotateLeft) btnImgRotateLeft.addEventListener('click', () => { editTransform.rotate -= 90; applyImageTransform(); });
    
    const btnImgRotateRight = document.getElementById('btn-img-rotate-right');
    if(btnImgRotateRight) btnImgRotateRight.addEventListener('click', () => { editTransform.rotate += 90; applyImageTransform(); });
    
    const btnImgFlipH = document.getElementById('btn-img-flip-h');
    if(btnImgFlipH) btnImgFlipH.addEventListener('click', () => { editTransform.flipH *= -1; applyImageTransform(); });
    
    const btnImgFlipV = document.getElementById('btn-img-flip-v');
    if(btnImgFlipV) btnImgFlipV.addEventListener('click', () => { editTransform.flipV *= -1; applyImageTransform(); });
    
    const btnImgCrop = document.getElementById('btn-img-crop');
    if(btnImgCrop) btnImgCrop.addEventListener('click', () => { 
        showToast('Crop simulation activated. Drag to crop area.', 'info'); 
        // Simulated crop mode
        const previewContainer = document.querySelector('.image-edit-preview-container');
        previewContainer.style.border = '2px dashed var(--accent-color)';
    });

    const btnSaveImageEdit = document.getElementById('btn-save-image-edit');
    if(btnSaveImageEdit) {
        btnSaveImageEdit.addEventListener('click', () => {
            showToast('Image changes saved and generated new version!', 'success');
            document.getElementById('image-edit-modal').style.display = 'none';
            // In a real app, this would process canvas and upload as a new image to Media store.
            // For now, we simulate success and re-render media.
            if(typeof loadMediaGrid === 'function') loadMediaGrid();
        });
    }

    // Start
    init();

    // Command Palette Logic
    document.addEventListener('keydown', (e) => {
        const cp = document.getElementById('cmsCommandPalette');
        if(!cp) return;
        
        if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
            e.preventDefault();
            cp.classList.remove('hidden');
            document.getElementById('cmsCommandInput')?.focus();
        }
        
        if (e.key === 'Escape') {
            cp.classList.add('hidden');
        }
    });
    
    document.getElementById('cmsCommandPalette')?.addEventListener('click', (e) => {
        if (e.target.id === 'cmsCommandPalette') {
            e.target.classList.add('hidden');
        }
    });

});
