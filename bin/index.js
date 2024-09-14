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
        if (config.tasks.some(t => t.task === task)) {
            console.log("Task already exists");
            return;
        }
    
        const newTask = {
            task: task,
            isDone: false
        };
    
        config.tasks.push(newTask);
    
        fs.writeFile(configFile, JSON.stringify(config), (err) => {
            if (err) {
                console.log(err);
                return;
            }
        });
    }
    
    
	function deleteTask(taskFragment) {
		const matchingTasks = config.tasks.filter(t => t.task.includes(taskFragment));

		if (matchingTasks.length === 0) {
			console.log("No matching tasks found.");
			return;
		}

		if (matchingTasks.length > 1 && !matchingTasks.some(t => t.task === taskFragment)) {
			console.log("Multiple matching tasks found containing that name. Please specify the task to delete.");
			return;
		}

		const exactMatch = matchingTasks.find(t => t.task === taskFragment);

		if (exactMatch) {
			const taskIndex = config.tasks.indexOf(exactMatch);
			config.tasks.splice(taskIndex, 1);
		} else {
			const taskIndex = config.tasks.indexOf(matchingTasks[0]);
			config.tasks.splice(taskIndex, 1);
		}

		fs.writeFile(configFile, JSON.stringify(config), (err) => {
			if (err) {
				console.log(err);
				return;
			}
		});
	}

	function listTasks() {
        config.tasks.forEach((task) => {
            const status = task.isDone ? "[x]" : "[ ]";
            console.log(`- ${status} ${task.task}`);
        });
    }
    
    function solveTask(taskFragment) {
        const matchingTasks = config.tasks.filter(t => t.task.includes(taskFragment));

        if (matchingTasks.length === 0) {
            console.log("No matching tasks found.");
            return;
        }

        const exactMatch = matchingTasks.find(t => t.task === taskFragment);
        if (exactMatch) {
            exactMatch.isDone = true;
            fs.writeFile(configFile, JSON.stringify(config), (err) => {
                if (err) {
                    console.log(err);
                    return;
                }
            });
            return;
        }
        if (matchingTasks.length > 1) {
            console.log("Multiple matching tasks found containing that name. Please specify the task to mark as done.");
            return;
        }
        let task = matchingTasks[0];
        task.isDone = true;
        fs.writeFile(configFile, JSON.stringify(config), (err) => {
            if (err) {
                console.log(err);
                return;
            }
        });
    }

    function unsolveTask(taskFragment) {
        const matchingTasks = config.tasks.filter(t => t.task.includes(taskFragment));

        if (matchingTasks.length === 0) {
            console.log("No matching tasks found.");
            return;
        }
        
        const exactMatch = matchingTasks.find(t => t.task === taskFragment);
        if (exactMatch) {
            exactMatch.isDone = false;
            fs.writeFile(configFile, JSON.stringify(config), (err) => {
                if (err) {
                    console.log(err);
                    return;
                }
            });
            return;
        }
        if (matchingTasks.length > 1) {
            console.log("Multiple matching tasks found containing that name. Please specify the task to mark as undone.");
            return;
        }
        let task = matchingTasks[0];
        task.isDone = false;
        fs.writeFile(configFile, JSON.stringify(config), (err) => {
            if (err) {
                console.log(err);
                return;
            }
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

    function editTask(oldTask, newTask) {
        const matchingTasks = config.tasks.filter(t => t.task.includes(oldTask));

        if (matchingTasks.length === 0) {
            console.log("No matching tasks found.");
            return;
        }

        const exactMatch = matchingTasks.find(t => t.task === oldTask);

        if (exactMatch) {
            exactMatch.task = newTask;
            fs.writeFile(configFile, JSON.stringify(config), (err) => {
                if (err) {
                    console.log(err);
                    return;
                }
            });
            return;
        }
        if (matchingTasks.length > 1) {
            console.log("Multiple matching tasks found containing that name. Please specify the task to rename.");
            return;
        }
        let task = matchingTasks[0];
        task.task = newTask;
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
        .command("done")
        .description("Mark a task as done")
        .argument("<string>", "Task name (or part of it)")
        .action((task) => {
            solveTask(task);
        });

    program
        .command("undo")
        .description("Mark a task as undone")
        .argument("<string>", "Task name (or part of it)")
        .action((task) => {
            unsolveTask(task);
        });

    program
        .command("clear")
        .description("Clear all tasks")
        .action(() => {
            clearTasks();
        });
	
	program
		.command("delete")
		.description("Delete a particular task")
		.argument("<string>", "Task name (or part of it)")
		.action((task) => {
			deleteTask(task);
		})

    program
        .command("edit <old> <new>")
        .description("Edit a task name")
        .action((oldTask, newTask) => {
            editTask(oldTask, newTask);
        })

    program.parse();
});
