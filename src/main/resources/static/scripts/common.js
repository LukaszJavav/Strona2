
let globalCPM = 0;
async function handleSubmit(event, type) {
    event.preventDefault(); // Zapobiega domyślnej akcji formularza

    const age = document.getElementById(`age-${type}`).value;
    const height = document.getElementById(`height-${type}`).value;
    const weight = document.getElementById(`weight-${type}`).value;
    const activityLevel = document.getElementById(`activity-level-${type}`).value;

    if (age && height && weight && activityLevel) {

        if (window.innerWidth <= 768) { // Sprawdź, czy szerokość okna jest mniejsza lub równa 768px
            resetUI(); // Zresetuj UI na wypadek, gdyby użytkownik kliknął "Powrót"
        }
        const ppm = Math.round(10 * weight + 6.25 * height - 5 * age + (type === 'man' ? 5 : -161));
        const cpm = Math.round(ppm * activityLevel);
        globalCPM = cpm;
        const heightM = height / 100;
        const bmi = (weight / (heightM * heightM)).toFixed(2); // Oblicz BMI

        displayPPM(ppm, type);
        displayCPM(cpm, type);
        displayBMI(bmi, type);

        document.querySelectorAll('.informacje-woman, .informacje-man').forEach(info => {
            info.style.display = 'none';
        });
        // Ukryj przyciski "Losuj inny jadłospis" przed obrotem kart
        document.querySelectorAll('.randomize-menu').forEach(button => {
            button.style.display = 'none';
        });
        //  Obróć wszystkie karty
        document.querySelectorAll('.card').forEach(card => {
            card.classList.add('flipped');
            card.querySelector('.form-container').classList.remove('active');
            card.querySelector('video').style.display = 'none';
            card.querySelector('.overlay').style.display = 'none';
            card.querySelector('.result-container').classList.add('active');
        });

        const oppositeType = type === 'man' ? 'woman' : 'man';
        // Wyświetl sekcję informacji natychmiast po obróceniu karty
        document.getElementById(`info-${type}`).style.display = 'block';

        // Wyświetl wykres po stronie formularza, który był wypełniany
        document.getElementById(`chart-${type}`).style.display = 'block';

        // Pokaż kółko ładowania
        document.getElementById(`loading-spinner-${oppositeType}`).style.display = 'block';

        // Ustaw styl display dla elementów w kontenerze result tylko na aktywnej karcie
        document.querySelectorAll(`#result-${type} .result p`).forEach(p => {
            p.style.display = 'inline-block';
        });

        // Pobierz przepisy dla CPM
        const recipes = await fetchRecipes(cpm);
        displayRecipes(recipes, oppositeType);

        document.getElementById(`loading-spinner-${oppositeType}`).style.display = 'none';

        document.querySelectorAll('.scroll-button').forEach(button => {
            button.style.display = 'none'; // Ukryj wszystkie przyciski
        });

        if (window.innerWidth <= 768) { // Sprawdź, czy szerokość okna jest mniejsza lub równa 768px
            document.querySelector(`#result-${type} .scroll-button`).style.display = 'flex';

            if (type === 'woman') {
                document.querySelector('#card-man .warning-man').style.display = 'block';
                document.querySelector('#card-woman .warning-woman').style.display = 'none';

                // Pokaż przycisk Powrót na przeciwniej karcie
                document.querySelector('#card-man .powrot').classList.add('show');
                document.querySelector('#card-woman .powrot').classList.remove('show');
            } else {
                document.querySelector('#card-woman .warning-woman').style.display = 'block';
                document.querySelector('#card-man .warning-man').style.display = 'none';

                // Pokaż przycisk Powrót na przeciwniej karcie
                document.querySelector('#card-woman .powrot').classList.add('show');
                document.querySelector('#card-man .powrot').classList.remove('show');
            }
        } else {
            // Przywróć standardowy wygląd dla większych ekranów
            document.querySelector('#card-woman .warning-woman').style.display = 'block';
            document.querySelector('#card-man .warning-man').style.display = 'block';

            document.querySelector('#card-woman .powrot').classList.remove('show');
            document.querySelector('#card-man .powrot').classList.remove('show');

        }// Pokaż tylko na odpowiedniej karcie

    } else {
        alert("Proszę wypełnić wszystkie pola formularza.");
    }
    return false;
}

