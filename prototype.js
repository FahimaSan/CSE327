/***********************
  TIMESLOT DEFINITIONS
************************/
const TIMESLOTS = {
  ST1: { days: ["Sun", "Tue"], start: "08:00", end: "09:30" },
  MW2: { days: ["Mon", "Wed"], start: "09:40", end: "11:10" },
  RA3: { days: ["Thu"], start: "11:20", end: "12:50" }
};

/***********************
  DATABASE SIMULATION
************************/
function getCourses() {
  return JSON.parse(localStorage.getItem("courses")) || [];
}

function saveCourses(courses) {
  localStorage.setItem("courses", JSON.stringify(courses));
}

/***********************
  CONFLICT DETECTION
************************/
function hasConflict(newCourse) {
  const courses = getCourses();

  for (let c of courses) {

    // Rule 4: Duplicate class
    if (
      c.courseCode === newCourse.courseCode &&
      c.section === newCourse.section &&
      c.timeslot === newCourse.timeslot
    ) {
      return "Duplicate class entry detected.";
    }

    // Rule 1: Instructor-time conflict
    if (
      c.instructor === newCourse.instructor &&
      c.timeslot === newCourse.timeslot
    ) {
      return "Instructor is already assigned in this timeslot.";
    }

    // Rule 2: Room-time conflict
    if (
      c.room === newCourse.room &&
      c.timeslot === newCourse.timeslot
    ) {
      return "Room is already booked in this timeslot.";
    }
  }

  // Rule 3: Lab room mismatch
  if (
    newCourse.courseType === "LAB" &&
    newCourse.roomType === "THEORY"
  ) {
    return "Lab course cannot be assigned to a theory room.";
  }

  return null;
}

/***********************
  ADD COURSE
************************/
function addCourse(event) {
  event.preventDefault();

  const newCourse = {
    courseCode: document.getElementById("courseCode").value,
    section: document.getElementById("section").value,
    instructor: document.getElementById("instructor").value,
    courseType: document.getElementById("courseType").value,
    room: document.getElementById("room").value,
    roomType: document.getElementById("roomType").value,
    timeslot: document.getElementById("timeslot").value
  };

  const conflictMessage = hasConflict(newCourse);

  if (conflictMessage) {
    localStorage.setItem("conflictMessage", conflictMessage);
    localStorage.setItem("conflictCourse", JSON.stringify(newCourse));
    window.location.href = "conflict_screen_cse327.html";
    return;
  }

  const courses = getCourses();
  courses.push(newCourse);
  saveCourses(courses);

  alert("Course added successfully!");
  window.location.href = "view_courses_cse327.html";
}

/***********************
  VIEW COURSES
************************/
function loadCourses() {
  const table = document.getElementById("courseTableBody");
  if (!table) return;

  const courses = getCourses();
  table.innerHTML = "";

  courses.forEach(c => {
    table.innerHTML += `
      <tr>
        <td>${c.courseCode}</td>
        <td>${c.section}</td>
        <td>${c.instructor}</td>
        <td>${c.timeslot}</td>
        <td>${c.room}</td>
      </tr>
    `;
  });
}

/***********************
  CONFLICT SCREEN
************************/
function loadConflict() {
  const msg = localStorage.getItem("conflictMessage");
  const el = document.getElementById("conflictText");
  if (el) el.innerText = msg;
}

window.onload = function () {
  loadCourses();
  loadConflict();
};
