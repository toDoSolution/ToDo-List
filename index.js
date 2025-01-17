

const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const subjectSelect = document.querySelector("#subject-select");
const todoList = document.querySelector("#todo-list"); 
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const searchInput = document.querySelector("#search-input");
const filterSelect = document.querySelector("#filter-select");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");

let currentTodo = null; 
const loadTodos = () => {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos.forEach((todo) => {
        saveTodo(todo.text, todo.subject, todo.isHighPriority, todo.isDone);
    });
};

const saveTodosToLocalStorage = () => {
    const todos = [];
    const todoElements = document.querySelectorAll(".todo");

    todoElements.forEach((todo) => {
        todos.push({
            text: todo.querySelector("h3").innerText,
            subject: todo.getAttribute("data-subject"),
            isHighPriority: todo.classList.contains("high-priority"),
            isDone: todo.classList.contains("done"),
        });
    });

    localStorage.setItem("todos", JSON.stringify(todos));
};

const saveTodo = (text, subject, isHighPriority, isDone = false) => {
    const todo = document.createElement("div");
    todo.classList.add("todo");
    todo.setAttribute("data-subject", subject);

    if (isHighPriority) {
        todo.classList.add("high-priority");
    }

    if (isDone) {
        todo.classList.add("done"); 
    }

    const todoTitle = document.createElement("h3");
    todoTitle.innerText = text;
    todo.appendChild(todoTitle);

    const todoSubject = document.createElement("p");
    todoSubject.innerText = subject;
    todoSubject.classList.add("todo-subject");
    todo.appendChild(todoSubject);

    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    todo.appendChild(doneBtn);

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    todo.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-todo");
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    todo.appendChild(deleteBtn);

    todoList.appendChild(todo);

    
    saveTodosToLocalStorage();
};


const toggleForms = () => {
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
};


const searchTodos = () => {
    const searchText = searchInput.value.toLowerCase();
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        const todoText = todo.querySelector("h3").innerText.toLowerCase();
        const isMatch = todoText.includes(searchText);
        todo.style.display = isMatch ? "flex" : "none";
    });
};


const filterTodos = () => {
    const selectedFilter = filterSelect.value;
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        const todoSubject = todo.getAttribute("data-subject");
        const isDone = todo.classList.contains("done");

        let shouldDisplay = false;

        switch (selectedFilter) {
            case "done":
                shouldDisplay = isDone; 
                break;
            case "todo":
                shouldDisplay = !isDone; 
                break;
            case "all":
                shouldDisplay = true; 
                break;
            default:
                shouldDisplay = todoSubject === selectedFilter;
                break;
        }

        todo.style.display = shouldDisplay ? "flex" : "none"; 
    });
};

todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputValue = todoInput.value.trim();
    const selectedSubject = subjectSelect.value; 
    const isHighPriority = document.querySelector("#high-priority").checked;

    if (inputValue) {
        saveTodo(inputValue, selectedSubject, isHighPriority); 
        todoInput.value = "";
        document.querySelector("#high-priority").checked = false; 
        filterTodos(); 
    }
});

todoList.addEventListener("click", (e) => {
    const targetEl = e.target;
    const parentEl = targetEl.closest(".todo");

    if (targetEl.classList.contains("finish-todo")) {
        if (parentEl) {
            parentEl.classList.toggle("done");
            saveTodosToLocalStorage(); 
            filterTodos(); 
        }
    }

    if (targetEl.classList.contains("remove-todo")) {
        parentEl.remove();
        saveTodosToLocalStorage(); 
        filterTodos(); 
    }

    if (targetEl.classList.contains("edit-todo")) {
        toggleForms();

        
        currentTodo = parentEl;
        editInput.value = currentTodo.querySelector("h3").innerText;
    }
});

editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (currentTodo) {
        const newTitle = editInput.value.trim();

        if (newTitle) {
            currentTodo.querySelector("h3").innerText = newTitle;
            toggleForms();
            saveTodosToLocalStorage(); 
            filterTodos();
        }
    }
});

searchInput.addEventListener("input", searchTodos);
filterSelect.addEventListener("change", filterTodos);

cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForms();
});

document.addEventListener("DOMContentLoaded", loadTodos);
