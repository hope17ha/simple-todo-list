import { html, render } from "https://unpkg.com/lit-html?module";

let tasks = [];
let filter = "all";

function loadTasks() {
    const storedTasks = localStorage.getItem("tasks");
    tasks = storedTasks ? JSON.parse(storedTasks) : [];
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function update() {
    let filteredTasks = tasks;

    if (filter === 'active'){
        filteredTasks = tasks.filter(t => !t.completed);
    } else if (filter === 'completed'){
        filteredTasks = tasks.filter(t => t.completed)
    };


    const template = html`
        <div class="container">
            <h1>To-Do List</h1>
            <div class="filters">
                <label>
                    <input
                        type="radio"
                        name="filter"
                        value="all"
                        @change=${handleFilterChange}
                        ?checked=${filter === "all"}
                    />
                    All
                </label>
                <label>
                    <input
                        type="radio"
                        name="filter"
                        value="active"
                        @change=${handleFilterChange}
                        ?checked=${filter === "active"}
                    />
                    Active
                </label>
                <label>
                    <input
                        type="radio"
                        name="filter"
                        value="completed"
                        @change=${handleFilterChange}
                        ?checked=${filter === "completed"}
                    />
                    Completed
                </label>
            </div>

            <input
                id="taskInput"
                type="text"
                @keydown=${handleKeydown}
                placeholder="Add new task..."
            />
            <button @click=${handleAdd} id="addBtn">Add</button>

            ${tasks.length === 0
                ? html`<p class="empty">No tasks yet. Start by adding one!</p> `
                : null}

            <ul id="taskList">
                ${filteredTasks.map(
                    (task, index) => html`
                <li>
                    <div
              style="text-decoration: ${
                  task.completed ? "line-through" : "none"
              }"
              
            >
            ${
                task.completed
                    ? html`<button @click=${() => deleteTask(index)}>
                          Delete
                      </button> `
                    : null
            }   
              ${task.task}
                    </div>
                    ${
                        task.isEditing
                            ? html`
                                  <input
                                      id="editInput"
                                      type="text"
                                      @keydown=${(e) => handleEditKeydown(e, index)}
                                      value="${task.task}"
                                  />
                                  <button @click=${() => saveEdit(index)}>
                                      Save
                                  </button>
                                  <button @click=${() => cancelEdit(index)}>
                                      Cancel
                                  </button>
                              `
                            : null
                    }
                    ${
                        !task.completed && !task.isEditing
                            ? html` <div class="buttons">
                                  <button
                                      @click=${() => toggleTaskStatus(index)}
                                  >
                                      Finish
                                  </button>
                                  <button @click=${() => deleteTask(index)}>
                                      Delete
                                  </button>
                                  <button @click=${() => editTask(index)}>
                                      Edit
                                  </button>
                              </div>`
                            : null
                    }
                            
                   
                        </div>
                </li>
                `
                )}
            </ul>
        </div>
    `;

    render(template, document.getElementById("app"));
}

function handleKeydown(e) {
    if (e.key === "Enter") {
        handleAdd();
    }
}

function handleEditKeydown(e, index) {
    if (e.key === "Escape") {
        cancelEdit(index);
    }
    if (e.key === "Enter") {
        saveEdit(index);
    }
}

function handleAdd() {
    const input = document.getElementById("taskInput");
    const task = input.value;
    if (task) {
        tasks.unshift({ task, completed: false, isEditing: false });
        input.value = "";
        saveTasks();
        update();
    }
}

function toggleTaskStatus(index) {
    tasks[index].completed = !tasks[index].completed;

    saveTasks();
    update();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    update();
}

function editTask(index) {
    tasks[index].isEditing = !tasks[index].isEditing;
    saveTasks();
    update();
}

function saveEdit(index) {
    tasks[index].task = document.getElementById("editInput").value;
    if (document.getElementById("editInput").value.length === 0) {
        return;
    }
    editTask(index);
    saveTasks();
    update();
}

function cancelEdit(index) {
    tasks[index].isEditing = !tasks[index].isEditing;
    update();
}

function handleFilterChange(e) {
    filter = e.target.value;
    update();
}

loadTasks();
update();
