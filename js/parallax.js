class ParallaxEffect {
    constructor() {
        this.layers = document.querySelectorAll('.parallax-layer');
        this.mouseX = 0;
        this.mouseY = 0;
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        
        this.init();
    }

    init() {
        // Инициализируем позиции
        this.updateLayerPositions();
        
        // Навешиваем обработчики
        window.addEventListener('mousemove', this.handleMouseMove.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Запускаем анимацию
        this.animate();
    }

    handleMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    }

    handleResize() {
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
    }

    updateLayerPositions() {
        // Рассчитываем смещение от центра
        const centerX = this.windowWidth / 2;
        const centerY = this.windowHeight / 2;
        
        const moveX = (this.mouseX - centerX) / centerX;
        const moveY = (this.mouseY - centerY) / centerY;
        
        // Применяем параллакс с разной скоростью для слоев
        this.layers.forEach((layer, index) => {
            const speed = (index + 1) * 0.1; // 0.02, 0.04, 0.06
            const translateX = moveX * speed * 120;
            const translateY = moveY * speed * 120;
            
            layer.style.transform = `translate(${translateX}px, ${translateY}px)`;
        });
    }

    animate() {
        const animateFrame = () => {
            this.updateLayerPositions();
            requestAnimationFrame(animateFrame);
        };
        
        animateFrame();
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    window.parallax = new ParallaxEffect();
});