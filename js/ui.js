'use strict';


import {
    Columns,
    ColumnsId,
    FormsId,
    ListsId,
    Priorities,
    appendChilds,
    toggleElementVisibility
} from './utils.js';


export default class UserInterface {
    constructor() {
        this.page = document.getElementById('container');
    }

    initialize() {
        this.page.innerHTML = '';

        const todoColumn = this.generateColumn(Columns.Todo, ColumnsId.Todo, ListsId.Todo, FormsId.Todo);
        const inProgressColumn = this.generateColumn(Columns.InProgress, ColumnsId.InProgress, ListsId.InProgress, FormsId.InProgress);
        const testingColumn = this.generateColumn(Columns.Testing, ColumnsId.Testing, ListsId.Testing, FormsId.Testing);
        const doneColumn = this.generateColumn(Columns.Done, ColumnsId.Done, ListsId.Done, FormsId.Done);
        
        appendChilds(this.page, todoColumn, inProgressColumn, testingColumn, doneColumn);
        
        const dialog =  document.getElementById('dialog');
        dialog.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleElementVisibility(dialog);
        });
        toggleElementVisibility(dialog);
    }

    generateColumn(titleOfColumn, idOfColumn, idOfList, idOfForm) {
        const column = document.createElement('div');
        column.setAttribute('class', 'column');
        column.setAttribute('id', idOfColumn);

        const title = document.createElement('h2');
        title.textContent = titleOfColumn;

        const list = document.createElement('ul');
        list.setAttribute('class', 'list');
        list.setAttribute('id', idOfList);

        const addButton = document.createElement('button');
        addButton.setAttribute('type', 'button');
        addButton.setAttribute('class', 'add-item');
        const buttonImage = document.createElement('img');
        buttonImage.setAttribute('src', './images/add.svg');
        appendChilds(addButton, buttonImage);
        addButton.addEventListener('click', () => {
            toggleElementVisibility(addButton);
            toggleElementVisibility(form);
        });

        const form = document.createElement('form');
        form.setAttribute('id', idOfForm);
        form.setAttribute('class', 'task-form');
        const textArea = document.createElement('textarea');
        textArea.setAttribute('class', 'task-description');
        textArea.setAttribute('placeholder', 'Enter the title or description of task');
        const submit = document.createElement('button');
        submit.setAttribute('class', 'save-button');
        submit.setAttribute('type', 'submit');
        submit.textContent = 'SAVE';
        const cancel = document.createElement('button');
        cancel.setAttribute('class', 'cancel-button');
        cancel.setAttribute('type', 'reset');
        cancel.textContent = 'CANCEL';
        cancel.addEventListener('click', () => {
            toggleElementVisibility(addButton);
            toggleElementVisibility(form);
        });
        appendChilds(form, textArea, submit, cancel);
        toggleElementVisibility(form);

        appendChilds(column, title, list, addButton, form);

        return column;
    }


    generateTask(textOfTask, targetColumn, priorityOfTask = Priorities.None) {
        const headerOfItem = document.createElement('div');
        headerOfItem.setAttribute('class', 'task-header');

        const prioritySelectBox = document.createElement('select');
        prioritySelectBox.setAttribute('class', 'selector priority-selector');
        prioritySelectBox.setAttribute('value', priorityOfTask);

        for (const key in Priorities) {
            const priority = Priorities[key];
            const option = document.createElement('option');
            option.setAttribute('value', priority);
            option.textContent = priority;

            if (priority === Priorities.None) {
                option.setAttribute('disabled', '');
            }
            if (priority === priorityOfTask) {
                option.setAttribute('selected', 'true');
            }

            prioritySelectBox.appendChild(option);
        }

        const columnSelectBox = document.createElement('select');
        columnSelectBox.setAttribute('class', 'selector column-selector');
        columnSelectBox.setAttribute('value', targetColumn);

        for (const key in Columns) {
            const column = Columns[key];
            const option = document.createElement('option');
            option.setAttribute('value', column);
            option.textContent = column;
            if (column === targetColumn) {
                option.setAttribute('selected', 'true');
            }

            columnSelectBox.appendChild(option);
        }

        const removeIcon = document.createElement('img');
        removeIcon.setAttribute('class', 'remove-task');
        removeIcon.setAttribute('src', './images/remove.svg');
        appendChilds(headerOfItem, prioritySelectBox, columnSelectBox, removeIcon);

        const bodyOfItem = document.createElement('div');
        bodyOfItem.setAttribute('class', 'task-body');
        const taskDescription = document.createTextNode(textOfTask);
        const taskPriority = document.createElement('span');
        if (priorityOfTask === Priorities.None) {
            taskPriority.setAttribute('class', 'task-priority no-priority');
        }
        else if (priorityOfTask === Priorities.Low) {
            taskPriority.setAttribute('class', 'task-priority low-priority');
        }
        else if (priorityOfTask === Priorities.Middle) {
            taskPriority.setAttribute('class', 'task-priority middle-priority');
        }
        else if (priorityOfTask === Priorities.High) {
            taskPriority.setAttribute('class', 'task-priority high-priority');
        }
        appendChilds(bodyOfItem, taskPriority, taskDescription);

        const item = document.createElement('li');
        item.setAttribute('class', 'item');
        item.setAttribute('draggable', 'true');

        item.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text', textOfTask);
            event.dataTransfer.setData('column', targetColumn);
            event.dataTransfer.setData('priority', priorityOfTask);
        });

        appendChilds(item, headerOfItem, bodyOfItem);

        return item;
    }

    updateList(listId, tasks) {
        const list = document.getElementById(listId);
        list.innerHTML = '';
        for (const task of tasks) {
            const {text, priority, column} = task;
            const generatedTask = this.generateTask(text, column, priority);
            list.appendChild(generatedTask);
        }
    }
}