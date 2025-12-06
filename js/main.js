// Инициализация всего приложения
document.addEventListener('DOMContentLoaded', () => {
    console.log('Приложение "Око Мира" загружено');
    
    // Применяем сохраненные настройки при загрузке
    StorageManager.applySavedSettings();
    
    // Инициализация меню (уже в своем файле)
    // Инициализация параллакса (уже в своем файле)
    
    // Дополнительные обработчики
    const startButton = document.getElementById('startButton');
    if (startButton) {
        startButton.addEventListener('click', (e) => {
            // Можно добавить анимацию перехода
            e.target.classList.add('clicked');
            setTimeout(() => {
                e.target.classList.remove('clicked');
            }, 300);
        });
    }
    
    // Предзагрузка изображений для меню
    this.preloadMenuImages();
});

// Предзагрузка изображений
function preloadMenuImages() {
    const images = [
        './assets/images/ui/burger.png',
        './assets/images/ui/close.png'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Вспомогательная функция для определения мобильного устройства
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}