function scrollToCard(type) {
    const oppositeType = type === 'woman' ? 'man' : 'woman';
    const oppositeCardElement = document.getElementById(`card-${oppositeType}`);

    console.log(`Scrolling to: card-${oppositeType}`); // Dodaj ten log, aby sprawdzić, czy element jest poprawnie zidentyfikowany

    oppositeCardElement.scrollIntoView({ behavior: 'smooth' });
}

function resetUI() {
    if (window.innerWidth <= 768) { // Sprawdź, czy szerokość okna jest mniejsza lub równa 768px
        document.querySelectorAll('.warning-woman, .warning-man').forEach(warning => {
            warning.style.display = 'none'; // Ukryj sekcje warning
        });

        document.querySelectorAll('.result-container').forEach(resultContainer => {
            resultContainer.classList.remove('active'); // Ukryj wynik
        });

        document.querySelectorAll('.powrot').forEach(button => {
            button.classList.remove('show'); // Ukryj przycisk Powrót
        });

        document.querySelectorAll('.randomize-menu').forEach(button => {
            button.style.display = 'block'; // Pokaż przycisk losowania menu
        });

        document.querySelectorAll('.form-container').forEach(formContainer => {
            formContainer.classList.remove('active'); // Ukryj formularz
        });

        document.querySelectorAll('.card').forEach(card => {
            card.classList.remove('flipped'); // Przywróć karty do pierwotnej pozycji
            card.querySelector('video').style.display = 'block'; // Przywróć widoczność wideo
            card.querySelector('.overlay').style.display = 'block'; // Przywróć widoczność overlay
        });
    }
}

function displayPPM(ppm, type) {
    const ppmValueElement = document.getElementById(`ppm-value-${type}`);
    ppmValueElement.textContent = ppm;
    ppmValueElement.style.display = 'block'; // Upewnij się, że tekst jest wyświetlany

    // Ukryj wynik PPM na karcie przeciwnej
    const oppositeType = type === 'man' ? 'woman' : 'man';
    const oppositePPMValueElement = document.getElementById(`ppm-value-${oppositeType}`);
    const oppositeResultText = document.getElementById(`result-text-${oppositeType}`);
    if (oppositePPMValueElement) {
        oppositePPMValueElement.textContent = "";
    }
    if (oppositeResultText) {
        oppositeResultText.style.display = 'none'; // Ukryj wynik na drugiej karcie
    }
}

function displayCPM(cpm, type) {
    const cpmValueElement = document.getElementById(`cpm-value-${type}`);
    cpmValueElement.textContent = cpm;
    cpmValueElement.style.display = 'block'; // Upewnij się, że tekst jest wyświetlany

    const oppositeType = type === 'man' ? 'woman' : 'man';
    const oppositeCPMValueElement = document.getElementById(`cpm-value-${oppositeType}`);
    const oppositeResultCPMText = document.getElementById(`result-cpm-${oppositeType}`);
    if (oppositeCPMValueElement) {
        oppositeCPMValueElement.textContent = "";
    }
    if (oppositeResultCPMText) {
        oppositeResultCPMText.style.display = 'none'; // Ukryj wynik na drugiej karcie
    }
}

function displayBMI(bmi, type) {
    const bmiValueElement = document.getElementById(`bmi-value-${type}`);
    bmiValueElement.textContent = bmi;
    bmiValueElement.style.display = 'block'; // Upewnij się, że tekst jest wyświetlany

    const oppositeType = type === 'man' ? 'woman' : 'man';
    const oppositeBMIValueElement = document.getElementById(`bmi-value-${oppositeType}`);
    const oppositeResultBMIText = document.getElementById(`result-bmi-${oppositeType}`);
    if (oppositeBMIValueElement) {
        oppositeBMIValueElement.textContent = "";
    }
    if (oppositeResultBMIText) {
        oppositeResultBMIText.style.display = 'none'; // Ukryj wynik na drugiej karcie
    }
}


let abortController = new AbortController(); // Globalny kontroler

let isAbortet = false;
async function fetchRecipes(cpm) {
    abortController = new AbortController(); // Utwórz nowy kontroler dla każdego żądania
    const signal = abortController.signal;
    isAbortet = false;

    try {
        const response = await fetch(`/api/getRecipeForCPM?cpm=${cpm}`, {signal});
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Błąd podczas pobierania przepisów.');
            return [];
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            isAbortet = true;
            console.log('Pobieranie przepisów zostało anulowane.');
        } else {
            console.error('Błąd podczas pobierania przepisów:', error);
        }
        return [];
    }
}


