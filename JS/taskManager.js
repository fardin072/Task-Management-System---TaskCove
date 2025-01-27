const taskCoveData = JSON.parse(localStorage.getItem("taskCoveData")) || [];

// Form Data function
const formData = () => {
  const title = document.getElementById("taskTitle").value;
  const description = document.getElementById("taskDescription").value;
  const priority = document.getElementById("taskPriority").value;
  const formData = {
    id: taskCoveData.length + 1,
    title,
    description,
    priority,
  };
  return formData;
};

// All Form Data Collection
const oneFormData = (oneData) => {
  taskCoveData.push(oneData);
};

// Event handler - submit button
document.getElementById("taskForm").addEventListener("submit", (e) => {
  e.preventDefault();

  // Collect form data
  const taskFormData = formData();

  // Add form data to the array
  oneFormData(taskFormData);

  // Save updated array to localStorage
  localStorage.setItem("taskCoveData", JSON.stringify(taskCoveData));

  // Log updated localStorage data
  const savedTasks = JSON.parse(localStorage.getItem("taskCoveData"));
  console.log("Retrieved Tasks from localStorage:", savedTasks);

  // Optional: Clear form inputs after submission
  document.getElementById("taskForm").reset();
});
