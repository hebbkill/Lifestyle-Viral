const defaultConfig = {
    app_title: "LIFESTYLE VIRAL",
    creator_name: "ATHLETE & CREATOR",
    weekly_goal: "4 VÍDEOS POR SEMANA",
    weekly_goal_number: 4,
    word_preset: "Curto (5-6)",
    word_max: 6
};

// State
let videos = [];
let allVideos = [];
let currentConfig = { ...defaultConfig };
let filters = {
    search: '',
    status: '',
    hookType: '',
    visualStyle: '',
    musicVibe: '',
    thisWeekOnly: false
};
let viewMode = 'grid'; // 'grid' | 'kanban'
let editingVideo = null; // Track the video being edited


// DOM Elements cache (populated in init)
const dom = {};

// --- Initialization ---

async function init() {
    console.log("Initializing App...");

    // Cache DOM elements
    dom.app = document.getElementById('app');
    dom.modal = document.getElementById('modal');
    dom.helpModal = document.getElementById('help-modal');
    dom.contentContainer = document.getElementById('content-container');
    dom.totalVideos = document.getElementById('total-videos');
    dom.thisWeek = document.getElementById('this-week');
    dom.ideiasCount = document.getElementById('ideias-count');
    dom.publicadosCount = document.getElementById('publicados-count');
    dom.progressBar = document.getElementById('progress-bar');
    dom.progressText = document.getElementById('progress-text');
    dom.progressStatus = document.getElementById('progress-status');
    dom.weeklyGoalInput = document.getElementById('weekly-goal-input');

    // Filters
    dom.searchInput = document.getElementById('search-input');
    dom.filterStatus = document.getElementById('filter-status');
    dom.filterHook = document.getElementById('filter-hook');
    dom.filterVisual = document.getElementById('filter-visual');
    dom.filterMusicVibe = document.getElementById('filter-music-vibe');
    dom.filterWeek = document.getElementById('filter-week');
    dom.clearFiltersBtn = document.getElementById('clear-filters');

    // Form
    dom.form = document.getElementById('video-form');
    dom.modalTitle = document.getElementById('modal-title');
    dom.saveBtn = document.getElementById('save-btn');
    dom.deleteBtn = document.getElementById('delete-btn');

    // Generator
    dom.generatePromptBtn = document.getElementById('generate-prompt-btn');
    dom.copyPromptBtn = document.getElementById('copy-open-chatgpt-btn');
    dom.gptPrompt = document.getElementById('gpt-prompt');
    dom.promptFeedback = document.getElementById('prompt-feedback');
    dom.wordPreset = document.getElementById('word-preset');
    dom.wordLimit = document.getElementById('word-limit');

    // Kanban & View
    dom.viewGridBtn = document.getElementById('view-grid-btn');
    dom.viewKanbanBtn = document.getElementById('view-kanban-btn');
    dom.kanbanContainer = document.getElementById('kanban-container');
    dom.referenceLink = document.getElementById('reference-link');

    // Buttons
    console.log('=== ATTACHING EVENT LISTENERS ===');

    const newVideoBtn = document.getElementById('new-video-btn');
    const closeModalBtn = document.getElementById('close-modal');
    const helpBtn = document.getElementById('help-btn');
    const closeHelpBtn = document.getElementById('close-help');

    console.log('new-video-btn element:', newVideoBtn);
    console.log('close-modal element:', closeModalBtn);
    console.log('help-btn element:', helpBtn);
    console.log('close-help element:', closeHelpBtn);

    if (newVideoBtn) {
        // Remove existing listeners (cloning node is a brute force way, but simple update is safer)
        const newBtn = newVideoBtn.cloneNode(true);
        newVideoBtn.parentNode.replaceChild(newBtn, newVideoBtn);

        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openModal();
        });
        console.log('✓ Event listener attached to new-video-btn (Protected)');
    } else {
        console.error('✗ new-video-btn not found!');
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
        console.log('✓ Event listener attached to close-modal');
    } else {
        console.error('✗ close-modal not found!');
    }

    if (helpBtn) {
        // Isolate help button
        const newHelpBtn = helpBtn.cloneNode(true);
        helpBtn.parentNode.replaceChild(newHelpBtn, helpBtn);

        newHelpBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openHelpModal(); // This calls the robust version I made earlier
        });
        console.log('✓ Event listener attached to help-btn (Protected)');
    } else {
        console.error('✗ help-btn not found!');
    }

    if (closeHelpBtn) {
        closeHelpBtn.addEventListener('click', closeHelpModal);
        console.log('✓ Event listener attached to close-help');
    } else {
        console.error('✗ close-help not found!');
    }

    console.log('=== EVENT LISTENERS ATTACHED ===');
    // Removed specific help-hooks-btn and help-visual-btn as they are now unified in the new modal structure


    // Close modals on backdrop click
    dom.modal.addEventListener('click', (e) => {
        if (e.target === dom.modal) closeModal();
    });
    dom.helpModal.addEventListener('click', (e) => {
        if (e.target === dom.helpModal) closeHelpModal();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!dom.helpModal.classList.contains('hidden')) {
                closeHelpModal();
            } else if (!dom.modal.classList.contains('hidden')) {
                closeModal();
            }
        }
    });

    // Auto-suggest text preset based on video duration
    const videoDurationSelect = document.getElementById('video-duration');
    if (videoDurationSelect) {
        videoDurationSelect.addEventListener('change', function () {
            const duration = this.value;
            const presetMap = {
                'ultra': 'Ultra curto (3-4)',
                'short': 'Curto (5-6)',
                'medium': 'Médio (7-9)',
                'long': 'Story (10-12)'
            };

            const suggestedPreset = presetMap[duration];
            if (suggestedPreset && dom.wordPreset) {
                dom.wordPreset.value = suggestedPreset;
                updateWordLimit();
            }
        });
    }

    // Update word limit when preset changes
    if (dom.wordPreset) {
        dom.wordPreset.addEventListener('change', updateWordLimit);
    }

    // Event Listeners for Filters
    dom.searchInput.addEventListener('input', (e) => {
        filters.search = e.target.value;
        applyFilters();
    });
    dom.filterStatus.addEventListener('change', (e) => {
        filters.status = e.target.value;
        applyFilters();
    });
    dom.filterHook.addEventListener('change', (e) => {
        filters.hookType = e.target.value;
        applyFilters();
    });
    dom.filterVisual.addEventListener('change', (e) => {
        filters.visualStyle = e.target.value;
        applyFilters();
    });
    if (dom.filterMusicVibe) {
        dom.filterMusicVibe.addEventListener('change', (e) => {
            filters.musicVibe = e.target.value;
            applyFilters();
        });
    }
    dom.filterWeek.addEventListener('change', (e) => {
        filters.thisWeekOnly = e.target.checked;
        applyFilters();
    });
    dom.clearFiltersBtn.addEventListener('click', clearFilters);

    // Form
    // dom.form.addEventListener('submit', handleSaveVideo); // Changed to button click
    dom.saveBtn.addEventListener('click', (e) => {
        if (dom.form.checkValidity()) {
            handleSaveVideo(e);
        } else {
            dom.form.reportValidity();
        }
    });
    dom.deleteBtn.addEventListener('click', handleDeleteVideo);

    // Weekly Goal
    dom.weeklyGoalInput.addEventListener('change', handleGoalChange);

    // Generator
    dom.generatePromptBtn.addEventListener('click', generatePrompt);
    dom.copyPromptBtn.addEventListener('click', copyPromptToClipboard);

    // Word Limit Config Logic
    dom.wordPreset.addEventListener('change', (e) => {
        const val = e.target.value;
        let limit = 6;
        if (val === 'Ultra curto (3-4)') limit = 4;
        else if (val === 'Curto (5-6)') limit = 6;
        else if (val === 'Médio (7-9)') limit = 9;
        else if (val === 'Longo (10-12)') limit = 12;

        if (val !== 'Custom') {
            dom.wordLimit.value = limit;
        }

        saveSettings();
    });
    dom.wordLimit.addEventListener('change', saveSettings);

    // View Toggles
    dom.viewGridBtn.addEventListener('click', () => setViewMode('grid'));
    dom.viewKanbanBtn.addEventListener('click', () => setViewMode('kanban'));

    // Voice Input
    initVoiceInput();

    // Hacker Hook Chips
    initHackerHookChips();

    // Filter Popup
    initFilterPopup();

    // Help Modal
    setupHelpModal();


    // SDK Init
    if (window.elementSdk && window.dataSdk) {
        // Init Element SDK (Config)
        window.elementSdk.init({
            defaultConfig: defaultConfig,
            onConfigChange: (config) => {
                currentConfig = { ...defaultConfig, ...config };
                renderConfig();
                updateStats();
            }
        });

        // Init Data SDK (Videos)
        const initResult = await window.dataSdk.init({
            onDataChanged: (data) => {
                allVideos = data.sort((a, b) => {
                    // Sort: Week desc, then Date desc
                    if (a.week_number !== b.week_number) {
                        return b.week_number - a.week_number;
                    }
                    return new Date(b.post_date) - new Date(a.post_date);
                });
                applyFilters(); // Re-apply filters which calls render
            }
        });

        if (!initResult.isOk) {
            console.error("Failed to initialize data SDK");
        }
    } else {
        console.error("SDKs not found");
    }
}

