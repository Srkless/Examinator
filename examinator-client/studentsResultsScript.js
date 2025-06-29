const userIcon = document.getElementById("userIcon");
const dropdownMenu = document.getElementById("dropdownMenu");
const schoolYearSelect = document.getElementById("schoolYear");
const subjectInput = document.getElementById("subject");

const studentOptions = document.querySelectorAll('.student-option');
const activityOptions = document.querySelectorAll('.activity-option');
const formulaOptions = document.querySelectorAll('.formula-option');
const studentSourceRadios = document.querySelectorAll('input[name="studentSource"]');
const columnDisplay = document.getElementById('selectedColumns');
const generateBtn = document.getElementById('generateBtn');
const tableContainer = document.getElementById('tableContainer');
const exportBtn = document.getElementById('exportBtn');
const copyBtn = document.getElementById('copyBtn');

const paginationWrapper = document.getElementById("paginationWrapper");
const paginationControls = document.getElementById("paginationControls");
const paginationInfo = document.getElementById("paginationInfo");
const rowsPerPageSelect = document.getElementById("rowsPerPage");

const alertBox = document.getElementById("missingStudentsAlert");
const alertMessage = document.getElementById("missingStudentsMessage");
const closeAlert = document.querySelector(".close-alert");

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

let selectedColumns = [];
let sortDirection = {};
let currentPage = 1;
let rowsPerPage = +rowsPerPageSelect.value;
let allStudents = [];

// Otvaranje fajl sistema ako se izabere fajl unos
studentSourceRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.value === 'fajl') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.csv, .txt';
      input.click();
      input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          console.log("Fajl izabran:", file.name);
        }
      });
    }
  });
});

// Funkcija za ažuriranje prikaza kolona
function updateSelectedColumns() {
  selectedColumns = [];

  [...studentOptions, ...activityOptions, ...formulaOptions].forEach(checkbox => {
    if (checkbox.checked) {
      const labelText = checkbox.parentElement.textContent.trim();
      selectedColumns.push(labelText);
}

  });
  const columnList = document.getElementById('columnList');
  columnList.textContent = selectedColumns.length ? selectedColumns.join(', ') : '';
}


// Dodaj event listener za sve checkboxove
[...studentOptions, ...activityOptions, ...formulaOptions].forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    const labelText = checkbox.parentElement.textContent.trim();

    if (checkbox.checked) {
      // Dodaj samo ako već nije tu
      if (!selectedColumns.includes(labelText)) {
        selectedColumns.push(labelText);
      }
    } else {
      // Ukloni iz niza ako je odčekirano
      selectedColumns = selectedColumns.filter(col => col !== labelText);
    }

    const columnList = document.getElementById('columnList');
    columnList.textContent = selectedColumns.length ? selectedColumns.join(', ') : '';
  });
});


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

// Prazna poruka
function showNoStudentsMessage() {
  studentsContainer.innerHTML = `<p class="no-data">Izaberite kolone koje želite da imate u tabeli</p>`;
  paginationWrapper.classList.add('hidden');
}

