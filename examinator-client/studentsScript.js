const userIcon = document.getElementById("userIcon");
const dropdownMenu = document.getElementById("dropdownMenu");

const studentDialog = document.getElementById("studentDialog");
const openDialogBtn = document.getElementById("addStudentBtn");
const closeDialogBtn = document.getElementById("closeStudentDialog");
const cancelDialogBtn = document.querySelector(".cancel-btn");
const studentForm = document.getElementById("studentForm");

const schoolYearSelect = document.getElementById("schoolYear");
const subjectInput = document.getElementById("subject");

const studentsContainer = document.getElementById("studentsContainer");
const searchInput = document.getElementById("searchInput");
const importBtn = document.getElementById("importStudents");

const paginationWrapper = document.getElementById("paginationWrapper");
const paginationControls = document.getElementById("paginationControls");
const paginationInfo = document.getElementById("paginationInfo");
const rowsPerPageSelect = document.getElementById("rowsPerPage");

let allStudents = [];
let sortDirection = {};
let currentPage = 1;
let rowsPerPage = +rowsPerPageSelect.value;

// Meni korisnika
userIcon.addEventListener("click", () => {
  dropdownMenu.classList.toggle("show");
});
document.addEventListener("click", (e) => {
  if (!userIcon.contains(e.target)) {
    dropdownMenu.classList.remove("show");
  }
});

// Popuni školsku godinu
function populateSchoolYears() {
  const today = new Date();
  let year = today.getFullYear();
  const month = today.getMonth();
  if (month >= 9) year += 1;

  for (let i = 0; i < 10; i++) {
    const start = year - i;
    const end = start + 1;
    const option = document.createElement("option");
    option.value = `${start}/${end}`;
    option.textContent = `${start}/${end}`;
    if (i === 0) option.selected = true;
    schoolYearSelect.appendChild(option);
  }
}
populateSchoolYears();

// Otvori file explorer
importBtn.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".csv, .txt";
  input.click();
  input.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Fajl:", file.name);
    }
  });
});

// Otvaranje dialoga
openDialogBtn.addEventListener("click", () => {
  studentForm.reset();
  delete studentDialog.dataset.editIndex;
  studentDialog.querySelector("h3").textContent = "Dodavanje studenta na predmet";
  studentDialog.showModal();
});
closeDialogBtn.addEventListener("click", () => studentDialog.close());
cancelDialogBtn.addEventListener("click", () => studentDialog.close());

// Dodavanje/izmjena
studentForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(studentForm);
  const student = {
    ime: formData.get("ime").trim(),
    prezime: formData.get("prezime").trim(),
    indeks: formData.get("indeks") || "",
    grupa: formData.get("grupa") || "",
    napomena: formData.get("napomena") || ""
  };

  const editIndex = studentDialog.dataset.editIndex;
  if (editIndex !== undefined) {
    allStudents[+editIndex] = student;
    delete studentDialog.dataset.editIndex;
  } else {
    allStudents.push(student);
  }

  renderTable();
  studentDialog.close();
});

// Pretraga
searchInput.addEventListener("input", () => {
  currentPage = 1;
  renderTable();
});

// Filter
function filterStudents() {
  const term = searchInput.value.toLowerCase();
  return allStudents.filter(s =>
    s.ime.toLowerCase().includes(term) ||
    s.prezime.toLowerCase().includes(term) ||
    s.indeks.toLowerCase().includes(term) ||
    s.grupa.toLowerCase().includes(term)
  );
}

// Prazna poruka
function showNoStudentsMessage() {
  studentsContainer.innerHTML = `<p class="no-data">Trenutno nema ni jednog studenta na predmetu</p>`;
  paginationWrapper.classList.add("hidden");
}

// Sort
function sortirajPo(kolona) {
  sortDirection[kolona] = !sortDirection[kolona];
  allStudents.sort((a, b) => {
    if (a[kolona] < b[kolona]) return sortDirection[kolona] ? -1 : 1;
    if (a[kolona] > b[kolona]) return sortDirection[kolona] ? 1 : -1;
    return 0;
  });
  renderTable();
}