// --- Utility Functions ---

// Status Color System: Green (published) | Yellow (in progress) | Red (overdue)
function getStatusColor(video) {
    // Green: Published
    if (video.status === 'Publicado') {
        return {
            primary: '#10b981',     // green-500
            light: 'rgba(16, 185, 129, 0.15)',
            border: 'rgba(16, 185, 129, 0.4)',
            text: '#000000'
        };
    }

    // Red: Overdue (past post_date and not published)
    if (video.post_date) {
        const postDate = new Date(video.post_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        postDate.setHours(0, 0, 0, 0);

        if (postDate < today && video.status !== 'Publicado') {
            return {
                primary: '#ef4444',     // red-500
                light: 'rgba(239, 68, 68, 0.15)',
                border: 'rgba(239, 68, 68, 0.4)',
                text: '#ffffff'
            };
        }
    }

    // Yellow: In progress (default)
    return {
        primary: '#f59e0b',     // amber-500
        light: 'rgba(245, 158, 11, 0.15)',
        border: 'rgba(245, 158, 11, 0.4)',
        text: '#ffffff'
    };
}

// --- Data & Logic ---

function renderConfig() {
    if (currentConfig.weekly_goal_number) {
        dom.weeklyGoalInput.value = currentConfig.weekly_goal_number;
    }

    if (currentConfig.word_preset) {
        dom.wordPreset.value = currentConfig.word_preset;
    }

    if (currentConfig.word_max) {
        dom.wordLimit.value = currentConfig.word_max;
    } else {
        // Default if missing
        dom.wordLimit.value = 6;
    }
}

function saveSettings() {
    const newConfig = {
        weekly_goal_number: parseInt(dom.weeklyGoalInput.value) || 4,
        word_preset: dom.wordPreset.value,
        word_max: parseInt(dom.wordLimit.value) || 6
    };

    window.elementSdk.setConfig(newConfig);
}

function handleGoalChange() {
    saveSettings();
    updateStats();
}

function applyFilters() {
    let filtered = [...allVideos];

    // Search
    if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(v =>
            (v.title && v.title.toLowerCase().includes(searchLower)) ||
            (v.concept && v.concept.toLowerCase().includes(searchLower)) ||
            (v.notes && v.notes.toLowerCase().includes(searchLower))
        );
    }

    // Status
    if (filters.status) filtered = filtered.filter(v => v.status === filters.status);

    // Hooks & Visuals
    if (filters.hookType) filtered = filtered.filter(v => v.hook_type === filters.hookType);
    if (filters.visualStyle) filtered = filtered.filter(v => v.visual_style === filters.visualStyle);
    if (filters.musicVibe) filtered = filtered.filter(v => v.music_vibe === filters.musicVibe);

    // Week
    if (filters.thisWeekOnly) {
        const currentWeek = getWeekISO();
        filtered = filtered.filter(v => parseInt(v.week_number) === currentWeek);
    }

    videos = filtered;
    renderContent();
    updateStats();
    updateActiveFiltersCount();
}

function clearFilters() {
    filters = {
        search: '',
        status: '',
        hookType: '',
        visualStyle: '',
        musicVibe: '',
        thisWeekOnly: false
    };

    if (dom.searchInput) dom.searchInput.value = '';
    if (dom.filterStatus) dom.filterStatus.value = '';
    if (dom.filterHook) dom.filterHook.value = '';
    if (dom.filterVisual) dom.filterVisual.value = '';
    if (dom.filterMusicVibe) dom.filterMusicVibe.value = '';
    if (dom.filterWeek) dom.filterWeek.checked = false;

    applyFilters();
}

