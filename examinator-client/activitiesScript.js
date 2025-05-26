const userIcon = document.getElementById("userIcon");
const dropdownMenu = document.getElementById("dropdownMenu");
const schoolYearSelect = document.getElementById("schoolYear");

const addActivityBtn = document.getElementById("addActivityBtn");
const addFormulaBtn = document.getElementById("addFormulaBtn");

const activityDialog = document.getElementById("activityDialog");
const formulaDialog = document.getElementById("formulaDialog");

const closeActivityDialogBtn = document.getElementById("closeActivityDialog");
const closeFormulaDialogBtn = document.getElementById("closeFormulaDialog");

const activityForm = document.getElementById("activityForm");
const formulaForm = document.getElementById("formulaForm");

const activitiesContainer = document.getElementById("activitiesContainer");
const formulasContainer = document.getElementById("formulasContainer");
const activityTags = document.getElementById("activityTags");

// Za praćenje izmene
let editingActivityRow = null;
let editingFormulaRow = null;

// Padajući meni korisnika
userIcon.addEventListener("click", () => {
  dropdownMenu.classList.toggle("show");
});
document.addEventListener("click", (e) => {
  if (!userIcon.contains(e.target)) {
    dropdownMenu.classList.remove("show");
  }
});

// Popuni školsku godinu (10 godina unazad)
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

// Otvaranje dijaloga
addActivityBtn.addEventListener("click", () => {
  activityForm.reset();
  activityDialog.querySelector("h3").textContent = "Dodavanje nove aktivnosti";
  editingActivityRow = null;
  activityDialog.showModal();
});

addFormulaBtn.addEventListener("click", () => {
  formulaForm.reset();
  formulaDialog.querySelector("h3").textContent = "Dodavanje nove formule";
  editingFormulaRow = null;
  formulaDialog.showModal();
});

// Zatvaranje dijaloga
closeActivityDialogBtn.addEventListener("click", () => activityDialog.close());
closeFormulaDialogBtn.addEventListener("click", () => formulaDialog.close());

document.querySelectorAll(".cancel-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const dialog = btn.closest("dialog");
    if (dialog) dialog.close();
  });
});

activityDialog.addEventListener("close", () => {
  editingActivityRow = null;
  activityForm.querySelector("h3").textContent = "Dodavanje nove aktivnosti";
  activityForm.reset();
});

formulaDialog.addEventListener("close", () => {
  editingFormulaRow = null;
  formulaForm.querySelector("h3").textContent = "Dodavanje nove formule";
  formulaForm.reset();
});

// Dodavanje / izmena aktivnosti
activityForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(activityForm);
  const naziv = data.get("naziv");
  const skrNaziv = data.get("skrNaziv");
  const maxBodova = data.get("maxBodova");

  if (editingActivityRow) {
    const oldSkrNaziv = editingActivityRow.children[0].textContent.trim();

    // Ako se promenio skraceni naziv → azuriraj formule i dugmad
    if (oldSkrNaziv !== skrNaziv) {
      const formulaRows = document.querySelectorAll("#formulasContainer tbody tr");
      formulaRows.forEach(row => {
        const izrazCell = row.children[1];
        if (izrazCell.textContent.includes(oldSkrNaziv)) {
          izrazCell.textContent = izrazCell.textContent.replaceAll(oldSkrNaziv, skrNaziv);
        }
      });

      // Ažuriraj dugmad ispod textarea
      const tagButtons = document.querySelectorAll("#activityTags button");
      tagButtons.forEach(btn => {
        if (btn.textContent === oldSkrNaziv) {
          btn.textContent = skrNaziv;
          btn.onclick = () => insertToExpression(skrNaziv);
        }
      });
    }

    editingActivityRow.children[0].textContent = skrNaziv;
    editingActivityRow.children[1].textContent = naziv;
    editingActivityRow.children[2].textContent = maxBodova;
  } else {
    let table = activitiesContainer.querySelector("table");
    if (!table) {
      activitiesContainer.innerHTML = "";
      table = document.createElement("table");
      table.innerHTML = `
        <thead>
          <tr>
            <th>Skraćeni naziv</th>
            <th>Naziv</th>
            <th>Maks. bodova</th>
            <th class="action-column">Akcija</th>
          </tr>
        </thead>
        <tbody></tbody>
      `;
      activitiesContainer.appendChild(table);
    }

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${skrNaziv}</td>
      <td>${naziv}</td>
      <td>${maxBodova}</td>
      <td class="action-column">
        <span class="material-icons">edit</span>
        <span class="material-icons">delete</span>
      </td>
    `;
    table.querySelector("tbody").appendChild(row);

    // Dodaj dugme za unos izraza
    const tagBtn = document.createElement("button");
    tagBtn.type = "button";
    tagBtn.classList.add("insert-btn");
    tagBtn.textContent = skrNaziv;
    tagBtn.addEventListener("click", () => insertToExpression(skrNaziv));
    activityTags.appendChild(tagBtn);
  }

  activityDialog.close();
});

// Klik na ikonicu u tabeli aktivnosti
activitiesContainer.addEventListener("click", (e) => {
  const row = e.target.closest("tr");
  if (!row) return;

  if (e.target.textContent.trim() === "edit") {
    const skrNaziv = row.children[0].textContent.trim();
    const naziv = row.children[1].textContent.trim();
    const maxBodova = row.children[2].textContent.trim();

    activityForm.elements["skrNaziv"].value = skrNaziv;
    activityForm.elements["naziv"].value = naziv;
    activityForm.elements["maxBodova"].value = maxBodova;

    editingActivityRow = row;
    activityForm.querySelector("h3").textContent = "Izmena aktivnosti";
    activityDialog.showModal();
  }
  // dio gdje se bezuslovno brise red sa aktivnoscu
  else if (e.target.textContent.trim() === "delete") {
    row.remove();

    const table = activitiesContainer.querySelector("table");
    if (table && table.querySelectorAll("tbody tr").length === 0) {
      table.remove();
      activitiesContainer.innerHTML = `<p class="no-data">Trenutno nemate ni jednu aktivnost na predmetu.</p>`;
    }
  }
});

// Dodavanje / izmena formule
formulaForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(formulaForm);
  const naziv = data.get("naziv");
  const izraz = data.get("izraz");

  if (editingFormulaRow) {
    editingFormulaRow.children[0].textContent = naziv;
    editingFormulaRow.children[1].textContent = izraz;
  } else {
    let table = formulasContainer.querySelector("table");
    if (!table) {
      formulasContainer.innerHTML = "";
      table = document.createElement("table");
      table.innerHTML = `
        <thead>
          <tr>
            <th>Naziv</th>
            <th>Izraz</th>
            <th class="action-column">Akcija</th>
          </tr>
        </thead>
        <tbody></tbody>
      `;
      formulasContainer.appendChild(table);
    }

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${naziv}</td>
      <td>${izraz}</td>
      <td class="action-column">
        <span class="material-icons">edit</span>
        <span class="material-icons">delete</span>
      </td>
    `;
    table.querySelector("tbody").appendChild(row);
  }

  formulaDialog.close();
});

