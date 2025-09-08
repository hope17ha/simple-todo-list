import { html, render } from 'https://unpkg.com/lit-html?module';

let tasks = [];

function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    tasks = storedTasks ? JSON.parse(storedTasks) : [];
}

function saveTasks () { 
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function update() {
    const template = html `
        <div class="container">
            <h1>To-Do List</h1>

            <input id="taskInput" type="text" @keydown=${handleKeydown} placeholder="Add new task..." />
            <button @click=${handleAdd} id="addBtn">Add</button>

            <ul id="taskList">
                ${tasks.map((task, index) => html `
                <li>
                <div
              style="text-decoration: ${task.completed ? 'line-through' : 'none'}"
            >
              ${task.task}
</div>
                    ${!task.completed ? 
                        html `
                        <div class="buttons">
                        <button @click=${() => toggleTaskStatus(index)}>Finish</button>` 
                        : null}
                    <button @click=${() => deleteTask(index)}>Delete</button>
                    </div>
                </li>
                `) }
            </ul>
        </div>
    `

    render(template, document.getElementById('app'));
}

function handleKeydown(e) {
    if (e.key === 'Enter') {
      handleAdd();
    }
  }

function handleAdd() {
    const input = document.getElementById('taskInput');
    const task = input.value;
    if (task) {
        tasks.push({task, completed: false});
        input.value = '';
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

loadTasks();
update();