document.addEventListener('DOMContentLoaded', () => {
    // DOM-element
    const uppgiftTextEl = document.getElementById('uppgift-text');
    const checkBtn = document.getElementById('check-btn');
    const nextBtn = document.getElementById('next-btn');
    const checkboxes = document.querySelectorAll('.tempus-val input[type="checkbox"]');
    // NYTT: Hämta den nya checkboxen
    const showStemCheckbox = document.getElementById('show-stem');

    const inputFields = {
        yo: document.getElementById('yo'),
        tu: document.getElementById('tu'),
        el: document.getElementById('el'),
        nosotros: document.getElementById('nosotros'),
        vosotros: document.getElementById('vosotros'),
        ellos: document.getElementById('ellos'),
    };

    const feedbackIcons = {
        yo: document.getElementById('feedback-yo'),
        tu: document.getElementById('feedback-tu'),
        el: document.getElementById('feedback-el'),
        nosotros: document.getElementById('feedback-nosotros'),
        vosotros: document.getElementById('feedback-vosotros'),
        ellos: document.getElementById('feedback-ellos'),
    };
    
    const pronouns = ['yo', 'tu', 'el', 'nosotros', 'vosotros', 'ellos'];

    const verbs = [
        'hablar', 'cantar', 'estudiar', 'comprar', 'trabajar', 
        'comer', 'beber', 'aprender', 'correr', 'comprender', 
        'vivir', 'escribir', 'abrir', 'decidir', 'recibir'
    ];

    let currentCorrectAnswers = {};
    // NYTT: Variabel för att spara den nuvarande verbstammen
    let currentStem = '';

    function getConjugations(verb, tense) {
        const stem = verb.slice(0, -2);
        let conjugations = {};
        // (Resten av funktionen är oförändrad...)
        switch (tense) {
            case 'Presens':
                if (ending === 'ar') { conjugations = { yo: stem + 'o', tu: stem + 'as', el: stem + 'a', nosotros: stem + 'amos', vosotros: stem + 'áis', ellos: stem + 'an' }; } 
                else if (ending === 'er') { conjugations = { yo: stem + 'o', tu: stem + 'es', el: stem + 'e', nosotros: stem + 'emos', vosotros: stem + 'éis', ellos: stem + 'en' }; }
                else if (ending === 'ir') { conjugations = { yo: stem + 'o', tu: stem + 'es', el: stem + 'e', nosotros: stem + 'imos', vosotros: stem + 'ís', ellos: stem + 'en' }; }
                break;
            case 'Preteritum':
                if (ending === 'ar') { conjugations = { yo: stem + 'é', tu: stem + 'aste', el: stem + 'ó', nosotros: stem + 'amos', vosotros: stem + 'asteis', ellos: stem + 'aron' }; } 
                else if (ending === 'er' || ending === 'ir') { conjugations = { yo: stem + 'í', tu: stem + 'iste', el: stem + 'ió', nosotros: stem + 'imos', vosotros: stem + 'isteis', ellos: stem + 'ieron' }; }
                break;
            case 'Imperfekt':
                if (ending === 'ar') { conjugations = { yo: stem + 'aba', tu: stem + 'abas', el: stem + 'aba', nosotros: stem + 'ábamos', vosotros: stem + 'abais', ellos: stem + 'aban' }; }
                else if (ending === 'er' || ending === 'ir') { conjugations = { yo: stem + 'ía', tu: stem + 'ías', el: stem + 'ía', nosotros: stem + 'íamos', vosotros: stem + 'íais', ellos: stem + 'ían' }; }
                break;
        }
        return conjugations;
    }

    function startNewRound() {
        const selectedTenses = Array.from(checkboxes)
            .filter(cb => cb.checked && cb.id !== 'show-stem') // Ignorera den nya checkboxen här
            .map(cb => cb.value);

        if (selectedTenses.length === 0) {
            uppgiftTextEl.textContent = "Välj minst ett tempus för att börja öva.";
            currentStem = ''; // Rensa stammen om inget är valt
            return;
        }
        
        const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
        // UPPDATERAD: Spara stammen globalt
        currentStem = randomVerb.slice(0, -2); 
        
        pronouns.forEach(pronoun => {
            // UPPDATERAD: Fyll i stam om checkboxen är ikryssad, annars töm fältet.
            inputFields[pronoun].value = showStemCheckbox.checked ? currentStem : '';
            inputFields[pronoun].style.borderColor = '';
            feedbackIcons[pronoun].className = 'feedback-icon'; 
        });

        const randomTense = selectedTenses[Math.floor(Math.random() * selectedTenses.length)];

        uppgiftTextEl.textContent = `Böj verbet "${randomVerb}" i ${randomTense}.`;
        currentCorrectAnswers = getConjugations(randomVerb, randomTense);
    }

    function removeAccents(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function checkAnswers() {
        const hints = [];

        pronouns.forEach(pronoun => {
            const userAnswer = inputFields[pronoun].value.trim().toLowerCase();
            const correctAnswer = currentCorrectAnswers[pronoun];
            
            feedbackIcons[pronoun].className = 'feedback-icon';
            inputFields[pronoun].style.borderColor = '';

            if (userAnswer === correctAnswer) {
                feedbackIcons[pronoun].classList.add('fa-solid', 'fa-circle-check', 'show');
                inputFields[pronoun].style.borderColor = 'var(--success)';
            } else {
                feedbackIcons[pronoun].classList.add('fa-solid', 'fa-circle-xmark', 'show');
                inputFields[pronoun].style.borderColor = 'var(--error)';

                if (correctAnswer && removeAccents(correctAnswer) === userAnswer) {
                    hints.push(`Kom ihåg accenten för "${pronoun}": ${correctAnswer}`);
                }
            }
        });

        if (hints.length > 0) {
            setTimeout(() => {
                alert("Nästan rätt! Några ledtrådar:\n\n" + hints.join('\n'));
            }, 100);
        }
    }

    // NYTT: Funktion som körs när man klickar i/ur "Visa verbstam"-rutan
    function handleShowStemToggle() {
        if (!currentStem) return; // Gör inget om inget verb är aktivt

        const isChecked = showStemCheckbox.checked;
        pronouns.forEach(pronoun => {
            const currentVal = inputFields[pronoun].value;

            if (isChecked) {
                // Fyll i stammen. Detta skriver över tomma fält.
                inputFields[pronoun].value = currentStem;
            } else {
                // Om rutan avbockas, ta bara bort stammen om det är det *enda* som står i fältet.
                // Detta förhindrar att ett påbörjat svar raderas.
                if (currentVal === currentStem) {
                    inputFields[pronoun].value = '';
                }
            }
        });
    }

    // Event listeners
    checkBtn.addEventListener('click', checkAnswers);
    nextBtn.addEventListener('click', startNewRound);
    checkboxes.forEach(cb => {
        if (cb.id !== 'show-stem') { // Lyssna bara på tempus-rutorna för att starta ny runda
            cb.addEventListener('change', startNewRound);
        }
    });

    // NYTT: Lägg till en event listener för den nya checkboxen
    showStemCheckbox.addEventListener('change', handleShowStemToggle);

    startNewRound();
});