document.addEventListener('DOMContentLoaded', () => {
    // === 1. DOM-ELEMENT OCH GRUNDLÄGGANDE INSTÄLLNINGAR ===
    const displayArea = document.getElementById('molecule-display-area');
    const answerInput = document.getElementById('answer-input');
    const checkBtn = document.getElementById('check-btn');
    const nextBtn = document.getElementById('next-btn');
    const feedbackArea = document.getElementById('feedback-area');
    const checkboxes = document.querySelectorAll('.class-selection input[type="checkbox"]');

    let currentMolecule = null; // Här lagras den genererade molekylen

    // === 2. DATABAS MED REGLER FÖR FUNKTIONELLA GRUPPER ===
    // Prioriteringsordningen är avgörande för korrekt namngivning.
    const functionalGroups = {
        'Karboxylsyra': { priority: 10, suffix: 'syra', type: 'terminal', display: 'COOH' },
        'Ester': { priority: 9, suffix: 'oat', type: 'terminal', display: 'COO' },
        'Aldehyd': { priority: 8, suffix: 'al', type: 'terminal', display: 'CHO' },
        'Keton': { priority: 7, suffix: 'on', type: 'internal', display: '=O' },
        'Alkohol': { priority: 6, suffix: 'ol', prefix: 'hydroxi', type: 'substituent', display: 'OH' },
        'Amin': { priority: 5, suffix: 'amin', prefix: 'amino', type: 'substituent', display: 'NH₂' },
        'Alkyn': { priority: 4, suffix: 'yn', type: 'bond' },
        'Alken': { priority: 3, suffix: 'en', type: 'bond' },
        'Eter': { priority: 2, prefix: 'alkoxi', type: 'special' },
        'Halogenalkan': { priority: 1, prefix: 'halogen', type: 'substituent' },
        'Alkan': { priority: 0, suffix: 'an', type: 'base' }
    };

    const chainNameMap = { 3: 'prop', 4: 'but', 5: 'pent', 6: 'hex', 7: 'hept' };
    const alkylMap = { 1: 'metyl', 2: 'etyl' };
    // PATCH: Ändrat till din föredragna nomenklatur (klor, brom, etc.)
    const halogenMap = { F: 'fluor', Cl: 'klor', Br: 'brom', I: 'jod' };
    const countPrefixMap = { 2: 'di', 3: 'tri' };

    // === 3. MOLEKYLGENERERING (BYGGER "ATOM-ARRAYEN") ===
    function generateMolecule(selectedClasses) {
        const chainLength = 4 + Math.floor(Math.random() * 3); // 4-6 kolatomer
        const principalClass = selectedClasses
            .sort((a, b) => functionalGroups[b].priority - functionalGroups[a].priority)[0];
        const groupInfo = functionalGroups[principalClass];

        let atomArray = Array.from({ length: chainLength }, () => ({
            bond: '-', top: null, bottom: null
        }));
        let moleculeData = { atomArray, principalClass, esterAlkylGroup: null, etherAlkoxyGroup: null };

        let occupiedPositions = [];
        if (groupInfo.type === 'terminal') {
            atomArray[0].top = { type: principalClass, display: groupInfo.display };
            occupiedPositions.push(1);
            if (principalClass === 'Ester') {
                const alkylLength = 1 + Math.floor(Math.random() * 2);
                moleculeData.esterAlkylGroup = alkylMap[alkylLength];
            }
        } else if (groupInfo.type === 'internal') {
            const pos = 2 + Math.floor(Math.random() * (chainLength - 2));
            atomArray[pos-1].top = { type: principalClass, display: groupInfo.display };
            occupiedPositions.push(pos);
        } else if (groupInfo.type === 'substituent') {
            const pos = 1 + Math.floor(Math.random() * chainLength);
            atomArray[pos-1].top = { type: principalClass, display: groupInfo.display };
            occupiedPositions.push(pos);
        } else if (groupInfo.type === 'bond') {
            const pos = 1 + Math.floor(Math.random() * (chainLength - 1));
            atomArray[pos-1].bond = principalClass === 'Alken' ? '=' : '≡';
            occupiedPositions.push(pos, pos + 1);
        } else if (principalClass === 'Eter') {
            const alkoxyLength = 1 + Math.floor(Math.random() * 2);
            moleculeData.etherAlkoxyGroup = { name: `${alkylMap[alkoxyLength]}oxi` };
        }

        if (Math.random() > 0.5) {
            let availablePos = Array.from({ length: chainLength }, (_, i) => i + 1).filter(p => !occupiedPositions.includes(p));
            if (availablePos.length > 0) {
                const pos = availablePos[Math.floor(Math.random() * availablePos.length)];
                const isMethyl = Math.random() > 0.5;
                if (isMethyl) {
                     atomArray[pos-1].bottom = { type: 'Alkyl', display: 'CH₃', name: 'metyl' };
                } else {
                    const halogenSymbol = Object.keys(halogenMap)[Math.floor(Math.random() * 4)];
                    atomArray[pos-1].bottom = { type: 'Halogenalkan', display: halogenSymbol, name: halogenMap[halogenSymbol] };
                }
            }
        }
        
        atomArray.forEach((atom, i) => {
            let bonds = 0;
            bonds += (i > 0) ? (atomArray[i-1].bond === '=' ? 2 : atomArray[i-1].bond === '≡' ? 3 : 1) : 0;
            bonds += (i < chainLength - 1) ? (atom.bond === '=' ? 2 : atom.bond === '≡' ? 3 : 1) : 0;
            if (atom.top) bonds += (atom.top.type === 'Keton') ? 2 : 1;
            if (atom.bottom) bonds += 1;
            if (atom.top && functionalGroups[atom.top.type]?.type === 'terminal') bonds = 4;
            atom.hydrogens = Math.max(0, 4 - bonds);
        });
        return moleculeData;
    }

    // === 4. NAMNGIVNING (OMSKRIVEN MED ROBUST LOGIK) ===
    function generateIUPACName(molecule) {
        const { atomArray, principalClass, esterAlkylGroup, etherAlkoxyGroup } = molecule;
        const chainLength = atomArray.length;

        // Steg 1: Hitta positioner för alla grupper
        let principalGroupPos = -1;
        let bondPositions = {}; // {en: [], yn: []}
        let substituents = [];

        atomArray.forEach((atom, i) => {
            const pos = i + 1;
            if (atom.top && atom.top.type === principalClass) principalGroupPos = pos;
            if (atom.bottom) substituents.push({ name: atom.bottom.name, pos });
            if (atom.bond === '=') bondPositions.en = [...(bondPositions.en || []), pos];
            if (atom.bond === '≡') bondPositions.yn = [...(bondPositions.yn || []), pos];
        });
        
        // Särskilda fall för ester och eter som har enklare namngivning
        if (esterAlkylGroup) return `${esterAlkylGroup}${chainNameMap[chainLength]}oat`;
        if (etherAlkoxyGroup) return `${etherAlkoxyGroup.name}${chainNameMap[chainLength]}an`;

        // Steg 2: Bygg prefix-strängen (t.ex. "3-klor-2-metyl-")
        const prefixStr = substituents
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(p => `${p.pos}-${p.name}`)
            .join('-') + (substituents.length > 0 ? '-' : '');

        // Steg 3: Bygg huvudkedjans namn (t.ex. "butan", "but-1-en", "pentan-2-ol")
        const rootName = chainNameMap[chainLength];
        const groupInfo = functionalGroups[principalClass];
        let mainChainName = '';

        if (groupInfo.priority >= 5) { // Högprioriterade suffix-grupper (alkohol, keton, syra etc.)
            let unsaturation = '';
            if (bondPositions.en) unsaturation = `-${bondPositions.en[0]}-en`;
            if (bondPositions.yn) unsaturation = `-${bondPositions.yn[0]}-yn`;

            let base = `${rootName}${unsaturation || 'an'}`;
            let position = groupInfo.type === 'terminal' ? '' : `-${principalGroupPos}`;

            // Hantera "e-bortfall", t.ex. "hexane-ol" -> "hexanol"
            if (position && unsaturation === '') base = base.slice(0, -1); 
            
            mainChainName = `${base}${position}-${groupInfo.suffix}`;
        } else if (groupInfo.priority >= 3) { // Om alken/alkyn är huvudgruppen
            mainChainName = `${rootName}-${(bondPositions.en || bondPositions.yn)[0]}-${groupInfo.suffix}`;
        } else { // Om det är en alkan eller derivat med låg prio (halogenalkan)
            mainChainName = `${rootName}an`;
        }

        return prefixStr + mainChainName;
    }

    // === 5. RITNING (LÄSER "ATOM-ARRAYEN") ===
    function drawStructure(molecule) {
        const { atomArray } = molecule;
        let top = '', mid = '', bot = '';

        atomArray.forEach((atom, i) => {
            let h_str = atom.hydrogens > 0 ? 'H' + (atom.hydrogens > 1 ? atom.hydrogens : '') : '';
            let mid_part = `C${h_str}`;
            let bond = (i < atomArray.length - 1) ? atom.bond : '';
            
            if (atom.top && functionalGroups[atom.top.type]?.type === 'terminal') {
                mid_part = atom.top.display;
                bond = '';
            }

            let top_part = atom.top && !functionalGroups[atom.top.type]?.type.includes('terminal') ? `|` : ' ';
            let bot_part = atom.bottom ? `|` : ' ';
            let top_display = atom.top && !functionalGroups[atom.top.type]?.type.includes('terminal') ? atom.top.display : ' ';
            let bot_display = atom.bottom ? atom.bottom.display : ' ';

            const len = Math.max(mid_part.length, top_display.length, bot_display.length);

            mid += mid_part.padEnd(len) + bond.padEnd(bond.length * 2);
            top += top_part.padStart(mid_part.length).padEnd(len) + ''.padEnd(bond.length * 2);
            bot += bot_part.padStart(mid_part.length).padEnd(len) + ''.padEnd(bond.length * 2);
            
            if (top_part.trim()) {
                let tempTop = top.split('');
                tempTop[top.lastIndexOf('|')] = top_display;
                top = tempTop.join('');
            }
            if (bot_part.trim()) {
                let tempBot = bot.split('');
                tempBot[bot.lastIndexOf('|')] = bot_display;
                bot = tempBot.join('');
            }
        });
        
        let result = [top, mid, bot].filter(s => s.trim().length > 0).join('\n');
        result = result.replace(/(\d)/g, c => '₀₁₂₃₄₅₆₇₈₉'[c]);
        displayArea.textContent = result;
    }

    // === 6. ANVÄNDARINTERAKTION ===
    function startNewRound() {
        const selectedClasses = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
        if (selectedClasses.length === 0) {
            displayArea.textContent = 'Välj minst en ämnesklass och klicka "Nästa Molekyl".';
            currentMolecule = null;
            return;
        }

        feedbackArea.textContent = '';
        answerInput.value = '';
        answerInput.style.borderColor = '';
        
        currentMolecule = generateMolecule(selectedClasses);
        drawStructure(currentMolecule);
    }

    function checkAnswer() {
        if (!currentMolecule) return;

        const correctAnswer = generateIUPACName(currentMolecule);
        const userAnswer = answerInput.value.trim().toLowerCase().replace(/[\s-]/g, '');
        const formattedCorrectName = correctAnswer.toLowerCase().replace(/[\s-]/g, '');

        if (userAnswer === formattedCorrectName) {
            feedbackArea.textContent = 'Helt rätt! Bra jobbat!';
            feedbackArea.className = 'feedback correct';
            answerInput.style.borderColor = 'var(--success)';
        } else {
            feedbackArea.textContent = `Fel. Rätt svar var: ${correctAnswer}`;
            feedbackArea.className = 'feedback incorrect';
            answerInput.style.borderColor = 'var(--error)';
        }
    }

    // Event listeners
    nextBtn.addEventListener('click', startNewRound);
    checkBtn.addEventListener('click', checkAnswer);
    answerInput.addEventListener('keyup', (e) => e.key === 'Enter' && checkAnswer());
    
    startNewRound();
});