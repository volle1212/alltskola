document.addEventListener('DOMContentLoaded', () => {
    // DOM-element
    const uppgiftTextEl = document.getElementById('uppgift-text');
    const checkBtn = document.getElementById('check-btn');
    const nextBtn = document.getElementById('next-btn');

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

    // Databas med verb och tempus
    const verbs = [
        'hablar', 'cantar', 'estudiar', 'comprar', 'trabajar', // -ar
        'comer', 'beber', 'aprender', 'correr', 'comprender', // -er
        'vivir', 'escribir', 'abrir', 'decidir', 'recibir'     // -ir
    ];
    const tenses = ['Presens', 'Preteritum', 'Imperfekt'];

    let currentCorrectAnswers = {};

    // Funktion för att få fram de korrekta böjningarna
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

            case 'Preteritum': // Pretérito Indefinido
                if (ending === 'ar') {
                    conjugations = { yo: stem + 'é', tu: stem + 'aste', el: stem + 'ó', nosotros: stem + 'amos', vosotros: stem + 'asteis', ellos: stem + 'aron' };
                } else if (ending === 'er' || ending === 'ir') {
                    conjugations = { yo: stem + 'í', tu: stem + 'iste', el: stem + 'ió', nosotros: stem + 'imos', vosotros: stem + 'isteis', ellos: stem + 'ieron' };
                }
                break;
            
            case 'Imperfekt': // Pretérito Imperfecto
                if (ending === 'ar') {
                    conjugations = { yo: stem + 'aba', tu: stem + 'abas', el: stem + 'aba', nosotros: stem + 'ábamos', vosotros: stem + 'abais', ellos: stem + 'aban' };
                } else if (ending === 'er' || ending === 'ir') {
                    conjugations = { yo: stem + 'ía', tu: stem + 'ías', el: stem + 'ía', nosotros: stem + 'íamos', vosotros: stem + 'íais', ellos: stem + 'ían' };
                }
                break;
        }
        return conjugations;
    }

    // Funktion för att starta en ny runda
    function startNewRound() {
        // Rensa alla fält och feedback
        pronouns.forEach(pronoun => {
            inputs[pronoun].value = '';
            inputs[pronoun].classList.remove('correct', 'incorrect');
            feedbackSpans[pronoun].className = 'feedback';
        });

        // Slumpa ett verb och ett tempus
        const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
        const randomTense = tenses[Math.floor(Math.random() * tenses.length)];

        // Visa uppgiften
        uppgiftTextEl.textContent = `Böj verbet "${randomVerb}" i ${randomTense}.`;

        // Hämta och spara de korrekta svaren
        currentCorrectAnswers = getConjugations(randomVerb, randomTense);
    }

    // Funktion för att rätta svaren
    function checkAnswers() {
        pronouns.forEach(pronoun => {
            const userAnswer = inputs[pronoun].value.trim().toLowerCase();
            const correctAnswer = currentCorrectAnswers[pronoun];
            
            // Rensa tidigare feedback
            inputs[pronoun].classList.remove('correct', 'incorrect');
            feedbackSpans[pronoun].className = 'feedback';

            if (userAnswer === correctAnswer) {
                inputs[pronoun].classList.add('correct');
                feedbackSpans[pronoun].classList.add('feedback-correct');
            } else {
                inputs[pronoun].classList.add('incorrect');
                feedbackSpans[pronoun].classList.add('feedback-incorrect');
            }
        });
    }

    // Event listeners för knapparna
    checkBtn.addEventListener('click', checkAnswers);
    nextBtn.addEventListener('click', startNewRound);

    // Starta första rundan när sidan laddas
    startNewRound();
});