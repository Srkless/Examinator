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
      <td><span class="material-icons">edit</span></td>
      <td><span class="material-icons">groups</span></td>
      <td><span class="material-icons">display_settings</span></td>
      <td><span class="material-icons">school</span></td>
      <td><span class="material-icons">description</span></td>
      <td><span class="material-icons">grid_on</span></td>
    `;
    subjectsBody.appendChild(row);
  }

  updateSubjectVisibility();
  form.reset();
  dialog.close();
});

// Klik na ikonicu u redu (edit)
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
});