function setViewMode(mode) {
    viewMode = mode;

    // Update buttons
    if (mode === 'grid') {
        dom.viewGridBtn.classList.add('active');
        dom.viewKanbanBtn.classList.remove('active');
        dom.contentContainer.classList.remove('hidden');
        dom.kanbanContainer.classList.add('hidden');
    } else {
        dom.viewGridBtn.classList.remove('active');
        dom.viewKanbanBtn.classList.add('active');
        dom.contentContainer.classList.add('hidden');
        dom.kanbanContainer.classList.remove('hidden');
    }

    renderContent();
}

// --- Rendering ---

function renderContent() {
    if (viewMode === 'kanban') {
        renderKanban();
        return;
    }
    const container = dom.contentContainer;
    container.innerHTML = '';

    if (videos.length === 0) {
        const hasActiveFilters = filters.search || filters.status || filters.hookType || filters.visualStyle || filters.thisWeekOnly;

        if (hasActiveFilters) {
            container.innerHTML = `
                <div class="text-center py-20">
                    <div class="text-8xl mb-6 opacity-20">🔍</div>
                    <p class="text-2xl font-bold font-mono-custom mb-2" style="letter-spacing: 2px;">NENHUM RESULTADO</p>
                    <p class="mt-2 mb-6" style="color: rgba(255, 255, 255, 0.5);">Tente ajustar os filtros ou limpar a busca</p>
                    <button class="px-6 py-3 bg-white text-black font-bold font-mono-custom hover:bg-gray-200 transition-colors" style="letter-spacing: 1px;" onclick="clearFilters()">LIMPAR FILTROS</button>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="text-center py-20">
                    <div class="text-8xl mb-6 opacity-20">🎬</div>
                    <p class="text-2xl font-bold font-mono-custom mb-2" style="letter-spacing: 2px;">NENHUM VÍDEO PLANEJADO</p>
                    <p class="mt-2" style="color: rgba(255, 255, 255, 0.5);">Clique em "NOVO VÍDEO" para começar sua jornada viral</p>
                </div>
            `;
        }
        return;
    }

    // Group by week
    const videosByWeek = videos.reduce((acc, video) => {
        const week = video.week_number || 'Sem Data';
        if (!acc[week]) acc[week] = [];
        acc[week].push(video);
        return acc;
    }, {});

    const weeks = Object.keys(videosByWeek).sort((a, b) => b - a);

    weeks.forEach(week => {
        const weekVideos = videosByWeek[week];

        const weekHtml = document.createElement('div');
        weekHtml.innerHTML = `
            <div class="week-separator">
                <span class="week-label font-mono-custom">SEMANA ${week}</span>
            </div>
            <div class="content-grid mb-8" id="grid-week-${week}"></div>
        `;
        container.appendChild(weekHtml);

        const grid = weekHtml.querySelector(`#grid-week-${week}`);
        weekVideos.forEach(video => {
            grid.appendChild(createVideoCard(video));

        });
    });
}

function renderKanban() {
    const container = dom.kanbanContainer;
    container.innerHTML = '';

    const statuses = [
        { id: 'Ideia', label: '💡 Ideia' },
        { id: 'Roteirizando', label: '✍️ Roteirizando' },
        { id: 'Takes Gravados', label: '🎬 Takes Gravados' },
        { id: 'Editando', label: '✂️ Editando' },
        { id: 'Agendado', label: '📅 Agendado' },
        { id: 'Publicado', label: '✅ Publicado' }
    ];

    statuses.forEach(status => {
        const column = document.createElement('div');
        column.className = 'kanban-column';
        column.dataset.status = status.id;

        // Drag Over Handlers
        column.addEventListener('dragover', (e) => {
            e.preventDefault();
            column.classList.add('drag-over');
        });
        column.addEventListener('dragleave', () => {
            column.classList.remove('drag-over');
        });
        column.addEventListener('drop', (e) => handleDrop(e, status.id));

        // Filter videos for this column
        const columnVideos = videos.filter(v => v.status === status.id);

        const header = document.createElement('div');
        header.className = 'kanban-header';
        header.textContent = status.label;
        header.dataset.count = columnVideos.length;

        const body = document.createElement('div');
        body.className = 'kanban-body';

        columnVideos.forEach(video => {
            body.appendChild(createKanbanCard(video));
        });

        column.appendChild(header);
        column.appendChild(body);
        container.appendChild(column);
    });
}

function createKanbanCard(video) {
    const card = document.createElement('div');
    card.className = "glass-effect p-4 kanban-card rounded-lg mb-2";
    card.draggable = true;

    // Get dynamic status colors
    const colors = getStatusColor(video);

    // Apply accent border
    card.style.borderLeft = `3px solid ${colors.primary}`;
    card.style.boxShadow = `0 2px 8px rgba(0,0,0,0.2), 0 0 12px ${colors.light}`;

    // Drag Events - use __backendId for consistency with mock SDK
    card.addEventListener('dragstart', (e) => {
        const videoId = video.id || video.__backendId;
        e.dataTransfer.setData('text/plain', videoId);
        card.classList.add('dragging');
    });
    card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
    });

    card.onclick = (e) => {
        // Prevent click when dragging end logic might fire
        openModal(video);
    };

    card.innerHTML = `
        <div class="text-xs font-mono-custom mb-1" style="color: rgba(255,255,255,0.4)">${formatDate(video.post_date)}</div>
        <h4 class="font-bold text-sm mb-2" style="color: #ffffff;">${escapeHtml(video.title)}</h4>
        
        ${video.hook_type ? `<div class="text-xs mb-1" style="color:#93c5fd">${escapeHtml(video.hook_type)}</div>` : ''}
        
        ${video.reference_link ? `
            <a href="${escapeHtml(video.reference_link)}" target="_blank" class="ref-link" onclick="event.stopPropagation()">
                🔗 Ref
            </a>
        ` : ''}
    `;
    return card;
}

async function handleDrop(e, newStatus) {
    e.preventDefault();
    document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));

    const videoId = e.dataTransfer.getData('text/plain');
    if (!videoId) return;

    // Find video by id or __backendId
    const video = allVideos.find(v =>
        v.id === videoId ||
        v.__backendId === videoId ||
        String(v.id) === String(videoId) ||
        String(v.__backendId) === String(videoId)
    );

    if (video && video.status !== newStatus) {
        await window.dataSdk.update({
            ...video,
            status: newStatus
        });
    }
}

