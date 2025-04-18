const courses = [
    { id: 1, name: "WDD 230", title: "Web Frontend Development", type: "WDD", completed: true },
    { id: 2, name: "CSE 121b", title: "JavaScript Programming", type: "CSE", completed: false },
    { id: 3, name: "WDD 231", title: "Advanced CSS", type: "WDD", completed: false },
];

function displayCourses(courseList) {
    const container = document.getElementById("courses-container");
    container.innerHTML = "";

    courseList.forEach(course => {
        const courseCard = document.createElement("div");
        courseCard.className = "course-card";
        if (course.completed) courseCard.classList.add("completed");

        courseCard.innerHTML = `<h3>${course.name}</h3><p>${course.title}</p>`;
        container.appendChild(courseCard);
    });
}

function filterCourses(type) {
    if (type === "all") {
        displayCourses(courses);
    } else {
        const filtered = courses.filter(course => course.type === type);
        displayCourses(filtered);
    }
}

// Initial display
document.addEventListener("DOMContentLoaded", () => {
    displayCourses(courses);
});

function updateCredits() {
    const totalCredits = courses.reduce((sum, course) => sum + (course.credits || 0), 0);
    document.getElementById("total-credits").textContent = `Total Credits: ${totalCredits}`;
}

document.addEventListener("DOMContentLoaded", () => {
    displayCourses(courses);
    updateCredits();
});
