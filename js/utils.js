"use strict";


const Columns = Object.freeze({
    Todo: "TO DO",
    InProgress: "IN PROGRESS",
    Testing: "TESTING",
    Done: "DONE",
});


const ColumnsId = Object.freeze({
    Todo: "todo-column",
    InProgress: "progress-column",
    Testing: "testing-column",
    Done: "done-column",
});


const ListsId = Object.freeze({
    Todo: "todo-list",
    InProgress: "progress-list",
    Testing: "testing-list",
    Done: "done-list",
});


const FormsId = Object.freeze({
    Todo: "todo-form",
    InProgress: "progress-form",
    Testing: "testing-form",
    Done: "done-form",
});


const Priorities = Object.freeze({
    None: "PRIORITY",
    High: "HIGH",
    Middle: "MIDDLE",
    Low: "LOW",
});


function toggleElementVisibility(element, displayMode = "block") {
    if (element.style.display === "none") {
        element.style.zIndex = "unset";
        element.style.display = displayMode;
    }
    else {
        element.style.zIndex = "-1";
        element.style.display = "none";
    }
}


function appendChilds(parent, ...childern) {
    for (const child of childern) {
        parent.appendChild(child);
    }
}
