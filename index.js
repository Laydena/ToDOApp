const addTaskBtn = document.querySelector(".main-btn");
const clearTaskList = document.querySelector(".clear-all-btn");
const form = document.querySelector(".task_form");
const emptyList = document.querySelector(".empty-list");

const inputTask = document.getElementById("input-task");
const checkbox = document.getElementById("task-checkbox");

const tasksList = document.querySelector(".task-list");


let tasks = [];

//Проверяем local Storage
if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
};

tasks.forEach(function (task) {
    renderTask(task);
})

checkEmptyList();



//Всякое кнопочное
form.addEventListener('submit', addTask)
tasksList.addEventListener('click', deleteTask)
tasksList.addEventListener('change', doneTask)
clearTaskList.addEventListener('click', deleteAllTasks);

//Добавляем задачу
function addTask(evt) {
    evt.preventDefault();
    const taskText = inputTask.value;

    if (taskText === 0) {
        document.querySelector(".main-btn").disabled = true;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,

    };

    tasks.push(newTask);

    saveToLS();

    renderTask(newTask);

    inputTask.value = '';
    inputTask.focus();

    checkEmptyList();
}

//Удаляем задачу
function deleteTask(evt) {
    if (evt.target.dataset.action !== 'delete') return

    const parentDiv = evt.target.closest(".task");

    const id = Number(parentDiv.id);

    const index = tasks.findIndex((task) => task.id === id);

    tasks.splice(index, 1);

    saveToLS();

    parentDiv.remove();

    checkEmptyList();
}


//Отмечаем задачу выполненной
function doneTask(evt) {
    const parentNode = evt.target.closest(".task");
    const id = Number(parentNode.id);

    const taskCondition = tasks.find((task) => task.id === id);

    taskCondition.done = !taskCondition.done

    saveToLS();

    if (evt.target.checked) {
        console.log('Это чекбокс!');
        parentNode.classList.add("done");
    } else {
        console.log('Чекбокс не выбран!');
        parentNode.classList.remove("done");
    }
}

//Проверяем, пуст ли список задач
function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHtml = `
        <div class="empty-list">
                <img class="empty-icon" src="/empty.png">
                <span>Нет ни одной задачи</span>
            </div>
        `;
        tasksList.insertAdjacentHTML('afterbegin', emptyListHtml)
    }

    if (tasks.length > 0) {
        const emptyListEl = document.querySelector(".empty-list");
        emptyListEl ? emptyListEl.remove() : null;
    }
}

//Сохраняем по ключу в LocalStorage
function saveToLS() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

//Рендерим html-код
function renderTask(task) {
    const cssClass = task.done ? "task done" : "task";

    const chbxStyle = "checkbox";

    let chbxValue = (cssClass === "task done") ? "checked" : null;

    const taskHtml = `
    <div class="${cssClass}" id="${task.id}">
                    <div class="${chbxStyle}">
                        <input type="checkbox" id="task-checkbox" ${chbxValue} class="box">
                        <p class="task-txt">${task.text}</p>
                    </div>
                    <button class="delete-task" data-action="delete"><img class="del-img" src="close.png"></button>
                </div>
    `

    tasksList.insertAdjacentHTML('beforeend', taskHtml);
}


//Удаляем задачу
function deleteAllTasks() {

    let tasktoDel = document.querySelectorAll(".task");
    tasktoDel.forEach(e => e.remove());
    localStorage.clear();


    const emptyListHtml = `
        <div class="empty-list">
                <img class="empty-icon" src="/empty.png">
                <span>Нет ни одной задачи</span>
            </div>
        `;
    tasksList.insertAdjacentHTML('afterbegin', emptyListHtml)
}