function createVideoCard(video) {
    const card = document.createElement('div');
    card.className = "glass-effect p-6 card-hover cursor-pointer rounded-lg";
    card.onclick = () => openModal(video);

    // Get dynamic status colors
    const colors = getStatusColor(video);

    // Apply accent border
    card.style.borderLeft = `4px solid ${colors.primary}`;

    const statusColors = {
        'Ideia': 'rgba(147, 197, 253, 0.2)', // blue-300
        'Roteirizando': 'rgba(253, 224, 71, 0.2)', // yellow-300
        'Takes Gravados': 'rgba(167, 139, 250, 0.2)', // purple-400
        'Editando': 'rgba(251, 146, 60, 0.2)', // orange-400
        'Agendado': 'rgba(74, 222, 128, 0.2)', // green-400
        'Publicado': '#10b981' // Solid Green for Published
    };

    // Specific style for Published to be more visible or same consistency? 
    // The requirement says "Barra de progresso semanal com mudança de cor". 
    // Status badges usually have background colors.

    const statusBg = colors.light;
    const statusColor = colors.text;

    card.innerHTML = `
        <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
                <h3 class="font-bold text-lg mb-2 leading-tight" style="color: #ffffff;">${escapeHtml(video.title)}</h3>
                <p class="text-sm font-mono-custom" style="color: rgba(255, 255, 255, 0.5);">${formatDate(video.post_date)}</p>
            </div>
            <span class="status-badge ml-2 flex-shrink-0" style="background: ${statusBg}; color: ${colors.primary}; border: 1px solid ${colors.border}; font-weight: 700;">
                ${escapeHtml(video.status)}
            </span>
        </div>
        
        ${video.concept ? `
            <p class="text-sm mb-3 line-clamp-2" style="color: rgba(255, 255, 255, 0.7);">${escapeHtml(video.concept)}</p>
        ` : ''}

        <div class="flex flex-wrap gap-2 mt-auto">
            ${video.hook_type ? `<span class="hook-badge text-xs" style="color:#93c5fd">${escapeHtml(video.hook_type)}</span>` : ''}
            ${video.visual_style ? `<span class="hook-badge text-xs" style="color:#fcd34d">${escapeHtml(video.visual_style)}</span>` : ''}
            ${video.reference_link ? `<a href="${escapeHtml(video.reference_link)}" target="_blank" class="text-xs text-blue-400 hover:text-blue-300 ml-auto flex items-center gap-1" onclick="event.stopPropagation()">🔗 Link</a>` : ''}
        </div>
    `;
    return card;
}

function updateStats() {
    const totalCount = allVideos.length;
    dom.totalVideos.textContent = totalCount;

    const currentWeek = getWeekISO();
    const thisWeekVideos = allVideos.filter(v => parseInt(v.week_number) === currentWeek);
    const thisWeekCount = thisWeekVideos.length;

    dom.thisWeek.textContent = thisWeekCount;

    // Color weekly counter based on published videos
    const thisWeekPublished = thisWeekVideos.filter(v => v.status === 'Publicado').length;
    const weeklyGoal = currentConfig.weekly_goal_number || 4;
    const weekCountColor = thisWeekPublished >= weeklyGoal ? '#10b981' : '#f59e0b';
    dom.thisWeek.style.color = weekCountColor;

    const ideiasCount = allVideos.filter(v => v.status === 'Ideia' || v.status === 'Roteirizando').length;
    dom.ideiasCount.textContent = ideiasCount;

    const publicadosCount = allVideos.filter(v => v.status === 'Publicado').length;
    dom.publicadosCount.textContent = publicadosCount;

    // Progress
    const progressPercent = Math.min((thisWeekCount / weeklyGoal) * 100, 100);

    dom.progressBar.style.width = `${progressPercent}%`;
    dom.progressText.textContent = `${thisWeekCount} / ${weeklyGoal} completos`;
    dom.progressStatus.textContent = `${Math.round(progressPercent)}%`;

    // Color logic
    let color = '#ef4444'; // Red < 50
    if (progressPercent >= 100) color = '#10b981'; // Green
    else if (progressPercent >= 75) color = '#3b82f6'; // Blue
    else if (progressPercent >= 50) color = '#f59e0b'; // Yellow (Warning)

    dom.progressBar.style.background = progressPercent >= 100
        ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)'
        : `linear-gradient(90deg, ${color} 0%, ${adjustColor(color, 20)} 100%)`;

    dom.progressStatus.style.color = color;
}

// --- Actions ---

function openModal(video = null) {
    editingVideo = video;
    dom.modal.classList.remove('hidden');
    dom.modal.classList.add('flex');
    dom.modalTitle.textContent = video ? 'EDITAR VÍDEO' : 'NOVO VÍDEO';
    dom.deleteBtn.classList.toggle('hidden', !video);

    // Reset delete button state
    dom.deleteBtn.textContent = 'EXCLUIR';
    dom.deleteBtn.classList.remove('bg-red-700');
    dom.deleteBtn.style.background = '#dc2626';

    if (video) {
        // Fill form
        document.getElementById('post-date').value = video.post_date || '';
        document.getElementById('week-number').value = video.week_number || '';
        document.getElementById('video-title').value = video.title || '';
        document.getElementById('video-status').value = video.status || 'Ideia';
        document.getElementById('hook-type').value = video.hook_type || '';
        document.getElementById('visual-style').value = video.visual_style || '';
        document.getElementById('music-vibe').value = video.music_vibe || '';
        document.getElementById('video-duration').value = video.video_duration || 'short';
        document.getElementById('concept').value = video.concept || '';
        document.getElementById('reference-link').value = video.reference_link || '';
        document.getElementById('voiceover').value = video.voiceover || '';
        document.getElementById('cta').value = video.cta || '';
        document.getElementById('notes').value = video.notes || '';
        // Restore hacker hook
        setHackerHook(video.hacker_hook || '');
        // Don't fill GPT fields as they are for generation
        dom.gptPrompt.value = '';
        dom.promptFeedback.style.display = 'none';
    } else {
        // Reset form
        dom.form.reset();
        // Prefill week with current week
        document.getElementById('week-number').value = getWeekISO();
        document.getElementById('post-date').valueAsDate = new Date();
        // Clear GPT Prompt state
        dom.gptPrompt.value = '';
        dom.promptFeedback.style.display = 'none';
        // Ensure new fields are cleared
        document.getElementById('music-vibe').value = '';
        document.getElementById('video-duration').value = 'short';
        // Reset hacker hook
        setHackerHook('');
    }
}

function closeModal() {
    dom.modal.classList.add('hidden');
    dom.modal.classList.remove('flex');
    editingVideo = null;
}


// --- Help Modal Logic ---

