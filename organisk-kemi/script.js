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
                        // Gruppera alkylgrupper och räkna antal av varje typ
                        const alkylGrupper = [alkyl1, alkyl2, alkyl3];
                        const gruppRäknare = {};
                        
                        alkylGrupper.forEach(alkyl => {
                            const namn = alkyl.namn.sv;
                            gruppRäknare[namn] = (gruppRäknare[namn] || 0) + 1;
                        });
                        
                        // Skapa namn med korrekt prefix (di-, tri-)
                        const namnDelar = [];
                        Object.keys(gruppRäknare).sort().forEach(alkylNamn => {
                            const antal = gruppRäknare[alkylNamn];
                            const alkyl = alkylGrupper.find(a => a.namn.sv === alkylNamn);
                            if (antal === 1) {
                                namnDelar.push(alkyl.namn.sv.toLowerCase());
                            } else if (antal === 2) {
                                namnDelar.push(`di${alkyl.namn.sv.toLowerCase()}`);
                            } else if (antal === 3) {
                                namnDelar.push(`tri${alkyl.namn.sv.toLowerCase()}`);
                            }
                        });
                        
                        return {
                            sv: `${namnDelar.join('')}amin`,
                            en: `${namnDelar.join('')}amine`
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
                    // Blockera båda positioner i dubbelbindningen OCH deras speglingar
                    const alkenSpegel1 = grund.c - huvudgruppPos + 1;
                    const alkenSpegel2 = grund.c - (huvudgruppPos + 1) + 1;
                    ledigaPositioner = ledigaPositioner.filter(p =>
                        p !== 1 &&
                        p !== huvudgruppPos &&
                        p !== huvudgruppPos + 1 &&
                        p !== alkenSpegel1 &&
                        p !== alkenSpegel2
                    );
                    break;
                case 'alkyn':
                    // Enligt IUPAC: numrera från det håll som ger lägsta nummer
                    huvudgruppPos = this.slumpaTal(1, Math.ceil((grund.c - 1) / 2));
                    suffixKey = 'yn';
                    // Blockera båda positioner i trippelbindningen OCH deras speglingar
                    const alkynSpegel1 = grund.c - huvudgruppPos + 1;
                    const alkynSpegel2 = grund.c - (huvudgruppPos + 1) + 1;
                    ledigaPositioner = ledigaPositioner.filter(p =>
                        p !== 1 &&
                        p !== huvudgruppPos &&
                        p !== huvudgruppPos + 1 &&
                        p !== alkynSpegel1 &&
                        p !== alkynSpegel2
                    );
                    break;
                case 'alkohol':
                    huvudgruppPos = this.slumpaTal(1, Math.ceil(grund.c / 2));
                    suffixKey = 'ol';
                    // Blockera både huvudgruppPos och dess speglingsposition (pga IUPAC-numrering)
                    const alkoholSpegel = grund.c - huvudgruppPos + 1;
                    ledigaPositioner = ledigaPositioner.filter(p => p !== huvudgruppPos && p !== alkoholSpegel && p !== 1);
                    break;
                case 'keton':
                    if (grund.c < 3) return this.genereraEttNamn(grupp); // Försök igen om kedjan är för kort
                    // Enligt IUPAC: keton kan vara på pos 2 till mitten, alltid lägsta nummer
                    huvudgruppPos = this.slumpaTal(2, Math.ceil(grund.c / 2));
                    suffixKey = 'on';
                    // Blockera både huvudgruppPos och dess speglingsposition (pga IUPAC-numrering)
                    const ketonSpegel = grund.c - huvudgruppPos + 1;
                    ledigaPositioner = ledigaPositioner.filter(p => p !== huvudgruppPos && p !== ketonSpegel && p !== 1);
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
            
            // Ta bort huvudgruppens position om den finns (förhindra substituenter på samma position)
            if (huvudgruppPos !== null) {
                ledigaPositioner = ledigaPositioner.filter(p => p !== huvudgruppPos);
            }
            
            // Välj och placera substituenter
            const antalSubstituenter = grupp === 'Halogenalkan' ? this.slumpaTal(1, 2) : this.slumpaTal(0, 2);
            if (antalSubstituenter > ledigaPositioner.length) return this.genereraEttNamn(grupp);
            
            // Ytterligare kontroll: se till att vi inte försöker placera fler substituenter än möjligt
            if (ledigaPositioner.length === 0 && antalSubstituenter > 0) return this.genereraEttNamn(grupp);

            const substituenter = [];
            for (let i = 0; i < antalSubstituenter; i++) {
                const posIndex = this.slumpaTal(0, ledigaPositioner.length - 1);
                const position = ledigaPositioner.splice(posIndex, 1)[0];

                let subTyp = this.slumpaElement(['halogen', 'alkyl']);
                if (grupp === 'Halogenalkan') subTyp = 'halogen';
                
                // Kontrollera att positionen inte skapar omöjliga strukturer
                // Om huvudgruppen är på närliggande position, kontrollera att substituenten inte skapar konflikt
                if (huvudgruppPos !== null && Math.abs(position - huvudgruppPos) === 1) {
                    // Om substituenten är på närliggande position till huvudgruppen, 
                    // kontrollera att det inte skapar omöjliga strukturer
                    if (subTyp === 'alkyl') {
                        // För alkylgrupper på närliggande positioner, använd bara små alkylgrupper
                        const tillgangligaAlkylgrupper = this.data.alkylgrupper.filter(a => a.c <= 1);
                        if (tillgangligaAlkylgrupper.length === 0) {
                            subTyp = 'halogen'; // Använd halogen istället om inga små alkylgrupper finns
                        }
                    }
                }
                
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

    // Konfetti-funktion
    function triggarKonfetti() {
        // Huvudkonfetti från centrum
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });

        // Extra konfetti från sidorna för mer dramatisk effekt
        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0 }
            });
            confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 1 }
            });
        }, 150);
    }

    // ===================================================================
    // GEMINI API MODAL FUNKTIONER
    // ===================================================================

    // Funktion för att konvertera Markdown till HTML
    function markdownTillHTML(text) {
        let html = text;

        // Konvertera **bold** till <strong> (gör före italic)
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

        // Konvertera *italic* till <em>
        html = html.replace(/\*([^*]+?)\*/g, '<em>$1</em>');

        // Konvertera headers
        html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
        html = html.replace(/^## (.+)$/gm, '<h3>$1</h3>');
        html = html.replace(/^# (.+)$/gm, '<h3>$1</h3>');

        // Konvertera numrerade listor (1. 2. 3.)
        const lines = html.split('\n');
        let inOrderedList = false;
        let result = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const orderedMatch = line.match(/^(\d+)\.\s+(.+)$/);
            const unorderedMatch = line.match(/^[-*]\s+(.+)$/);

            if (orderedMatch) {
                if (!inOrderedList) {
                    result.push('<ol>');
                    inOrderedList = true;
                }
                result.push(`<li>${orderedMatch[2]}</li>`);
            } else if (unorderedMatch) {
                if (inOrderedList) {
                    result.push('</ol>');
                    inOrderedList = false;
                }
                result.push(`<li>${unorderedMatch[1]}</li>`);
            } else {
                if (inOrderedList) {
                    result.push('</ol>');
                    inOrderedList = false;
                }
                result.push(line);
            }
        }

        if (inOrderedList) {
            result.push('</ol>');
        }

        html = result.join('\n');

        // Wrappa unordered list items i <ul>
        html = html.replace(/(<li>(?!.*<ol>).*?<\/li>\n?)+/g, (match) => {
            // Kontrollera om det redan är i en <ol>
            if (!match.includes('<ol>')) {
                return '<ul>' + match + '</ul>';
            }
            return match;
        });

        // Konvertera dubbla radbrytningar till paragraf
        html = html.replace(/\n\n+/g, '</p><p>');

        // Konvertera enkla radbrytningar till <br> (utom runt block-element)
        html = html.replace(/\n(?!<\/?(?:ul|ol|li|h\d|p))/g, '<br>');

        // Wrappa i paragraf om det inte redan finns block-element
        if (!html.match(/^<(?:h\d|ul|ol|p)/)) {
            html = '<p>' + html + '</p>';
        }

        // Rensa upp överflödiga <br> runt listor
        html = html.replace(/<br>\s*<\/(ul|ol)>/g, '</$1>');
        html = html.replace(/<(ul|ol)>\s*<br>/g, '<$1>');

        return html;
    }

    // Funktion för att anropa Gemini API
    async function anropaGeminiAPI(prompt) {
        try {
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt })
            });

            // Kontrollera om svaret är tomt
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Servern returnerade inte JSON. Kontrollera att GEMINI_API_KEY är konfigurerad i Vercel.');
            }

            let data;
            try {
                data = await response.json();
            } catch (jsonError) {
                throw new Error('Kunde inte läsa API-svaret. Servern kanske är ner eller API-nyckeln är inte konfigurerad.');
            }

            if (!response.ok) {
                throw new Error(data.error || `API-fel: ${response.status} ${response.statusText}`);
            }

            if (!data.success) {
                throw new Error(data.error || 'API-anropet misslyckades');
            }

            return data.text;
        } catch (error) {
            console.error('Fel vid anrop till Gemini API:', error);
            throw error;
        }
    }

    // Funktion för att visa modal med AI-svar
    function visaGeminiModal(prompt, länkText) {
        // Ta bort befintlig modal om den finns
        const befintligModal = document.getElementById('gemini-modal-overlay');
        if (befintligModal) {
            befintligModal.remove();
        }

        // Skapa modal overlay
        const overlay = document.createElement('div');
        overlay.id = 'gemini-modal-overlay';
        overlay.className = 'gemini-modal-overlay';

        // Skapa modal container
        const modal = document.createElement('div');
        modal.className = 'gemini-modal';

        // Skapa header med stängningsknapp
        const header = document.createElement('div');
        header.className = 'gemini-modal-header';

        const title = document.createElement('h3');
        title.innerHTML = '<i class="fa-solid fa-sparkles"></i> Google Gemini';
        title.style.margin = '0';
        title.style.fontSize = '1.3rem';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'gemini-modal-close';
        closeBtn.innerHTML = '<i class="fa-solid fa-times"></i>';
        closeBtn.addEventListener('click', () => overlay.remove());

        header.appendChild(title);
        header.appendChild(closeBtn);

        // Skapa content area
        const content = document.createElement('div');
        content.className = 'gemini-modal-content';
        content.innerHTML = `
            <div class="gemini-loading">
                <div class="gemini-spinner"></div>
                <p>Frågar Google Gemini...</p>
            </div>
        `;

        // Lägg ihop modal
        modal.appendChild(header);
        modal.appendChild(content);
        overlay.appendChild(modal);

        // Lägg till i DOM
        document.body.appendChild(overlay);

        // Stäng vid click utanför modal
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });

        // Anropa API och visa svar
        anropaGeminiAPI(prompt)
            .then(text => {
                const formatteradText = markdownTillHTML(text);

                content.innerHTML = `
                    <div class="gemini-response">
                        <p style="margin-top: 0; color: #666; font-size: 0.9rem; font-style: italic;">
                            ${länkText}
                        </p>
                        <div class="gemini-text">${formatteradText}</div>
                        <div class="gemini-prompt-toggle">
                            <button class="visa-prompt-btn">
                                <i class="fa-solid fa-eye"></i> Visa prompt
                            </button>
                            <div class="gemini-prompt-text" style="display: none;">
                                ${prompt.replace(/\n/g, '<br>')}
                            </div>
                        </div>
                    </div>
                `;

                // Lägg till event listener för prompt-knappen
                const promptBtn = content.querySelector('.visa-prompt-btn');
                const promptText = content.querySelector('.gemini-prompt-text');

                if (promptBtn && promptText) {
                    promptBtn.addEventListener('click', () => {
                        if (promptText.style.display === 'none') {
                            promptText.style.display = 'block';
                            promptBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i> Dölj prompt';
                        } else {
                            promptText.style.display = 'none';
                            promptBtn.innerHTML = '<i class="fa-solid fa-eye"></i> Visa prompt';
                        }
                    });
                }
            })
            .catch(error => {
                content.innerHTML = `
                    <div class="gemini-error">
                        <i class="fa-solid fa-exclamation-triangle"></i>
                        <p><strong>Kunde inte få svar från AI</strong></p>
                        <p style="font-size: 0.9rem; color: #666;">${error.message || 'Försök igen senare.'}</p>
                    </div>
                `;
            });
    }

    const namnDisplay = document.getElementById('kemiskt-namn');
    const generateBtn = document.getElementById('generate-btn');
    const visaNamnBtn = document.getElementById('visa-namn-btn');
    const gissaBtn = document.getElementById('gissa-btn');
    const gissningInput = document.getElementById('gissning-input');
    const gissningContainer = document.getElementById('gissning-container');
    const feedbackContainer = document.getElementById('feedback-container');
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
        
        // Kontrollera om gissningsläge är aktiverat
        const gissningslägeCheckbox = document.getElementById('gissningsläge-checkbox');
        const ärGissningsläge = gissningslägeCheckbox.checked;
        
        if (ärGissningsläge) {
            // Gissningsläge - visa placeholder och gissningsfält
            namnDisplay.textContent = '❓ Vad heter denna förening?';
            
            // Visa gissningsfältet och återställ det
            gissningContainer.style.display = 'block';
            gissningInput.value = '';
            gissningInput.focus();
            gissningInput.disabled = false;
            gissaBtn.disabled = false;
            gissaBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Gissa';
            visaNamnBtn.style.display = 'none';
        } else {
            // Direktläge - dölj namnet och visa "Visa svenska namn"-knappen
            namnDisplay.textContent = '❓ Vad heter denna förening?';
            
            // Dölj gissningsfältet och visa "Visa svenska namn"-knappen
            gissningContainer.style.display = 'none';
            visaNamnBtn.style.display = 'inline-block';
            visaNamnBtn.innerHTML = '<i class="fa-solid fa-eye"></i> Visa svenska namn';
            visaNamnBtn.disabled = false;
        }
        
        // Rensa feedback
        feedbackContainer.innerHTML = '';
        
        // Återställ "Visa dolt namn"-knappen
        const visaDoltNamnBtn = document.getElementById('visa-dolt-namn-btn');
        visaDoltNamnBtn.disabled = false;
        visaDoltNamnBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i> Visa dolt namn';
        
        // Ta bort tidigare länkar
        const befintligaLänkar = document.querySelector('.länk-container');
        if (befintligaLänkar) {
            befintligaLänkar.remove();
        }

        // Rendera den nya molekylen
        renderMolekyl(namnObjekt.en);
    }

    // Event listeners
    generateBtn.addEventListener('click', genereraNyttNamn);
    
    // Gissningsfunktionalitet
    gissaBtn.addEventListener('click', () => {
        const gissning = gissningInput.value.trim();
        const korrektNamn = namnDisplay.dataset.svName;
        
        if (!gissning) {
            feedbackContainer.innerHTML = '<p style="color: #ff9800; font-weight: 600;">⚠️ Skriv din gissning först!</p>';
            return;
        }
        
        // Normalisera båda strängarna för jämförelse (lowercase, ta bort extra mellanslag)
        const normaliseradGissning = gissning.toLowerCase().replace(/\s+/g, ' ').trim();
        const normaliseratKorrekt = korrektNamn.toLowerCase().replace(/\s+/g, ' ').trim();
        
        if (normaliseradGissning === normaliseratKorrekt) {
            // Rätt svar! - visa i gissa-knappen istället

            // Trigga konfetti!
            triggarKonfetti();

            // Visa svensk namnet i huvuddisplayen
            namnDisplay.textContent = korrektNamn;

            // Ändra gissa-knappen till att visa "Rätt svar!" och gör den grön
            gissaBtn.innerHTML = '<i class="fa-solid fa-check-circle"></i> Rätt svar!';
            gissaBtn.style.backgroundColor = '#4caf50';
            gissaBtn.style.color = 'white';
            gissaBtn.disabled = true;

            // Inaktivera input och dölj "Visa svenska namn"-knappen
            gissningInput.disabled = true;
            visaNamnBtn.style.display = 'none';

            // Rensa feedback-container (ingen separat ruta ska visas)
            feedbackContainer.innerHTML = '';

            // Visa länkarna direkt efter rätt svar
            visaLänkar(namnDisplay.dataset.grupp, korrektNamn);
        } else {
            // Fel svar - visa i gissa-knappen istället

            // Visa svenska namnet i huvuddisplayen
            namnDisplay.textContent = korrektNamn;

            // Ändra gissa-knappen till att visa "Du hade fel!" och gör den röd
            gissaBtn.innerHTML = '<i class="fa-solid fa-times-circle"></i> Du hade fel!';
            gissaBtn.style.backgroundColor = '#f44336';
            gissaBtn.style.borderColor = '#f44336';
            gissaBtn.style.color = 'white';
            gissaBtn.disabled = true;

            // Inaktivera input och dölj "Visa svenska namn"-knappen
            gissningInput.disabled = true;
            visaNamnBtn.style.display = 'none';

            // Rensa feedback-container (ingen separat ruta ska visas)
            feedbackContainer.innerHTML = '';

            // Visa länkarna med modifierad Gemini-länk
            visaLänkar(namnDisplay.dataset.grupp, korrektNamn, gissning);
        }
    });
    
    // Tillåt Enter-tangent för att gissa
    gissningInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            gissaBtn.click();
        }
    });
    
    // Funktion för att visa länkar
    function visaLänkar(grupp, svensktNamn, felGissning = null) {
        // Ta bort tidigare länkar om de finns
        const befintligaLänkar = document.querySelector('.länk-container');
        if (befintligaLänkar) {
            befintligaLänkar.remove();
        }
        
        // Skapa en gemensam container för båda länkarna
        const länkContainer = document.createElement('div');
        länkContainer.className = 'länk-container';
        länkContainer.style.marginTop = '15px';
        länkContainer.style.textAlign = 'center';
        länkContainer.style.display = 'flex';
        länkContainer.style.gap = '10px';
        länkContainer.style.justifyContent = 'center';
        länkContainer.style.flexWrap = 'wrap';
        
        // Visa Magnus Ehinger-länk om den finns
        const ehingerLänk = ehingerLänkar[grupp];
        if (ehingerLänk) {
            const länk = document.createElement('a');
            länk.href = ehingerLänk;
            länk.target = '_blank';
            länk.style.display = 'inline-block';
            länk.style.padding = '8px 16px';
            länk.style.backgroundColor = '#007bff';
            länk.style.color = 'white';
            länk.style.textDecoration = 'none';
            länk.style.border = 'none';
            länk.style.borderRadius = '5px';
            länk.style.fontSize = '14px';
            länk.style.fontFamily = "'Poppins', sans-serif";
            länk.style.fontWeight = 'normal';
            länk.style.cursor = 'pointer';
            länk.style.transition = 'background-color 0.2s';
            länk.innerHTML = '<i class="fa-solid fa-external-link-alt inline-icon"></i> Läs mer om ' + grupp.toLowerCase() + ' hos Magnus Ehinger';

            // Hover-effekter (samma som Gemini-knappen)
            länk.addEventListener('mouseenter', () => {
                länk.style.backgroundColor = '#0056b3';
            });
            länk.addEventListener('mouseleave', () => {
                länk.style.backgroundColor = '#007bff';
            });

            länkContainer.appendChild(länk);
        }

        // Lägg till Google Gemini-knapp
        let geminiPrompt;
        let länkText;
        let knappText;

        if (felGissning) {
            // Om användaren gissade fel, fråga varför det korrekta namnet inte kallas för deras gissning
            geminiPrompt = `Förklara kort (max 250 ord, får vara kortare) varför "${svensktNamn}" INTE kallas "${felGissning}" enligt IUPAC. Fokusera på skillnaden mellan namnen. Svara på svenska med tydlig struktur.`;
            länkText = `Varför kallas <i>${svensktNamn.toLowerCase()}</i> inte för <i>${felGissning.toLowerCase()}</i>?`;
            knappText = `Fråga Google Gemini varför namnet är fel`;
        } else {
            // Normal prompt för rätt svar
            geminiPrompt = `Förklara IUPAC-namnet "${svensktNamn}" kortfattat (max 250 ord, får vara kortare). Bryt ner: 1) Huvudkedjan, 2) Funktionell grupp, 3) Positioner/substituenter. Svara på svenska med tydlig struktur.`;
            länkText = `Förklaring av namngivningen för <i>${svensktNamn.toLowerCase()}</i>`;
            knappText = `Fråga Google Gemini om namngivningen`;
        }

        if (geminiPrompt) {
            const knapp = document.createElement('button');
            knapp.type = 'button';
            knapp.style.display = 'inline-block';
            knapp.style.padding = '8px 16px';
            knapp.style.backgroundColor = '#007bff';
            knapp.style.color = 'white';
            knapp.style.textDecoration = 'none';
            knapp.style.border = 'none';
            knapp.style.borderRadius = '5px';
            knapp.style.fontSize = '14px';
            knapp.style.fontFamily = "'Poppins', sans-serif";
            knapp.style.fontWeight = 'normal';
            knapp.style.cursor = 'pointer';
            knapp.style.transition = 'background-color 0.2s';
            knapp.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles inline-icon"></i> ' + knappText;

            // Hover-effekter (samma som Magnus Ehinger-länken)
            knapp.addEventListener('mouseenter', () => {
                knapp.style.backgroundColor = '#0056b3';
            });
            knapp.addEventListener('mouseleave', () => {
                knapp.style.backgroundColor = '#007bff';
            });

            // Öppna modal när man klickar
            knapp.addEventListener('click', () => {
                visaGeminiModal(geminiPrompt, länkText);
            });

            länkContainer.appendChild(knapp);
        }
        
        // Lägg till container efter namnDisplay
        const uppgiftContainer = namnDisplay.parentNode;
        uppgiftContainer.insertBefore(länkContainer, uppgiftContainer.lastElementChild);
    }
    
    visaNamnBtn.addEventListener('click', () => {
        // Visa det svenska namnet
        const svensktNamn = namnDisplay.dataset.svName;
        const grupp = namnDisplay.dataset.grupp;
        if (svensktNamn) {
            namnDisplay.textContent = svensktNamn;
            visaNamnBtn.innerHTML = '<i class="fa-solid fa-check"></i> Avslöjat!';
            visaNamnBtn.disabled = true;
            
            // Dölj gissningsfältet och visa feedback
            gissningContainer.style.display = 'none';
            feedbackContainer.innerHTML = `
                <div style="background-color: #fff3cd; border: 2px solid #ffc107; border-radius: 8px; padding: 1rem; text-align: center;">
                    <p style="color: #856404; font-weight: 600; margin: 0;">
                        <i class="fa-solid fa-lightbulb"></i> Rätt svar: <strong>${svensktNamn}</strong>
                    </p>
                </div>
            `;
            
            // Visa länkarna
            visaLänkar(grupp, svensktNamn);
        }
    });
    
    valjAllaBtn.addEventListener('click', () => {
        checkboxes.forEach(cb => cb.checked = true);
    });
    
    avvaljAllaBtn.addEventListener('click', () => {
        checkboxes.forEach(cb => cb.checked = false);
    });

    // Event listener för gissningsläge-checkbox
    const gissningslägeCheckbox = document.getElementById('gissningsläge-checkbox');
    gissningslägeCheckbox.addEventListener('change', () => {
        // Om det redan finns ett genererat namn, uppdatera displayen
        if (namnDisplay.dataset.svName) {
            const ärGissningsläge = gissningslägeCheckbox.checked;
            
            if (ärGissningsläge) {
                // Växla till gissningsläge
                namnDisplay.textContent = '❓ Vad heter denna förening?';
                gissningContainer.style.display = 'block';
                gissningInput.value = '';
                gissningInput.disabled = false;
                gissaBtn.disabled = false;
                gissaBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Gissa';
                visaNamnBtn.style.display = 'none';
                feedbackContainer.innerHTML = '';
            } else {
                // Växla till direktläge
                namnDisplay.textContent = '❓ Vad heter denna förening?';
                gissningContainer.style.display = 'none';
                visaNamnBtn.style.display = 'inline-block';
                visaNamnBtn.innerHTML = '<i class="fa-solid fa-eye"></i> Visa svenska namn';
                visaNamnBtn.disabled = false;
                feedbackContainer.innerHTML = '';
            }
        }
    });

    // Event listener för "Visa dolt namn"-knappen
    const visaDoltNamnBtn = document.getElementById('visa-dolt-namn-btn');
    visaDoltNamnBtn.addEventListener('click', () => {
        const svensktNamn = namnDisplay.dataset.svName;
        if (svensktNamn) {
            // Visa det svenska namnet
            namnDisplay.textContent = svensktNamn;
            
            // Inaktivera knappen efter att namnet har visats
            visaDoltNamnBtn.disabled = true;
            visaDoltNamnBtn.innerHTML = '<i class="fa-solid fa-eye"></i> Namnet visas';
            
            // Visa länkarna
            const grupp = namnDisplay.dataset.grupp;
            visaLänkar(grupp, svensktNamn);
        }
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

    // JSmol försöker ladda molekyler med systematiska IUPAC-namn direkt
    // Om det inte fungerar, använder vi NCI resolver som fallback

    async function renderMolekyl(namn) {
        if (!jmolApplet || !namn) return;

        console.log(`🧪 Rendering: ${namn}`);

        // Använd systematiskt IUPAC-namn direkt
        let script = `load $${namn}; spin off;`;
        Jmol.script(jmolApplet, script);
        
        // Kontrollera om det gick bra genom att se om molekylen laddades
        // Om inte, försök med NCI resolver som fallback
        setTimeout(async () => {
            const atomCount = Jmol.evaluateVar(jmolApplet, 'atomCount');
            if (atomCount === 0 || atomCount === null) {
                console.warn(`⚠️ Kunde inte ladda "${namn}", försöker med NCI resolver...`);
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