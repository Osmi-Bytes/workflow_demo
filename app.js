const STORAGE_KEY = "simple_todo_items";

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const itemsLeft = document.getElementById("items-left");
const filterButtons = document.querySelectorAll(".filter-btn");
const clearCompletedButton = document.getElementById("clear-completed");

let state = {
  todos: loadTodos(),
  filter: "all"
};

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos));
}

function createTodo(text) {
  return {
    id: crypto.randomUUID(),
    text,
    completed: false
  };
}

function getVisibleTodos() {
  if (state.filter === "active") {
    return state.todos.filter((todo) => !todo.completed);
  }

  if (state.filter === "completed") {
    return state.todos.filter((todo) => todo.completed);
  }

  return state.todos;
}

function render() {
  list.innerHTML = "";

  const visibleTodos = getVisibleTodos();
  visibleTodos.forEach((todo) => {
    const item = document.createElement("li");
    item.className = `todo-item${todo.completed ? " completed" : ""}`;

    const toggle = document.createElement("input");
    toggle.type = "checkbox";
    toggle.checked = todo.completed;
    toggle.setAttribute("aria-label", `Toggle ${todo.text}`);
    toggle.addEventListener("change", () => {
      toggleTodo(todo.id);
    });

    const text = document.createElement("span");
    text.className = "text";
    text.textContent = todo.text;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "delete-btn";
    remove.textContent = "Delete";
    remove.addEventListener("click", () => {
      deleteTodo(todo.id);
    });

    item.append(toggle, text, remove);
    list.appendChild(item);
  });

  const activeCount = state.todos.filter((todo) => !todo.completed).length;
  itemsLeft.textContent = `${activeCount} item${activeCount === 1 ? "" : "s"} left`;
}

function addTodo(text) {
  state.todos.unshift(createTodo(text));
  saveTodos();
  render();
}

function toggleTodo(id) {
  state.todos = state.todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveTodos();
  render();
}

function deleteTodo(id) {
  state.todos = state.todos.filter((todo) => todo.id !== id);
  saveTodos();
  render();
}

function clearCompleted() {
  state.todos = state.todos.filter((todo) => !todo.completed);
  saveTodos();
  render();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = input.value.trim();

  if (!value) {
    return;
  }

  addTodo(value);
  form.reset();
  input.focus();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.filter = button.dataset.filter;

    filterButtons.forEach((other) => {
      other.classList.toggle("active", other === button);
    });

    render();
  });
});

clearCompletedButton.addEventListener("click", clearCompleted);

render();
