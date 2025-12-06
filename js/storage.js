const StorageManager = {
    // Ключи для Local Storage
    KEYS: {
        TEXT_SIZE: 'eye_of_world_text_size',
        SOUND_ENABLED: 'eye_of_world_sound_enabled'
    },

    // Значения по умолчанию
    DEFAULTS: {
        TEXT_SIZE: 2, // 1, 2 или 3
        SOUND_ENABLED: true
    },

    // Сохранить настройку
    save(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Ошибка сохранения в Local Storage:', error);
            return false;
        }
    },

    // Загрузить настройку
    load(key) {
        try {
            const item = localStorage.getItem(key);
            return item !== null ? JSON.parse(item) : this.DEFAULTS[key];
        } catch (error) {
            console.error('Ошибка чтения из Local Storage:', error);
            return this.DEFAULTS[key];
        }
    },

    // Получить все настройки
    getAllSettings() {
        return {
            textSize: this.load(this.KEYS.TEXT_SIZE),
            soundEnabled: this.load(this.KEYS.SOUND_ENABLED)
        };
    },

    // Применить сохраненные настройки
    applySavedSettings() {
        const settings = this.getAllSettings();
        
        // Применяем размер текста
        this.applyTextSize(settings.textSize);
        
        // Применяем настройку звука
        this.applySoundSetting(settings.soundEnabled);
        
        return settings;
    },

    // Применить размер текста (обновленная версия)
    applyTextSize(size) {
        document.documentElement.setAttribute('data-text-size', size);
        
        // Обновляем пример текста в меню
        const previewTitle = document.querySelector('.preview-title');
        const previewText = document.querySelector('.preview-text');
        
        if (previewTitle && previewText) {
            const sizes = {
                1: { title: '1.5rem', text: '1.25rem' },   // 24px, 20px
                2: { title: '2.5rem', text: '1.25rem' },   // 40px, 20px
                3: { title: '2.75rem', text: '1.875rem' }  // 44px, 30px
            };
            
            previewTitle.style.fontSize = sizes[size].title;
            previewText.style.fontSize = sizes[size].text;
        }
        
        // Триггерим кастомное событие для обновления на странице главы
        const event = new CustomEvent('textSizeChanged', { 
            detail: { size: size }
        });
        document.dispatchEvent(event);
    },

    // Применить настройку звука
    applySoundSetting(enabled) {
        const toggle = document.getElementById('soundToggle');
        const label = document.getElementById('soundLabel');
        
        if (toggle) {
            toggle.checked = enabled;
        }
        
        if (label) {
            label.textContent = enabled ? 'Включен' : 'Выключен';
        }
    }
};