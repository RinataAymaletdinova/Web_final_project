class MenuManager {
    constructor() {
        this.menuToggle = document.getElementById('menuToggle');
        this.menuContainer = document.querySelector('.menu-container');
        this.menuSlide = document.getElementById('menuSlide');
        this.settingsButton = document.getElementById('settingsButton');
        this.settingsPanel = document.getElementById('settingsPanel');
        this.fontSliderThumb = document.getElementById('fontSliderThumb');
        this.sliderTrack = document.querySelector('.slider-track');
        this.soundToggle = document.getElementById('soundToggle');
        this.soundLabel = document.getElementById('soundLabel');
        
        this.isDragging = false;
        this.currentTextSize = 2;
        
        this.init();
    }

    init() {
        // Загружаем сохраненные настройки
        const settings = StorageManager.getAllSettings();
        this.currentTextSize = settings.textSize;
        
        // Инициализируем UI
        this.updateSliderPosition(this.currentTextSize);
        StorageManager.applySoundSetting(settings.soundEnabled);
        
        // Навешиваем обработчики
        this.setupEventListeners();
        
        // Инициализируем layout меню
        this.initMenuLayout();
    }

    initMenuLayout() {
        // Создаем контейнер для кнопки "Скачать артбук" в выдвижном меню
        const menuNav = document.querySelector('.menu-nav');
        const downloadButton = menuNav.querySelector('.menu-nav-item:last-child');
        
        if (downloadButton) {
            // Создаем футер для кнопки
            const footer = document.createElement('div');
            footer.className = 'settings-footer';
            footer.style.display = 'none'; // По умолчанию скрыт
            
            // Клонируем кнопку для футера (чтобы не нарушать структуру DOM)
            const downloadClone = downloadButton.cloneNode(true);
            footer.appendChild(downloadClone);
            
            // Добавляем футер после панели настроек
            this.settingsPanel.parentNode.insertBefore(footer, this.settingsPanel.nextSibling);
            
            // Сохраняем ссылки
            this.downloadFooter = footer;
            this.originalDownloadButton = downloadButton;
            this.footerDownloadButton = downloadClone;
            
            // Назначаем обработчик для клонированной кнопки
            this.footerDownloadButton.addEventListener('click', (e) => {
                e.preventDefault();
                // Логика для скачивания артбука
                console.log('Скачать артбук');
                // Здесь можно добавить реальную логику скачивания
            });
        }
    }

    setupEventListeners() {
        // Открытие/закрытие меню
        this.menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        // Кнопка настроек
        this.settingsButton.addEventListener('click', () => {
            this.toggleSettings();
        });

        // Клик вне меню
        document.addEventListener('click', (e) => {
            if (this.menuContainer.classList.contains('menu-open') &&
                !this.menuSlide.contains(e.target) &&
                !this.menuToggle.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Слайдер размера текста
        this.setupSlider();
        
        // Переключатель звука
        this.setupSoundToggle();
        
        // Обработка нажатия Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.menuContainer.classList.contains('menu-open')) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        const isOpening = !this.menuContainer.classList.contains('menu-open');
        
        this.menuContainer.classList.toggle('menu-open');
        
        // Если закрываем меню, закрываем и настройки
        if (!isOpening) {
            this.menuContainer.classList.remove('settings-open');
            this.hideDownloadFooter();
        } else {
            // При открытии меню показываем оригинальную кнопку
            this.showOriginalDownloadButton();
        }
        
        // Блокируем прокрутку страницы при открытом меню
        document.body.style.overflow = isOpening ? 'hidden' : '';
        
        // Обновляем aria-атрибуты для доступности
        this.updateAriaAttributes(isOpening);
    }

    closeMenu() {
        this.menuContainer.classList.remove('menu-open', 'settings-open');
        document.body.style.overflow = '';
        this.hideDownloadFooter();
        this.showOriginalDownloadButton();
        this.updateAriaAttributes(false);
    }

    toggleSettings() {
        const isOpening = !this.menuContainer.classList.contains('settings-open');
        this.menuContainer.classList.toggle('settings-open');
        
        if (isOpening) {
            // При открытии настроек показываем кнопку в футере
            this.showDownloadFooter();
            this.hideOriginalDownloadButton();
        } else {
            // При закрытии настроек возвращаем кнопку в меню
            this.hideDownloadFooter();
            this.showOriginalDownloadButton();
        }
    }

    showDownloadFooter() {
        if (this.downloadFooter) {
            this.downloadFooter.style.display = 'block';
        }
    }

    hideDownloadFooter() {
        if (this.downloadFooter) {
            this.downloadFooter.style.display = 'none';
        }
    }

    showOriginalDownloadButton() {
        if (this.originalDownloadButton) {
            this.originalDownloadButton.style.display = 'block';
        }
    }

    hideOriginalDownloadButton() {
        if (this.originalDownloadButton) {
            this.originalDownloadButton.style.display = 'none';
        }
    }

    setupSlider() {
        // Клик по треку
        this.sliderTrack.addEventListener('click', (e) => {
            const rect = this.sliderTrack.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const width = rect.width;
            
            // Определяем ближайшую позицию (1, 2 или 3)
            const position = Math.round((x / width) * 2) + 1;
            this.setFontSize(position);
        });

        // Перетаскивание ползунка
        this.fontSliderThumb.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.isDragging = true;
            document.addEventListener('mousemove', this.handleDrag.bind(this));
            document.addEventListener('mouseup', this.handleDragEnd.bind(this));
        });

        // Для тач-устройств
        this.fontSliderThumb.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.isDragging = true;
            document.addEventListener('touchmove', this.handleTouchDrag.bind(this));
            document.addEventListener('touchend', this.handleTouchEnd.bind(this));
        });
    }

    handleDrag(e) {
        if (!this.isDragging) return;
        
        const rect = this.sliderTrack.getBoundingClientRect();
        let x = e.clientX - rect.left;
        x = Math.max(0, Math.min(x, rect.width));
        
        const position = Math.round((x / rect.width) * 2) + 1;
        this.setFontSize(position);
    }

    handleDragEnd() {
        this.isDragging = false;
        document.removeEventListener('mousemove', this.handleDrag.bind(this));
        document.removeEventListener('mouseup', this.handleDragEnd.bind(this));
    }

    handleTouchDrag(e) {
        if (!this.isDragging || !e.touches[0]) return;
        
        const rect = this.sliderTrack.getBoundingClientRect();
        let x = e.touches[0].clientX - rect.left;
        x = Math.max(0, Math.min(x, rect.width));
        
        const position = Math.round((x / rect.width) * 2) + 1;
        this.setFontSize(position);
    }

    handleTouchEnd() {
        this.isDragging = false;
        document.removeEventListener('touchmove', this.handleTouchDrag.bind(this));
        document.removeEventListener('touchend', this.handleTouchEnd.bind(this));
    }

    setFontSize(size) {
        this.currentTextSize = size;
        this.updateSliderPosition(size);
        StorageManager.save(StorageManager.KEYS.TEXT_SIZE, size);
        StorageManager.applyTextSize(size);
    }

    updateSliderPosition(size) {
        const positions = { 1: '0%', 2: '50%', 3: '100%' };
        this.fontSliderThumb.style.left = positions[size];
    }

    setupSoundToggle() {
        this.soundToggle.addEventListener('change', (e) => {
            const isEnabled = e.target.checked;
            StorageManager.save(StorageManager.KEYS.SOUND_ENABLED, isEnabled);
            StorageManager.applySoundSetting(isEnabled);
        });
    }

    updateAriaAttributes(isOpen) {
        const menuToggle = this.menuToggle;
        const menuSlide = this.menuSlide;
        
        if (isOpen) {
            menuToggle.setAttribute('aria-expanded', 'true');
            menuToggle.setAttribute('aria-label', 'Закрыть меню');
            menuSlide.setAttribute('aria-hidden', 'false');
        } else {
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Открыть меню');
            menuSlide.setAttribute('aria-hidden', 'true');
        }
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    window.menuManager = new MenuManager();
});