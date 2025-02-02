document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("newTaskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");
    const toCalendarBtn = document.getElementById("toCalendar");
    const toTaskPageBtn = document.getElementById("toTaskPage");
    const taskPage = document.getElementById("taskPage");
    const calendarPage = document.getElementById("calendarPage");
    const datepickerElement = document.getElementById("datepicker");
    const selectedDateTasks = document.getElementById("selectedDateTasks");

    const datepicker = new Datepicker(datepickerElement, {
        autohide: true,
    });

    datepickerElement.addEventListener('changeDate', (event) => {
        const date = event.detail.date;
        showTasksForDate(date.toISOString().split('T')[0]);
    });

    // Load tasks from localStorage
    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || {};
        for (let date in tasks) {
            tasks[date].forEach(task => {
                addTaskToList(task, date);
            });
        }
    };

    // Save tasks to localStorage
    const saveTasks = () => {
        const tasks = {};
        document.querySelectorAll("#taskList li").forEach(taskItem => {
            const date = taskItem.dataset.date;
            if (!tasks[date]) tasks[date] = [];
            tasks[date].push({
                text: taskItem.querySelector('.task-text').innerText,
                completed: taskItem.classList.contains("completed")
            });
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    };

    
    const addTaskToList = (task, date) => {
        const li = document.createElement("li");
        li.dataset.date = date;
        
        const taskText = document.createElement("span");
        taskText.className = 'task-text';
        taskText.innerText = task.text;
        if (task.completed) li.classList.add("completed");
        li.appendChild(taskText);

        li.addEventListener("click", () => {
            li.classList.toggle("completed");
            saveTasks();
        });

        const removeBtn = document.createElement("button");
        removeBtn.innerText = "Sil";
        removeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            li.remove();
            saveTasks();
        });
        li.appendChild(removeBtn);

        taskList.appendChild(li);
    };

    // Handle adding new task
    addTaskBtn.addEventListener("click", () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const date = new Date().toISOString().split("T")[0];
            addTaskToList({ text: taskText, completed: false }, date);
            saveTasks();
            taskInput.value = "";
        }
    });

    
    toCalendarBtn.addEventListener("click", () => {
        taskPage.style.display = "none";
        calendarPage.style.display = "block";
        toTaskPageBtn.style.display = "block";
        toCalendarBtn.style.display = "none";
    });

    // Switch to task page
    toTaskPageBtn.addEventListener("click", () => {
        taskPage.style.display = "block";
        calendarPage.style.display = "none";
        toTaskPageBtn.style.display = "none";
        toCalendarBtn.style.display = "block";
    });

    // Show tasks for selected date
    const showTasksForDate = (date) => {
        selectedDateTasks.innerHTML = "";
        const tasks = JSON.parse(localStorage.getItem("tasks")) || {};
        if (tasks[date]) {
            tasks[date].forEach(task => {
                const taskItem = document.createElement("div");
                taskItem.innerText = task.text;
                if (task.completed) taskItem.classList.add("completed");
                selectedDateTasks.appendChild(taskItem);
            });
        } else {
            selectedDateTasks.innerText = "Seçtiğiniz tarihte herhangi bir görev eklemediniz.";
        }
    };

    
    loadTasks();
});
        