function setupHelpModal() {
    const helpModal = document.getElementById('help-modal');
    if (!helpModal) return;

    const tabs = helpModal.querySelectorAll('.nav-item');
    const sections = helpModal.querySelectorAll('.help-section');

    function switchTab(targetId) {
        tabs.forEach(t => {
            const isTarget = t.dataset.target === targetId;
            if (isTarget) {
                t.classList.add('active', 'bg-white/10', 'text-white');
                t.classList.remove('text-white/70');
            } else {
                t.classList.remove('active', 'bg-white/10', 'text-white');
                t.classList.add('text-white/70');
            }
        });

        sections.forEach(s => {
            const isTarget = s.id === targetId;
            if (isTarget) {
                s.classList.remove('hidden');
                s.classList.add('block', 'animate-fade-in');
            } else {
                s.classList.add('hidden');
                s.classList.remove('block', 'animate-fade-in');
            }
        });
    }

    tabs.forEach(tab => {
        // Remove old listeners by cloning or just assume fresh start if this runs once
        // To be safe against multiple inits, we can check a flag
        if (tab.dataset.hasListener) return;

        tab.addEventListener('click', () => switchTab(tab.dataset.target));
        tab.dataset.hasListener = 'true';
    });

    // Initial tab
    switchTab('help-home');
}

function openHelpModal() {
    const helpModal = document.getElementById('help-modal');
    if (helpModal) {
        helpModal.classList.remove('hidden');
        // Ensure setup runs (idempotent-ish)
        setupHelpModal();
    }
}

function closeHelpModal() {
    const helpModal = document.getElementById('help-modal');
    if (helpModal) helpModal.classList.add('hidden');
}




async function handleSaveVideo(e) {
    e.preventDefault();

    if (allVideos.length >= 999 && !editingVideo) {
        alert("Limite de vídeos atingido (999). Exclua alguns para criar novos.");
        return;
    }

    const formData = {
        post_date: document.getElementById('post-date').value,
        week_number: parseInt(document.getElementById('week-number').value),
        title: document.getElementById('video-title').value,
        status: document.getElementById('video-status').value,
        hook_type: document.getElementById('hook-type').value,
        visual_style: document.getElementById('visual-style').value,
        music_vibe: document.getElementById('music-vibe').value,
        video_duration: document.getElementById('video-duration').value,
        concept: document.getElementById('concept').value,
        reference_link: document.getElementById('reference-link').value,
        voiceover: document.getElementById('voiceover').value,
        cta: document.getElementById('cta').value,
        notes: document.getElementById('notes').value,
        hacker_hook: document.getElementById('hacker-hook').value,
    };

    try {
        if (editingVideo) {
            // Update
            await window.dataSdk.update({
                ...editingVideo,
                ...formData
            });
        } else {
            // Create
            await window.dataSdk.create(formData);
        }

        closeModal();
    } catch (error) {
        console.error("Erro ao salvar:", error);
        alert("Ocorreu um erro ao salvar o vídeo. Verifique o console para mais detalhes.");
    }
}

let deleteTimeout;
async function handleDeleteVideo() {
    if (dom.deleteBtn.textContent === 'EXCLUIR') {
        dom.deleteBtn.textContent = 'CONFIRMAR?';
        dom.deleteBtn.style.background = '#991b1b'; // Darker red

        deleteTimeout = setTimeout(() => {
            dom.deleteBtn.textContent = 'EXCLUIR';
            dom.deleteBtn.style.background = '#dc2626';
        }, 3000);
    } else {
        // Confirmed
        if (deleteTimeout) clearTimeout(deleteTimeout);
        if (editingVideo) {
            await window.dataSdk.delete(editingVideo);
        }
        closeModal();
    }
}

// Helper function to update word limit based on preset
function updateWordLimit() {
    if (!dom.wordPreset || !dom.wordLimit) return;

    const preset = dom.wordPreset.value;
    const wordLimitMap = {
        'Ultra curto (3-4)': 4,
        'Curto (5-6)': 6,
        'Médio (7-9)': 9,
        'Story (10-12)': 12
    };

    // Only update if not Custom
    if (preset !== 'Custom' && wordLimitMap[preset]) {
        dom.wordLimit.value = wordLimitMap[preset];
    }
}

// --- Generator ---

// Helper function to get timeline based on duration
function getTimelineByDuration(duration) {
    const timelines = {
        'ultra': [
            { range: '0-2s', visual: 'Pattern Interrupt visual', text: 'Gancho forte', audio: 'Entrada abrupta' },
            { range: '2-5s', visual: 'Desenvolvimento rápido', text: 'Ação principal', audio: 'Batida entra' },
            { range: '5-7s', visual: 'Clímax/Momento chave', text: 'Pico emocional', audio: 'High point' },
            { range: '7-10s', visual: 'Loop/CTA rápido', text: 'Fechamento', audio: 'Fade/Loop' }
        ],
        'short': [
            { range: '0-2s', visual: 'Pattern Interrupt visual', text: 'Gancho forte', audio: 'Início impactante' },
            { range: '2-5s', visual: 'Desenvolvimento', text: 'Contexto/Setup', audio: 'Batida entra' },
            { range: '5-10s', visual: 'Clímax/Ação principal', text: 'Momento chave', audio: 'High point' },
            { range: '10-15s', visual: 'Loop/Fechamento', text: 'CTA', audio: 'Fade/Loop' }
        ],
        'medium': [
            { range: '0-2s', visual: 'Pattern Interrupt visual', text: 'Gancho forte', audio: 'Início impactante' },
            { range: '2-7s', visual: 'Contexto/Setup', text: 'Apresentação', audio: 'Batida entra' },
            { range: '7-15s', visual: 'Desenvolvimento/Ação', text: 'Jornada', audio: 'Build up' },
            { range: '15-20s', visual: 'Clímax/Momento decisivo', text: 'Pico emocional', audio: 'High point' },
            { range: '20-25s', visual: 'Resolução/CTA', text: 'Fechamento', audio: 'Fade/Loop' }
        ],
        'long': [
            { range: '0-2s', visual: 'Pattern Interrupt visual', text: 'Gancho forte', audio: 'Início impactante' },
            { range: '2-7s', visual: 'Contexto/Setup completo', text: 'Apresentação', audio: 'Intro musical' },
            { range: '7-15s', visual: 'Desenvolvimento 1', text: 'Jornada parte 1', audio: 'Build up' },
            { range: '15-22s', visual: 'Desenvolvimento 2/Clímax', text: 'Transformação', audio: 'High point' },
            { range: '22-27s', visual: 'Resolução/Reflexão', text: 'Mensagem final', audio: 'Transição' },
            { range: '27-30s', visual: 'CTA/Loop natural', text: 'Fechamento', audio: 'Fade/Loop' }
        ]
    };

    return timelines[duration] || timelines['short'];
}

