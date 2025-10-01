document.addEventListener('DOMContentLoaded', () => {
    // DOM-element
    const uppgiftTextEl = document.getElementById('uppgift-text');
    const checkBtn = document.getElementById('check-btn');
    const nextBtn = document.getElementById('next-btn');
    const checkboxes = document.querySelectorAll('.tempus-val input[type="checkbox"]');

    const inputs = {
        yo: document.getElementById('yo'),
        tu: document.getElementById('tu'),
        el: document.getElementById('el'),
        nosotros: document.getElementById('nosotros'),
        vosotros: document.getElementById('vosotros'),
        ellos: document.getElementById('ellos'),
    };

    const feedbackSpans = {
        yo: document.getElementById('feedback-yo'),
        tu: document.getElementById('feedback-tu'),
        el: document.getElementById('feedback-el'),
        nosotros: document.getElementById('feedback-nosotros'),
        vosotros: document.getElementById('feedback-vosotros'),
        ellos: document.getElementById('feedback-ellos'),
    };
    
    const pronouns = ['yo', 'tu', 'el', 'nosotros', 'vosotros', 'ellos'];

    // Databas med verb
    const verbs = [
        'hablar', 'cantar', 'estudiar', 'comprar', 'trabajar', 
        'comer', 'beber', 'aprender', 'correr', 'comprender', 
        'vivir', 'escribir', 'abrir', 'decidir', 'recibir'
    ];

    let currentCorrectAnswers = {};

    function getConjugations(verb, tense) {
        const stem = verb.slice(0, -2);
        const ending = verb.slice(-2);
        let conjugations = {};

        switch (tense) {
            case 'Presens':
                if (ending === 'ar') {
                    conjugations = { yo: stem + 'o', tu: stem + 'as', el: stem + 'a', nosotros: stem + 'amos', vosotros: stem + 'áis', ellos: stem + 'an' };
                } else if (ending === 'er') {
                    conjugations = { yo: stem + 'o', tu: stem + 'es', el: stem + 'e', nosotros: stem + 'emos', vosotros: stem + 'éis', ellos: stem + 'en' };
                } else if (ending === 'ir') {
                    conjugations = { yo: stem + 'o', tu: stem + 'es', el: stem + 'e', nosotros: stem + 'imos', vosotros: stem + 'ís', ellos: stem + 'en' };
                }
                break;
            case 'Preteritum':
                if (ending === 'ar') {
                    conjugations = { yo: stem + 'é', tu: stem + 'aste', el: stem + 'ó', nosotros: stem + 'amos', vosotros: stem + 'asteis', ellos: stem + 'aron' };
                } else if (ending === 'er' || ending === 'ir') {
                    conjugations = { yo: stem + 'í', tu: stem + 'iste', el: stem + 'ió', nosotros: stem + 'imos', vosotros: stem + 'isteis', ellos: stem + 'ieron' };
                }
                break;
            case 'Imperfekt':
                if (ending === 'ar') {
                    conjugations = { yo: stem + 'aba', tu: stem + 'abas', el: stem + 'aba', nosotros: stem + 'ábamos', vosotros: stem + 'abais', ellos: stem + 'aban' };
                } else if (ending === 'er' || ending === 'ir') {
                    conjugations = { yo: stem + 'ía', tu: stem + 'ías', el: stem + 'ía', nosotros: stem + 'íamos', vosotros: stem + 'íais', ellos: stem + 'ían' };
                }
                break;
        }
        return conjugations;
    }

    // UPPDATERAD: Funktion för att starta en ny runda
    function startNewRound() {
        // Läs av vilka tempus som är valda
        const selectedTenses = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        // Om inga tempus är valda, avbryt
        if (selectedTenses.length === 0) {
            uppgiftTextEl.textContent = "Välj minst ett tempus för att börja öva.";
            return;
        }

        pronouns.forEach(pronoun => {
            inputs[pronoun].value = '';
            inputs[pronoun].classList.remove('correct', 'incorrect');
            feedbackSpans[pronoun].className = 'feedback';
        });

        const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
        const randomTense = selectedTenses[Math.floor(Math.random() * selectedTenses.length)];

        uppgiftTextEl.textContent = `Böj verbet "${randomVerb}" i ${randomTense}.`;
        currentCorrectAnswers = getConjugations(randomVerb, randomTense);
    }

    // NYTT: Hjälpfunktion för att ta bort accenter
    function removeAccents(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    // UPPDATERAD: Funktion för att rätta svaren
    function checkAnswers() {
        const hints = []; // Samla ledtrådar här

        pronouns.forEach(pronoun => {
            const userAnswer = inputs[pronoun].value.trim().toLowerCase();
            const correctAnswer = currentCorrectAnswers[pronoun];
            
            inputs[pronoun].classList.remove('correct', 'incorrect');
            feedbackSpans[pronoun].className = 'feedback';

            if (userAnswer === correctAnswer) {
                inputs[pronoun].classList.add('correct');
                feedbackSpans[pronoun].classList.add('feedback-correct');
            } else {
                inputs[pronoun].classList.add('incorrect');
                feedbackSpans[pronoun].classList.add('feedback-incorrect');

                // NYTT: Kontrollera om felet bara är en saknad accent
                if (correctAnswer && removeAccents(correctAnswer) === userAnswer) {
                    hints.push(`Kom ihåg accenten för "${pronoun}": ${correctAnswer}`);
                }
            }
        });

        // Om det finns några ledtrådar, visa dem i en enkel popup
        if (hints.length > 0) {
            alert("Nästan rätt! Några ledtrådar:\n\n" + hints.join('\n'));
        }
    }

    // Event listeners
    checkBtn.addEventListener('click', checkAnswers);
    nextBtn.addEventListener('click', startNewRound);
    // Lyssna på ändringar i checkboxarna också, för att starta en ny runda direkt
    checkboxes.forEach(cb => cb.addEventListener('change', startNewRound));

    // Starta första rundan
    startNewRound();
});