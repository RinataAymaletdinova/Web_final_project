class MapInteractionManager {
    constructor() {
        this.pathButton = document.getElementById('pathButton');
        this.legendButton = document.getElementById('legendButton');
        this.closeEventModal = document.getElementById('closeEventModal');
        this.eventModal = document.getElementById('eventModal');
        
        this.characterCheckboxes = document.querySelectorAll('input[name="character"]');
        this.eventMarkers = document.querySelectorAll('.event-marker');
        
        this.pathButtonWrapper = this.pathButton.closest('.bottom-button-wrapper');
        this.legendButtonWrapper = this.legendButton.closest('.bottom-button-wrapper');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadCharacterSelections();
        this.updateCheckboxColors();
    }

    setupEventListeners() {
        // Кнопка "Путь героев"
        this.pathButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleBottomModal(this.pathButtonWrapper, this.legendButtonWrapper);
        });

        // Кнопка "Обозначения"
        this.legendButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleBottomModal(this.legendButtonWrapper, this.pathButtonWrapper);
        });

        // Закрытие окна события
        this.closeEventModal.addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeEventModalFunc();
        });

        // Клик вне окон закрывает их
        document.addEventListener('click', (e) => {
            const clickedOnButton = e.target.closest('.bottom-button');
            const clickedOnModal = e.target.closest('.bottom-modal-slide');
            const clickedOnEventModal = e.target.closest('.event-modal');
            
            if (!clickedOnButton && !clickedOnModal && !clickedOnEventModal) {
                this.closeAllBottomModals();
            }
        });

        // Выбор персонажей
        this.characterCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const character = e.target.value;
                const isChecked = e.target.checked;
                
                if (window.mapManager) {
                    if (isChecked) {
                        mapManager.showCharacterPath(character);
                    } else {
                        mapManager.hideCharacterPath(character);
                    }
                }
                
                this.saveCharacterSelections();
            });
        });

        // События на карте
        this.eventMarkers.forEach(marker => {
            marker.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openEventModal(marker.dataset.eventId);
            });
        });

        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllBottomModals();
                this.closeEventModalFunc();
            }
        });
    }

    toggleBottomModal(openWrapper, closeWrapper) {
        // Если уже открыто - закрываем
        if (openWrapper.classList.contains('active')) {
            this.closeBottomModal(openWrapper);
        } else {
            // Закрываем другое окно
            this.closeBottomModal(closeWrapper);
            // Открываем выбранное
            openWrapper.classList.add('active');
            openWrapper.querySelector('.bottom-button').classList.add('active');
            this.updateButtonIcons();
        }
    }

    closeBottomModal(wrapper) {
        if (wrapper) {
            wrapper.classList.remove('active');
            wrapper.querySelector('.bottom-button').classList.remove('active');
            this.updateButtonIcons();
        }
    }

    closeAllBottomModals() {
        this.closeBottomModal(this.pathButtonWrapper);
        this.closeBottomModal(this.legendButtonWrapper);
    }

    updateButtonIcons() {
        // Обновляем иконки кнопок
        const buttons = document.querySelectorAll('.bottom-button');
        
        buttons.forEach(button => {
            const icon = button.querySelector('.button-icon');
            if (!icon) return;
            
            if (button.classList.contains('active')) {
                // При открытии - меняем на стрелку
                icon.src = '../assets/images/ui/arrow.png';
                icon.alt = 'Закрыть';
            } else {
                // При закрытии - возвращаем оригинальную иконку
                if (button.id === 'pathButton') {
                    icon.src = '../assets/images/map/legend/path.png';
                    icon.alt = 'Путь';
                } else if (button.id === 'legendButton') {
                    icon.src = '../assets/images/map/legend/icons.png';
                    icon.alt = 'Легенда';
                }
                icon.style.transform = 'rotate(0deg)';
            }
        });
    }

    openEventModal(eventId) {
        this.closeAllBottomModals();
        this.eventModal.classList.add('active');
        console.log('Открыто событие:', eventId);
    }

    closeEventModalFunc() {
        this.eventModal.classList.remove('active');
    }

    saveCharacterSelections() {
        const selections = {};
        this.characterCheckboxes.forEach(checkbox => {
            selections[checkbox.value] = checkbox.checked;
        });
        
        try {
            localStorage.setItem('character_paths_selections', JSON.stringify(selections));
        } catch (e) {
            console.error('Ошибка сохранения:', e);
        }
    }

    loadCharacterSelections() {
        try {
            const saved = localStorage.getItem('character_paths_selections');
            if (saved) {
                const selections = JSON.parse(saved);
                
                this.characterCheckboxes.forEach(checkbox => {
                    if (selections[checkbox.value]) {
                        checkbox.checked = true;
                        if (window.mapManager) {
                            window.mapManager.showCharacterPath(checkbox.value);
                        }
                    }
                });
            }
        } catch (e) {
            console.error('Ошибка загрузки:', e);
        }
    }

    updateCheckboxColors() {
        this.characterCheckboxes.forEach(checkbox => {
            const label = checkbox.closest('.path-checkbox');
            if (label) {
                label.setAttribute('data-character', checkbox.value);
            }
        });
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    window.mapInteractionManager = new MapInteractionManager();
});