function generatePrompt() {
    const title = document.getElementById('video-title').value || "[TÍTULO DO VÍDEO]";
    const concept = document.getElementById('concept').value || "[CONCEITO]";
    const hook = document.getElementById('hook-type').value || "[GANCHO NÃO ESPECIFICADO]";
    const style = document.getElementById('visual-style').value || "[ESTILO VISUAL NÃO ESPECIFICADO]";
    const musicVibe = document.getElementById('music-vibe').value || "[VIBE DA MÚSICA NÃO ESPECIFICADA]";
    const voiceover = document.getElementById('voiceover').value || "[NÃO ESPECIFICADO]";
    const cta = document.getElementById('cta').value || "[NÃO ESPECIFICADO]";
    const wordPreset = dom.wordPreset.value !== 'Custom' ? dom.wordPreset.value : `${dom.wordLimit.value} palavras`;
    const duration = document.getElementById('video-duration').value || 'short';
    const hackerHook = document.getElementById('hacker-hook').value || '';

    // Get dynamic timeline based on duration
    const timeline = getTimelineByDuration(duration);

    // Generate timeline rows for the table
    const timelineRows = timeline.map(t =>
        `| **${t.range}** | [${t.visual}] | [${t.text}] | [${t.audio}] |`
    ).join('\n');

    // Duration labels for context
    const durationLabels = {
        'ultra': '7-10 segundos (Ultra-curto)',
        'short': '10-15 segundos (Curto - Padrão Viral)',
        'medium': '15-25 segundos (Médio - Storytelling)',
        'long': '25-30 segundos (Longo - Narrativa Rica)'
    };

    // Build hacker hook intensification block if selected
    let hackerHookBlock = '';
    if (hackerHook) {
        const hackerHookDescriptions = {
            'Polêmica': {
                desc: 'Ganchos que POLARIZAM opiniões e geram debate intenso nos comentários. Afirmações fortes que fazem as pessoas quererem concordar ou discordar publicamente.',
                subtypes: 'Opinião Impopular, Desmistificação, Provocação Direta, Verdade Inconveniente, Contra a Maioria',
                examples: '"Ninguém que treina de manhã realmente gosta de acordar cedo.", "Disciplina é uma mentira que te venderam.", "99% de quem fala de mindset nunca conquistou nada."'
            },
            'Crença Forte': {
                desc: 'Ganchos que reafirmam ou DESAFIAM crenças profundas do público. Tocam em valores pessoais, identidade e princípios que as pessoas defendem com paixão.',
                subtypes: 'Reafirmação de Identidade, Desafio de Crença, Manifesto Pessoal, Princípio Inegociável, Declaração de Valores',
                examples: '"Se você não treina quando não quer, você não é disciplinado.", "A dor do treino é o preço do respeito próprio.", "Quem reclama do processo não merece o resultado."'
            },
            'Afirmação Contra Intuitiva': {
                desc: 'Ganchos que apresentam o OPOSTO do que o público espera. Surpreendem com uma lógica invertida que faz a pessoa parar para pensar e querer entender.',
                subtypes: 'Paradoxo, Inversão Lógica, Revelação Surpreendente, Mito Quebrado, Perspectiva Inversa',
                examples: '"Treinar menos me fez evoluir mais.", "O dia que parei de buscar motivação, tudo mudou.", "Quanto mais eu descanso, mais forte eu fico."'
            },
            'Recompensa Rápida': {
                desc: 'Ganchos que prometem um RESULTADO IMEDIATO ou uma transformação rápida. O espectador sente que vai ganhar algo valioso em poucos segundos.',
                subtypes: 'Hack Rápido, Resultado em X Dias, Segredo Revelado, Atalho Prático, Mudança Instantânea',
                examples: '"Em 7 dias sua rotina vai mudar completamente.", "Faça isso HOJE e veja a diferença amanhã.", "O exercício que destrói preguiça em 30 segundos."'
            },
            'Curiosidade': {
                desc: 'Ganchos que criam uma LACUNA DE CONHECIMENTO irresistível. A pessoa PRECISA continuar assistindo para preencher essa lacuna mental.',
                subtypes: 'Segredo Revelado, Lacuna de Conhecimento, Teaser Misterioso, Pergunta Sem Resposta, Revelação Gradual',
                examples: '"O que acontece quando você treina 5h da manhã por 30 dias.", "Ninguém fala sobre esse detalhe do Jiu-Jitsu.", "Descobri algo que muda tudo sobre rotina."'
            }
        };

        const hookInfo = hackerHookDescriptions[hackerHook];
        if (hookInfo) {
            hackerHookBlock = `\n\n---\n\n## 🔓 GANCHO HACKER ATIVADO: ${hackerHook.toUpperCase()}\n\n**INSTRUÇÃO ESPECIAL — INTENSIFICAR GANCHO**\n\n> O criador ativou o modo "Gancho Hacker". Isso significa que você deve ir ALÉM do gancho padrão e buscar as MELHORES e mais PODEROSAS variações do tipo "${hackerHook}".\n\n**O que é:** ${hookInfo.desc}\n\n**Sub-tipos para explorar nas 3 variações:** ${hookInfo.subtypes}\n\n**Exemplos de referência:** ${hookInfo.examples}\n\n### REGRAS DO GANCHO HACKER:\n1. **CADA variação (A, B, C) deve usar um sub-tipo DIFERENTE** do gancho "${hackerHook}"\n2. **O gancho deve aparecer nos primeiros 0-2 segundos** do vídeo, tanto em texto na tela quanto no conceito visual\n3. **Gere 3 opções de frase de gancho** para cada variação (o criador escolherá a melhor)\n4. **Considere o contexto do vídeo** (título: "${title}", conceito: "${concept}") para criar ganchos que sejam RELEVANTES e não genéricos\n5. **Avalie cada gancho de 1-10** em: Poder de Parada (scroll-stopping), Potencial de Engajamento (comentários), e Viralidade\n6. **Use linguagem direta, curta e impactante** — sem enrolação\n\n**FORMATO EXTRA para cada variação:**\n> 🔓 GANCHO HACKER — [Sub-tipo usado]\n> - Opção 1: "[frase]" → Poder: X/10 | Engajamento: X/10 | Viral: X/10\n> - Opção 2: "[frase]" → Poder: X/10 | Engajamento: X/10 | Viral: X/10\n> - Opção 3: "[frase]" → Poder: X/10 | Engajamento: X/10 | Viral: X/10\n> - ✅ Recomendação: [Opção X — justificativa rápida]`;
        }
    }

    const basePrompt = `# CONTEXTO: LIFESTYLE VIRAL AGENT - STRICT OUTPUT MODE

ATUE COMO: O "Lifestyle Viral Agent".
MISSÃO: Gerar 3 variações de roteiro prontas para execução (filmáveis) para um criador de conteúdo/atleta.

## 📊 DADOS DO PROJETO
- **Título:** ${title}
- **Conceito:** ${concept}
- **Gancho:** ${hook}
- **Estilo Visual:** ${style}
- **Vibe Musical:** ${musicVibe}
- **Duração Alvo:** ${durationLabels[duration]}
- **Base Voiceover:** ${voiceover}
- **CTA:** ${cta}
- **Limite de Texto:** ${wordPreset} por tela${hackerHook ? `\n- **🔓 Gancho Hacker:** ${hackerHook}` : ''}

---

## ⚡ REGRAS DE OURO (NÃO QUEBRE)
1. **Ritmo Musical:** Cortes na batida. Indique o momento do áudio.
2. **Retenção:** Pattern Interrupt obrigatório nos 0-2s.
3. **Texto Curto:** Respeite RIGOROSAMENTE o limite de palavras escolhido.
4. **Loop Natural:** O final deve conectar visualmente com o início.
5. **Duração:** Respeite a duração alvo de ${durationLabels[duration]}.

---

## 🎨 LIBERDADE CRIATIVA

Você tem TOTAL LIBERDADE para ajustar as seguintes configurações em CADA VARIAÇÃO, SE isso aumentar o potencial viral:

1. **Duração do Vídeo**: 
   - Configuração base do usuário: ${durationLabels[duration]}
   - Você PODE sugerir durações diferentes para cada variação (7-30s)
   - Exemplo: Variação A = 8s (ultra-curto), Variação B = 15s (viral), Variação C = 25s (storytelling)

2. **Quantidade de Texto por Tela**:
   - Configuração base do usuário: ${wordPreset}
   - Ajuste conforme a duração e ritmo de cada variação
   - Exemplo: Variação A = 3-4 palavras, Variação B = 5-6 palavras, Variação C = 7-9 palavras

3. **Estrutura de Timeline**:
   - Adapte o número de beats conforme necessário
   - Priorize sempre: Pattern Interrupt (0-2s) + Retenção máxima
   - Vídeos curtos = menos beats, vídeos longos = mais beats

**IMPORTANTE**: 
- Sempre justifique suas escolhas na "Ficha Técnica" de cada variação
- Explique POR QUE você ajustou duração/texto (ex: "Reduzido para 8s para maximizar retenção")
- Cada variação deve ter um ARQUÉTIPO diferente (ex: Hook Explosivo, Storytelling, Narrativa Profunda)
${hackerHookBlock}

---

## 🎯 FILTRO DE MENSAGEM (3 TESTES OBRIGATÓRIOS)

Antes de entregar CADA variação, avalie a mensagem principal (gancho + texto na tela) contra estes 3 testes. Se QUALQUER teste falhar, reescreva até passar.

### TESTE 1: 🧠 CAIXA DE CURIOSIDADE
**Pergunta:** A pessoa fica querendo saber o que vem depois?
- ❌ Exemplo FRACO: "3 dicas de produtividade" → Não abre curiosidade, é genérico
- ✅ Exemplo FORTE: "Porque acordar cedo está te atrasando" → Abre uma caixa de curiosidade na mente
- **Regra:** A frase deve criar uma LACUNA mental que SÓ se resolve assistindo o vídeo

### TESTE 2: 💔 CONEXÃO PELA DOR
**Pergunta:** Estou falando sobre algo que INCOMODA as pessoas?
- ❌ Exemplo FRACO: "Treino completo de pernas" → Fala sobre técnica, não conecta emocionalmente
- ✅ Exemplo FORTE: "Por que você treina todos os dias e as suas pernas não crescem" → Fala sobre FRUSTRAÇÃO
- **Regra:** Pessoas se conectam MUITO mais rápido quando se VEEM naquele conteúdo. Toque na dor, frustração ou desejo reprimido

### TESTE 3: 💬 SIMPLICIDADE BRUTAL
**Pergunta:** O que estou falando é simples de entender? Ou estou complicando demais?
- ❌ Exemplo FRACO: "Otimização tributária através da PJotização" → Linguagem técnica, repele o público
- ✅ Exemplo FORTE: "Como pagar menos impostos virando PJ" → Qualquer pessoa entende em 1 segundo
- **Regra:** Se uma pessoa de 12 anos não entender a frase em 2 segundos, REESCREVA

---

## 📝 FORMATO DE SAÍDA (GERE 3 VARIAÇÕES: A, B, C)

Para CADA variação, use EXATAMENTE esta estrutura:

### 🎬 VARIAÇÃO [A/B/C] - [NOME DO ARQUÉTIPO]
*(Ex: A - Curiosidade, B - Quebra de Padrão, C - Identificação)*

**1. FICHA TÉCNICA**
- **Potencial Viral:** [Nota 1-10]
- **Por que funciona:** [Explicação de 1 frase]

**2. ROTEIRO BEAT-BY-BEAT**
| Timing | Visual (Seja específico) | Texto na Tela | Áudio/Vibe |
|--------|--------------------------|---------------|------------|
${timelineRows}

**3. CHECKLIST DE TAKES (Filmagem)**
- [ ] Take 1: [Descrição detalhada: ângulo, luz, movimento]
- [ ] Take 2: [...]
- [ ] Take 3: [...]

**4. LEGENDAS \& TAGS**
- **Legenda:**
  - Gancho: [Frase inicial]
  - Corpo: [História/Reflexão expandida]
  - CTA: [Chamada final]
- **Hashtags (Camadas):**
  - #Nicho: #jiujitsu #bjjlifestyle #grapplers
  - #Mindset: #disciplina #focoforçafé #mentalidade
  - #Viral: #lifestyle #motivation #1percentbetter
  - #Local: #brasil #sp (se aplicar)

**5. 🎯 FILTRO DE MENSAGEM**
| Teste | Nota (1-10) | Análise |
|-------|-------------|---------|
| 🧠 Caixa de Curiosidade | X/10 | [A pessoa PRECISA ver o que vem depois? Justifique] |
| 💔 Conexão pela Dor | X/10 | [Toca em frustração/desejo real? Justifique] |
| 💬 Simplicidade Brutal | X/10 | [Entendível em 2 segundos? Justifique] |
- **Média:** X/10
- ⚠️ Se qualquer nota < 7, reescreva o gancho/texto principal AQUI com versão melhorada

---

GERE AGORA AS 3 VARIAÇÕES SEGUINDO ESTE MODELO EXATO.`;

    dom.gptPrompt.value = basePrompt.trim();
}

