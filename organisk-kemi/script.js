document.addEventListener('DOMContentLoaded', () => {

    // ===================================================================
    // DEL 1: KEMISK GENERATOR (Uppdaterad och inkapslad)
    // ===================================================================

    const kemiskGenerator = {
        data: {
            // BEGRÄNSAD TILL 10 KOLATOMER
            stammar: [
                { c: 1, stam: { sv: 'Met', en: 'Meth' }, alkan: { sv: 'metan', en: 'methane' } },
                { c: 2, stam: { sv: 'Et', en: 'Eth' }, alkan: { sv: 'etan', en: 'ethane' } },
                { c: 3, stam: { sv: 'Prop', en: 'Prop' }, alkan: { sv: 'propan', en: 'propane' } },
                { c: 4, stam: { sv: 'But', en: 'But' }, alkan: { sv: 'butan', en: 'butane' } },
                { c: 5, stam: { sv: 'Pent', en: 'Pent' }, alkan: { sv: 'pentan', en: 'pentane' } },
                { c: 6, stam: { sv: 'Hex', en: 'Hex' }, alkan: { sv: 'hexan', en: 'hexane' } },
                { c: 7, stam: { sv: 'Hept', en: 'Hept' }, alkan: { sv: 'heptan', en: 'heptane' } },
                { c: 8, stam: { sv: 'Okt', en: 'Oct' }, alkan: { sv: 'oktan', en: 'octane' } },
                { c: 9, stam: { sv: 'Non', en: 'Non' }, alkan: { sv: 'nonan', en: 'nonane' } },
                { c: 10, stam: { sv: 'Dek', en: 'Dec' }, alkan: { sv: 'dekan', en: 'decane' } }
            ],
            halogener: [
                { namn: { sv: 'Brom', en: 'Bromo' }, prefix: { sv: 'bromo', en: 'bromo' } },
                { namn: { sv: 'Klor', en: 'Chloro' }, prefix: { sv: 'kloro', en: 'chloro' } },
                { namn: { sv: 'Fluor', en: 'Fluoro' }, prefix: { sv: 'fluoro', en: 'fluoro' } },
                { namn: { sv: 'Jod', en: 'Iodo' }, prefix: { sv: 'jodo', en: 'iodo' } }
            ],
            alkylgrupper: [
                { namn: { sv: 'Metyl', en: 'Methyl' }, c: 1 }, { namn: { sv: 'Etyl', en: 'Ethyl' }, c: 2 },
                { namn: { sv: 'Propyl', en: 'Propyl' }, c: 3 }, { namn: { sv: 'Butyl', en: 'Butyl' }, c: 4 }
            ],
            suffix: {
                an: { sv: 'an', en: 'ane' },
                en: { sv: 'en', en: 'ene' },
                yn: { sv: 'yn', en: 'yne' },
                ol: { sv: 'ol', en: 'ol' },
                on: { sv: 'on', en: 'one' },
                al: { sv: 'al', en: 'al' },
                syra: { sv: 'syra', en: 'oic acid' },
                eter: { sv: 'eter', en: 'ether' },
                yl: { sv: 'yl', en: 'yl' },
                oat: { sv: 'oat', en: 'oate' }
            },
            halogener: [
                { namn: { sv: 'Brom', en: 'Bromo' }, prefix: { sv: 'bromo', en: 'bromo' } },
                { namn: { sv: 'Klor', en: 'Chloro' }, prefix: { sv: 'kloro', en: 'chloro' } },
                { namn: { sv: 'Fluor', en: 'Fluoro' }, prefix: { sv: 'fluoro', en: 'fluoro' } },
                { namn: { sv: 'Jod', en: 'Iodo' }, prefix: { sv: 'jodo', en: 'iodo' } }
            ],
            alkylgrupper: [
                { namn: { sv: 'Metyl', en: 'Methyl' }, c: 1 }, { namn: { sv: 'Etyl', en: 'Ethyl' }, c: 2 },
                { namn: { sv: 'Propyl', en: 'Propyl' }, c: 3 }, { namn: { sv: 'Butyl', en: 'Butyl' }, c: 4 }
            ],
            suffix: {
                an: { sv: 'an', en: 'ane' },
                en: { sv: 'en', en: 'ene' },
                yn: { sv: 'yn', en: 'yne' },
                ol: { sv: 'ol', en: 'ol' },
                on: { sv: 'on', en: 'one' },
                al: { sv: 'al', en: 'al' },
                syra: { sv: 'syra', en: 'oic acid' },
                eter: { sv: 'eter', en: 'ether' },
                yl: { sv: 'yl', en: 'yl' },
                oat: { sv: 'oat', en: 'oate' }
            },
            grupper: ['Alkan', 'Alken', 'Alkyn', 'Alkohol', 'Keton', 'Aldehyd', 'Karboxylsyra', 'Halogenalkan', 'Eter', 'Ester']
        },

        slumpaTal: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
        slumpaElement: (arr) => arr[kemiskGenerator.slumpaTal(0, arr.length - 1)],

        genereraEttNamn(grupp) {
            // Systematiska grupper (plockar från en färdig lista)
            if (grupp === 'Ester') {
                const alkylStam = this.slumpaElement(this.data.stammar);
                const syraStam = this.slumpaElement(this.data.stammar);
                return {
                    sv: `${alkylStam.stam.sv}${this.data.suffix.yl.sv}${syraStam.stam.sv}${this.data.suffix.oat.sv}`,
                    en: `${alkylStam.stam.en}${this.data.suffix.yl.en}${syraStam.stam.en}${this.data.suffix.oat.en}`
                };
            }
            if (grupp === 'Eter') {
                const stam1 = this.slumpaElement(this.data.stammar);
                const stam2 = this.slumpaElement(this.data.stammar);
                const alkyls_sv = [`${stam1.stam.sv}${this.data.suffix.yl.sv}`, `${stam2.stam.sv}${this.data.suffix.yl.sv}`].sort();
                const alkyls_en = [`${stam1.stam.en}${this.data.suffix.yl.en}`, `${stam2.stam.en}${this.data.suffix.yl.en}`].sort();
                return {
                    sv: `${alkyls_sv[0]}${alkyls_sv[1]}${this.data.suffix.eter.sv}`,
                    en: `${alkyls_en[0]}${alkyls_en[1]}${this.data.suffix.eter.en}`
                };
            }

            // Slumpmässiga grupper med substituenter
            const grund = this.data.stammar[this.slumpaTal(2, this.data.stammar.length - 1)]; // C3-C10
            let ledigaPositioner = Array.from({ length: grund.c }, (_, i) => i + 1);
            let huvudgruppPos = null;
            let suffixKey = 'an';
            let typ = grupp.toLowerCase();
            if (typ === 'halogenalkan') typ = 'alkan';

            // Logik för att sätta huvudgrupp och suffix
            switch (typ) {
                case 'alken':
                    huvudgruppPos = this.slumpaTal(1, grund.c - 1);
                    suffixKey = 'en';
                    break;
                case 'alkyn':
                    huvudgruppPos = this.slumpaTal(1, grund.c - 1);
                    suffixKey = 'yn';
                    break;
                case 'alkohol':
                    huvudgruppPos = this.slumpaTal(1, grund.c);
                    suffixKey = 'ol';
                    ledigaPositioner = ledigaPositioner.filter(p => p !== huvudgruppPos);
                    break;
                case 'keton':
                    if (grund.c < 3) return this.genereraEttNamn(grupp); // Försök igen om kedjan är för kort
                    huvudgruppPos = this.slumpaTal(2, grund.c - 1);
                    suffixKey = 'on';
                    ledigaPositioner = ledigaPositioner.filter(p => p !== huvudgruppPos);
                    break;
                case 'aldehyd':
                    suffixKey = 'al';
                    ledigaPositioner.shift(); // Ta bort pos 1
                    break;
                case 'karboxylsyra':
                    suffixKey = 'syra';
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
                
                const sub = subTyp === 'halogen'
                    ? this.slumpaElement(this.data.halogener)
                    : this.slumpaElement(this.data.alkylgrupper);
                
                substituenter.push({ position, namn: sub.namn });
            }

            // Montera namnet
            const subGrupper = {};
            substituenter.forEach(s => {
                const namnKey = s.namn.sv; // Använd svenska som nyckel
                if (!subGrupper[namnKey]) subGrupper[namnKey] = { positions: [], namn: s.namn };
                subGrupper[namnKey].positions.push(s.position);
            });

            const diTriPrefix = ['', '', 'di', 'tri'];
            
            const createPrefix = (lang) => {
                const prefixDelar = Object.values(subGrupper).map(sub => {
                    sub.positions.sort((a, b) => a - b);
                    const namn = sub.namn[lang];
                    return `${sub.positions.join(',')}-${diTriPrefix[sub.positions.length]}${namn}`;
                }).sort((a, b) => a.replace(/[^a-zA-Z]/g, '').localeCompare(b.replace(/[^a-zA-Z]/g, '')));
                return prefixDelar.join('-').toLowerCase();
            };

            const prefix_sv = createPrefix('sv');
            const prefix_en = createPrefix('en');

            const suffix = this.data.suffix[suffixKey];

            const createSlutligtNamn = (prefix, lang) => {
                // Korrekt avkapning: -an (sv, 2 tecken), -ane (en, 3 tecken)
                const sliceIndex = lang === 'sv' ? -2 : -3;
                const bas = grund.alkan[lang].slice(0, sliceIndex); 

                if (['alkohol', 'keton', 'alken', 'alkyn'].includes(typ)) {
                    return `${prefix ? prefix + '-' : ''}${huvudgruppPos}-${bas}${suffix[lang]}`;
                } else if (['aldehyd', 'karboxylsyra'].includes(typ)) {
                    return `${prefix ? prefix + '-' : ''}${bas}${suffix[lang]}`;
                } else { // Alkaner (inkl. Halogenalkaner)
                    return `${prefix ? prefix + '-' : ''}${grund.alkan[lang]}`;
                }
            };

            return {
                sv: createSlutligtNamn(prefix_sv, 'sv'),
                en: createSlutligtNamn(prefix_en, 'en')
            };
        }
    };

    // ===================================================================
    // DEL 2: UI-LOGIK
    // ===================================================================

    let jmolApplet = null; // Flyttad hit för att undvika ReferenceError

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
        const namnObjekt = kemiskGenerator.genereraEttNamn(slumpadGrupp);

        if (!namnObjekt) {
            console.error("Kunde inte generera ett namn, försöker igen...");
            genereraNyttNamn();
            return;
        }
        
        console.log('Engelskt namn:', namnObjekt.en);
        // Spara det engelska namnet för framtida bruk, t.ex. i ett data-attribut
        namnDisplay.dataset.enName = namnObjekt.en; 
        namnDisplay.textContent = namnObjekt.sv;

        // Rendera den nya molekylen
        renderMolekyl(namnObjekt.en);
    }

    // Event listeners
    generateBtn.addEventListener('click', genereraNyttNamn);
    
    valjAllaBtn.addEventListener('click', () => {
        checkboxes.forEach(cb => cb.checked = true);
    });
    
    avvaljAllaBtn.addEventListener('click', () => {
        checkboxes.forEach(cb => cb.checked = false);
    });

    // ===================================================================
    // DEL 3: JSMOL-INTEGRATION
    // ===================================================================
    
    const jmolContainer = document.getElementById('jmol-container');

    const JmolInfo = {
        width: '100%',
        height: '100%',
        debug: false,
        color: '#ffffff',
        j2sPath: 'https://chemapps.stolaf.edu/jmol/jsmol/j2s',
        use: 'HTML5',
        readyFunction: (applet) => {
            jmolApplet = applet;
            console.log('✅ JSmol ready');
            // Generera första namnet och molekylen när JSmol är redo
            genereraNyttNamn();
        }
    };

    function renderMolekyl(namn) {
        if (jmolApplet && namn) {
            console.log(`Rendering: ${namn}`);
            const script = `load $${namn}; spin off;`;
            Jmol.script(jmolApplet, script);
        }
    }

    // Starta JSmol
    jmolContainer.innerHTML = Jmol.getAppletHtml("jmolApplet0", JmolInfo);
});