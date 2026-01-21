
loadTheme();

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const themeToggle = document.getElementById("themeToggle");

const greeting = document.getElementById("greeting");
const nameModal = new bootstrap.Modal(document.getElementById("nameModal"));
const userNameInput = document.getElementById("userNameInput");
const saveNameBtn = document.getElementById("saveNameBtn");


const greetingText = document.getElementById("greetingText");
const resetNameBtn = document.getElementById("resetNameBtn");

const taskCounter = document.getElementById("taskCounter");

const clearCompletedBtn = document.getElementById("clearCompletedBtn");




/* =========================
   Local Storage Functions
========================= */

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* =========================
   Render Tasks
========================= */

function renderTasks() {
  taskList.innerHTML = "";
  const tasks = getTasks();

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  const sortedTasks = [...activeTasks, ...completedTasks];

  sortedTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "list-group-item";

    if (task.completed) {
      li.classList.add("completed");
    }

    const date = new Date(task.createdAt);
const formattedDate = date.toLocaleString("ar-EG", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit"
});

li.innerHTML = `
  <div class="task-content">
    <span class="task-text">${task.text}</span>
    <div class="task-date">🕒 ${formattedDate}</div>
  </div>
  <button class="btn btn-sm btn-outline-danger">✖</button>
`;


    li.querySelector("span").addEventListener("click", () => {
      task.completed = !task.completed;
      saveTasks(sortedTasks);
      renderTasks();
    });

    li.querySelector("button").addEventListener("click", () => {
      const confirmDelete = confirm("متأكد إنك عايز تمسح التاسك دي؟");
      if (!confirmDelete) return;

      sortedTasks.splice(index, 1);
      saveTasks(sortedTasks);
      renderTasks();
    });

    taskList.appendChild(li);
  });
  updateCounter(sortedTasks);

}


/* =========================
   Add Task
========================= */

addTaskBtn.addEventListener("click", () => {
  if (taskInput.value.trim() === "") return;

  const tasks = getTasks();
  tasks.push({
    text: taskInput.value,
    completed: false,
    createdAt: new Date().toISOString()
  });

  saveTasks(tasks);
  taskInput.value = "";
  renderTasks();
});



/* Enter Key Support */
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTaskBtn.click();
});

/* =========================
   Theme Toggle
========================= */
/* =========================
   Theme
========================= */

function loadTheme() {
  const theme = localStorage.getItem("theme") || "light";
  document.body.classList.add(`${theme}-mode`);
}

themeToggle.addEventListener("click", () => {
  if (document.body.classList.contains("dark-mode")) {
    document.body.classList.replace("dark-mode", "light-mode");
    localStorage.setItem("theme", "light");
  } else {
    document.body.classList.replace("light-mode", "dark-mode");
    localStorage.setItem("theme", "dark");
  }
});
/* =========================
   On Load
========================= */
checkUserName();
/* =========================
   User Name
========================= */

function checkUserName() {
  const userName = localStorage.getItem("userName");

  if (!userName) {
    nameModal.show();
  } else {
    greetingText.textContent = `ازيك يا ${userName} 👋`;
  }
}

saveNameBtn.addEventListener("click", () => {
  if (userNameInput.value.trim() === "") return;

  localStorage.setItem("userName", userNameInput.value);
  greetingText.textContent = `ازيك يا ${userNameInput.value} 👋`;
  nameModal.hide();
});

resetNameBtn.addEventListener("click", () => {
  localStorage.removeItem("userName");
  greetingText.textContent = "";
  nameModal.show();
});




function updateCounter(tasks) {
  const remaining = tasks.filter(task => !task.completed).length;
  const completed = tasks.filter(task => task.completed).length;

  if (remaining === 0) {
    taskCounter.textContent = "🎉 مفيش مهام متبقية";
  } else {
    taskCounter.textContent = `باقي ${remaining} مهام`;
  }

  if (completed > 0) {
    clearCompletedBtn.classList.remove("d-none");
  } else {
    clearCompletedBtn.classList.add("d-none");
  }
}



taskInput.addEventListener("input", () => {
  taskInput.style.height = "auto";
  taskInput.style.height = taskInput.scrollHeight + "px";
});



clearCompletedBtn.addEventListener("click", () => {
  const confirmClear = confirm("متأكد إنك عايز تمسح كل المهام المكتملة؟");
  if (!confirmClear) return;

  const tasks = getTasks().filter(task => !task.completed);
  saveTasks(tasks);
  renderTasks();
});


/* =========================
   Load Tasks on Start
========================= */

renderTasks();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(reg => {
        console.log("Service Worker registered", reg);
      })
      .catch(err => {
        console.log("SW registration failed", err);
      });
  });
}