// --- Hacker Hook Chips ---

function initHackerHookChips() {
    const container = document.getElementById('hacker-hook-chips');
    if (!container) return;

    container.addEventListener('click', (e) => {
        const chip = e.target.closest('.hacker-chip');
        if (!chip) return;

        const hookValue = chip.dataset.hook;
        const hiddenInput = document.getElementById('hacker-hook');
        const isActive = chip.classList.contains('active');

        // Deselect all chips
        container.querySelectorAll('.hacker-chip').forEach(c => c.classList.remove('active'));

        if (isActive) {
            // Toggle off
            hiddenInput.value = '';
        } else {
            // Select this chip
            chip.classList.add('active');
            hiddenInput.value = hookValue;
        }
    });
}

function setHackerHook(value) {
    const hiddenInput = document.getElementById('hacker-hook');
    const container = document.getElementById('hacker-hook-chips');
    if (!hiddenInput || !container) return;

    hiddenInput.value = value;

    // Update chip visuals
    container.querySelectorAll('.hacker-chip').forEach(chip => {
        if (value && chip.dataset.hook === value) {
            chip.classList.add('active');
        } else {
            chip.classList.remove('active');
        }
    });
}

function copyPromptToClipboard() {
    const text = dom.gptPrompt.value;
    if (!text) return;

    navigator.clipboard.writeText(text).then(() => {
        dom.promptFeedback.style.display = 'inline';
        setTimeout(() => {
            dom.promptFeedback.style.display = 'none';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy', err);
        // Fallback
        dom.gptPrompt.select();
        document.execCommand('copy');
        dom.promptFeedback.style.display = 'inline';
    });
}

// --- Helpers ---

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const part = dateStr.split('-');
    return `${part[2]}/${part[1]}/${part[0]}`;
}

function getWeekISO() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

// --- Voice Input Functions ---

let recognition = null;
let currentVoiceTarget = null;

function initVoiceInput() {
    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        console.warn('[Voice Input] Web Speech API not supported in this browser');
        // Disable all voice buttons
        document.querySelectorAll('.voice-btn').forEach(btn => {
            btn.disabled = true;
            btn.title = 'Reconhecimento de voz não suportado neste navegador';
        });
        return;
    }

    // Initialize recognition
    recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    // Event handlers
    recognition.onstart = () => {
        console.log('[Voice Input] Recording started');
    };

    recognition.onresult = (event) => {
        if (!currentVoiceTarget) return;

        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }

        // Update the target field
        const targetElement = document.getElementById(currentVoiceTarget);
        if (targetElement) {
            if (finalTranscript) {
                // Append final transcript to existing content
                const currentValue = targetElement.value || '';
                const newValue = currentValue + (currentValue ? ' ' : '') + finalTranscript.trim();
                targetElement.value = newValue;
            }
        }
    };

    recognition.onerror = (event) => {
        console.error('[Voice Input] Error:', event.error);
        stopVoiceRecording();

        // Show user-friendly error messages
        if (event.error === 'no-speech') {
            console.log('[Voice Input] Nenhuma fala detectada');
        } else if (event.error === 'not-allowed') {
            alert('Permissão de microfone negada. Por favor, permita o acesso ao microfone nas configurações do navegador.');
        } else {
            console.log('[Voice Input] Erro no reconhecimento de voz:', event.error);
        }
    };

    recognition.onend = () => {
        console.log('[Voice Input] Recording ended');
        stopVoiceRecording();
    };

    // Attach click handlers to all voice buttons
    document.querySelectorAll('.voice-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = btn.dataset.target;
            toggleVoiceRecording(targetId, btn);
        });
    });

    console.log('[Voice Input] Initialized successfully');
}