// Klik na ikonicu u tabeli formula
formulasContainer.addEventListener("click", (e) => {
  const row = e.target.closest("tr");
  if (!row) return;

  if (e.target.textContent.trim() === "edit") {
    const naziv = row.children[0].textContent.trim();
    const izraz = row.children[1].textContent.trim();

    formulaForm.elements["naziv"].value = naziv;
    formulaForm.elements["izraz"].value = izraz;

    editingFormulaRow = row;
    formulaForm.querySelector("h3").textContent = "Izmena formule";
    formulaDialog.showModal();
  }

  if (e.target.textContent.trim() === "delete") {
    row.remove();

    const table = formulasContainer.querySelector("table");
    if (table && table.querySelectorAll("tbody tr").length === 0) {
      table.remove();
      formulasContainer.innerHTML = `<p class="no-data">Trenutno nemate ni jednu formulu na predmetu.</p>`;
    }
  }
});

// Umetanje izraza klikom na dugme
function insertToExpression(text) {
  const input = formulaForm.elements["izraz"];
  const start = input.selectionStart;
  const end = input.selectionEnd;
  const value = input.value;
  input.value = value.slice(0, start) + text + value.slice(end);
  input.focus();
  input.selectionStart = input.selectionEnd = start + text.length;
}

// Umetanje operatora
document.querySelectorAll("#operators button").forEach((btn) => {
  btn.addEventListener("click", () => insertToExpression(btn.textContent));
});



// ovo se dodaje u slucaju da neki studenti imaju bodove za tu aktivnosti, te izabrane godine
// Elementi
const warningDialog = document.getElementById("warningDialog");
const cancelWarning = document.getElementById("cancelWarning");
const confirmDelete = document.getElementById("confirmDelete");
const closeWarningDialog = document.getElementById("closeWarningDialog");

let rowToDelete = null;

// Otvori dialog
document.addEventListener("click", function (e) {
  if (e.target.closest(".material-icons")?.textContent === "delete") {
    rowToDelete = e.target.closest("tr");
    warningDialog.showModal();
  }
});

// Otkaži i zatvori dialog
cancelWarning.addEventListener("click", () => {
  warningDialog.close();
  rowToDelete = null;
});

closeWarningDialog.addEventListener("click", () => {
  warningDialog.close();
  rowToDelete = null;
});

// Potvrdi brisanje
confirmDelete.addEventListener("click", () => {
  if (rowToDelete) {
    rowToDelete.remove();
    rowToDelete = null;

    // Ažuriraj prikaz ako je tabela prazna
    const subjectsBody = document.getElementById("subjects-body");
    const noSubjectsDiv = document.getElementById("no-subjects");
    const subjectsTable = document.getElementById("subjects-table");
    const subjectTitle = document.getElementById("subject-title");

    const table = activitiesContainer.querySelector("table");
    if (table && table.querySelectorAll("tbody tr").length === 0) {
      table.remove();
      activitiesContainer.innerHTML = `<p class="no-data">Trenutno nemate ni jednu aktivnost na predmetu.</p>`;
    }
  }
  warningDialog.close();
});

// naziv predmeta, u zavirsnosti koji je predmet kliknut
window.addEventListener("DOMContentLoaded", () => {
  const inputSubject = document.getElementById("subject");
  const selectedSubject = localStorage.getItem("selectedSubject");
  if (selectedSubject && inputSubject) {
    inputSubject.value = selectedSubject;
  }
});
