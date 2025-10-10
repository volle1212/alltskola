document.addEventListener('DOMContentLoaded', () => {

    // ===================================================================
    // DEL 1: KEMISK GENERATOR (Uppdaterad och inkapslad)
    // ===================================================================

    const kemiskGenerator = {
    data: {
        // LIMITED TO 10 CARBON ATOMS
        stammar: [
            { c: 1, stam: 'Meth', alkan: 'methane' }, { c: 2, stam: 'Eth', alkan: 'ethane' },
            { c: 3, stam: 'Prop', alkan: 'propane' }, { c: 4, stam: 'But', alkan: 'butane' },
            { c: 5, stam: 'Pent', alkan: 'pentane' }, { c: 6, stam: 'Hex', alkan: 'hexane' },
            { c: 7, stam: 'Hept', alkan: 'heptane' }, { c: 8, stam: 'Oct', alkan: 'octane' },
            { c: 9, stam: 'Non', alkan: 'nonane' }, { c: 10, stam: 'Dec', alkan: 'decane' }
        ],
        halogener: [
            { namn: 'Bromo', prefix: 'bromo' }, { namn: 'Chloro', prefix: 'chloro' },
            { namn: 'Fluoro', prefix: 'fluoro' }, { namn: 'Iodo', prefix: 'iodo' }
        ],
        alkylgrupper: [
            { namn: 'Methyl', c: 1 }, { namn: 'Ethyl', c: 2 },
            { namn: 'Propyl', c: 3 }, { namn: 'Butyl', c: 4 }
        ],
        grupper: ['Alkane', 'Alkene', 'Alkyne', 'Alcohol', 'Ketone', 'Aldehyde', 'Carboxylic acid', 'Haloalkane', 'Ether', 'Ester']
    },

    slumpaTal: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    slumpaElement: (arr) => arr[kemiskGenerator.slumpaTal(0, arr.length - 1)],

    genereraEttNamn(grupp) {
        // Systematic groups (from predefined lists)
        if (grupp === 'Ester') {
            const alkyls = this.data.stammar.map(s => `${s.stam}yl`);
            const syror = this.data.stammar.map(s => `${s.stam}anoate`);
            return `${this.slumpaElement(alkyls)}${this.slumpaElement(syror)}`;
        }
        if (grupp === 'Ether') {
            const alkyls = this.data.stammar.map(s => `${s.stam}yl`);
            const sorterade = [this.slumpaElement(alkyls), this.slumpaElement(alkyls)].sort();
            return `${sorterade[0]}${sorterade[1]}ether`;
        }

        // Randomized groups with substituents
        const grund = this.data.stammar[this.slumpaTal(2, this.data.stammar.length - 1)]; // C3–C10
        let ledigaPositioner = Array.from({ length: grund.c }, (_, i) => i + 1);
        let huvudgruppPos = null;
        let suffix = 'ane';
        let typ = grupp.toLowerCase();
        if (typ === 'haloalkane') typ = 'alkane';

        // Determine functional group and suffix
        switch (typ) {
            case 'alkene':
                huvudgruppPos = this.slumpaTal(1, grund.c - 1);
                suffix = 'ene';
                break;
            case 'alkyne':
                huvudgruppPos = this.slumpaTal(1, grund.c - 1);
                suffix = 'yne';
                break;
            case 'alcohol':
                huvudgruppPos = this.slumpaTal(1, grund.c);
                suffix = 'ol';
                ledigaPositioner = ledigaPositioner.filter(p => p !== huvudgruppPos);
                break;
            case 'ketone':
                if (grund.c < 3) return this.genereraEttNamn(grupp); // retry if too short
                huvudgruppPos = this.slumpaTal(2, grund.c - 1);
                suffix = 'one';
                ledigaPositioner = ledigaPositioner.filter(p => p !== huvudgruppPos);
                break;
            case 'aldehyde':
                suffix = 'al';
                ledigaPositioner.shift(); // remove position 1
                break;
            case 'carboxylic acid':
                suffix = 'oic acid';
                ledigaPositioner.shift(); // remove position 1
                break;
        }

        // Select and place substituents
        const antalSubstituenter = grupp === 'Haloalkane' ? this.slumpaTal(1, 2) : this.slumpaTal(0, 2);
        if (antalSubstituenter > ledigaPositioner.length) return this.genereraEttNamn(grupp);

        const substituenter = [];
        for (let i = 0; i < antalSubstituenter; i++) {
            const posIndex = this.slumpaTal(0, ledigaPositioner.length - 1);
            const position = ledigaPositioner.splice(posIndex, 1)[0];

            let subTyp = this.slumpaElement(['halogen', 'alkyl']);
            if (grupp === 'Haloalkane') subTyp = 'halogen';
            
            const subNamn = subTyp === 'halogen'
                ? this.slumpaElement(this.data.halogener).namn
                : this.slumpaElement(this.data.alkylgrupper).namn;
            
            substituenter.push({ position, namn: subNamn });
        }

        // Assemble name
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

        // FIX: Proper assembly for all groups
        const bas = grund.alkan.slice(0, -2);
        let slutligtNamn;
        
        if (['alcohol', 'ketone', 'alkene', 'alkyne'].includes(typ)) {
            slutligtNamn = `${prefixStr ? prefixStr + '-' : ''}${huvudgruppPos}-${bas}${suffix}`;
        } else if (['aldehyde', 'carboxylic acid'].includes(typ)) {
            slutligtNamn = `${prefixStr ? prefixStr + '-' : ''}${bas}${suffix}`;
        } else { // Alkanes
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