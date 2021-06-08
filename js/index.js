'use strict';


import TasksManager from './tasks-manager.js';


window.addEventListener('load', handlePageLoad);

function handlePageLoad() {
    const storedTasksInBrwoser = JSON.parse(localStorage.getItem('tasks'));
    const application = new TasksManager(storedTasksInBrwoser ?? []);
    application.start();
}