// Funkcija za renderovanje tabele
function renderTable() {
  if (!selectedColumns.length) {
    showNoStudentsMessage();
    return;
  }
  // uklanjanje poruke kada se generise tabela
  const noDataEl = document.querySelector('.no-data');
  if (noDataEl) noDataEl.remove();

  allStudents = studentsData;

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const prikazani = allStudents.slice(start, end);

  const table = document.createElement("table");

  // Generiši zaglavlje
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  selectedColumns.forEach(col => {
    const th = document.createElement("th");
    th.textContent = col;
    th.dataset.kolona = col;
    th.style.cursor = "pointer";
    th.addEventListener("click", () => sortirajPo(col));
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Generiši tijelo tabele
  const tbody = document.createElement("tbody");

  prikazani.forEach(student => {
    const row = document.createElement("tr");
    selectedColumns.forEach(col => {
      const td = document.createElement("td");
      td.textContent = student[col] || '';
      row.appendChild(td);
    });
    tbody.appendChild(row);
  });

  table.appendChild(tbody);

  // Postavi tabelu u DOM
  tableContainer.innerHTML = "";
  tableContainer.appendChild(table);

  exportBtn.style.display = 'inline-block';
  copyBtn.style.display = 'inline-block';

  renderPagination(allStudents.length);
}

// Generisanje
generateBtn.addEventListener('click', () => {
  currentPage = 1;
  renderTable();
});


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


// Promena broja redova po stranici
rowsPerPageSelect.addEventListener("change", function () {
  rowsPerPage = +this.value;
  currentPage = 1;
  renderTable();
});


// Dugmad za eksport i kopiranje (samo simulacija)
document.getElementById('exportBtn').addEventListener('click', () => {
  alert('Export funkcionalnost nije implementirana.');
});
document.getElementById('copyBtn').addEventListener('click', () => {
  alert('Podaci su kopirani u clipboard (simulacija).');
});

// Učitaj naziv predmeta i renderuj
window.addEventListener("DOMContentLoaded", () => {
  const selectedSubject = localStorage.getItem("selectedSubject");
  if (selectedSubject && subjectInput) subjectInput.value = selectedSubject;
  renderTable();
});


// podaci za simulaciju studenata
const studentsData = Array.from({ length: 50 }, (_, i) => ({
  Indeks: `20${i + 1}/23`,
  Ime: `Ime${i + 1}`,
  Prezime: `Prezime${i + 1}`,
  Grupa: `G${i % 3 + 1}`,
  Napomena: `Napomena ${i + 1}`,
  K1: Math.floor(Math.random() * 20),
  K2: Math.floor(Math.random() * 20),
  LAB: Math.floor(Math.random() * 10),
  PD: Math.floor(Math.random() * 10),
  Kolokvijumi: Math.floor(Math.random() * 40),
}));


// Kreiranje checkbox-ova za formule i aktivnosti koje ce se uzimati iz baze
function createCheckbox(labelText, container) {
  const label = document.createElement("label");
  label.classList.add("checkbox-label");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("dynamic-checkbox");

  label.appendChild(checkbox);
  label.appendChild(document.createTextNode(" " + labelText));
  container.appendChild(label);

  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      if (!selectedColumns.includes(labelText)) {
        selectedColumns.push(labelText);
      }
    } else {
      selectedColumns = selectedColumns.filter(col => col !== labelText);
    }

    const columnList = document.getElementById('columnList');
    columnList.textContent = selectedColumns.length ? selectedColumns.join(', ') : '';
  });
}


// formule i aktivnosti iz baze
document.addEventListener("DOMContentLoaded", () => {
  const aktivnostiIzBaze = ['K1', 'K2', 'LAB'];
  const formuleIzBaze = ['PD', 'Kolokvijumi'];

  const activityOptionsContainer = document.getElementById("activityOptionsContainer");
  const formulaOptionsContainer = document.getElementById("formulaOptionsContainer");

  aktivnostiIzBaze.forEach(aktivnost => {
    createCheckbox(aktivnost, activityOptionsContainer);
  });

  formuleIzBaze.forEach(formula => {
    createCheckbox(formula, formulaOptionsContainer);
  });
});


// Scroll funkcionalnost
const goTopBtn = document.getElementById("goTopBtn");
const goBottomBtn = document.getElementById("goBottomBtn");

let lastScrollTop = 0;

window.addEventListener("scroll", () => {
  const st = window.pageYOffset || document.documentElement.scrollTop;

  if (st > 100) {
    if (st > lastScrollTop) {
      // Scroll-uje se naniže
      goTopBtn.style.display = "none";
      goBottomBtn.style.display = "block";
    } else {
      // Scroll-uje se nagore
      goBottomBtn.style.display = "none";
      goTopBtn.style.display = "block";
    }
  } else {
    // Vrh stranice - sakrij oba dugmeta
    goTopBtn.style.display = "none";
    goBottomBtn.style.display = "none";
  }

  lastScrollTop = st <= 0 ? 0 : st; 
});

goTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

goBottomBtn.addEventListener("click", () => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
});


// Poruka kada nema studenata u bazi
function showMissingStudentsAlert(indeksi) {
  if (!indeksi.length) {
    alertBox.classList.add("hidden");
    return;
  }

  alertMessage.textContent = `Za sledeće studente nema informacija u bazi: ${indeksi.join(', ')}`;
  alertBox.classList.remove("hidden");
}

// zatvaranje obavjestenja
closeAlert.addEventListener("click", () => {
  alertBox.classList.add("hidden");
});

generateBtn.addEventListener('click', () => {
  currentPage = 1;

  // Simulacija: validni indeksi su oni u studentsData
  const validIndexes = studentsData.map(s => s.Indeks);
  
  // Simulacija svih studenata koji su "trebali biti u tabeli"
  const allIndexes = ["201/23", "202/23", "203/23", "204/23", "250/23", "299/23"]; 

  const missingIndexes = allIndexes.filter(indeks => !validIndexes.includes(indeks));
  
  showMissingStudentsAlert(missingIndexes);
  renderTable();
});

