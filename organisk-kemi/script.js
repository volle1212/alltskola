document.addEventListener('DOMContentLoaded', () => {

    // ===================================================================
    // DEL 1: KEMISK GENERATOR (Uppdaterad och inkapslad)
    // ===================================================================

    const kemiskGenerator = {
        data: {
            // BEGRÄNSAD TILL 10 KOLATOMER
            stammar: [
                { c: 1, stam: 'Met', alkan: 'metan' }, { c: 2, stam: 'Et', alkan: 'etan' },
                { c: 3, stam: 'Prop', alkan: 'propan' }, { c: 4, stam: 'But', alkan: 'butan' },
                { c: 5, stam: 'Pent', alkan: 'pentan' }, { c: 6, stam: 'Hex', alkan: 'hexan' },
                { c: 7, stam: 'Hept', alkan: 'heptan' }, { c: 8, stam: 'Okt', alkan: 'oktan' },
                { c: 9, stam: 'Non', alkan: 'nonan' }, { c: 10, stam: 'Dek', alkan: 'dekan' }
            ],
            halogener: [
                { namn: 'Brom', prefix: 'bromo' }, { namn: 'Klor', prefix: 'kloro' },
                { namn: 'Fluor', prefix: 'fluoro' }, { namn: 'Jod', prefix: 'jodo' }
            ],
            alkylgrupper: [
                { namn: 'Metyl', c: 1 }, { namn: 'Etyl', c: 2 },
                { namn: 'Propyl', c: 3 }, { namn: 'Butyl', c: 4 }
            ],
            grupper: ['Alkan', 'Alken', 'Alkyn', 'Alkohol', 'Keton', 'Aldehyd', 'Karboxylsyra', 'Halogenalkan', 'Eter', 'Ester']
        },

        slumpaTal: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
        slumpaElement: (arr) => arr[kemiskGenerator.slumpaTal(0, arr.length - 1)],

        genereraEttNamn(grupp) {
            // Systematiska grupper (plockar från en färdig lista)
            if (grupp === 'Ester') {
                const alkyls = this.data.stammar.map(s => `${s.stam}yl`);
                const syror = this.data.stammar.map(s => `${s.stam}anoat`);
                return `${this.slumpaElement(alkyls)}${this.slumpaElement(syror)}`;
            }
            if (grupp === 'Eter') {
                const alkyls = this.data.stammar.map(s => `${s.stam}yl`);
                const sorterade = [this.slumpaElement(alkyls), this.slumpaElement(alkyls)].sort();
                return `${sorterade[0]}${sorterade[1]}eter`;
            }

            // Slumpmässiga grupper med substituenter
            const grund = this.data.stammar[this.slumpaTal(2, this.data.stammar.length - 1)]; // C3-C10
            let ledigaPositioner = Array.from({ length: grund.c }, (_, i) => i + 1);
            let huvudgruppPos = null;
            let suffix = 'an';
            let typ = grupp.toLowerCase();
            if (typ === 'halogenalkan') typ = 'alkan';

            // Logik för att sätta huvudgrupp och suffix
            switch (typ) {
                case 'alken':
                    huvudgruppPos = this.slumpaTal(1, grund.c - 1);
                    suffix = 'en';
                    break;
                case 'alkyn':
                    huvudgruppPos = this.slumpaTal(1, grund.c - 1);
                    suffix = 'yn';
                    break;
                case 'alkohol':
                    huvudgruppPos = this.slumpaTal(1, grund.c);
                    suffix = 'ol';
                    ledigaPositioner = ledigaPositioner.filter(p => p !== huvudgruppPos);
                    break;
                case 'keton':
                    if (grund.c < 3) return this.genereraEttNamn(grupp); // Försök igen om kedjan är för kort
                    huvudgruppPos = this.slumpaTal(2, grund.c - 1);
                    suffix = 'on';
                    ledigaPositioner = ledigaPositioner.filter(p => p !== huvudgruppPos);
                    break;
                case 'aldehyd':
                    suffix = 'al';
                    ledigaPositioner.shift(); // Ta bort pos 1
                    break;
                case 'karboxylsyra':
                    suffix = 'syra';
                    ledigaPositioner.shift(); // Ta bort pos 1
                    break;
            }

            // Välj och placera substituenter
            const antalSubstituenter = grupp === 'Halogenalkan' ? this.slumpaTal(1, 2) : this.slumpaTal(0, 2);
            if (antalSubstituenter > ledigaPositioner.length) return this.genereraEttNamn(grupp);

            const substituenter = [];
            for (let i = 0; i < antalSubstituenter; i++) {
                const posIndex = this.slumpaTal(0, ledigaPositioner.length - 1);
                const position = ledigaPositioner.splice(posIndex, 1)[0];

                let subTyp = this.slumpaElement(['halogen', 'alkyl']);
                if (grupp === 'Halogenalkan') subTyp = 'halogen';
                
                const subNamn = subTyp === 'halogen'
                    ? this.slumpaElement(this.data.halogener).namn
                    : this.slumpaElement(this.data.alkylgrupper).namn;
                
                substituenter.push({ position, namn: subNamn });
            }

            // Montera namnet
            const subGrupper = {};
            substituenter.forEach(s => {
                if (!subGrupper[s.namn]) subGrupper[s.namn] = [];
                subGrupper[s.namn].push(s.position);
            });
            const diTriPrefix = ['', '', 'di', 'tri'];
            const prefixDelar = Object.entries(subGrupper).map(([namn, pos]) => {
                pos.sort((a, b) => a - b);
                return `${pos.join(',')}-${diTriPrefix[pos.length]}${namn}`;
            }).sort((a, b) => a.replace(/[^a-zA-Z]/g, '').localeCompare(b.replace(/[^a-zA-Z]/g, '')));
            const prefixStr = prefixDelar.join('-').toLowerCase();

            // FIX: Korrekt montering för alla grupper
            const bas = grund.alkan.slice(0, -2);
            let slutligtNamn;
            
            if (['alkohol', 'keton', 'alken', 'alkyn'].includes(typ)) {
                slutligtNamn = `${prefixStr ? prefixStr + '-' : ''}${huvudgruppPos}-${bas}${suffix}`;
            } else if (['aldehyd', 'karboxylsyra'].includes(typ)) {
                slutligtNamn = `${prefixStr ? prefixStr + '-' : ''}${bas}${suffix}`;
            } else { // Alkaner
                slutligtNamn = `${prefixStr ? prefixStr + '-' : ''}${grund.alkan}`;
            }
            return slutligtNamn;
        }
    };

    // ===================================================================
    // DEL 2: UI-LOGIK
    // ===================================================================

    const namnDisplay = document.getElementById('kemiskt-namn');
    const generateBtn = document.getElementById('generate-btn');
    const checkboxGrid = document.querySelector('.checkbox-grid');
    const valjAllaBtn = document.getElementById('valj-alla');
    const avvaljAllaBtn = document.getElementById('avvalj-alla');
    
    // Fyll i checkbox-griden dynamiskt
    kemiskGenerator.data.grupper.forEach(grupp => {
        const div = document.createElement('div');
        div.className = 'checkbox-grupp';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = grupp.toLowerCase();
        checkbox.value = grupp;
        checkbox.checked = true; // Alla är valda från start
        
        const label = document.createElement('label');
        label.htmlFor = grupp.toLowerCase();
        label.textContent = grupp;
        
        div.appendChild(checkbox);
        div.appendChild(label);
        checkboxGrid.appendChild(div);
    });

    const checkboxes = document.querySelectorAll('.checkbox-grid input[type="checkbox"]');

    function genereraNyttNamn() {
        const valdaGrupper = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        if (valdaGrupper.length === 0) {
            namnDisplay.textContent = 'Välj minst en grupp.';
            return;
        }

        const slumpadGrupp = kemiskGenerator.slumpaElement(valdaGrupper);
        const nyttNamn = kemiskGenerator.genereraEttNamn(slumpadGrupp);
        namnDisplay.textContent = nyttNamn;
    }

    // Event listeners
    generateBtn.addEventListener('click', genereraNyttNamn);
    
    valjAllaBtn.addEventListener('click', () => {
        checkboxes.forEach(cb => cb.checked = true);
    });
    
    avvaljAllaBtn.addEventListener('click', () => {
        checkboxes.forEach(cb => cb.checked = false);
    });

    // Generera ett namn direkt när sidan laddas
    genereraNyttNamn();
});