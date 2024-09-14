const termInput = document.getElementById('termInput');
const termList = document.getElementById('termList');
const submitBtn = document.getElementById('submitBtn');

let terms = [];

// Begriff hinzufügen
termInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && termInput.value.trim() !== '') {
        e.preventDefault();
        addTerm(termInput.value.trim());
        termInput.value = '';
    }
});

function addTerm(term) {
    const termItem = document.createElement('div');
    termItem.className = 'term-item';

    const termHeader = document.createElement('div');
    termHeader.className = 'term-header';

    const termText = document.createElement('div');
    termText.className = 'term-text';
    termText.textContent = term;

    // Optional: Button zum Entfernen des Begriffs
    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn btn-sm btn-outline-danger';
    removeBtn.textContent = 'Entfernen';
    removeBtn.addEventListener('click', () => {
        termList.removeChild(termItem);
        terms = terms.filter(t => t.id !== termId);
    });

    termHeader.appendChild(termText);
    termHeader.appendChild(removeBtn);

    const categoriesDiv = document.createElement('div');
    categoriesDiv.className = 'categories-div';

    const categories = [
        { name: 'Was du liebst', value: 'liebe' },
        { name: 'Worin du gut bist', value: 'gut' },
        { name: 'Was die Welt braucht', value: 'welt' },
        { name: 'Wofür du bezahlt werden kannst', value: 'bezahlt' }
    ];

    categories.forEach(cat => {
        const checkboxDiv = document.createElement('div');
        checkboxDiv.className = 'form-check form-check-inline';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = cat.value;
        checkbox.className = 'form-check-input';
        checkbox.id = `checkbox-${term}-${cat.value}`;

        const label = document.createElement('label');
        label.className = 'form-check-label';
        label.setAttribute('for', `checkbox-${term}-${cat.value}`);
        label.textContent = cat.name;

        checkboxDiv.appendChild(checkbox);
        checkboxDiv.appendChild(label);
        categoriesDiv.appendChild(checkboxDiv);
    });

    termItem.appendChild(termHeader);
    termItem.appendChild(categoriesDiv);
    termList.appendChild(termItem);

    // Eindeutige ID für den Begriff generieren
    const termId = Date.now() + Math.random();

    // Speichere den Begriff mit seiner ID und dem zugehörigen DOM-Element
    terms.push({ id: termId, term: term, categories: [], element: termItem });
}

// Kategorien speichern
function saveCategories() {
    terms.forEach((item) => {
        const checkboxes = item.element.querySelectorAll('input[type="checkbox"]');
        const selectedCategories = [];
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedCategories.push(checkbox.value);
            }
        });
        item.categories = selectedCategories;
    });
}

// Beim Klick auf "Ikigai anzeigen"
submitBtn.addEventListener('click', function() {
    saveCategories();

    if (terms.length === 0) {
        alert('Bitte füge mindestens einen Begriff hinzu.');
        return;
    }

    // Validierung: Jeder Begriff muss mindestens einer Kategorie zugeordnet sein
    for (let i = 0; i < terms.length; i++) {
        if (terms[i].categories.length === 0) {
            alert(`Bitte weise dem Begriff "${terms[i].term}" mindestens eine Kategorie zu.`);
            return;
        }
    }

    // Daten speichern und weiterleiten
    // Entferne die 'element' Eigenschaft vor dem Speichern
    const termsToSave = terms.map(({ id, term, categories }) => ({ id, term, categories }));

    localStorage.setItem('ikigaiData', JSON.stringify(termsToSave));
    window.location.href = 'ergebnis.html';
});
