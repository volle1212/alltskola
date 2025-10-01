document.addEventListener('DOMContentLoaded', () => {
    // DOM-element
    const uppgiftTextEl = document.getElementById('uppgift-text');
    const checkBtn = document.getElementById('check-btn');
    const nextBtn = document.getElementById('next-btn');
    const checkboxes = document.querySelectorAll('.tempus-val input[type="checkbox"]');

    // UPPDATERAD: bytt namn för tydlighet (inputs -> inputFields)
    const inputFields = {
        yo: document.getElementById('yo'),
        tu: document.getElementById('tu'),
        el: document.getElementById('el'),
        nosotros: document.getElementById('nosotros'),
        vosotros: document.getElementById('vosotros'),
        ellos: document.getElementById('ellos'),
    };

    // UPPDATERAD: bytt namn för tydlighet (feedbackSpans -> feedbackIcons)
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

    function getConjugations(verb, tense) {
        const stem = verb.slice(0, -2);
        const ending = verb.slice(-2);
        let conjugations = {};

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
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        if (selectedTenses.length === 0) {
            uppgiftTextEl.textContent = "Välj minst ett tempus för att börja öva.";
            return;
        }

        pronouns.forEach(pronoun => {
            inputFields[pronoun].value = '';
            inputFields[pronoun].style.borderColor = ''; // Återställ border
            // UPPDATERAD: Återställ ikonen
            feedbackIcons[pronoun].className = 'feedback-icon'; 
        });

        const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
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
            
            // Återställ ikon och border innan ny kontroll
            feedbackIcons[pronoun].className = 'feedback-icon';
            inputFields[pronoun].style.borderColor = '';

            if (userAnswer === correctAnswer) {
                // UPPDATERAD: Lägg till Font Awesome klasser för rätt svar
                feedbackIcons[pronoun].classList.add('fa-solid', 'fa-circle-check', 'show');
                inputFields[pronoun].style.borderColor = 'var(--success)';
            } else {
                // UPPDATERAD: Lägg till Font Awesome klasser för fel svar
                feedbackIcons[pronoun].classList.add('fa-solid', 'fa-circle-xmark', 'show');
                inputFields[pronoun].style.borderColor = 'var(--error)';

                if (correctAnswer && removeAccents(correctAnswer) === userAnswer) {
                    hints.push(`Kom ihåg accenten för "${pronoun}": ${correctAnswer}`);
                }
            }
        });

        if (hints.length > 0) {
            setTimeout(() => { // Liten fördröjning så ikonerna hinner visas
                alert("Nästan rätt! Några ledtrådar:\n\n" + hints.join('\n'));
            }, 100);
        }
    }

    // Event listeners
    checkBtn.addEventListener('click', checkAnswers);
    nextBtn.addEventListener('click', startNewRound);
    checkboxes.forEach(cb => cb.addEventListener('change', startNewRound));

    startNewRound();
});