function displayRecipes(recipes, targetType) {
    const recipeContainer = document.getElementById(`recipes-content-${targetType}`);
    if (!recipeContainer) {
        console.error(`Element o ID recipes-content-${targetType} nie istnieje.`);
        return;
    }

    // Ukryj kółko ładowania
    document.getElementById(`loading-spinner-${targetType}`).style.display = 'none';

    recipeContainer.innerHTML = "";

    if (recipes.length > 0) {
        // Definiuj kolejność posiłków
        const mealOrder = ["Śniadanie", "Drugie śniadanie", "Obiad", "Przekąska", "Podwieczorek", "Kolacja"];

        // Sortuj przepisy według kolejności posiłków
        recipes.sort((a, b) => mealOrder.indexOf(a.dailyMeals) - mealOrder.indexOf(b.dailyMeals));
        let totalCalories = 0
        recipeContainer.innerHTML = "<b>Przykładowa dieta na dziś, odpowiadająca Twojemu CPM (+/-50kcal):</b>";
        recipes.forEach(recipe => {
            totalCalories += recipe.kcal;
            recipeContainer.innerHTML += `
                    <p><b> ${recipe.dailyMeals}</b></p>
                <p>Opis posiłku: ${recipe.description}</p>
                <p>Kalorie: ${recipe.kcal}</p>`;
        });
        recipeContainer.innerHTML += `<p><b>Łączna suma kalorii: ${totalCalories}</b></p>`;

        document.querySelector(`.button-container-${targetType}`).style.display = 'block';
        document.getElementById(`randomize-${targetType}`).style.display = 'block'; // Pokaż przycisk po załadowaniu przepisów
        document.getElementById(`powrot-${targetType}`).style.display = 'block'; // Pokaż przycisk po załadowaniu przepisów

    } else if (!isAbortet) {
        recipeContainer.textContent = "Nie znaleziono kombinacji posiłków.";
    }
    const recipesSection = document.getElementById(`result-${targetType}`);
    if (recipesSection) {
        recipesSection.style.display = 'block';
    } else {
        console.error(`Element o ID result-${targetType} nie istnieje.`);
    }

    setTimeout(() => {
        recipeContainer.scrollTop = 0;
    }, 0);
}

