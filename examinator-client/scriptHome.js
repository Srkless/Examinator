const addBtn = document.getElementById("add-subject");
const dialog = document.getElementById("dialog");
const cancelBtn = document.getElementById("cancel-btn");
const closeBtn = document.getElementById("close-dialog");
const form = document.getElementById("subject-form");

const noSubjectsDiv = document.getElementById("no-subjects");
const subjectsTable = document.getElementById("subjects-table");
const subjectsBody = document.getElementById("subjects-body");

const subjectTitle = document.getElementById("subject-title");

const userIcon = document.getElementById("userIcon");
const dropdownMenu = document.getElementById("dropdownMenu");

const dialogTitle = document.getElementById("dialogTitle");

let editingRow = null; // trenutno editovani red

// Pomoćna funkcija za ažuriranje vidljivosti elemenata
function updateSubjectVisibility() {
  const hasSubjects = subjectsBody.children.length > 0;
  noSubjectsDiv.hidden = hasSubjects;
  subjectsTable.hidden = !hasSubjects;
  subjectTitle.hidden = !hasSubjects;
}

// Otvoranje padajuceg menija korisnika
userIcon.addEventListener("click", () => {
  dropdownMenu.classList.toggle("show");
});

// Zatvaranje padajuceg menija ako kliknes van njega
document.addEventListener("click", (event) => {
  if (!userIcon.contains(event.target)) {
    dropdownMenu.classList.remove("show");
  }
});

// Otvaranje dialoga (dodavanje novog predmeta)
addBtn.addEventListener("click", () => {
  dialogTitle.textContent = "Dodavanje novog predmeta";
  form.reset();
  editingRow = null;
  dialog.showModal();
  document.querySelector(".close-btn").blur(); // spriječi fokus na X dugme
});

// Zatvori dialog (cancel)
cancelBtn.addEventListener("click", () => {
  dialog.close();
  editingRow = null;
  dialogTitle.textContent = "Dodavanje novog predmeta";
});

// Zatvori dialog (X dugme)
closeBtn.addEventListener("click", () => {
  dialog.close();
  editingRow = null;
  dialogTitle.textContent = "Dodavanje novog predmeta";
});

