// Course data + rendering/filtering
// Replace 'completed: true/false' according to your progress.
// You may also replace this array with the official one provided by the course.
const courses = [
  { subject: 'WDD', number: 130, title: 'Web Fundamentals', credits: 1, completed: true },
  { subject: 'WDD', number: 131, title: 'Dynamic Web Fundamentals', credits: 2, completed: false },
  { subject: 'WDD', number: 231, title: 'Front-End Development II', credits: 2, completed: false },
  { subject: 'CSE', number: 110, title: 'Introduction to Programming', credits: 2, completed: true },
  { subject: 'CSE', number: 111, title: 'Programming with Functions', credits: 2, completed: false },
  { subject: 'CSE', number: 210, title: 'Programming with Classes', credits: 2, completed: false }
];

const grid = document.getElementById('courses');
const totalEl = document.getElementById('credits-total');
const filterButtons = document.querySelectorAll('.filters .chip');

function render(list) {
  grid.innerHTML = '';
  list.forEach(c => {
    const card = document.createElement('div');
    card.className = 'course' + (c.completed ? ' completed' : '');
    const left = document.createElement('div');
    const right = document.createElement('div');
    left.innerHTML = `<strong>${c.subject} ${c.number}</strong><div class="meta">${c.title}</div>`;
    right.innerHTML = `<span class="badge">${c.credits} cr</span>`;
    card.append(left, right);
    grid.append(card);
  });
  const credits = list.reduce((sum, c) => sum + (c.credits || 0), 0);
  totalEl.textContent = credits;
}

function applyFilter(kind) {
  let subset = courses;
  if (kind === 'WDD') subset = courses.filter(c => c.subject === 'WDD');
  if (kind === 'CSE') subset = courses.filter(c => c.subject === 'CSE');
  render(subset);
}

// Button state handling
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => {
      b.classList.remove('is-pressed');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('is-pressed');
    btn.setAttribute('aria-pressed', 'true');
    applyFilter(btn.dataset.filter === 'all' ? 'all' : btn.dataset.filter);
  });
});

// Initial render
render(courses);
