// Upravljanje korisničkim menijem
const userIcon = document.getElementById('userIcon');
const dropdownMenu = document.getElementById('dropdownMenu');

userIcon.addEventListener('click', () => {
  dropdownMenu.classList.toggle('show');
});

// Zatvaranje menija klikom van njega
document.addEventListener('click', (event) => {
  if (!userIcon.contains(event.target)) {
    dropdownMenu.classList.remove('show');
  }
});

// Funkcionalnost prebacivanja teme
const themeToggle = document.getElementById('themeToggle');
const themeName = document.querySelector('.theme-name');

// Provjera da li korisnik ima sačuvane postavke teme
if (localStorage.getItem('darkTheme') === 'true') {
  document.body.classList.add('dark-theme');
  themeToggle.checked = true;
  themeName.textContent = 'Tamna';
}

themeToggle.addEventListener('change', () => {
  if (themeToggle.checked) {
    document.body.classList.add('dark-theme');
    localStorage.setItem('darkTheme', 'true');
    themeName.textContent = 'Tamna';
  } else {
    document.body.classList.remove('dark-theme');
    localStorage.setItem('darkTheme', 'false');
    themeName.textContent = 'Svijetla';
  }
});

// Izbor akcentne boje
const colorOptions = document.querySelectorAll('.color-option');
const selectedColorName = document.querySelector('.selected-color-name');

// Provjera da li korisnik ima sačuvanu postavku za akcentnu boju
const savedAccentColor = localStorage.getItem('accentColor');
const savedColorName = localStorage.getItem('colorName');

if (savedAccentColor) {
  document.documentElement.style.setProperty('--accent-color', savedAccentColor);
  
  // Ažuriranje selektovane boje
  colorOptions.forEach(option => {
    option.classList.remove('selected');
    if (option.getAttribute('data-color') === savedAccentColor) {
      option.classList.add('selected');
    }
  });
  
  // Ažuriranje imena boje
  if (savedColorName) {
    selectedColorName.textContent = savedColorName;
  }
}

colorOptions.forEach(option => {
  option.addEventListener('click', () => {
    // Uklanjanje klase 'selected' sa svih opcija
    colorOptions.forEach(opt => opt.classList.remove('selected'));
    
    // Dodavanje klase 'selected' na kliknutu opciju
    option.classList.add('selected');
    
    // Preuzimanje i postavljanje akcentne boje
    const color = option.getAttribute('data-color');
    const colorName = option.getAttribute('data-name');
    
    document.documentElement.style.setProperty('--accent-color', color);
    selectedColorName.textContent = colorName;
    
    // Čuvanje podešavanja
    localStorage.setItem('accentColor', color);
    localStorage.setItem('colorName', colorName);
  });
});