// Dodavanje ili izmjena predmeta
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("subject-name").value.trim();
  const code = document.getElementById("subject-code").value.trim();

  if (!name || !code) return;

  if (editingRow) {
    // Ažuriranje postojećeg reda
    editingRow.cells[0].textContent = `${name} (${code})`;
    editingRow = null;
    dialogTitle.textContent = "Dodavanje novog predmeta";
  } else {
    // Dodavanje novog reda
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${name} (${code})</td>
      <td><span class="material-icons" data-tooltip="Izmjena osnovnih podataka o predmetu">edit</span></td>
      <td><span class="material-icons" data-tooltip="Predavači na predmetu">groups</span></td>
      <td><span class="material-icons" data-tooltip="Definisanje aktivnosti i formula">calculate</span></td>
      <td><span class="material-icons" data-tooltip="Studenti na predmetu">school</span></td>
      <td><span class="material-icons" data-tooltip="Rezultati studenata na predmetu">description</span></td>
      <td><span class="material-icons" data-tooltip="Unos rezultata">grid_on</span></td>
    `;
    subjectsBody.appendChild(row);
    enableTooltipsForIcons();
  }

  updateSubjectVisibility();
  form.reset();
  dialog.close();
});

// Tooltip
function enableTooltipsForIcons() {
  document.querySelectorAll('.material-icons[data-tooltip]').forEach(icon => {
    let timeout;
    icon.addEventListener('mouseenter', () => {
      timeout = setTimeout(() => icon.classList.add('show-tooltip'), 500);
    });
    icon.addEventListener('mouseleave', () => {
      clearTimeout(timeout);
      icon.classList.remove('show-tooltip');
    });
  });
}

// Klik na ikonicu u redu
subjectsBody.addEventListener("click", function (e) {
  if (e.target.textContent === "edit") {
    const icon = e.target;
    const row = icon.closest("tr");

    if (!row) return;

    const fullText = row.cells[0].textContent.trim();
    const match = fullText.match(/(.+)\s+\((.+)\)/);

    if (match) {
      const naziv = match[1];
      const sifra = match[2];

      document.getElementById("subject-name").value = naziv;
      document.getElementById("subject-code").value = sifra;

      dialogTitle.textContent = "Izmjena osnovnih podataka o predmetu";
      editingRow = row;
      dialog.showModal();
      document.querySelector(".close-btn").blur();
    }
  }
  else if(e.target.textContent == "groups"){ 
    popuniPredavace();
    professorsDialog.showModal();
  }
  else if (e.target.textContent === "calculate") {  // aktivnosti i formule
    const icon = e.target;
    const row = icon.closest("tr");

    if (!row) return;

    const fullText = row.cells[0].textContent.trim(); // npr: Programiranje 1 (2235)
    const match = fullText.match(/(.+)\s+\((.+)\)/);

    if (match) {
      const naziv = match[1].trim();
      const sifra = match[2].trim();
      const prikaz = `${naziv} - ${sifra}`;

      localStorage.setItem("selectedSubject", prikaz);
      window.location.href = "activities.html";
    }
  }
  else if(e.target.textContent === "school"){ // studenti na predmetu
    const icon = e.target;
    const row = icon.closest("tr");

    if (!row) return;

    const fullText = row.cells[0].textContent.trim(); // npr: Programiranje 1 (2235)
    const match = fullText.match(/(.+)\s+\((.+)\)/);

    if (match) {
      const naziv = match[1].trim();
      const sifra = match[2].trim();
      const prikaz = `${naziv} - ${sifra}`;

      localStorage.setItem("selectedSubject", prikaz);
      window.location.href = "students.html"; 
    }
  }
  else if(e.target.textContent === "description"){ // rezultati studenata na predmetu
    const icon = e.target;
    const row = icon.closest("tr");

    if (!row) return;

    const fullText = row.cells[0].textContent.trim(); // npr: Programiranje 1 (2235)
    const match = fullText.match(/(.+)\s+\((.+)\)/);

    if (match) {
      const naziv = match[1].trim();
      const sifra = match[2].trim();
      const prikaz = `${naziv} - ${sifra}`;

      localStorage.setItem("selectedSubject", prikaz);
      window.location.href = "studentResults.html"; 
    }
    // window.location.href = "studentResults.html";  
  }
  else if(e.target.textContent == "grid_on"){ // unos rezultata
    const row = e.target.closest("tr");
    const fullText = row?.cells[0].textContent.trim();
    const match = fullText.match(/(.+)\s+\((.+)\)/);

    if (match) {
      const naziv = match[1].trim();
      const sifra = match[2].trim();
      subjectInput.value = `${naziv} - ${sifra}`;

      yearSelect.value = "";
      activitySelect.value = "";
      resultsDialog.showModal(); 
    }
    // window.location.href = "importResults.html";
  }
});


// Elementi dialoga za predavače
const professorsDialog = document.getElementById("professors-dialog");
const closeProfessorsDialog = document.getElementById("close-professors-dialog");
const cancelProfessors = document.getElementById("cancel-professors");
const addProfessorBtn = document.getElementById("add-professor");
const professorSelect = document.getElementById("professor-select");
const professorTable = document.getElementById("professor-table");
const professorBody = document.getElementById("professor-body");
const noProfessorsMsg = document.getElementById("no-professors");

const professorsForm = document.getElementById("professors-form");

// Simulacija baze predavaca
const sviPredavaci = [
  { id: 1, ime: "Danijela", prezime: "Banjac", email: "danijela.banjac@eft.unibl.org" },
  { id: 2, ime: "Goran", prezime: "Banjac", email: "goran.banjac@eft.unibl.org" },
  { id: 3, ime: "Nikola", prezime: "Obradović", email: "nikola.obradovic@eft.unibl.org" }
];

let dodatiPredavaci = []; // predavaci koji su trenutno dodati za predmet

// Popunjavanje select menija (kasnije zameni sa fetch iz baze)
function popuniPredavace() {
  professorSelect.innerHTML = `<option value="" disabled selected>Izaberite predavača</option>`;
  sviPredavaci.forEach(p => {
    const option = document.createElement("option");
    option.value = p.id;
    option.textContent = `${p.ime} ${p.prezime}`;
    professorSelect.appendChild(option);
  });
}

// Zatvaranje dialoga
closeProfessorsDialog.addEventListener("click", () => professorsDialog.close());
cancelProfessors.addEventListener("click", () => professorsDialog.close());

// Dodavanje predavača
addProfessorBtn.addEventListener("click", () => {
  const selectedId = professorSelect.value;
  if (!selectedId) return;

  const selected = sviPredavaci.find(p => p.id == selectedId);
  if (!selected) return;

  // Proveri da li je vec dodat
  if (dodatiPredavaci.some(p => p.id == selectedId)) return;

  // Dodaj i sortiraj listu
  dodatiPredavaci.push(selected);
  dodatiPredavaci.sort((a, b) => a.ime.localeCompare(b.ime));

  // Prikazi sortiran sadrzaj u tabeli
  professorBody.innerHTML = "";

  dodatiPredavaci.forEach(p => {
    const row = document.createElement("tr");
    row.dataset.id = p.id;
    row.innerHTML = `
      <td>${p.ime}</td>
      <td>${p.prezime}</td>
      <td>${p.email}</td>
      <td><span class="material-icons delete-professor">delete</span></td>
    `;
    professorBody.appendChild(row);
  });

  professorTable.hidden = false;
  noProfessorsMsg.hidden = true;
});

// Brisanje predavaca
professorBody.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-professor")) {
    const row = e.target.closest("tr");
    const id = row.dataset.id;

    // Ukloni iz tabele
    row.remove();

    // Ukloni iz liste
    dodatiPredavaci = dodatiPredavaci.filter(p => p.id != id);

    // Azuriraj prikaz
    if (dodatiPredavaci.length === 0) {
      professorTable.hidden = true;
      noProfessorsMsg.hidden = false;
    }
  }
});

// Sacuvaj predavace (submit forme)
professorsForm.addEventListener("submit", (e) => {
  e.preventDefault();

  console.log("Sačuvani predavači:", dodatiPredavaci);

  // Ovdje možeš slati podatke backendu putem fetch-a
  professorsDialog.close();
});



// Elementi dialoga za unos rezultata
const resultsDialog = document.getElementById("results-dialog");
const subjectInput = document.getElementById("subject");
const yearSelect = document.getElementById("schoolYear");
const activitySelect = document.getElementById("activity-select");
const closeResultsDialog = document.getElementById("close-results-dialog");
const cancelResults = document.getElementById("cancel-results");
const resultsForm = document.getElementById("results-form");

// Popuni školsku godinu
function populateSchoolYears() {
  yearSelect.innerHTML = '<option value="" disabled selected>Izaberite školsku godinu</option>';
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
    yearSelect.appendChild(option);
  }
}

// Popuni aktivnosti - Aktivnosti (skraceni naziv aktivnosti uzeti iz baze)
function populateActivities() {
  const activities = ["K1", "K2", "LAB"];
  activitySelect.innerHTML = '<option value="" disabled selected>Izaberite aktivnost</option>';
  activities.forEach(a => {
    const opt = document.createElement("option");
    opt.value = a;
    opt.textContent = a;
    activitySelect.appendChild(opt);
  });
}

populateSchoolYears();
populateActivities();

// Zatvori dijalog
closeResultsDialog.addEventListener("click", () => resultsDialog.close());
cancelResults.addEventListener("click", () => resultsDialog.close());

// Potvrda
resultsForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const year = yearSelect.value;
  const activity = activitySelect.value;
  const subject = subjectInput.value;

  if (!year || !activity || !subject) return;

  localStorage.setItem("selectedSubject", subject);
  localStorage.setItem("selectedYear", year);
  localStorage.setItem("selectedActivity", activity);

  window.location.href = "importResults.html";
});
