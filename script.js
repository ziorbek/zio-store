// Ścieżki do pliku JSON z nazwą i API
const petNameFile = './petName.json';
const apiUrl = 'https://ps99.biggamesapi.io/api/rap';

// Funkcja do pobierania nazwy z pliku JSON
async function fetchPetName() {
    const response = await fetch(petNameFile);
    if (!response.ok) {
        throw new Error('Błąd wczytywania pliku JSON z nazwą peta');
    }
    const data = await response.json();
    return data.name; // Zwracamy nazwę peta
}

// Funkcja do pobierania danych z API i filtrowania
async function fetchPetValue(petName) {
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error(`Błąd API: ${response.status}`);
    }
    const data = await response.json();

    // Wyświetl dane w konsoli dla diagnostyki
    console.log('Dane z API:', data);

    // Jeśli dane nie są tablicą, sprawdź ich strukturę
    if (!Array.isArray(data)) {
        throw new Error('Dane z API nie są tablicą.');
    }

    // Filtrowanie danych: szukamy elementów bez "pt" w configData
    const matchingPets = data.filter(item =>
        item.configData.id === petName && !item.configData.pt
    );

    if (matchingPets.length === 0) {
        throw new Error('Nie znaleziono odpowiedniego peta w API');
    }

    return matchingPets[0].value;
}

// Główna funkcja inicjująca proces
async function displayPetValue() {
    try {
        const petName = await fetchPetName(); // Pobieramy nazwę peta
        const petValue = await fetchPetValue(petName); // Pobieramy wartość
        const container = document.getElementById('data-container');
        container.textContent = `Wartość "${petName}" to: ${petValue}`;
    } catch (error) {
        console.error(error.message);
        document.getElementById('data-container').textContent =
            'Wystąpił błąd: ' + error.message;
    }
}

// Wywołanie funkcji po załadowaniu strony
document.addEventListener('DOMContentLoaded', displayPetValue);
