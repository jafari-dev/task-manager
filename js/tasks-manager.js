"use strict";


class TasksManager {
    constructor(tasks) {
        this.todoTasks = tasks.filter(({column}) => column === Columns.Todo);
        this.inProgressTasks = tasks.filter(({column}) => column === Columns.InProgress);
        this.testingTasks = tasks.filter(({column}) => column === Columns.Testing);
        this.doneTasks = tasks.filter(({column}) => column === Columns.Done);
        this.ui = new UserInterface();
    }

    start() {
        this.ui.initialize();
        this.updateColumnsUI();

        for (const key in Columns) {
            const columnName = Columns[key];
            const column = document.getElementById(ColumnsId[key]);
            column.addEventListener("dragover", (event) => {
                event.preventDefault();
            });
            column.addEventListener("drop", (event) => {
                event.preventDefault();
                const textOfTask = event.dataTransfer.getData("text");
                const columnOfTask = event.dataTransfer.getData("column");
                const priorityOfTask = event.dataTransfer.getData("priority");
                if (columnOfTask !== columnName) {
                    this.removeTask(textOfTask, columnOfTask);
                    this.addTask(textOfTask, priorityOfTask, columnName);
                    this.updateColumnsUI([columnOfTask, columnName]);
                }
            });

            const taskForm = column.getElementsByClassName("task-form").item(0);
            const cancelButton = taskForm.getElementsByClassName("cancel-button").item(0);
            const textArea = taskForm.getElementsByClassName("task-description").item(0);

            taskForm.addEventListener("submit", (event) => {
                event.preventDefault();
                const textOfTask = textArea.value.trim();
                if (this.hasTaskExist(textOfTask)) {
                    toggleElementVisibility(document.getElementById("dialog"));
                }
                else if (textOfTask !== "") {
                    this.addTask(textOfTask, Priorities.None, columnName);
                    cancelButton.click();
                    this.updateColumnsUI([columnName]);
                }
            });
        }
    }

    updateColumnsUI(columns = Object.values(Columns)) {
        for (const column of columns) {
            switch (column) {
                case Columns.Todo:
                    this.ui.updateList(ListsId.Todo, this.todoTasks);
                    this.handleEventsDispatcher(ListsId.Todo, column);
                    break;
                case Columns.InProgress:
                    this.ui.updateList(ListsId.InProgress, this.inProgressTasks);
                    this.handleEventsDispatcher(ListsId.InProgress, column);
                    break;
                case Columns.Testing:
                    this.ui.updateList(ListsId.Testing, this.testingTasks);
                    this.handleEventsDispatcher(ListsId.Testing, column);
                    break;
                case Columns.Done:
                    this.ui.updateList(ListsId.Done, this.doneTasks);
                    this.handleEventsDispatcher(ListsId.Done, column);
                    break;
            }
        }

    }

    addTask(text, priority, column) {
        const newTask = { text, priority, column };

        switch (column) {
            case Columns.Todo:
                this.todoTasks = [...this.todoTasks, newTask];
                break;
            case Columns.InProgress:
                this.inProgressTasks = [...this.inProgressTasks, newTask];
                break;
            case Columns.Testing:
                this.testingTasks = [...this.testingTasks, newTask];
                break;
            case Columns.Done:
                this.doneTasks = [...this.doneTasks, newTask];
                break;
        }

        this.saveTasksInBrowser();
    }

    removeTask(text, column) {
        switch (column) {
            case Columns.Todo:
                this.todoTasks = this.todoTasks.filter((task) => task.text !== text);
                break;
            case Columns.InProgress:
                this.inProgressTasks = this.inProgressTasks.filter((task) => task.text !== text);
                break;
            case Columns.Testing:
                this.testingTasks = this.testingTasks.filter((task) => task.text !== text);
                break;
            case Columns.Done:
                this.doneTasks = this.doneTasks.filter((task) => task.text !== text);
                break;
        }

        this.saveTasksInBrowser();
    }

    changeTaskPriority(text, column, newPriority) {
        const mapHandler = (task) => (
            task.text === text ? { ...task, priority: newPriority } : task
        );

        switch (column) {
            case Columns.Todo:
                this.todoTasks = this.todoTasks.map(mapHandler);
                break;
            case Columns.InProgress:
                this.inProgressTasks = this.inProgressTasks.map(mapHandler);
                break;
            case Columns.Testing:
                this.testingTasks = this.testingTasks.map(mapHandler);
                break;
            case Columns.Done:
                this.doneTasks = this.doneTasks.map(mapHandler);
                break;
        }

        this.saveTasksInBrowser();
    }


    changeTaskColumn(text, priority, previousColumn, newColumn) {
        const filterHandler = (task) => (
            task.text === text ? { ...task, priority: newPriority } : task
        );

        switch (previousColumn) {
            case Columns.Todo:
                this.todoTasks = this.todoTasks.map(mapHandler);
                break;
            case Columns.InProgress:
                this.inProgressTasks = this.inProgressTasks.map(mapHandler);
                break;
            case Columns.Testing:
                this.testingTasks = this.testingTasks.map(mapHandler);
                break;
            case Columns.Done:
                this.doneTasks = this.doneTasks.map(mapHandler);
                break;
        }

        this.saveTasksInBrowser();
    }


    


    saveTasksInBrowser() {
        const tasks = JSON.stringify([
            ...this.todoTasks,
            ...this.inProgressTasks,
            ...this.testingTasks,
            ...this.doneTasks
        ]);

        localStorage.setItem("tasks", tasks);
    }


    hasTaskExist(textOfTask) {
        return (
            [...this.todoTasks, ...this.inProgressTasks, ... this.testingTasks, ...this.doneTasks]
                .find(({text}) => text === textOfTask)
        );
    }


    handleEventsDispatcher(listId, column) {
        const list = document.getElementById(listId);
        const items = list.getElementsByClassName("item");

        for (const item of items) {
            const priorityElement = item.getElementsByClassName("priority-selector").item(0);
            const columnSelector = item.getElementsByClassName("column-selector").item(0);
            const text = item.getElementsByClassName("task-body").item(0).textContent;
            const removeIcon = item.getElementsByClassName("remove-task").item(0);
            const currentColumn = columnSelector.value;

            item.addEventListener("dragstart", (event) => {
                event.dataTransfer.setData("text", text);
                event.dataTransfer.setData("column", column);
                event.dataTransfer.setData("priority", priorityElement.value);
            });

            removeIcon.addEventListener("click", () => {
                this.removeTask(text, column);
                this.updateColumnsUI([column]);
            });

            priorityElement.addEventListener("change", (event) => {
                const newPriority = event.target.value;
                this.changeTaskPriority(text, column, newPriority);
                this.updateColumnsUI([column]);
            });


            columnSelector.addEventListener("change", (event) => {
                const newColumn = event.target.value;
                this.removeTask(text, currentColumn);
                this.addTask(text, priorityElement.value, newColumn);
                this.updateColumnsUI([currentColumn, newColumn]);
            })
        }
    }
}