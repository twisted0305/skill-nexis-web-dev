/**
 * ChatTask - Production-Grade Vanilla JS State & UI Controller
 */

// 1. Initial State & Storage Sync
const STORAGE_KEY = 'chat_tasks_data_v1';

const defaultTasks = [
  { id: '1', text: 'Set up project structure & files', completed: true, timestamp: '09:15 AM' },
  { id: '2', text: 'Implement LocalStorage persistence', completed: true, timestamp: '10:00 AM' },
  { id: '3', text: 'Test add, complete, and delete actions', completed: false, timestamp: '10:30 AM' }
];

let state = {
  tasks: loadTasks(),
  filter: 'all' // 'all' | 'active' | 'completed'
};

// 2. DOM Selectors
const chatFeed = document.getElementById('chatFeed');
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskStats = document.getElementById('taskStats');
const filterBtns = document.querySelectorAll('.filter-btn');

// 3. Storage Utilities
function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultTasks;
  } catch (e) {
    console.error('Could not load from localStorage:', e);
    return defaultTasks;
  }
}

function persistTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

// 4. State Mutations
function addTask(text) {
  const newTask = {
    id: Date.now().toString(),
    text: text.trim(),
    completed: false,
    timestamp: formatCurrentTime()
  };

  state.tasks.push(newTask);
  persistTasks();
  render();
  scrollToBottom();
}

function toggleTask(id) {
  state.tasks = state.tasks.map(task => 
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  persistTasks();
  render();
}

function deleteTask(id) {
  state.tasks = state.tasks.filter(task => task.id !== id);
  persistTasks();
  render();
}

function setFilter(filterType) {
  state.filter = filterType;
  filterBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filterType);
  });
  render();
}

// 5. Helper Utilities
function formatCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function scrollToBottom() {
  chatFeed.scrollTop = chatFeed.scrollHeight;
}

// 6. UI Render Engine
function render() {
  // Compute Stats
  const activeCount = state.tasks.filter(t => !t.completed).length;
  const doneCount = state.tasks.filter(t => t.completed).length;
  
  if (state.tasks.length === 0) {
    taskStats.textContent = 'No tasks yet';
  } else {
    taskStats.textContent = `${activeCount} pending · ${doneCount} completed`;
  }

  // Filter tasks
  const visibleTasks = state.tasks.filter(task => {
    if (state.filter === 'active') return !task.completed;
    if (state.filter === 'completed') return task.completed;
    return true;
  });

  // Empty view check
  if (visibleTasks.length === 0) {
    chatFeed.innerHTML = `
      <div class="empty-state">
        <div class="icon">💬</div>
        <p>No ${state.filter === 'all' ? '' : state.filter} tasks found.</p>
      </div>
    `;
    return;
  }

  // Render message cards
  chatFeed.innerHTML = visibleTasks.map(task => `
    <div class="task-row" data-id="${task.id}">
      <button class="delete-btn" onclick="deleteTask('${task.id}')" title="Delete Task" aria-label="Delete Task">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>

      <div class="task-bubble ${task.completed ? 'completed' : ''}">
        <div class="task-body">
          <input 
            type="checkbox" 
            class="task-checkbox" 
            ${task.completed ? 'checked' : ''}
            onchange="toggleTask('${task.id}')"
            aria-label="Mark task as complete"
          />
          <span class="task-text">${escapeHtml(task.text)}</span>
        </div>
        <div class="task-time">${task.timestamp}</div>
      </div>
    </div>
  `).join('');
}

// 7. Event Listeners
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const val = taskInput.value.trim();
  if (val) {
    addTask(val);
    taskInput.value = '';
    taskInput.focus();
  }
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    setFilter(btn.dataset.filter);
  });
});

// Expose handlers to window for inline onclick attributes
window.toggleTask = toggleTask;
window.deleteTask = deleteTask;

// Initial render & scroll
render();
scrollToBottom();
