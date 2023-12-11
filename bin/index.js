#!/usr/bin/env node
const { program } = require("commander");
const fs = require("fs");
const os = require("os");
const path = require("path");

// Get the user's home directory
const homeDir = os.homedir();

// Specify the configuration file path
const configFile = path.join(homeDir, ".config/todo.json");

// Read the configuration file
fs.readFile(configFile, "utf8", (err, data) => {
    if (err) {
        console.log("Configuration file not found. Creating one...");
        initConfig(); // Run initConfig() if the configuration file doesn't exist
        return;
    }

    // Parse the configuration data (assuming it's in JSON format)
    const config = JSON.parse(data);

    function addTask(task) {
        if (config.tasks.includes(task)) {
            console.log("Task already exists");
            return;
        }

        config.tasks.push(task);

        fs.writeFile(configFile, JSON.stringify(config), (err) => {
            if (err) {
                console.log(err);
                return;
            }
        });
    }

    function listTasks() {
        config.tasks.forEach((task, index) => {
            console.log(`${index + 1}. ${task}`);
        });
    }

    function clearTasks() {
        config.tasks = [];
        fs.writeFile(configFile, JSON.stringify(config), (err) => {
            if (err) {
                console.log(err);
                return;
            }
        });
    }

    function initConfig() {
        const config = {
            tasks: [],
        };

        fs.writeFile(configFile, JSON.stringify(config), (err) => {
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
});
