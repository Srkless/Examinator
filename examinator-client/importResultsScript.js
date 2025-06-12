const userIcon = document.getElementById("userIcon");
const dropdownMenu = document.getElementById("dropdownMenu");

const schoolYearInput = document.getElementById("schoolYear");
const subjectInput = document.getElementById("subject")

const studentsContainer = document.getElementById("studentsContainer");
const searchInput = document.getElementById("searchInput");
const importBtn = document.getElementById("importResult");


let allStudents = [];
let sortDirection = {};

// Meni korisnika
userIcon.addEventListener("click", () => {
  dropdownMenu.classList.toggle("show");
});
document.addEventListener("click", (e) => {
  if (!userIcon.contains(e.target)) {
    dropdownMenu.classList.remove("show");
  }
});

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


// Pretraga
searchInput.addEventListener("input", () => {
  const selectedActivity = localStorage.getItem("selectedActivity");
  renderTable(selectedActivity);
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

// Sort
function sortirajPo(kolona) {
  sortDirection[kolona] = !sortDirection[kolona];
  allStudents.sort((a, b) => {
    if (a[kolona] < b[kolona]) return sortDirection[kolona] ? -1 : 1;
    if (a[kolona] > b[kolona]) return sortDirection[kolona] ? 1 : -1;
    return 0;
  });
  const selectedActivity = localStorage.getItem("selectedActivity");
  renderTable(selectedActivity);
}

// Tabela
function renderTable(activityName) {
  const filtrirani = filterStudents();

  let table = document.createElement("table");
  table.innerHTML = `
    <thead>
      <tr>
        <th data-kolona="indeks">Indeks</th>
        <th data-kolona="ime">Ime</th>
        <th data-kolona="prezime">Prezime</th>
        <th data-kolona="grupa">Grupa</th>
        <th>${activityName}</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = table.querySelector("tbody");
  filtrirani.forEach((student, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${student.indeks}</td>
      <td>${student.ime}</td>
      <td>${student.prezime}</td>
      <td>${student.grupa}</td>
      <td><input type="text" class="activity-input" data-index="${index}" data-activity="${activityName}" min="0" max="100"/></td>
    `;
    tbody.appendChild(row);
  });

  studentsContainer.innerHTML = "";
  studentsContainer.appendChild(table);

  table.querySelectorAll("th[data-kolona]").forEach(th => {
    th.addEventListener("click", () => sortirajPo(th.dataset.kolona));
  });
}


// Provjera unosa bodova
studentsContainer.addEventListener("input", (e) => {
  if (e.target.classList.contains("activity-input")) {
    let val = e.target.value;
    // dozvoli samo cifre i decimalni broj
    if (val && !/^\d*\.?\d*$/.test(val)) {
      e.target.value = val.slice(0, -1);
    }
    // ograniči na max 100    <- ovdje treba vidjeti koliko je stavljeno max ogranicenje bodova za izabranu aktivnost
    if (parseFloat(e.target.value) > 100) {
      e.target.value = "100";
    }
  }
});


// Učitaj naziv predmeta, godinu, aktivnost i renderuj
window.addEventListener("DOMContentLoaded", () => {
  const selectedSubject = localStorage.getItem("selectedSubject");
  if (selectedSubject && subjectInput) subjectInput.value = selectedSubject;

  const selectedYear = localStorage.getItem("selectedYear");
  if (selectedYear && schoolYearInput) schoolYearInput.value = selectedYear;

  const selectedActivity = localStorage.getItem("selectedActivity");
  renderTable(selectedActivity);
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


// Primjer simulacije dohvaćenih studenata
allStudents = [
  { indeks: "IB123/2022", ime: "Petar", prezime: "Petrović", grupa: "G1" },
  { indeks: "IB124/2022", ime: "Jovana", prezime: "Jovanović", grupa: "G1" },
  { indeks: "IB125/2022", ime: "Marko", prezime: "Marković", grupa: "G2" },
  { indeks: "IB126/2022", ime: "Dusko", prezime: "Simovic", grupa: "G2" },
  { indeks: "IB127/2022", ime: "Mirko", prezime: "Mirkovic", grupa: "G2" },
  { indeks: "IB128/2022", ime: "Sonja", prezime: "Mirkovic", grupa: "G2" },
  { indeks: "IB129/2022", ime: "Tamara", prezime: "Dakic", grupa: "G2" },
  { indeks: "IB130/2022", ime: "Milenko", prezime: "Savic", grupa: "G2" },
  { indeks: "IB131/2022", ime: "Dusko", prezime: "Dugousko", grupa: "G2" },
  { indeks: "IB132/2022", ime: "Tomo", prezime: "Tomic", grupa: "G2" },
  { indeks: "IB133/2022", ime: "Ana", prezime: "Babic", grupa: "G2" },
  { indeks: "IB123/2022", ime: "Petar", prezime: "Petrović", grupa: "G1" },
  { indeks: "IB124/2022", ime: "Jovana", prezime: "Jovanović", grupa: "G1" },
  { indeks: "IB125/2022", ime: "Marko", prezime: "Marković", grupa: "G2" },
  { indeks: "IB126/2022", ime: "Dusko", prezime: "Simovic", grupa: "G2" },
  { indeks: "IB127/2022", ime: "Mirko", prezime: "Mirkovic", grupa: "G2" },
  { indeks: "IB128/2022", ime: "Sonja", prezime: "Mirkovic", grupa: "G2" },
  { indeks: "IB129/2022", ime: "Tamara", prezime: "Dakic", grupa: "G2" },
  { indeks: "IB130/2022", ime: "Milenko", prezime: "Savic", grupa: "G2" },
  { indeks: "IB131/2022", ime: "Dusko", prezime: "Dugousko", grupa: "G2" },
  { indeks: "IB132/2022", ime: "Tomo", prezime: "Tomic", grupa: "G2" },
  { indeks: "IB133/2022", ime: "Ana", prezime: "Babic", grupa: "G2" },
];

// Dugme za čuvanje
const saveBtn = document.createElement("button");
saveBtn.textContent = "Sačuvaj rezultate";
saveBtn.classList.add("save-btn");
document.querySelector(".main-content").appendChild(saveBtn);

saveBtn.addEventListener("click", () => {
  const activityInputs = document.querySelectorAll(".activity-input");
  const rezultati = [];

  activityInputs.forEach(input => {
    const index = parseInt(input.dataset.index);
    const vrednost = input.value.trim();
    rezultati.push({
      indeks: allStudents[index].indeks,
      activity: vrednost !== "" ? parseFloat(vrednost) : null,
    });
  });

  console.log("Sačuvani rezultati:", rezultati);
  alert("Rezultati su sačuvani (simulacija).");
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