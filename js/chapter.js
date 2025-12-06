class ChapterManager {
    constructor() {
        this.backToTopButton = document.getElementById('backToTop');
        this.currentTextSize = 2;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadTextSettings();
        this.applyTextSettings();
        this.setupScrollAnimation();
    }

    setupEventListeners() {
        // Кнопка "Наверх"
        if (this.backToTopButton) {
            this.backToTopButton.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        // Показывать/скрывать кнопку "Наверх" при прокрутке
        window.addEventListener('scroll', this.toggleBackToTopButton.bind(this));
        
        // Слушаем изменения настроек текста
        this.setupTextSettingsListener();
    }

    setupTextSettingsListener() {
        // Слушаем изменения в атрибуте data-text-size
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && 
                    mutation.attributeName === 'data-text-size') {
                    this.loadTextSettings();
                    this.applyTextSettings();
                }
            });
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-text-size']
        });
    }

    setupScrollAnimation() {
        // Плавное появление элементов при прокрутке
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);
        
        // Наблюдаем за абзацами и иллюстрациями
        document.querySelectorAll('.text-content p, .illustration-block').forEach(el => {
            observer.observe(el);
        });
    }

    loadTextSettings() {
        // Загружаем настройки из атрибута или Local Storage
        const sizeAttr = document.documentElement.getAttribute('data-text-size');
        if (sizeAttr) {
            this.currentTextSize = parseInt(sizeAttr);
        } else {
            const settings = StorageManager.getAllSettings();
            this.currentTextSize = settings.textSize;
        }
    }

    applyTextSettings() {
        // Размеры для разных уровней
        const sizes = {
            1: { 
                title: '3rem',           // 48px - маленький
                subtitle: '1.5rem',      // 24px
                text: '1.125rem',        // 18px
                nav: '1.25rem'           // 20px
            },
            2: { 
                title: '4rem',           // 64px - стандартный
                subtitle: '2rem',        // 32px
                text: '1.25rem',         // 20px
                nav: '1.5rem'            // 24px
            },
            3: { 
                title: '5rem',           // 80px - большой
                subtitle: '2.5rem',      // 40px
                text: '1.5rem',          // 24px
                nav: '1.75rem'           // 28px
            }
        };
        
        const currentSize = sizes[this.currentTextSize] || sizes[2];
        
        // Устанавливаем CSS переменные
        document.documentElement.style.setProperty('--chapter-title-size', currentSize.title);
        document.documentElement.style.setProperty('--chapter-subtitle-size', currentSize.subtitle);
        document.documentElement.style.setProperty('--chapter-text-size', currentSize.text);
        document.documentElement.style.setProperty('--nav-button-size', currentSize.nav);
    }

    toggleBackToTopButton() {
        if (this.backToTopButton) {
            if (window.scrollY > 500) {
                this.backToTopButton.style.opacity = '1';
                this.backToTopButton.style.visibility = 'visible';
                this.backToTopButton.style.transform = 'translateY(0)';
            } else {
                this.backToTopButton.style.opacity = '0';
                this.backToTopButton.style.visibility = 'hidden';
                this.backToTopButton.style.transform = 'translateY(20px)';
            }
        }
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    window.chapterManager = new ChapterManager();
});