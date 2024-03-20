document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const addButton = document.getElementById('add-task-btn');
    const inputField = document.getElementById('new-task-input');
    const taskList = document.getElementById('task-list');
    
    // Load tasks and dark mode from localStorage
    loadTasks();
    loadDarkMode();
    
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode') ? 'true' : 'false');
    });

    addButton.addEventListener('click', () => {
        const taskText = inputField.value.trim();
        if (taskText) {
            addTask(taskText);
            inputField.value = ''; // Clear the input field
            saveTasks();
        } else {
            alert('Please enter a task.');
        }
    });

    function addTask(text, completed = false) {
        const listItem = document.createElement('li');
        listItem.textContent = text;
        if (completed) {
            listItem.classList.add('completed');
        }

        listItem.addEventListener('click', () => {
            listItem.classList.toggle('completed');
            saveTasks();
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent toggle completion when deleting
            listItem.remove();
            saveTasks();
        });

        listItem.appendChild(deleteButton);

        listItem.setAttribute('draggable', true);
        listItem.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', ''); // For Firefox
            listItem.classList.add('dragging');
        });

        listItem.addEventListener('dragend', () => {
            listItem.classList.remove('dragging');
        });

        taskList.appendChild(listItem);
    }

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(li => {
            tasks.push({
                text: li.textContent.replace('Delete', '').trim(), // Exclude delete button text
                completed: li.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => addTask(task.text, task.completed));
    }

    function loadDarkMode() {
        const darkMode = localStorage.getItem('darkMode') === 'true';
        if (darkMode) {
            document.body.classList.add('dark-mode');
        }
    }

    taskList.addEventListener('dragover', e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(e.clientY);
        const draggable = document.querySelector('.dragging');
        if (afterElement == null) {
            taskList.appendChild(draggable);
        } else {
            taskList.insertBefore(draggable, afterElement);
        }
    });

    function getDragAfterElement(y) {
        const draggableElements = [...taskList.querySelectorAll('li:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
});