// Tabela
function renderTable() {
  const filtrirani = filterStudents();

  if (filtrirani.length === 0) {
    showNoStudentsMessage();
    return;
  }

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const prikazani = filtrirani.slice(start, end);

  let table = document.createElement("table");
  table.innerHTML = `
    <thead>
      <tr>
        <th data-kolona="indeks">Indeks</th>
        <th data-kolona="ime">Ime</th>
        <th data-kolona="prezime">Prezime</th>
        <th data-kolona="grupa">Grupa</th>
        <th data-kolona="napomena">Napomena</th>
        <th class="action-column">Akcija</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = table.querySelector("tbody");
  prikazani.forEach(s => {
    const globalIndex = allStudents.indexOf(s);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${s.indeks}</td>
      <td>${s.ime}</td>
      <td>${s.prezime}</td>
      <td>${s.grupa}</td>
      <td>${s.napomena}</td>
      <td>
        <span class="material-icons edit" data-index="${globalIndex}">edit</span>
        <span class="material-icons delete" data-index="${globalIndex}">delete</span>
      </td>
    `;
    tbody.appendChild(row);
  });

  studentsContainer.innerHTML = "";
  studentsContainer.appendChild(table);
  renderPagination(filtrirani.length);

  table.querySelectorAll("th[data-kolona]").forEach(th => {
    th.addEventListener("click", () => sortirajPo(th.dataset.kolona));
  });
}

// Paginacija
function renderPagination(total) {
  const totalPages = Math.ceil(total / rowsPerPage);
  paginationWrapper.classList.toggle("hidden", total < 10);

  paginationInfo.textContent = `${currentPage} / ${totalPages}`;
  paginationControls.innerHTML = "";

  const icon = (name, action, disabled = false) => {
    const el = document.createElement("span");
    el.className = "material-icons";
    el.textContent = name;
    el.style.cursor = disabled ? "default" : "pointer";
    if (!disabled) el.addEventListener("click", action);
    return el;
  };

  paginationControls.appendChild(icon("first_page", () => { currentPage = 1; renderTable(); }, currentPage === 1));
  paginationControls.appendChild(icon("navigate_before", () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
    }
  }, currentPage === 1));

  paginationControls.appendChild(paginationInfo);

  paginationControls.appendChild(icon("navigate_next", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderTable();
    }
  }, currentPage === totalPages));
  paginationControls.appendChild(icon("last_page", () => {
    currentPage = totalPages;
    renderTable();
  }, currentPage === totalPages));
}

// Izmena i brisanje
studentsContainer.addEventListener("click", (e) => {
  const index = +e.target.dataset.index;
  if (e.target.classList.contains("delete")) {
    allStudents.splice(index, 1);
    renderTable();
  }
  if (e.target.classList.contains("edit")) {
    const s = allStudents[index];
    studentForm.elements["ime"].value = s.ime;
    studentForm.elements["prezime"].value = s.prezime;
    studentForm.elements["indeks"].value = s.indeks;
    studentForm.elements["grupa"].value = s.grupa;
    studentForm.elements["napomena"].value = s.napomena;
    studentDialog.dataset.editIndex = index;
    studentDialog.querySelector("h3").textContent = "Izmena podataka studenta";
    studentDialog.showModal();
  }
});

// Promena broja redova po stranici
rowsPerPageSelect.addEventListener("change", function () {
  rowsPerPage = +this.value;
  currentPage = 1;
  renderTable();
});

// Učitaj naziv predmeta i renderuj
window.addEventListener("DOMContentLoaded", () => {
  const selectedSubject = localStorage.getItem("selectedSubject");
  if (selectedSubject && subjectInput) subjectInput.value = selectedSubject;
  renderTable();
});

// Tooltip
document.querySelectorAll('button[data-tooltip]').forEach(button => {
  let timeout;
  button.addEventListener('mouseenter', () => {
    timeout = setTimeout(() => button.classList.add('show-tooltip'), 300);
  });
  button.addEventListener('mouseleave', () => {
    clearTimeout(timeout);
    button.classList.remove('show-tooltip');
  });
});