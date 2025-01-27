const taskCoveData = JSON.parse(localStorage.getItem("taskCoveData")) || [];

// Form Data function
const formData = () => {
  const title = document.getElementById("taskTitle").value;
  const description = document.getElementById("taskDescription").value;
  const priority = document.getElementById("taskPriority").value;
  
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
const addTask = (task) => {
  taskCoveData.push(task);
  localStorage.setItem("taskCoveData", JSON.stringify(taskCoveData));
  displayTasks();
};

// Remove task by id
const removeTaskById = (id) => {
  const taskIndex = taskCoveData.findIndex((task) => task.id === id);
  if (taskIndex !== -1) {
    taskCoveData.splice(taskIndex, 1);
    localStorage.setItem("taskCoveData", JSON.stringify(taskCoveData));
    displayTasks();
  }
};

// Update task by id using prompt
const updateTaskById = (id) => {
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
      task.title = newTitle;
      task.description = newDescription;
      task.priority = newPriority;

      // Save updated task in localStorage
      localStorage.setItem("taskCoveData", JSON.stringify(taskCoveData));

      // Re-display tasks
      displayTasks();
    } else {
      alert("All fields are required to update the task.");
    }
  }
};

// Mark task as done or not done
const toggleDone = (id) => {
  const task = taskCoveData.find((task) => task.id === id);
  if (task) {
    task.done = !task.done; // Toggle the done status
    localStorage.setItem("taskCoveData", JSON.stringify(taskCoveData));
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

  addTask(taskFormData);

  // Reset form
  document.getElementById("taskForm").reset();
});

// Initial task load
displayTasks();
