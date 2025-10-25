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
                syra: { sv: 'ansyra', en: 'anoicacid' },
                eter: { sv: 'eter', en: 'ether' },
                yl: { sv: 'yl', en: 'yl' },
                oat: { sv: 'anoat', en: 'anoate' },
                amin: { sv: 'anamin', en: 'anamine' }
            },
            grupper: ['Alkan', 'Alken', 'Alkyn', 'Alkohol', 'Keton', 'Aldehyd', 'Karboxylsyra', 'Halogenalkan', 'Eter', 'Ester', 'Amin']
        },

        slumpaTal: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
        slumpaElement: (arr) => arr[kemiskGenerator.slumpaTal(0, arr.length - 1)],

        genereraEttNamn(grupp) {
            // Systematiska grupper (plockar från en färdig lista)
            if (grupp === 'Ester') {
                // Begränsa till max 8 kolatomer för varje del för att undvika för långa namn
                const alkylStam = this.data.stammar[this.slumpaTal(1, 7)]; // C1-C8
                const syraStam = this.data.stammar[this.slumpaTal(1, 7)]; // C1-C8
                const alkylDel_sv = `${alkylStam.stam.sv}${this.data.suffix.yl.sv}`;
                const alkylDel_en = `${alkylStam.stam.en}${this.data.suffix.yl.en}`;
                return {
                    sv: `${alkylDel_sv.charAt(0).toUpperCase() + alkylDel_sv.slice(1).toLowerCase()}${syraStam.stam.sv.toLowerCase()}${this.data.suffix.oat.sv}`,
                    en: `${alkylDel_en.charAt(0).toUpperCase() + alkylDel_en.slice(1).toLowerCase()}${syraStam.stam.en.toLowerCase()}${this.data.suffix.oat.en}`
                };
            }
            if (grupp === 'Eter') {
                const stam1 = this.slumpaElement(this.data.stammar);
                const stam2 = this.slumpaElement(this.data.stammar);
                const alkyls_sv = [`${stam1.stam.sv.toLowerCase()}${this.data.suffix.yl.sv}`, `${stam2.stam.sv.toLowerCase()}${this.data.suffix.yl.sv}`].sort();
                const alkyls_en = [`${stam1.stam.en.toLowerCase()}${this.data.suffix.yl.en}`, `${stam2.stam.en.toLowerCase()}${this.data.suffix.yl.en}`].sort();
                const namn_sv = `${alkyls_sv[0]}${alkyls_sv[1]}${this.data.suffix.eter.sv}`;
                const namn_en = `${alkyls_en[0]}${alkyls_en[1]}${this.data.suffix.eter.en}`;
                return {
                    sv: namn_sv.charAt(0).toUpperCase() + namn_sv.slice(1),
                    en: namn_en.charAt(0).toUpperCase() + namn_en.slice(1)
                };
            }
            if (grupp === 'Amin') {
                // Aminer: primära (R-NH2), sekundära (R-NH-R'), tertiära (R-NR'-R'')
                const typ = this.slumpaElement(['primär', 'sekundär', 'tertiär']);
                const grund = this.data.stammar[this.slumpaTal(1, 6)]; // C1-C7 för enklare namn
                
                if (typ === 'primär') {
                    // R-NH2: alkylamin (inte alkanamin)
                    const alkyl = this.data.alkylgrupper[grund.c - 1]; // -1 för att matcha alkylgrupper array
                    return {
                        sv: `${alkyl.namn.sv.toLowerCase()}amin`,
                        en: `${alkyl.namn.en.toLowerCase()}amine`
                    };
                } else if (typ === 'sekundär') {
                    // R-NH-R': alkylalkylamin eller dialkylamin
                    const alkyl1 = this.data.alkylgrupper[this.slumpaTal(0, 2)]; // metyl, etyl, propyl
                    const alkyl2 = this.data.alkylgrupper[this.slumpaTal(0, 2)];
                    
                    // Om samma alkylgrupper, använd "di-"
                    if (alkyl1.namn.sv === alkyl2.namn.sv) {
                        return {
                            sv: `di${alkyl1.namn.sv.toLowerCase()}amin`,
                            en: `di${alkyl1.namn.en.toLowerCase()}amine`
                        };
                    } else {
                        // Sortera alkylgrupperna alfabetiskt
                        const alkyls = [alkyl1, alkyl2].sort((a, b) => a.namn.sv.localeCompare(b.namn.sv));
                        return {
                            sv: `${alkyls[0].namn.sv.toLowerCase()}${alkyls[1].namn.sv.toLowerCase()}amin`,
                            en: `${alkyls[0].namn.en.toLowerCase()}${alkyls[1].namn.en.toLowerCase()}amine`
                        };
                    }
                } else { // tertiär
                    // R-NR'-R'': trialkylamin eller alkylalkylalkylamin
                    const alkyl1 = this.data.alkylgrupper[this.slumpaTal(0, 2)];
                    const alkyl2 = this.data.alkylgrupper[this.slumpaTal(0, 2)];
                    const alkyl3 = this.data.alkylgrupper[this.slumpaTal(0, 2)];
                    
                    // Om alla samma alkylgrupper, använd "tri-"
                    if (alkyl1.namn.sv === alkyl2.namn.sv && alkyl2.namn.sv === alkyl3.namn.sv) {
                        return {
                            sv: `tri${alkyl1.namn.sv.toLowerCase()}amin`,
                            en: `tri${alkyl1.namn.en.toLowerCase()}amine`
                        };
                    } else {
                        // Sortera alfabetiskt
                        const alkyls = [alkyl1, alkyl2, alkyl3].sort((a, b) => a.namn.sv.localeCompare(b.namn.sv));
                        return {
                            sv: `${alkyls[0].namn.sv.toLowerCase()}${alkyls[1].namn.sv.toLowerCase()}${alkyls[2].namn.sv.toLowerCase()}amin`,
                            en: `${alkyls[0].namn.en.toLowerCase()}${alkyls[1].namn.en.toLowerCase()}${alkyls[2].namn.en.toLowerCase()}amine`
                        };
                    }
                }
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
                case 'alkan':
                    // För alkaner, ta bort pos 1 direkt (annars blir substituent del av kedjan)
                    ledigaPositioner.shift();
                    break;
                case 'alken':
                    // Enligt IUPAC: numrera från det håll som ger lägsta nummer
                    huvudgruppPos = this.slumpaTal(1, Math.ceil((grund.c - 1) / 2));
                    suffixKey = 'en';
                    ledigaPositioner = ledigaPositioner.filter(p => p !== 1);
                    break;
                case 'alkyn':
                    // Enligt IUPAC: numrera från det håll som ger lägsta nummer
                    huvudgruppPos = this.slumpaTal(1, Math.ceil((grund.c - 1) / 2));
                    suffixKey = 'yn';
                    ledigaPositioner = ledigaPositioner.filter(p => p !== 1);
                    break;
                case 'alkohol':
                    huvudgruppPos = this.slumpaTal(1, Math.ceil(grund.c / 2));
                    suffixKey = 'ol';
                    ledigaPositioner = ledigaPositioner.filter(p => p !== huvudgruppPos && p !== 1);
                    break;
                case 'keton':
                    if (grund.c < 3) return this.genereraEttNamn(grupp); // Försök igen om kedjan är för kort
                    // Enligt IUPAC: keton kan vara på pos 2 till mitten, alltid lägsta nummer
                    huvudgruppPos = this.slumpaTal(2, Math.ceil(grund.c / 2));
                    suffixKey = 'on';
                    ledigaPositioner = ledigaPositioner.filter(p => p !== huvudgruppPos && p !== 1);
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

            // Ta bort sista positionen för alla grupper (undvik att substituenter sitter på kedjeslutet)
            // Detta följer IUPAC-regeln att substituenter på kedjeslutet ska räknas in i huvudkedjan
            ledigaPositioner = ledigaPositioner.filter(p => p !== grund.c);
            
            // Välj och placera substituenter
            const antalSubstituenter = grupp === 'Halogenalkan' ? this.slumpaTal(1, 2) : this.slumpaTal(0, 2);
            if (antalSubstituenter > ledigaPositioner.length) return this.genereraEttNamn(grupp);

            const substituenter = [];
            for (let i = 0; i < antalSubstituenter; i++) {
                const posIndex = this.slumpaTal(0, ledigaPositioner.length - 1);
                const position = ledigaPositioner.splice(posIndex, 1)[0];

                let subTyp = this.slumpaElement(['halogen', 'alkyl']);
                if (grupp === 'Halogenalkan') subTyp = 'halogen';
                
                let sub;
                if (subTyp === 'halogen') {
                    sub = this.slumpaElement(this.data.halogener);
                } else {
                    // För alkylgrupper: kontrollera att de inte skapar en längre kedja
                    // Längsta kedjan genom alkyl: max(alkyl.c + position, alkyl.c + grund.c - position + 1)
                    // Detta måste vara <= grund.c, vilket ger: alkyl.c <= min(position - 1, grund.c - position)
                    const maxAlkylStorlek = Math.min(position - 1, grund.c - position);
                    
                    // Filtrera alkylgrupper som är tillräckligt små
                    const tillgangligaAlkylgrupper = this.data.alkylgrupper.filter(a => a.c <= maxAlkylStorlek);
                    
                    // Om inga tillgängliga alkylgrupper, använd halogen istället
                    if (tillgangligaAlkylgrupper.length === 0) {
                        sub = this.slumpaElement(this.data.halogener);
                    } else {
                        sub = this.slumpaElement(tillgangligaAlkylgrupper);
                    }
                }
                
                substituenter.push({ position, namn: sub.namn });
            }

            // IUPAC-regel: numrera från det håll som ger lägsta nummer för substituenter
            // Om position > grund.c/2, konvertera till motsvarande lägre position
            substituenter.forEach(sub => {
                if (sub.position > Math.ceil(grund.c / 2)) {
                    sub.position = grund.c - sub.position + 1;
                }
            });

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
                // Använd stammen från data
                const stam = grund.stam[lang];
                
                // Olika grupper behöver olika konstruktion
                if (typ === 'alken' || typ === 'alkyn') {
                    // Alken/alkyn: stam + suffix (utan "an")
                    return `${prefix ? prefix + '-' : ''}${huvudgruppPos}-${stam.toLowerCase()}${suffix[lang]}`;
                } else if (typ === 'alkohol' || typ === 'keton') {
                    // Alkohol/keton: stam + "an" + suffix
                    const anSuffix = lang === 'sv' ? 'an' : 'an';
                    return `${prefix ? prefix + '-' : ''}${huvudgruppPos}-${stam.toLowerCase()}${anSuffix}${suffix[lang]}`;
                } else if (typ === 'aldehyd') {
                    // Aldehyd: stam + "an" + "al" (utan positionsnummer)
                    const anSuffix = lang === 'sv' ? 'an' : 'an';
                    return `${prefix ? prefix + '-' : ''}${stam.toLowerCase()}${anSuffix}${suffix[lang]}`;
                } else if (typ === 'karboxylsyra') {
                    // Karboxylsyra: stam + suffix (suffix innehåller redan "an")
                    return `${prefix ? prefix + '-' : ''}${stam.toLowerCase()}${suffix[lang]}`;
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
    const visaNamnBtn = document.getElementById('visa-namn-btn');
    const checkboxGrid = document.querySelector('.checkbox-grid');
    const valjAllaBtn = document.getElementById('valj-alla');
    const avvaljAllaBtn = document.getElementById('avvalj-alla');
    
    // Magnus Ehinger länkar för varje ämnesklass
    const ehingerLänkar = {
        'Alkan': 'https://undervisning.ehinger.nu/amnen/kemi-2/lektioner/organiska-molekylers-struktur-och-funktion/kolvaten-alkaner.html',
        'Alken': 'https://undervisning.ehinger.nu/amnen/kemi-2/lektioner/organiska-molekylers-struktur-och-funktion/alkener.html',
        'Alkyn': 'https://undervisning.ehinger.nu/amnen/kemi-2/lektioner/organiska-molekylers-struktur-och-funktion/alkyner.html',
        'Alkohol': 'https://undervisning.ehinger.nu/amnen/kemi-2/lektioner/organiska-molekylers-struktur-och-funktion/alkoholer.html',
        'Keton': 'https://undervisning.ehinger.nu/amnen/kemi-2/lektioner/mer-om-organiska-reaktioner/aldehyder-och-ketoner.html',
        'Aldehyd': 'https://undervisning.ehinger.nu/amnen/kemi-2/lektioner/mer-om-organiska-reaktioner/aldehyder-och-ketoner.html',
        'Karboxylsyra': 'https://undervisning.ehinger.nu/amnen/kemi-2/lektioner/mer-om-organiska-reaktioner/karboxylsyrornas-nomenklatur-mattade-och-omattade-karboxylsyror.html',
        'Halogenalkan': 'https://undervisning.ehinger.nu/amnen/kemi-2/lektioner/organiska-molekylers-struktur-och-funktion/halogenalkaner.html',
        'Eter': 'https://undervisning.ehinger.nu/amnen/kemi-2/lektioner/mer-om-organiska-reaktioner/etrar.html',
        'Ester': 'https://undervisning.ehinger.nu/amnen/kemi-2/lektioner/mer-om-organiska-reaktioner/estrar.html',
        'Amin': 'https://undervisning.ehinger.nu/amnen/kemi-2/lektioner/mer-om-organiska-reaktioner/aminer.html'
    };
    
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
        console.log('Svenskt namn:', namnObjekt.sv);
        
        // Spara namnen och grupp i data-attribut
        namnDisplay.dataset.enName = namnObjekt.en;
        namnDisplay.dataset.svName = namnObjekt.sv;
        namnDisplay.dataset.grupp = slumpadGrupp;
        
        // Visa en placeholder istället för svenska namnet
        namnDisplay.textContent = '❓ Vad heter denna förening?';
        
        // Visa knappen för att avslöja namnet
        visaNamnBtn.style.display = 'inline-flex';
        visaNamnBtn.innerHTML = '<i class="fa-solid fa-eye"></i> Visa svenska namn';
        visaNamnBtn.disabled = false;
        
        // Ta bort tidigare Ehinger-länk om den finns
        const befintligLänk = document.querySelector('.ehinger-länk');
        if (befintligLänk) {
            befintligLänk.remove();
        }

        // Rendera den nya molekylen
        renderMolekyl(namnObjekt.en);
    }

    // Event listeners
    generateBtn.addEventListener('click', genereraNyttNamn);
    
    visaNamnBtn.addEventListener('click', () => {
        // Visa det svenska namnet
        const svensktNamn = namnDisplay.dataset.svName;
        const grupp = namnDisplay.dataset.grupp;
        if (svensktNamn) {
            namnDisplay.textContent = svensktNamn;
            visaNamnBtn.innerHTML = '<i class="fa-solid fa-check"></i> Avslöjat!';
            visaNamnBtn.disabled = true;
            
            // Visa Magnus Ehinger-länk om den finns
            const ehingerLänk = ehingerLänkar[grupp];
            if (ehingerLänk) {
                // Skapa länk-element
                const länkContainer = document.createElement('div');
                länkContainer.style.marginTop = '15px';
                länkContainer.style.textAlign = 'center';
                
                const länk = document.createElement('a');
                länk.href = ehingerLänk;
                länk.target = '_blank';
                länk.style.display = 'inline-block';
                länk.style.padding = '8px 16px';
                länk.style.backgroundColor = '#007bff';
                länk.style.color = 'white';
                länk.style.textDecoration = 'none';
                länk.style.borderRadius = '5px';
                länk.style.fontSize = '14px';
                länk.innerHTML = '<i class="fa-solid fa-external-link-alt"></i> Läs mer om ' + grupp.toLowerCase() + ' hos Magnus Ehinger';
                
                länkContainer.appendChild(länk);
                
                // Ta bort tidigare länk om den finns
                const befintligLänk = document.querySelector('.ehinger-länk');
                if (befintligLänk) {
                    befintligLänk.remove();
                }
                
                länkContainer.className = 'ehinger-länk';
                namnDisplay.parentNode.insertBefore(länkContainer, namnDisplay.nextSibling);
            }

            const chatgptLänk = ("https://chat.openai.com/?q=Förklara%20den%20systatiska%20namngivningen%20av%20följande%20organsiska%20förening,%20enligt%20IUPAC:" + svensktNamn);
            console.log("ChatGPT-länk:", chatgptLänk);
            if (chatgptLänk) {
                // Skapa länk-element
                const länkContainer = document.createElement('div');
                länkContainer.style.marginTop = '15px';
                länkContainer.style.textAlign = 'center';
                
                const länk = document.createElement('a');
                länk.href = chatgptLänk;
                länk.target = '_blank';
                länk.style.display = 'inline-block';
                länk.style.padding = '8px 16px';
                länk.style.backgroundColor = '#007bff';
                länk.style.color = 'white';
                länk.style.textDecoration = 'none';
                länk.style.borderRadius = '5px';
                länk.style.fontSize = '14px';
                länk.innerHTML = '<i class="fa-solid fa-comment"></i> Fråga ChatGPT om' + svensktNamn.toLowerCase() + '';
                
                länkContainer.appendChild(länk);
                
                // Ta bort tidigare länk om den finns
                const befintligLänk = document.querySelector('.chatgpt-länk');
                if (befintligLänk) {
                    befintligLänk.remove();
                }
                
                länkContainer.className = 'chatgpt-länk';
                namnDisplay.parentNode.insertBefore(länkContainer, namnDisplay.nextSibling);
            }
        }
    });
    
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
    let isInitialLoad = true; // Flagga för att undvika oändlig loop

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
            // Generera första namnet ENDAST vid första laddningen
            if (isInitialLoad) {
                isInitialLoad = false;
                genereraNyttNamn();
            }
        }
    };

    // Mappning för triviala namn (ökar chansen att JSmol hittar molekylen)
    const trivialtNamnMapping = {
        // Karboxylsyror
        'methanoic acid': 'formic acid',
        'ethanoic acid': 'acetic acid',
        'propanoic acid': 'propionic acid',
        'butanoic acid': 'butyric acid',
        'pentanoic acid': 'valeric acid',
        'hexanoic acid': 'caproic acid',
        'heptanoic acid': 'enanthic acid',
        'octanoic acid': 'caprylic acid',
        // Aldehyder
        'methanal': 'formaldehyde',
        'ethanal': 'acetaldehyde',
        'propanal': 'propionaldehyde',
        'butanal': 'butyraldehyde',
        // Ketoner
        'propanone': 'acetone',
        '2-butanone': 'methyl ethyl ketone',
        // Alkoholer (vanliga)
        'methanol': 'methyl alcohol',
        'ethanol': 'ethyl alcohol',
        'propanol': 'propyl alcohol',
        '2-propanol': 'isopropyl alcohol',
        // Estrar (vanliga) - utan mellanrum
        'methylmethanoate': 'methyl formate',
        'ethylmethanoate': 'ethyl formate',
        'methylethanoate': 'methyl acetate',
        'ethylethanoate': 'ethyl acetate',
        'propylethanoate': 'propyl acetate',
        'butylethanoate': 'butyl acetate',
        'pentylethanoate': 'pentyl acetate',
        'hexylethanoate': 'hexyl acetate',
        'heptylethanoate': 'heptyl acetate',
        'octylethanoate': 'octyl acetate',
        'nonyloctanoate': 'nonyl octanoate',
        'octyloctanoate': 'octyl octanoate',
        'heptylheptanoate': 'heptyl heptanoate',
        'hexylhexanoate': 'hexyl hexanoate',
        'pentylpentanoate': 'pentyl pentanoate',
        'butylbutanoate': 'butyl butanoate',
        'propylpropanoate': 'propyl propanoate',
        'ethylethanoate': 'ethyl acetate',
        'methylmethanoate': 'methyl formate',
        // Aminer (vanliga trivialnamn)
        'metylamin': 'methylamine',
        'etylamin': 'ethylamine',
        'propylamin': 'propylamine',
        'butylamin': 'butylamine',
        'pentylamin': 'pentylamine',
        'hexylamin': 'hexylamine',
        'dimetylamin': 'dimethylamine',
        'dietylamin': 'diethylamine',
        'dipropylamin': 'dipropylamine',
        'trimetylamin': 'trimethylamine',
        'trietylamin': 'triethylamine',
        'metyletylamin': 'methylethylamine',
        'metylpropylamin': 'methylpropylamine',
        'etylpropylamin': 'ethylpropylamine'
    };

    function getMolekylIdentifier(namn) {
        // Försök först med trivialt namn om det finns
        const trivialNamn = trivialtNamnMapping[namn.toLowerCase()];
        if (trivialNamn) {
            return trivialNamn;
        }
        return namn;
    }

    async function renderMolekyl(namn) {
        if (!jmolApplet || !namn) return;
        
        console.log(`🧪 Rendering: ${namn}`);
        
        // Försök först med trivialt/systematiskt namn
        const molekylId = getMolekylIdentifier(namn);
        console.log(`Försöker med: ${molekylId}`);
        
        let script = `load $${molekylId}; spin off;`;
        Jmol.script(jmolApplet, script);
        
        // Kontrollera om det gick bra genom att se om molekylen laddades
        // Om inte, försök med NCI resolver som fallback
        setTimeout(async () => {
            const atomCount = Jmol.evaluateVar(jmolApplet, 'atomCount');
            if (atomCount === 0 || atomCount === null) {
                console.warn(`⚠️ Kunde inte ladda "${molekylId}", försöker med NCI resolver...`);
                await tryNCIResolver(namn);
            } else {
                console.log(`✅ Molekyl laddad (${atomCount} atomer)`);
            }
        }, 500);
    }

    async function tryNCIResolver(namn) {
        try {
            // NCI/CADD Chemical Identifier Resolver
            const url = `https://cactus.nci.nih.gov/chemical/structure/${encodeURIComponent(namn)}/smiles`;
            console.log(`🔍 Slår upp: ${url}`);
            
            const response = await fetch(url);
            if (!response.ok) throw new Error('Kunde inte hitta molekylen');
            
            const smiles = await response.text();
            console.log(`✅ SMILES hittad: ${smiles}`);
            
            // Ladda molekylen med SMILES
            const script = `load $${smiles}; spin off;`;
            Jmol.script(jmolApplet, script);
            
        } catch (error) {
            console.error(`❌ Kunde inte rendera molekylen: ${error.message}`);
            // Visa felmeddelande i JSmol-viewern (utan att förstöra appleten)
            const script = `echo "⚠️ Kunde inte rendera molekylen"`;
            Jmol.script(jmolApplet, script);
        }
    }

    // ===================================================================
    // DEL 4: DISCLAIMER POPUP
    // ===================================================================
    
    function visaDisclaimerPopup() {
        // Kontrollera om användaren redan har sett disclaimern
        if (localStorage.getItem('organiskKemiDisclaimer') === 'visad') {
            return;
        }
        
        // Skapa popup-overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        overlay.style.zIndex = '10000';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.id = 'disclaimer-overlay';
        
        // Skapa popup-container
        const popup = document.createElement('div');
        popup.style.backgroundColor = 'white';
        popup.style.padding = '30px';
        popup.style.borderRadius = '10px';
        popup.style.maxWidth = '500px';
        popup.style.margin = '20px';
        popup.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
        popup.style.position = 'relative';
        
        // Titel
        const title = document.createElement('h2');
        title.textContent = '⚠️ Viktig information';
        title.style.marginTop = '0';
        title.style.color = '#d32f2f';
        title.style.fontSize = '24px';
        title.style.marginBottom = '20px';
        
        // Meddelande
        const message = document.createElement('div');
        message.innerHTML = `
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                <strong>Innehållet i denna tränare är inte verifierat och kan innehålla fel.</strong>
            </p>
            <p style="font-size: 14px; line-height: 1.5; color: #666;">
                Denna tränare genererar kemiska namn och molekylstrukturer för utbildningssyfte. 
                Alla namn och strukturer bör verifieras mot officiella källor innan användning i akademiska eller professionella sammanhang.
            </p>
            <p style="font-size: 14px; line-height: 1.5; color: #666; margin-top: 15px;">
                <strong>Använd på egen risk.</strong>
            </p>
        `;
        
        // Knapp-container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginTop = '25px';
        buttonContainer.style.textAlign = 'center';
        
        // OK-knapp
        const okButton = document.createElement('button');
        okButton.textContent = 'Jag förstår';
        okButton.style.backgroundColor = '#007bff';
        okButton.style.color = 'white';
        okButton.style.border = 'none';
        okButton.style.padding = '12px 30px';
        okButton.style.borderRadius = '5px';
        okButton.style.fontSize = '16px';
        okButton.style.cursor = 'pointer';
        okButton.style.fontWeight = 'bold';
        
        // Hover-effekt för knapp
        okButton.addEventListener('mouseenter', () => {
            okButton.style.backgroundColor = '#0056b3';
        });
        okButton.addEventListener('mouseleave', () => {
            okButton.style.backgroundColor = '#007bff';
        });
        
        // Event listener för knappen
        okButton.addEventListener('click', () => {
            // Markera att disclaimern har visats
            localStorage.setItem('organiskKemiDisclaimer', 'visad');
            // Ta bort popup
            overlay.remove();
        });
        
        // Lägg till element
        buttonContainer.appendChild(okButton);
        popup.appendChild(title);
        popup.appendChild(message);
        popup.appendChild(buttonContainer);
        overlay.appendChild(popup);
        
        // Lägg till i DOM
        document.body.appendChild(overlay);
        
        // Stäng popup om användaren klickar utanför
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                localStorage.setItem('organiskKemiDisclaimer', 'visad');
                overlay.remove();
            }
        });
    }
    
    // Visa disclaimer popup när sidan laddas
    visaDisclaimerPopup();

    // Starta JSmol
    jmolContainer.innerHTML = Jmol.getAppletHtml("jmolApplet0", JmolInfo);
});