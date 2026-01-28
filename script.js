// DOM Elements
const form = document.getElementById("studentForm");
const tableBody = document.getElementById("tableBody");
const msg = document.getElementById("msg");
const clearBtn = document.getElementById("clearBtn");
const emptyText = document.getElementById("emptyText");

// Load students from local storage
function loadStudents() {
  const data = localStorage.getItem("students");
  return data ? JSON.parse(data) : [];
}

// Save students to local storage
function saveStudents(students) {
  localStorage.setItem("students", JSON.stringify(students));
}

// Function to show messages with auto-hide
function showMessage(text, color) {
  msg.innerText = text;
  msg.style.color = color;
  
  // Hide message after 2 seconds
  setTimeout(() => {
    msg.innerText = "";
  }, 2000);
}

// Render Table Function
function renderStudents() {
  const students = loadStudents();
  tableBody.innerHTML = "";
 
  // Toggle 'No Data' message
  if (students.length === 0) {
    emptyText.style.display = "block";
    return;
  } else {
    emptyText.style.display = "none";
  }

  // Create table rows
  students.forEach((student, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${student.name}</td>
      <td>${student.roll}</td>
      <td>${student.course}</td>
      <td>${student.gender}</td>
      <td><button class="delete-btn" data-id="${student.id}">Delete</button></td>
    `;
    tableBody.appendChild(tr);
  });

  // Attach event listeners to delete buttons
  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", function() {
      const id = Number(this.getAttribute("data-id"));
      deleteStudent(id);
    });
  });
}

// Delete Student Function
function deleteStudent(id) {
  let students = loadStudents();
  
  // Filter out the student with the matching ID
  students = students.filter((student) => student.id !== id);
  
  saveStudents(students);
  renderStudents();
  showMessage("Student deleted", "#FF0000");
}

// Add Student (Form Submit)
form.addEventListener("submit", function(e) {
  e.preventDefault();
 
  // Get input values
  const name = document.getElementById("name").value.trim();
  const roll = document.getElementById("roll").value.trim();
  const course = document.getElementById("course").value;
  const genderInputs = document.querySelector("input[name='gender']:checked");
  const gender = genderInputs ? genderInputs.value : "";

  // Validation: Check if fields are empty
  if (!name || !roll || !course || !gender) {
    showMessage("Please fill in all fields", "red");
    return;
  }

  const students = loadStudents();
  
  // Validation: Check for duplicate Roll Number
  const rollExists = students.some((student) => student.roll === roll);
 
  if (rollExists) {
    showMessage("Roll number already exists", "red");
    return;
  }

  // Create new student object
  const newStudent = {
    id: Date.now(),
    name,
    roll,
    course,
    gender
  };

  // Add and save
  students.push(newStudent);
  saveStudents(students);
  renderStudents();
  
  // Reset form and show success message
  form.reset();
  showMessage("Student added successfully", "green");
});

// Clear All Data
clearBtn.addEventListener("click", function() {
  if (confirm("Are you sure you want to clear all students?")) {
    saveStudents([]);
    renderStudents();
    showMessage("All students cleared", "#FF0000");
  }
});

// Initial Render
renderStudents();