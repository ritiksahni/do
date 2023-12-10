const { program } = require("commander");
const fs = require("fs");

function addTask(task) {
    const data = require("./config/tasks.json");

    if (data.tasks.includes(task)) {
        console.log("Task already exists");
        return;
    }

    data.tasks.push(task);

    fs.writeFile("./config/tasks.json", JSON.stringify(data), (err) => {
        if (err) {
            console.log(err);
            return;
        }
    });
}

function listTasks() {
    const data = require("./config/tasks.json");
    data.tasks.forEach((task, index) => {
        console.log(`${index + 1}. ${task}`);
    });
}

function clearTasks() {
    const data = require("./config/tasks.json");
    data.tasks = [];
    fs.writeFile("./config/tasks.json", JSON.stringify(data), (err) => {
        if (err) {
            console.log(err);
            return;
        }
    });
}

program
    .command("add")
    .description("Add a todo")
    .argument("<string>", "Task to add")
    .action((str) => {
        addTask(str);
    });

program
    .command("list")
    .description("List all tasks")
    .action(() => {
        listTasks();
    });

program
    .command("clear")
    .description("Clear all tasks")
    .action(() => {
        clearTasks();
    });

program.parse();
