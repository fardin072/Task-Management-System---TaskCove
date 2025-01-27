const taskCoveData = JSON.parse(localStorage.getItem("taskCoveData")) || [];

// Simulate async data storage with Promises
const asyncSetItem = (key, value) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem(key, value);
      resolve();
    }, 100);  // Simulating some delay (e.g., a backend call)
  });
};

const asyncGetItem = (key) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(localStorage.getItem(key));
    }, 100);  // Simulating some delay
  });
};

// Form Data function with title uniqueness check
const formData = () => {
  const title = document.getElementById("taskTitle").value;
  const description = document.getElementById("taskDescription").value;
  const priority = document.getElementById("taskPriority").value;

  // Check if the title already exists in the task array
  const existingTask = taskCoveData.find((task) => task.title === title);
  if (existingTask) {
    alert("Task title must be unique! This title already exists.");
    return null;  // Return null to prevent task from being added
  }

  // Create a unique ID using timestamp and random number
  const uniqueId = Date.now() + Math.floor(Math.random() * 1000);

  const formData = {
    id: uniqueId,  // Use the unique ID
    title,
    description,
    priority,
    done: false,  // Added done field
  };

  return formData;
};

// Add task to array
const addTask = async (task) => {
  if (task) {
    taskCoveData.push(task);
    await asyncSetItem("taskCoveData", JSON.stringify(taskCoveData)); // Async saving
    displayTasks();
  }
};

// Remove task by id
const removeTaskById = async (id) => {
  const taskIndex = taskCoveData.findIndex((task) => task.id === id);
  if (taskIndex !== -1) {
    taskCoveData.splice(taskIndex, 1);
    await asyncSetItem("taskCoveData", JSON.stringify(taskCoveData)); // Async saving
    displayTasks();
  }
};

// Update task by id using prompt
const updateTaskById = async (id) => {
  const task = taskCoveData.find((task) => task.id === id);
  if (task) {
    // Prompt for new task details
    const newTitle = prompt("Enter new task title:", task.title);
    const newDescription = prompt("Enter new task description:", task.description);
    const newPriority = prompt(
      "Enter new task priority (low, medium, high):",
      task.priority
    );

    // Validate and update the task
    if (newTitle && newDescription && newPriority) {
      // Check if the new title already exists
      const existingTask = taskCoveData.find((task) => task.title === newTitle);
      if (existingTask) {
        alert("Task title must be unique! This title already exists.");
        return;  // Prevent updating the task if the title is not unique
      }

      task.title = newTitle;
      task.description = newDescription;
      task.priority = newPriority;

      // Save updated task in localStorage
      await asyncSetItem("taskCoveData", JSON.stringify(taskCoveData)); // Async saving

      // Re-display tasks
      displayTasks();
    } else {
      alert("All fields are required to update the task.");
    }
  }
};

// Mark task as done or not done
const toggleDone = async (id) => {
  const task = taskCoveData.find((task) => task.id === id);
  if (task) {
    task.done = !task.done; // Toggle the done status
    await asyncSetItem("taskCoveData", JSON.stringify(taskCoveData)); // Async saving
    displayTasks(); // Re-display tasks with updated status
  }
};

// Display all tasks in task list
const displayTasks = () => {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = ""; // Clear the current task list

  taskCoveData.forEach((task) => {
    const taskElement = document.createElement("div");
    taskElement.classList.add("task");

    taskElement.innerHTML = `
    <div style="background-color: #f4f4f4; text-align:center; box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2), -4px -4px 10px rgba(255, 255, 255, 0.5); border-radius: 4px; max-width: full; padding: 20px; margin-bottom:10px;">
    <div>
        <p style="font-size: 1.3em; font-weight:600; color:#4CAF50">${task.title}</p>
        <p style="font-size: .8em">${task.description}</p>
        <p style="font-size: 1em" class="priority ${task.priority}">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority</p>
        <p style="font-size: 1em; color: ${task.done ? 'green' : 'red'}">${task.done ? 'Done' : 'Not Done'}</p>
      </div>
      <button style="
      margin-left: 10px;
      padding: 5px 10px;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      background-color: orange;
      color: white;
      " onclick="updateTaskById(${task.id})">Update</button>
      <button style="
      margin-left: 10px;
      padding: 5px 10px;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      background-color: #f44336;
      color: white;
      " onclick="removeTaskById(${task.id})">Remove</button>
      <button style="
      margin-left: 10px;
      padding: 5px 10px;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      background-color: ${task.done ? 'gray' : 'green'};
      color: white;
      " onclick="toggleDone(${task.id})">${task.done ? 'Undo' : 'Mark Done'}</button>
    </div>
    `;

    taskList.appendChild(taskElement);
  });
};

// Event handler - submit button
document.getElementById("taskForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const taskFormData = formData();

  if (taskFormData) {
    addTask(taskFormData);
  }

  // Reset form
  document.getElementById("taskForm").reset();
});

// Initial task load (async)
const loadTasks = async () => {
  const savedTasks = await asyncGetItem("taskCoveData");
  if (savedTasks) {
    taskCoveData.push(...JSON.parse(savedTasks));
  }
  displayTasks();
};

loadTasks();
