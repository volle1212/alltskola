document.addEventListener('DOMContentLoaded', () => {
    // --- DOM-element ---
    const uppgiftTextEl = document.getElementById('uppgift-text');
    const checkBtn = document.getElementById('check-btn');
    const nextBtn = document.getElementById('next-btn');
    const checkboxes = document.querySelectorAll('.tempus-val input[type="checkbox"]');
    const showStemCheckbox = document.getElementById('show-stem');
    const bablaLink = document.getElementById('babla-link');

    // Checkboxar för verbtyper
    const typeRegularCheckbox = document.getElementById('type-regular');
    const typeIrregularCheckbox = document.getElementById('type-irregular');

    // Input-fält för pronomen
    const inputFields = {
        yo: document.getElementById('yo'),
        tu: document.getElementById('tu'),
        el: document.getElementById('el'),
        nosotros: document.getElementById('nosotros'),
        vosotros: document.getElementById('vosotros'),
        ellos: document.getElementById('ellos'),
    };

    // Feedback-ikoner
    const feedbackIcons = {
        yo: document.getElementById('feedback-yo'),
        tu: document.getElementById('feedback-tu'),
        el: document.getElementById('feedback-el'),
        nosotros: document.getElementById('feedback-nosotros'),
        vosotros: document.getElementById('feedback-vosotros'),
        ellos: document.getElementById('feedback-ellos'),
    };
    
    const pronouns = ['yo', 'tu', 'el', 'nosotros', 'vosotros', 'ellos'];

    // --- Verblistor ---
    const regularVerbs = [
        'hablar', 'cantar', 'estudiar', 'comprar', 'trabajar', 
        'comer', 'beber', 'aprender', 'correr', 'comprender', 
        'vivir', 'escribir', 'abrir', 'decidir', 'recibir'
    ];

    // Alla oregelbundna verb som systemet känner till
    const irregularVerbs = ['poder', 'poner', 'querer', 'decir', 'hacer', 'tener', 'venir'];

    // --- Override-konfiguration (Oregelbundna böjningar) ---
    const verbOverrides = {
        poder: {
            // Endast preteritum (ingen imperativ)
            Preteritum: { yo: 'pude', tu: 'pudiste', el: 'pudo', nosotros: 'pudimos', vosotros: 'pudisteis', ellos: 'pudieron' }
        },
        querer: {
            // Endast preteritum (ingen imperativ enligt önskemål)
            Preteritum: { yo: 'quise', tu: 'quisiste', el: 'quiso', nosotros: 'quisimos', vosotros: 'quisisteis', ellos: 'quisieron' }
        },
        // --- De 5 verben som ska ha Imperativ-undantag ---
        decir: {
            Preteritum: { yo: 'dije', tu: 'dijiste', el: 'dijo', nosotros: 'dijimos', vosotros: 'dijisteis', ellos: 'dijeron' },
            Imperativ: { yo: '-', tu: 'di', el: 'diga', nosotros: 'digamos', vosotros: 'decid', ellos: 'digan' }
        },
        hacer: {
            Preteritum: { yo: 'hice', tu: 'hiciste', el: 'hizo', nosotros: 'hicimos', vosotros: 'hicisteis', ellos: 'hicieron' },
            Imperativ: { yo: '-', tu: 'haz', el: 'haga', nosotros: 'hagamos', vosotros: 'haced', ellos: 'hagan' }
        },
        poner: {
            Preteritum: { yo: 'puse', tu: 'pusiste', el: 'puso', nosotros: 'pusimos', vosotros: 'pusisteis', ellos: 'pusieron' },
            Imperativ: { yo: '-', tu: 'pon', el: 'ponga', nosotros: 'pongamos', vosotros: 'poned', ellos: 'pongan' }
        },
        tener: {
            Preteritum: { yo: 'tuve', tu: 'tuviste', el: 'tuvo', nosotros: 'tuvimos', vosotros: 'tuvisteis', ellos: 'tuvieron' },
            Imperativ: { yo: '-', tu: 'ten', el: 'tenga', nosotros: 'tengamos', vosotros: 'tened', ellos: 'tengan' }
        },
        venir: {
            Preteritum: { yo: 'vine', tu: 'viniste', el: 'vino', nosotros: 'vinimos', vosotros: 'vinisteis', ellos: 'vinieron' },
            Imperativ: { yo: '-', tu: 'ven', el: 'venga', nosotros: 'vengamos', vosotros: 'venid', ellos: 'vengan' }
        }
    };

    let currentCorrectAnswers = {};
    let currentStem = '';
    let currentTense = '';

    // --- Huvudlogik för böjningar ---
    function getConjugations(verb, tense) {
        // 1. KONTROLLERA UNDANTAG FÖRST
        if (verbOverrides[verb] && verbOverrides[verb][tense]) {
            return verbOverrides[verb][tense];
        }

        // 2. REGELBUNDEN ALGORITM (Fallback)
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
            case 'Imperativ':
                if (ending === 'ar') { conjugations = { yo: '-', tu: stem + 'a', el: stem + 'e', nosotros: stem + 'emos', vosotros: stem + 'ad', ellos: stem + 'en' }; }
                else if (ending === 'er') { conjugations = { yo: '-', tu: stem + 'e', el: stem + 'a', nosotros: stem + 'amos', vosotros: stem + 'ed', ellos: stem + 'an' }; }
                else if (ending === 'ir') { conjugations = { yo: '-', tu: stem + 'e', el: stem + 'a', nosotros: stem + 'amos', vosotros: stem + 'id', ellos: stem + 'an' }; }
                break;
        }
        return conjugations;
    }

    function setInputStatus(disabled) {
        pronouns.forEach(p => inputFields[p].disabled = disabled);
    }

    // --- Starta ny runda ---
    function startNewRound() {
        // 1. Hämta valda tempus
        const selectedTenses = Array.from(checkboxes)
            .filter(cb => cb.checked && cb.name !== 'verb-type' && cb.id !== 'show-stem' && cb.id !== 'type-regular' && cb.id !== 'type-irregular')
            .map(cb => cb.value);

        // 2. Bygg verblistan baserat på verbtyp-checkboxarna
        let availableVerbs = [];
        if (typeRegularCheckbox.checked) {
            availableVerbs = availableVerbs.concat(regularVerbs);
        }
        if (typeIrregularCheckbox.checked) {
            availableVerbs = availableVerbs.concat(irregularVerbs);
        }

        // 3. Validering (Förhindra start om inget är valt)
        if (selectedTenses.length === 0) {
            uppgiftTextEl.textContent = "Välj minst ett tempus.";
            currentStem = '';
            setInputStatus(true);
            bablaLink.style.display = 'none'; 
            return;
        }
        if (availableVerbs.length === 0) {
            uppgiftTextEl.textContent = "Välj minst en verbtyp (Regelbundna och/eller Oregelbundna).";
            currentStem = '';
            setInputStatus(true);
            bablaLink.style.display = 'none';
            return;
        }

        // Allt ok - aktivera input
        setInputStatus(false);
        bablaLink.style.display = 'inline-block';
        
        // 4. Välj slumpmässigt verb och tempus
        const randomVerb = availableVerbs[Math.floor(Math.random() * availableVerbs.length)];
        currentStem = randomVerb.slice(0, -2); 
        
        currentTense = selectedTenses[Math.floor(Math.random() * selectedTenses.length)];

        // 5. Uppdatera UI
        uppgiftTextEl.textContent = `Böj verbet "${randomVerb}" i ${currentTense}.`;
        
        // Uppdatera bab.la-länken
        bablaLink.href = `https://sv.bab.la/verb/spansk/${randomVerb}`;

        // Hämta facit
        currentCorrectAnswers = getConjugations(randomVerb, currentTense);

        // 6. Återställ och konfigurera fälten
        pronouns.forEach(pronoun => {
            let shouldDisable = false;

            // REGEL: I Imperativ ska vi bara fylla i: Tú, Vosotros, Usted (El) & Ustedes (Ellos).
            // Därmed inaktiverar vi "Yo" och "Nosotros".
            if (currentTense === 'Imperativ' && (pronoun === 'yo' || pronoun === 'nosotros')) {
                shouldDisable = true;
            }

            // Återställ UI först
            inputFields[pronoun].style.borderColor = '';
            feedbackIcons[pronoun].className = 'feedback-icon'; 

            if (shouldDisable) {
                // Inaktivera fältet
                inputFields[pronoun].value = '-';
                inputFields[pronoun].disabled = true;
                inputFields[pronoun].style.backgroundColor = '#f0f0f0';
                
                // VIKTIGT: Sätt facit till '-' så att det rättas som "rätt"
                currentCorrectAnswers[pronoun] = '-';
            } else {
                // Aktivera fältet
                inputFields[pronoun].disabled = false;
                inputFields[pronoun].value = ''; // Töm först
                
                if (showStemCheckbox.checked) {
                    inputFields[pronoun].value = currentStem;
                }
                inputFields[pronoun].style.backgroundColor = ''; 
            }
        });
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

                if (correctAnswer && removeAccents(correctAnswer) === userAnswer && correctAnswer !== '-') {
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

    function handleShowStemToggle() {
        if (!currentStem) return;
        const isChecked = showStemCheckbox.checked;
        pronouns.forEach(pronoun => {
            // Uppdaterad logik: Hoppa över om fältet är inaktiverat (t.ex. Yo/Nosotros i Imperativ)
            if (inputFields[pronoun].disabled) return;

            const currentVal = inputFields[pronoun].value;
            
            if (isChecked) {
                if (currentVal === '') inputFields[pronoun].value = currentStem;
            } else {
                if (currentVal === currentStem) inputFields[pronoun].value = '';
            }
        });
    }

    // --- Event Listeners ---
    checkBtn.addEventListener('click', checkAnswers);
    nextBtn.addEventListener('click', startNewRound);
    
    // Lyssna på alla checkboxar (utom show-stem) för att trigga ny runda direkt
    checkboxes.forEach(cb => {
        if (cb.id !== 'show-stem') {
            cb.addEventListener('change', startNewRound);
        }
    });

    typeRegularCheckbox.addEventListener('change', startNewRound);
    typeIrregularCheckbox.addEventListener('change', startNewRound);

    showStemCheckbox.addEventListener('change', handleShowStemToggle);

    // Starta appen
    startNewRound();
});