class MapManager {
    constructor() {
        this.mapContainer = document.getElementById('mapContainer');
        this.mapImage = document.getElementById('mapImage');
        this.mapMarkers = document.getElementById('mapMarkers');
        this.pathsSvg = document.getElementById('pathsSvg');
        
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.translateX = 0;
        this.translateY = 0;
        this.scale = 1;
        
        // Ограничения масштабирования
        this.minScale = 1;
        this.maxScale = 2.0;
        
        // Ограничения перемещения
        this.maxTranslate = 0.2;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.centerMap();
        this.drawCharacterPaths();
    }

    setupEventListeners() {
        // Перемещение карты мышью
        this.mapContainer.addEventListener('mousedown', this.startDrag.bind(this));
        document.addEventListener('mousemove', this.drag.bind(this));
        document.addEventListener('mouseup', this.endDrag.bind(this));
        document.addEventListener('mouseleave', this.endDrag.bind(this));
        
        // Для тач-устройств
        this.mapContainer.addEventListener('touchstart', this.startTouchDrag.bind(this));
        document.addEventListener('touchmove', this.touchDrag.bind(this));
        document.addEventListener('touchend', this.endDrag.bind(this));
        
        // Масштабирование колесиком мыши
        this.mapContainer.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
        
        // Предотвращаем контекстное меню
        this.mapContainer.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    startDrag(e) {
        this.isDragging = true;
        this.mapContainer.classList.add('grabbing');
        
        const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
        
        this.startX = clientX - this.translateX;
        this.startY = clientY - this.translateY;
        
        e.preventDefault();
    }

    startTouchDrag(e) {
        if (e.touches.length === 1) {
            this.startDrag(e);
        }
    }

    drag(e) {
        if (!this.isDragging) return;
        
        const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
        
        this.translateX = clientX - this.startX;
        this.translateY = clientY - this.startY;
        
        this.applyConstraints();
        this.updateTransform();
        
        e.preventDefault();
    }

    touchDrag(e) {
        if (e.touches.length === 1) {
            this.drag(e);
        }
    }

    endDrag() {
        this.isDragging = false;
        this.mapContainer.classList.remove('grabbing');
    }

    handleWheel(e) {
        e.preventDefault();
    
        const deltaScale = e.deltaY > 0 ? -0.1 : 0.1;
        const newScale = Math.min(this.maxScale, Math.max(this.minScale, this.scale + deltaScale));
    
        if (newScale === this.scale) return;
    
        const rect = this.mapContainer.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
    
        const worldX = (mouseX - this.translateX) / this.scale;
        const worldY = (mouseY - this.translateY) / this.scale;
    
        this.scale = newScale;
    
        this.translateX = mouseX - worldX * this.scale;
        this.translateY = mouseY - worldY * this.scale;
    
        this.applyConstraints();
        this.updateTransform();
    }

    applyConstraints() {
        const containerWidth = this.mapContainer.offsetWidth;
        const containerHeight = this.mapContainer.offsetHeight;
    
        const mapWidth = this.mapImage.offsetWidth * this.scale;
        const mapHeight = this.mapImage.offsetHeight * this.scale;
    
        const maxX = Math.max(0, (mapWidth - containerWidth) / 2);
        const maxY = Math.max(0, (mapHeight - containerHeight) / 2);
    
        this.translateX = Math.min(maxX, Math.max(-maxX, this.translateX));
        this.translateY = Math.min(maxY, Math.max(-maxY, this.translateY));
    }

    updateTransform() {
        const transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
        
        this.mapImage.style.transform = transform;
        if (this.mapMarkers) this.mapMarkers.style.transform = transform;
        if (this.pathsSvg) this.pathsSvg.style.transform = transform;
    }

    centerMap() {
        this.translateX = 0;
        this.translateY = 0;
        this.scale = 1;
        this.updateTransform();
    }

    drawCharacterPaths() {
        if (!this.pathsSvg) return;
        
        // Очищаем старые пути
        this.pathsSvg.innerHTML = '';
        
        // Координаты в пикселях от размеров SVG (не проценты!)
        // Берем 10% от размера для координат
        const svgWidth = 1000;
        const svgHeight = 1000;
        
        const paths = {
            rand: [
                { x: svgWidth * 0.4, y: svgHeight * 0.4 },
                { x: svgWidth * 0.7, y: svgHeight * 0.35 },
                { x: svgWidth * 0.9, y: svgHeight * 0.4 },
                { x: svgWidth * 1.29, y: svgHeight * 0.7 }
            ],
            perrin: [
                { x: svgWidth * 0.4, y: svgHeight * 0.4 },
                { x: svgWidth * 0.7, y: svgHeight * 0.35 },
                { x: svgWidth * 1.2, y: svgHeight * 0.2 },
            ],
            mat: [
                { x: svgWidth * 0.3, y: svgHeight * 0.4 },
                { x: svgWidth * 0.35, y: svgHeight * 0.45 },
                { x: svgWidth * 0.45, y: svgHeight * 0.4 }
            ],
            'moiraine-lan': [
                { x: svgWidth * 0.25, y: svgHeight * 0.35 },
                { x: svgWidth * 0.3, y: svgHeight * 0.4 },
                { x: svgWidth * 0.4, y: svgHeight * 0.45 }
            ],
            egwene: [
                { x: svgWidth * 0.3, y: svgHeight * 0.4 },
                { x: svgWidth * 0.35, y: svgHeight * 0.45 },
                { x: svgWidth * 0.4, y: svgHeight * 0.5 }
            ],
            nynaeve: [
                { x: svgWidth * 0.3, y: svgHeight * 0.4 },
                { x: svgWidth * 0.35, y: svgHeight * 0.45 },
                { x: svgWidth * 0.4, y: svgHeight * 0.5 }
            ]
        };

        Object.keys(paths).forEach(character => {
            const points = paths[character];
            if (points.length < 2) return;

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            
            // Генерируем путь с абсолютными координатами
            let pathData = `M ${points[0].x} ${points[0].y} `;
            
            for (let i = 1; i < points.length; i++) {
                const prev = points[i - 1];
                const curr = points[i];
                
                // Плавная кривая Безье
                const cp1x = prev.x + (curr.x - prev.x) * 0.3;
                const cp1y = prev.y;
                const cp2x = prev.x + (curr.x - prev.x) * 0.7;
                const cp2y = curr.y;
                
                pathData += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y} `;
            }
            
            path.setAttribute('d', pathData);
            path.setAttribute('class', `path-line ${character}`);
            path.setAttribute('stroke-dasharray', '8,6');
            path.setAttribute('data-character', character);
            path.style.display = 'none';
            
            this.pathsSvg.appendChild(path);
        });
    }

    showCharacterPath(character) {
        const path = this.pathsSvg?.querySelector(`.path-line.${character}`);
        if (path) {
            path.style.display = 'block';
            path.style.opacity = '0';
            
            setTimeout(() => {
                path.style.opacity = '0.8';
                path.style.transition = 'opacity 0.5s ease';
                
                // Анимация пунктирной линии
                const length = path.getTotalLength();
                path.style.strokeDasharray = length;
                path.style.strokeDashoffset = length;
                
                path.animate([
                    { strokeDashoffset: length },
                    { strokeDashoffset: 0 }
                ], {
                    duration: 2000,
                    easing: 'ease-in-out',
                    fill: 'forwards'
                });
            }, 100);
        }
    }

    hideCharacterPath(character) {
        const path = this.pathsSvg?.querySelector(`.path-line.${character}`);
        if (path) {
            path.style.opacity = '0';
            setTimeout(() => {
                path.style.display = 'none';
            }, 500);
        }
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    window.mapManager = new MapManager();
});