function toggleVoiceRecording(targetId, button) {
    if (!recognition) return;

    if (currentVoiceTarget === targetId) {
        // Stop recording
        stopVoiceRecording();
    } else {
        // Start recording
        startVoiceRecording(targetId, button);
    }
}

function startVoiceRecording(targetId, button) {
    if (!recognition) return;

    // Stop any existing recording
    if (currentVoiceTarget) {
        stopVoiceRecording();
    }

    currentVoiceTarget = targetId;

    // Update button state
    button.classList.add('recording');
    button.title = 'Clique para parar';

    try {
        recognition.start();
        console.log('[Voice Input] Started recording for:', targetId);
    } catch (error) {
        console.error('[Voice Input] Failed to start:', error);
        stopVoiceRecording();
    }
}

function stopVoiceRecording() {
    if (!recognition) return;

    try {
        recognition.stop();
    } catch (error) {
        console.log('[Voice Input] Stop error (may be already stopped):', error);
    }

    // Reset button state
    if (currentVoiceTarget) {
        const button = document.querySelector(`.voice-btn[data-target="${currentVoiceTarget}"]`);
        if (button) {
            button.classList.remove('recording');
            button.title = 'Clique para gravar';
        }
    }

    currentVoiceTarget = null;
}

function adjustColor(color, amount) {

    return color; // Simplification, in real CSS gradient handles this or we utilize a lighter variant if needed
}

// Boot
document.addEventListener('DOMContentLoaded', () => {
    init();
    // Default to Grid view on load, but we need to trigger the class set
    setViewMode('grid');
});

// --- Filter Popup Logic ---
function initFilterPopup() {
    const overlay = document.getElementById('filter-popup-overlay');
    const popup = document.getElementById('filter-popup');
    const openBtn = document.getElementById('open-filters-btn');
    const closeBtn = document.getElementById('close-filters-btn');
    const applyBtn = document.getElementById('apply-filters-btn');

    if (!overlay || !popup || !openBtn) return;

    function openPopup() {
        overlay.classList.remove('hidden');
        // Trigger reflow
        void popup.offsetWidth;
        popup.style.transform = 'translateY(0)';
    }

    function closePopup() {
        popup.style.transform = 'translateY(100%)';
        setTimeout(() => {
            overlay.classList.add('hidden');
        }, 300);
    }

    openBtn.addEventListener('click', openPopup);
    if (closeBtn) closeBtn.addEventListener('click', closePopup);
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            applyFilters();
            closePopup();
        });
    }

    // Close on click outside
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closePopup();
    });
}

function updateActiveFiltersCount() {
    let count = 0;
    if (filters.search) count++;
    if (filters.status) count++;
    if (filters.hookType) count++;
    if (filters.visualStyle) count++;
    if (filters.musicVibe) count++;
    if (filters.thisWeekOnly) count++;

    const badge = document.getElementById('active-filters-count');
    if (badge) {
        if (count > 0) {
            badge.textContent = count;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }
}