async function randomizeMenu(targetType) {

    // Użyj globalnej zmiennej CPM
    const cpm = globalCPM;

    if (isNaN(cpm)) {
        console.error("Wartość CPM nie jest liczbą.");
        return;
    }
    // Ukryj aktualny jadłospis
    const recipeContainer = document.getElementById(`recipes-content-${targetType}`);
    recipeContainer.style.display = 'none';

    // Ukryj przycisk "Losuj inny jadłospis"
    const randomizeButton = document.getElementById(`randomize-${targetType}`);
    randomizeButton.style.display = 'none';

    // Pokaż kółko ładowania
    document.getElementById(`loading-spinner-${targetType}`).style.display = 'block';

    // Pobierz nowe przepisy dla CPM
    const recipes = await fetchRecipes(cpm);
    // console.log(`Pobrane przepisy dla ${targetType}:`, recipes);
    displayRecipes(recipes, targetType);

    // Ukryj kółko ładowania
    document.getElementById(`loading-spinner-${targetType}`).style.display = 'none';
    // Pokaż nowy jadłospis
    recipeContainer.style.display = 'block';
    // Ukryj przycisk "Losuj inny jadłospis"
    const randomizeButton1 = document.getElementById(`randomize-${targetType}`);
    randomizeButton1.style.display = 'block';
}
function resetCards() {

    if (window.innerWidth <= 768) { // Sprawdź, czy szerokość okna jest mniejsza lub równa 768px
        resetUI(); // Najpierw zresetuj interfejs
        document.querySelectorAll('.card').forEach(card => {
            card.classList.remove('flipped'); // Przywróć karty do pierwotnej pozycji
        });
    }
    abortController.abort();
    document.querySelectorAll('.informacje-man, .informacje-woman').forEach(info => {
        info.classList.remove('active');
        info.style.display = 'none';
    });

    document.querySelectorAll('.card').forEach(card => {
        card.classList.remove('flipped');
        card.querySelector('.result-container').classList.remove('active');
        card.querySelector('.form-container').classList.remove('active');
        card.querySelector('video').style.display = 'block';
        card.querySelector('.overlay').style.display = 'block';


        const ppmValueElementMan = document.getElementById('ppm-value-man');
        const ppmValueElementWoman = document.getElementById('ppm-value-woman');
        const resultTextMan = document.getElementById('result-text-man');
        const resultTextWoman = document.getElementById('result-text-woman');
        const cpmValueElementMan = document.getElementById('cpm-value-man');
        const cpmValueElementWoman = document.getElementById('cpm-value-woman');
        const resultCPMTextMan = document.getElementById('result-cpm-man');
        const resultCPMTextWoman = document.getElementById('result-cpm-woman');
        const bmiValueElementMan = document.getElementById('bmi-value-man');
        const bmiValueElementWoman = document.getElementById('bmi-value-woman');
        const resultBMITextMan = document.getElementById('result-bmi-man');
        const resultBMITextWoman = document.getElementById('result-bmi-woman');

        const result = document.getElementById('result');
        if (result) {
            result.textContent = "";
        }
        if (result) {
            result.style.display = 'inline-block';
        }

        if (ppmValueElementMan) {
            ppmValueElementMan.textContent = "";
        }
        if (ppmValueElementWoman) {
            ppmValueElementWoman.textContent = "";
        }
        if (resultTextMan) {
            resultTextMan.style.display = 'block';
        }
        if (resultTextWoman) {
            resultTextWoman.style.display = 'block';
        }
        if (cpmValueElementMan) {
            cpmValueElementMan.textContent = "";
        }
        if (cpmValueElementWoman) {
            cpmValueElementWoman.textContent = "";
        }
        if (resultCPMTextMan) {
            resultCPMTextMan.style.display = 'block';
        }
        if (resultCPMTextWoman) {
            resultCPMTextWoman.style.display = 'block';
        }
        if (bmiValueElementMan) {
            bmiValueElementMan.textContent = "";
        }
        if (bmiValueElementWoman) {
            bmiValueElementWoman.textContent = "";
        }
        if (resultBMITextMan) {
            resultBMITextMan.style.display = 'block';
        }
        if (resultBMITextWoman) {
            resultBMITextWoman.style.display = 'block';
        }

        const recipeContainerMan = document.getElementById('recipes-content-man');
        const recipeContainerWoman = document.getElementById('recipes-content-woman');

        if (recipeContainerMan) {
            recipeContainerMan.innerHTML = "";
        }
        if (recipeContainerWoman) {
            recipeContainerWoman.innerHTML = "";
        }
        // Ukryj wykres na obu kartach
        document.getElementById('chart-man').style.display = 'none';
        document.getElementById('chart-woman').style.display = 'none';

        // Ukryj kółko ładowania
        document.getElementById('loading-spinner-man').style.display = 'none';
        document.getElementById('loading-spinner-woman').style.display = 'none';

        // Ukryj sekcje informacji
        document.getElementById('info-man').style.display = 'none';
        document.getElementById('info-woman').style.display = 'none';

        // Ukryj przyciski "Losuj inny jadłospis" na obu stronach
        document.getElementById('randomize-man').style.display = 'none';
        document.getElementById('randomize-woman').style.display = 'none';

        document.getElementById('powrot-man').style.display = 'none';
        document.getElementById('powrot-woman').style.display = 'none';
    });
}

document.querySelectorAll('video').forEach(video => {

    video.addEventListener('click', () => {
        const targetId = video.getAttribute('data-target');
        const form = document.getElementById(targetId);
        form.classList.add('active');

        // Sprawdź, który formularz został kliknięty i wyświetl odpowiednią sekcję informacji
        const informacjeId = targetId === 'man-form' ? 'info-man' : 'info-woman';

        const informacje = document.getElementById(informacjeId);
        informacje.classList.add('active');
        informacje.style.display = 'block';

        if (!video.paused) {
            video.pause();
            video.currentTime = 0;
        }
    });
    video.addEventListener('mouseenter', () => {
        video.play().then(() => {
            // Odtwarzanie wideo rozpoczęło się pomyślnie
        }).catch(error => {
            // Odtwarzanie zostało zablokowane
            console.error("Odtwarzanie zostało zablokowane", error);
        });
    });
    video.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
    });
});