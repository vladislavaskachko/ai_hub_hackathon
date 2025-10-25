class MoodAlchemy {
    constructor() {
        this.allTasks = JSON.parse(localStorage.getItem('moodAlchemyAllTasks')) || [];
        this.selectedMood = null;
        this.diaryNote = '';
        this.potions = JSON.parse(localStorage.getItem('moodAlchemyPotions')) || [];
        this.currentLanguage = localStorage.getItem('moodAlchemyLanguage') || 'en';
        
        this.initializeEventListeners();
        this.loadPotionCollection();
        this.updateLanguage();
    }

    initializeEventListeners() {
        // Mood selection
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectMood(e.target));
        });

        // Diary note character count
        document.getElementById('diaryNote').addEventListener('input', (e) => {
            this.diaryNote = e.target.value;
            document.getElementById('charCount').textContent = e.target.value.length;
        });

        // Brew potion
        document.getElementById('brewPotionBtn').addEventListener('click', () => this.brewPotion());
        
        // Language toggle
        document.getElementById('langToggle').addEventListener('click', () => this.toggleLanguage());
        
        // Task management
        document.getElementById('manageTasksBtn').addEventListener('click', () => this.openTaskManagement());
        document.getElementById('closeTaskModal').addEventListener('click', () => this.closeTaskManagement());
        document.getElementById('addNewTaskBtn').addEventListener('click', () => this.addNewTask());
        document.getElementById('newTaskTitle').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addNewTask();
        });
    }


    getCategoryEmoji(category) {
        const emojis = {
            work: '💼',
            home: '🏠',
            relaxation: '🧘',
            social: '👥',
            hobby: '🎨',
            sport: '⚽'
        };
        return emojis[category] || '📝';
    }

    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'ru' : 'en';
        localStorage.setItem('moodAlchemyLanguage', this.currentLanguage);
        this.updateLanguage();
    }

    updateLanguage() {
        const elements = document.querySelectorAll('[data-en], [data-ru]');
        elements.forEach(element => {
            const text = element.getAttribute(`data-${this.currentLanguage}`);
            if (text) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = text;
                } else {
                    element.textContent = text;
                }
            }
        });
        
        // Update language button
        const langBtn = document.getElementById('langToggle');
        langBtn.textContent = this.currentLanguage === 'en' ? '🌍 EN' : '🌍 RU';
        
        // Update placeholder attributes
        const inputs = document.querySelectorAll('[data-en-placeholder], [data-ru-placeholder]');
        inputs.forEach(input => {
            const placeholder = input.getAttribute(`data-${this.currentLanguage}-placeholder`);
            if (placeholder) {
                input.placeholder = placeholder;
            }
        });
    }

    selectMood(button) {
        // Remove previous selection
        document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
        
        // Add selection to clicked button
        button.classList.add('selected');
        this.selectedMood = {
            mood: button.dataset.mood,
            color: button.dataset.color
        };

        // Add magical effect
        this.createMagicalEffect();
    }

    brewPotion() {
        if (!this.selectedMood) {
            const alertText = this.currentLanguage === 'en' 
                ? 'Please select a mood!' 
                : 'Пожалуйста, выберите настроение!';
            alert(alertText);
            return;
        }

        const potion = this.generatePotion();
        this.potions.unshift(potion);
        localStorage.setItem('moodAlchemyPotions', JSON.stringify(this.potions));
        
        this.displayPotion(potion);
        this.loadPotionCollection();
        
        // Reset form
        this.resetForm();
    }

    generatePotion() {
        const date = new Date();
        const completedTasks = this.allTasks.filter(task => task.completed);
        const taskCategories = [...new Set(completedTasks.map(task => task.category))];
        
        return {
            id: Date.now(),
            date: date.toISOString(),
            mood: this.selectedMood,
            tasks: completedTasks,
            diaryNote: this.diaryNote,
            taskCategories,
            taskCount: completedTasks.length
        };
    }

    displayPotion(potion) {
        const potionDisplay = document.getElementById('potionDisplay');
        const potionLiquid = document.getElementById('potionLiquid');
        const potionEffects = document.getElementById('potionEffects');
        const potionStory = document.getElementById('potionStory');

        // Set potion color
        potionLiquid.style.backgroundColor = potion.mood.color;
        potionLiquid.style.background = `linear-gradient(45deg, ${potion.mood.color}, ${this.lightenColor(potion.mood.color, 20)})`;

        // Clear previous effects
        potionEffects.innerHTML = '';

        // Add sparkles based on task count
        for (let i = 0; i < Math.min(potion.taskCount, 10); i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.className = 'sparkle';
                sparkle.innerHTML = '✨';
                sparkle.style.left = Math.random() * 100 + '%';
                sparkle.style.top = Math.random() * 100 + '%';
                sparkle.style.animationDelay = Math.random() * 2 + 's';
                potionEffects.appendChild(sparkle);
            }, i * 100);
        }

        // Add bubbles based on task categories
        const bubbleCount = Math.min(potion.taskCategories.length * 2, 8);
        for (let i = 0; i < bubbleCount; i++) {
            setTimeout(() => {
                const bubble = document.createElement('div');
                bubble.className = 'bubble';
                bubble.style.left = Math.random() * 100 + '%';
                bubble.style.animationDelay = Math.random() * 3 + 's';
                potionEffects.appendChild(bubble);
            }, i * 200);
        }

        // Generate story
        const story = this.generateStory(potion);
        potionStory.textContent = story;

        // Show potion display
        potionDisplay.classList.remove('hidden');
        potionDisplay.scrollIntoView({ behavior: 'smooth' });

        // Add magical effect
        this.createMagicalEffect();
    }

    generateStory(potion) {
        const moodStories = {
            joy: {
                en: "A radiant potion that sparkles with pink happiness, capturing the joy of your productive day.",
                ru: "Сияющий эликсир, искрящийся розовым счастьем, отражает радость твоего дня."
            },
            calm: {
                en: "A serene lavender elixir that flows like peaceful waters, reflecting your tranquil moments.",
                ru: "Спокойный лавандовый эликсир течет, как мирная река, даря умиротворение."
            },
            energy: {
                en: "A vibrant pink potion that bubbles with life and vigor, embodying your dynamic spirit.",
                ru: "Яркий розовый эликсир пузырится энергией, отражая твой живой дух."
            },
            sadness: {
                en: "A gentle purple brew that holds your emotions tenderly, like a comforting embrace.",
                ru: "Нежный фиолетовый эликсир бережно хранит твои эмоции, словно объятия."
            },
            tiredness: {
                en: "A soft lavender mixture that whispers of rest and the gentle need for self-care.",
                ru: "Мягкий лавандовый эликсир напоминает о отдыхе и заботе о себе."
            },
            anger: {
                en: "A fiery red potion that simmers with intensity, transforming rage into powerful determination.",
                ru: "Огненный красный эликсир кипит страстью и превращает раздражение в решимость."
            },
        };

        const categoryEffects = {
            work: {
                en: "with hints of determination",
                ru: "с нотками решимости"
            },
            home: {
                en: "infused with warmth and comfort",
                ru: "наполненный теплом и уютом"
            },
            relaxation: {
                en: "carrying whispers of peace",
                ru: "несущий шепот покоя"
            },
            social: {
                en: "bubbling with connection and laughter",
                ru: "пузырящийся общением и смехом"
            },
            hobby: {
                en: "sparkling with creativity",
                ru: "искрящийся творчеством"
            },
            sport: {
                en: "pulsing with vitality",
                ru: "пульсирующий жизненной силой"
            }
        };

        const taskText = {
            en: ` With ${potion.taskCount} task${potion.taskCount > 1 ? 's' : ''} completed, your potion is truly one of a kind.`,
            ru: ` С ${potion.taskCount} выполненн${potion.taskCount === 1 ? 'ой задачей' : potion.taskCount < 5 ? 'ыми задачами' : 'ыми задачами'}, ваш эликсир поистине уникален.`
        };

        const noteText = {
            en: ` The essence of "${potion.diaryNote}" adds a personal touch to this unique creation.`,
            ru: ` Сущность "${potion.diaryNote}" добавляет личный оттенок к этому уникальному творению.`
        };

        let story = moodStories[potion.mood.mood][this.currentLanguage];
        
        if (potion.taskCategories.length > 0) {
            const effects = potion.taskCategories.map(cat => categoryEffects[cat][this.currentLanguage]).join(this.currentLanguage === 'en' ? ' and ' : ' и ');
            const enhancedText = this.currentLanguage === 'en' ? ` This magical brew is enhanced ${effects}.` : ` Этот магический напиток усилен ${effects}.`;
            story += enhancedText;
        }

        story += taskText[this.currentLanguage];

        if (potion.diaryNote) {
            story += noteText[this.currentLanguage];
        }

        return story;
    }

    lightenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    resetForm() {
        this.selectedMood = null;
        this.diaryNote = '';
        
        document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
        document.getElementById('diaryNote').value = '';
        document.getElementById('charCount').textContent = '0';
    }

    loadPotionCollection() {
        const collection = document.getElementById('potionCollection');
        collection.innerHTML = '';

        this.potions.forEach((potion, index) => {
            const item = document.createElement('div');
            item.className = 'collection-item';
            item.innerHTML = `
                <div class="collection-potion">
                    <div class="collection-neck"></div>
                    <div class="collection-body">
                        <div class="collection-liquid" style="background-color: ${potion.mood.color}"></div>
                    </div>
                    <div class="collection-base"></div>
                </div>
                <div class="collection-date">${new Date(potion.date).toLocaleDateString()}</div>
            `;
            
            item.addEventListener('click', () => this.showPotionDetails(potion));
            collection.appendChild(item);
        });
    }

    showPotionDetails(potion) {
        // Create modal-like display
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;

        const moodNames = {
            joy: { en: 'Joy', ru: 'Радость' },
            calm: { en: 'Calm', ru: 'Спокойствие' },
            energy: { en: 'Energy', ru: 'Энергия' },
            sadness: { en: 'Sadness', ru: 'Грусть' },
            tiredness: { en: 'Tiredness', ru: 'Усталость' },
            anger: { en: 'Anger', ru: 'Злость' }
        };

        const labels = {
            mood: { en: 'Mood:', ru: 'Настроение:' },
            tasks: { en: 'Tasks:', ru: 'Задачи:' },
            note: { en: 'Note:', ru: 'Заметка:' },
            potionFrom: { en: 'Potion from', ru: 'Эликсир от' }
        };

        modal.innerHTML = `
            <div style="background: white; border-radius: 20px; padding: 30px; max-width: 400px; width: 100%; position: relative;">
                <button onclick="this.parentElement.parentElement.remove()" style="position: absolute; top: 10px; right: 15px; background: none; border: none; font-size: 24px; cursor: pointer;">×</button>
                <h2 style="color: #8b4a8b; margin-bottom: 20px;">🍄 ${labels.potionFrom[this.currentLanguage]} ${new Date(potion.date).toLocaleDateString()}</h2>
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="width: 80px; height: 100px; margin: 0 auto; background: linear-gradient(45deg, #e8e8e8, #f0f0f0); border-radius: 15px 15px 25px 25px; border: 2px solid #d0d0d0; position: relative; overflow: hidden;">
                        <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 60%; background-color: ${potion.mood.color}; border-radius: 0 0 20px 20px;"></div>
                    </div>
                </div>
                <div style="margin-bottom: 15px;">
                    <strong>${labels.mood[this.currentLanguage]}</strong> ${moodNames[potion.mood.mood][this.currentLanguage]}
                </div>
                <div style="margin-bottom: 15px;">
                    <strong>${labels.tasks[this.currentLanguage]} (${potion.taskCount}):</strong>
                    <ul style="margin-top: 5px; padding-left: 20px;">
                        ${potion.tasks.map(task => `<li>${this.getCategoryEmoji(task.category)} ${task.title}</li>`).join('')}
                    </ul>
                </div>
                ${potion.diaryNote ? `<div style="margin-bottom: 15px;"><strong>${labels.note[this.currentLanguage]}</strong> "${potion.diaryNote}"</div>` : ''}
            </div>
        `;

        document.body.appendChild(modal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    openTaskManagement() {
        document.getElementById('taskManagementModal').classList.remove('hidden');
        this.renderTaskListModal();
    }

    closeTaskManagement() {
        document.getElementById('taskManagementModal').classList.add('hidden');
    }

    addNewTask() {
        const title = document.getElementById('newTaskTitle').value.trim();
        const category = document.getElementById('newTaskCategory').value;
        
        if (!title) return;

        const task = {
            id: Date.now(),
            title,
            category,
            completed: false,
            timestamp: new Date()
        };

        this.allTasks.unshift(task);
        localStorage.setItem('moodAlchemyAllTasks', JSON.stringify(this.allTasks));
        
        // Clear input
        document.getElementById('newTaskTitle').value = '';
        
        // Refresh task list
        this.renderTaskListModal();
        
        // Add magical effect
        this.createMagicalEffect();
    }

    renderTaskListModal() {
        const taskListModal = document.getElementById('taskListModal');
        taskListModal.innerHTML = '';

        if (this.allTasks.length === 0) {
            taskListModal.innerHTML = `
                <div style="text-align: center; padding: 20px; color: #8b4a8b; font-style: italic;">
                    ${this.currentLanguage === 'en' ? 'No tasks yet. Add your first task!' : 'Пока нет задач. Добавьте первую задачу!'}
                </div>
            `;
            return;
        }

        this.allTasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = 'task-item-modal';
            taskItem.innerHTML = `
                <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="moodAlchemy.toggleTask(${task.id})"></div>
                <div class="task-content">
                    <div class="task-title ${task.completed ? 'completed' : ''}">${task.title}</div>
                    <div class="task-category-modal">${this.getCategoryEmoji(task.category)} ${this.getCategoryName(task.category)}</div>
                </div>
                <div class="task-actions">
                    <button class="task-edit-btn" onclick="moodAlchemy.editTask(${task.id})" title="${this.currentLanguage === 'en' ? 'Edit' : 'Редактировать'}">✏️</button>
                    <button class="task-delete-btn" onclick="moodAlchemy.deleteTaskFromAll(${task.id})" title="${this.currentLanguage === 'en' ? 'Delete' : 'Удалить'}">🗑️</button>
                </div>
            `;
            taskListModal.appendChild(taskItem);
        });
    }

    getCategoryName(category) {
        const names = {
            work: { en: 'Work/Study', ru: 'Работа/Учеба' },
            home: { en: 'Home/Chores', ru: 'Дом/Хлопоты' },
            relaxation: { en: 'Relaxation/Meditation', ru: 'Отдых/Медитация' },
            social: { en: 'Social/Friends', ru: 'Общение/Друзья' },
            hobby: { en: 'Hobby/Creativity', ru: 'Хобби/Творчество' },
            sport: { en: 'Sport/Activity', ru: 'Спорт/Активность' }
        };
        return names[category][this.currentLanguage];
    }

    toggleTask(taskId) {
        const task = this.allTasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            localStorage.setItem('moodAlchemyAllTasks', JSON.stringify(this.allTasks));
            this.renderTaskListModal();
        }
    }

    editTask(taskId) {
        const task = this.allTasks.find(t => t.id === taskId);
        if (task) {
            const newTitle = prompt(
                this.currentLanguage === 'en' ? 'Edit task:' : 'Редактировать задачу:',
                task.title
            );
            if (newTitle && newTitle.trim()) {
                task.title = newTitle.trim();
                localStorage.setItem('moodAlchemyAllTasks', JSON.stringify(this.allTasks));
                this.renderTaskListModal();
            }
        }
    }

    deleteTaskFromAll(taskId) {
        if (confirm(this.currentLanguage === 'en' ? 'Delete this task?' : 'Удалить эту задачу?')) {
            this.allTasks = this.allTasks.filter(t => t.id !== taskId);
            localStorage.setItem('moodAlchemyAllTasks', JSON.stringify(this.allTasks));
            this.renderTaskListModal();
        }
    }

    createMagicalEffect() {
        const effects = ['✨', '🍄', '💖', '⭐', '🌸', '💫'];
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        
        const sparkle = document.createElement('div');
        sparkle.className = 'magical-sparkle';
        sparkle.innerHTML = randomEffect;
        sparkle.style.cssText = `
            position: fixed;
            left: ${Math.random() * window.innerWidth}px;
            top: ${Math.random() * window.innerHeight}px;
            font-size: 20px;
            pointer-events: none;
            z-index: 1000;
        `;
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 2000);
    }
}

// Initialize the app
const moodAlchemy = new MoodAlchemy();

// Register service worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
