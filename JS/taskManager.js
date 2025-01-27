// Retrieve data from localStorage with error handling
let taskCoveData = [];
try {
    const storedData = localStorage.getItem("taskCoveData");
    taskCoveData = storedData ? JSON.parse(storedData) : [];
} catch (error) {
    console.error("Error loading task data from localStorage:", error);
}

// Form Data function with error handling
const formData = () => {
    try {
        const title = document.getElementById("taskTitle").value;
        const description = document.getElementById("taskDescription").value;
        const priority = document.getElementById("taskPriority").value;
        const dueDate = document.getElementById("taskDueDate").value;

        // Ensure that title and description are not empty
        if (!title || !description) {
            throw new Error("Title and description are required.");
        }

        const formData = {
            id: Date.now(), // Ensure unique IDs by using Date.now()
            title,
            description,
            priority,
            dueDate,
            done: false // Default to not done
        };
        return formData;
    } catch (error) {
        console.error("Error creating task data:", error);
        alert("An error occurred while creating the task. Please check the inputs.");
    }
};

// Add task to array with error handling
const addTask = (task) => {
    try {
        taskCoveData.push(task);
        localStorage.setItem("taskCoveData", JSON.stringify(taskCoveData));
        displayTasks();
    } catch (error) {
        console.error("Error adding task to localStorage:", error);
        alert("An error occurred while adding the task.");
    }
};

// Remove task by id with error handling
const removeTaskById = (id) => {
    try {
        const taskIndex = taskCoveData.findIndex((task) => task.id === id);
        if (taskIndex !== -1) {
            taskCoveData.splice(taskIndex, 1);
            localStorage.setItem("taskCoveData", JSON.stringify(taskCoveData));
            displayTasks();
        }
    } catch (error) {
        console.error("Error removing task:", error);
        alert("An error occurred while removing the task.");
    }
};

// Update task by id using prompt with error handling
const updateTaskById = (id) => {
    try {
        const task = taskCoveData.find((task) => task.id === id);
        if (task) {
            // Prompt for new task details
            const newTitle = prompt("Enter new task title:", task.title);
            const newDescription = prompt("Enter new task description:", task.description);

            if (newTitle && newDescription) {
                // Update the task
                task.title = newTitle;
                task.description = newDescription;

                // Save updated task in localStorage
                localStorage.setItem("taskCoveData", JSON.stringify(taskCoveData));

                // Re-display tasks
                displayTasks();
            }
        }
    } catch (error) {
        console.error("Error updating task:", error);
        alert("An error occurred while updating the task.");
    }
};

// Toggle task done status with error handling
const toggleDone = (id) => {
    try {
        const task = taskCoveData.find((task) => task.id === id);
        if (task) {
            task.done = !task.done; // Toggle the done status
            localStorage.setItem("taskCoveData", JSON.stringify(taskCoveData));
            displayTasks();
        }
    } catch (error) {
        console.error("Error toggling task done status:", error);
        alert("An error occurred while updating the task status.");
    }
};

// Display all tasks in task list with error handling
const displayTasks = () => {
    try {
        const taskList = document.getElementById("taskList");
        taskList.innerHTML = ""; // Clear the current task list

        if (taskCoveData.length === 0) {
            // If the task list is empty, display a message
            const emptyMessage = document.createElement("div");
            emptyMessage.classList.add("empty-message");

            emptyMessage.innerHTML = `
                <p style="font-size: 1.5em; font-weight: bold; color: #ff6347;">No tasks available!</p>
                <p style="color: #888;">Please add a task to get started.</p>
            `;

            taskList.appendChild(emptyMessage);
        } else {
            // Filter and search tasks
            let filteredTasks = [...taskCoveData];
            const filterPriority = document.getElementById("filterPriority").value;
            const filterStatus = document.getElementById("filterStatus").value;
            const searchInput = document.getElementById("searchInput").value.toLowerCase();

            if (filterPriority) {
                filteredTasks = filteredTasks.filter(task => task.priority === filterPriority);
            }

            if (filterStatus) {
                const isDone = filterStatus === "done";
                filteredTasks = filteredTasks.filter(task => task.done === isDone);
            }

            if (searchInput) {
                filteredTasks = filteredTasks.filter(task => 
                    task.title.toLowerCase().includes(searchInput) || 
                    task.description.toLowerCase().includes(searchInput)
                );
            }

            filteredTasks.forEach((task) => {
                const taskElement = document.createElement("div");
                taskElement.classList.add("task");

                taskElement.innerHTML = `
                    <div style="background-color: #f4f4f4; text-align:center; box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2), -4px -4px 10px rgba(255, 255, 255, 0.5); border-radius: 4px; max-width: full; padding: 20px; margin-bottom:10px;">
                    <div>
                        <p style="font-size: 1.3em; font-weight:600; color:#4CAF50">${task.title}</p>
                        <p style="font-size: .8em">${task.description}</p>
                        <p style="font-size: 1em" class="priority ${task.priority}">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority</p>
                        <p style="font-size: .9em; color: gray;">Due Date: ${task.dueDate}</p>
                        <p style="font-size: 1em; color: ${task.done ? 'green' : 'red'}">${task.done ? 'Done' : 'Not Done'}</p>
                    </div>
                    <button style="margin-left: 10px; padding: 5px 10px; border: none; border-radius: 3px; cursor: pointer; background-color: orange; color: white;" onclick="updateTaskById(${task.id})">Update</button>
                    <button style="margin-left: 10px; padding: 5px 10px; border: none; border-radius: 3px; cursor: pointer; background-color: #f44336; color: white;" onclick="removeTaskById(${task.id})">Remove</button>
                    <button style="margin-left: 10px; padding: 5px 10px; border: none; border-radius: 3px; cursor: pointer; background-color: ${task.done ? 'gray' : 'green'}; color: white;" onclick="toggleDone(${task.id})">${task.done ? 'Undo' : 'Mark Done'}</button>
                    </div>
                `;

                taskList.appendChild(taskElement);
            });
        }
    } catch (error) {
        console.error("Error displaying tasks:", error);
        alert("An error occurred while displaying the tasks.");
    }
};

// Event handler - submit button
document.getElementById("taskForm").addEventListener("submit", (e) => {
    e.preventDefault();

    try {
        const taskFormData = formData();

        // Check if the task title already exists
        if (taskCoveData.some(task => task.title === taskFormData.title)) {
            alert("A task with this title already exists!");
            return;
        }

        addTask(taskFormData);

        // Reset form
        document.getElementById("taskForm").reset();
    } catch (error) {
        console.error("Error handling task form submission:", error);
        alert("An error occurred while submitting the form.");
    }
});

// Sorting functionality with error handling
document.getElementById("sortByPriority").addEventListener("click", () => {
    try {
        taskCoveData.sort((a, b) => {
            const priorityOrder = ["low", "medium", "high"];
            return priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority);
        });
        localStorage.setItem("taskCoveData", JSON.stringify(taskCoveData));
        displayTasks();
    } catch (error) {
        console.error("Error sorting tasks by priority:", error);
        alert("An error occurred while sorting tasks by priority.");
    }
});

document.getElementById("sortByDueDate").addEventListener("click", () => {
    try {
        taskCoveData.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        localStorage.setItem("taskCoveData", JSON.stringify(taskCoveData));
        displayTasks();
    } catch (error) {
        console.error("Error sorting tasks by due date:", error);
        alert("An error occurred while sorting tasks by due date.");
    }
});

// Initial task load with error handling
try {
    displayTasks();
} catch (error) {
    console.error("Error loading initial tasks:", error);
    alert("An error occurred while loading the tasks.");
}
