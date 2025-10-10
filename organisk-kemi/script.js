document.addEventListener('DOMContentLoaded', () => {

    // ===================================================================
    // DEL 1: KEMISK GENERATOR (Ny approach för engelska namn)
    // ===================================================================
    const kemiskGenerator = {
        data: {
             stammar: [
                { c: 1, stam: 'Met', alkan: 'metan', alkan_en: 'methane' }, { c: 2, stam: 'Et', alkan: 'etan', alkan_en: 'ethane' },
                { c: 3, stam: 'Prop', alkan: 'propan', alkan_en: 'propane' }, { c: 4, stam: 'But', alkan: 'butan', alkan_en: 'butane' },
                { c: 5, stam: 'Pent', alkan: 'pentan', alkan_en: 'pentane' }, { c: 6, stam: 'Hex', alkan: 'hexan', alkan_en: 'hexane' },
                { c: 7, stam: 'Hept', alkan: 'heptan', alkan_en: 'heptane' }, { c: 8, stam: 'Okt', alkan: 'oktan', alkan_en: 'octane' },
                { c: 9, stam: 'Non', alkan: 'nonan', alkan_en: 'nonane' }, { c: 10, stam: 'Dek', alkan: 'dekan', alkan_en: 'decane' }
            ],
            halogener: [
                { namn: 'Brom', namn_en: 'Bromo' }, { namn: 'Klor', namn_en: 'Chloro' },
                { namn: 'Fluor', namn_en: 'Fluoro' }, { namn: 'Jod', namn_en: 'Iodo' }
            ],
            alkylgrupper: [
                { namn: 'Metyl', namn_en: 'Methyl' }, { namn: 'Etyl', namn_en: 'Ethyl' },
                { namn: 'Propyl', namn_en: 'Propyl' }, { namn: 'Butyl', namn_en: 'Butyl' }
            ],
            suffix_map: {
                'en': 'ene', 'yn': 'yne', 'ol': 'ol', 'on': 'one', 'al': 'al',
                'syra': 'oic acid'
            },
            grupper: ['Alkan', 'Alken', 'Alkyn', 'Alkohol', 'Keton', 'Aldehyd', 'Karboxylsyra', 'Halogenalkan', 'Eter', 'Ester']
        },
        slumpaTal: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
        slumpaElement: (arr) => arr[kemiskGenerator.slumpaTal(0, arr.length - 1)],

        genereraEttNamn(grupp) {
             if (grupp === 'Ester' || grupp === 'Eter') {
                const alkyl_sv = this.slumpaElement(this.data.stammar).stam + 'yl';
                const alkyl_en = this.slumpaElement(this.data.stammar).stam.toLowerCase() + 'yl';
                return { svensktNamn: `${alkyl_sv}propanoat`, engelsktNamn: `${alkyl_en} propanoate` };
            }

            const grund = this.data.stammar[this.slumpaTal(2, this.data.stammar.length - 1)];
            let typ = grupp.toLowerCase();
            if (typ === 'halogenalkan') typ = 'alkan';

            let suffix_sv = 'an';
            let huvudgruppPos = null;
            let ledigaPositioner = Array.from({ length: grund.c }, (_, i) => i + 1);
            
            switch (typ) {
                case 'alken': suffix_sv = 'en'; huvudgruppPos = this.slumpaTal(1, grund.c - 1); break;
                case 'alkyn': suffix_sv = 'yn'; huvudgruppPos = this.slumpaTal(1, grund.c - 1); break;
                case 'alkohol': suffix_sv = 'ol'; huvudgruppPos = this.slumpaTal(1, grund.c); ledigaPositioner = ledigaPositioner.filter(p => p !== huvudgruppPos); break;
                case 'keton': if (grund.c < 3) return this.genereraEttNamn(grupp); suffix_sv = 'on'; huvudgruppPos = this.slumpaTal(2, grund.c - 1); ledigaPositioner = ledigaPositioner.filter(p => p !== huvudgruppPos); break;
                case 'aldehyd': suffix_sv = 'al'; ledigaPositioner.shift(); break;
                case 'karboxylsyra': suffix_sv = 'syra'; ledigaPositioner.shift(); break;
            }

            const antalSubstituenter = grupp === 'Halogenalkan' ? 1 : this.slumpaTal(0, 1);
            if (antalSubstituenter > ledigaPositioner.length) return this.genereraEttNamn(grupp);
            
            const substituenter = [];
            for (let i = 0; i < antalSubstituenter; i++) {
                const position = this.slumpaElement(ledigaPositioner);
                ledigaPositioner = ledigaPositioner.filter(p => p !== position);
                let subTyp = this.slumpaElement(['halogen', 'alkyl']);
                if (grupp === 'Halogenalkan') subTyp = 'halogen';
                const sub = subTyp === 'halogen' ? this.slumpaElement(this.data.halogener) : this.slumpaElement(this.data.alkylgrupper);
                substituenter.push({ position, ...sub });
            }
            substituenter.sort((a,b) => a.namn_en.localeCompare(b.namn_en));

            const prefix_sv = substituenter.map(s => `${s.position}-${s.namn.toLowerCase()}`).join('-');
            const prefix_en = substituenter.map(s => `${s.position}-${s.namn_en.toLowerCase()}`).join('-');
            
            const suffix_en = this.data.suffix_map[suffix_sv];
            let sv, en;
            
            // ### NY GENERATIONSLOGIK FÖR ENGELSKA NAMN ###
            const bas_en = grund.alkan_en; // t.ex. 'hexane'

            if (huvudgruppPos) {
                sv = `${prefix_sv ? prefix_sv + '-' : ''}${huvudgruppPos}-${grund.alkan.slice(0,-2)}${suffix_sv}`;
                // Ny, mer API-vänlig engelsk variant: 'hexane-3-ol' istället för '3-hexanol'
                en = `${prefix_en ? prefix_en + '-' : ''}${bas_en.slice(0, -1)}${suffix_en === 'ene' || suffix_en === 'yne' ? '' : 'an'}-${huvudgruppPos}-${suffix_en}`;
                if (suffix_en === 'ene') en = `${prefix_en ? prefix_en + '-' : ''}${bas_en.slice(0, -1)}-${huvudgruppPos}-${suffix_en}`; // hex-2-ene
                if (suffix_en === 'yne') en = `${prefix_en ? prefix_en + '-' : ''}${bas_en.slice(0, -1)}-${huvudgruppPos}-${suffix_en}`; // hex-2-yne
            } else if (typ === 'karboxylsyra') {
                sv = `${prefix_sv ? prefix_sv + '-' : ''}${grund.alkan.slice(0,-2)}syra`;
                en = `${prefix_en ? prefix_en + '-' : ''}${bas_en.slice(0, -1)}oic acid`;
            } else if (typ === 'aldehyd') {
                sv = `${prefix_sv ? prefix_sv + '-' : ''}${grund.alkan.slice(0,-2)}al`;
                en = `${prefix_en ? prefix_en + '-' : ''}${bas_en.slice(0,-1)}al`;
            } else { // Alkan
                sv = `${prefix_sv ? prefix_sv + '-' : ''}${grund.alkan}`;
                en = `${prefix_en ? prefix_en + '-' : ''}${bas_en}`;
            }

            return { svensktNamn: sv.replace(/--/g, '-'), engelsktNamn: en.replace(/--/g, '-') };
        }
    };

    // ===================================================================
    // DEL 2: JSMOL & UI-LOGIK
    // ===================================================================

    let jmolReady = false;
    const JmolInfo = { /* ... oförändrad ... */ };
    jmolContainer.innerHTML = Jmol.getAppletHtml('jmolApplet', JmolInfo); // oförändrad
    
    // ... Alla DOM-element-deklarationer är oförändrade ...

    // NYTT: Hämta element för debug-rutan
    const debugInput = document.getElementById('debug-input');
    const debugBtn = document.getElementById('debug-btn');
    
    async function renderMolecule(name_en) { /* ... oförändrad från förra gången ... */ }

    function genereraNyttNamn() { /* ... oförändrad ... */ }
    
    // NYTT: Event listener för debug-knappen
    debugBtn.addEventListener('click', () => {
        const nameToTest = debugInput.value.trim();
        if (nameToTest) {
            namnDisplay.textContent = `Testar manuellt namn:`;
            renderMolecule(nameToTest);
        } else {
            jmolStatus.textContent = "Skriv ett engelskt namn i debug-rutan.";
        }
    });

    // ... resten av filen (event listeners, etc) är oförändrad ...

    // Fyll hela filen nedanför denna kommentar för att vara säker
    const namnDisplay = document.getElementById('kemiskt-namn');
    const generateBtn = document.getElementById('generate-btn');
    const checkboxGrid = document.querySelector('.checkbox-grid');
    const valjAllaBtn = document.getElementById('valj-alla');
    const avvaljAllaBtn = document.getElementById('avvalj-alla');
    const jmolContainer = document.getElementById('jmol-container');
    const jmolStatus = document.getElementById('jmol-status');
    
    kemiskGenerator.data.grupper.forEach(grupp => {
        const div = document.createElement('div'); div.className = 'checkbox-grupp';
        const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.id = grupp.toLowerCase(); checkbox.value = grupp; checkbox.checked = true;
        const label = document.createElement('label'); label.htmlFor = grupp.toLowerCase(); label.textContent = grupp;
        div.appendChild(checkbox); div.appendChild(label); checkboxGrid.appendChild(div);
    });
    const checkboxes = document.querySelectorAll('.checkbox-grid input[type="checkbox"]');

    generateBtn.addEventListener('click', genereraNyttNamn);
    valjAllaBtn.addEventListener('click', () => checkboxes.forEach(cb => cb.checked = true));
    avvaljAllaBtn.addEventListener('click', () => checkboxes.forEach(cb => cb.checked = false));
    namnDisplay.textContent = 'Välkommen! Klicka på "Generera nytt namn".';
});