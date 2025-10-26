# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Swedish educational web application ("Övningsportal") with interactive practice modules for learning:
- **Spanska Verb**: Spanish verb conjugation practice
- **Organisk Kemi**: Organic chemistry nomenclature trainer (IUPAC naming)

The project is deployed on Vercel and includes Vercel Analytics tracking.

## Project Structure

```
alltskola/
├── index.html              # Main landing page with subject selection
├── css/
│   └── global.css          # Shared global styles
├── spanska-verb/           # Spanish verb conjugation module
│   ├── index.html
│   ├── script.js
│   └── style.css
├── organisk-kemi/          # Organic chemistry nomenclature module
│   ├── index.html
│   ├── script.js          # Complex chemical name generator
│   └── style.css
└── [OLD]_organisk-kemi/    # Legacy version (deprecated)
```

## Development Commands

This is a static website with no build system or dependencies. Development workflow:

### Local Development
```bash
# Serve locally with any static server
python3 -m http.server 8000
# or
npx serve
```

### Testing
No automated test suite exists. Testing is manual:
1. Open each module in browser
2. Verify form interactions
3. Test randomization logic
4. Check mobile responsiveness

### Deployment
Automatically deployed to Vercel on git push to master branch.

## Architecture

### Spanska Verb Module (spanska-verb/)
- **Pure vanilla JavaScript** - no frameworks
- Generates random Spanish verb conjugation exercises
- User selects tenses (Presens, Preteritum, Imperfekt)
- Optional "show stem" feature pre-fills verb stems
- Real-time validation with visual feedback (checkmarks/X marks)
- Accent checking with hints if user forgets accents

**Key functions:**
- `getConjugations(verb, tense)` - Generates conjugations based on -ar/-er/-ir endings
- `startNewRound()` - Creates new exercise
- `checkAnswers()` - Validates user input with accent-aware comparison

### Organisk Kemi Module (organisk-kemi/)
**Complex chemical name generator** with IUPAC nomenclature rules.

#### Architecture Layers:
1. **Chemical Generator** (`kemiskGenerator` object)
   - Data structures for stems (C1-C10), functional groups, suffixes
   - `genereraEttNamn(grupp)` - Main generation logic with IUPAC rules
   - Handles 11 compound classes: Alkan, Alken, Alkyn, Alkohol, Keton, Aldehyd, Karboxylsyra, Halogenalkan, Eter, Ester, Amin
   - Validates substituent positions to prevent impossible structures

2. **UI Layer**
   - Checkbox grid for compound class selection
   - Two modes: Direct reveal or guessing mode
   - Feedback system with color-coded responses
   - Links to Magnus Ehinger educational resources
   - Dynamic ChatGPT link generation for wrong answers

3. **3D Visualization** (JSmol integration)
   - Renders molecules in 3D using JSmol library
   - Uses NCI/CADD Chemical Identifier Resolver for SMILES lookup
   - Fallback to trivial names for common compounds

#### Key Technical Details:
- **IUPAC Numbering**: Always uses lowest numbering for substituents and functional groups
- **Position Validation**: Prevents substituents at chain ends (must be part of main chain)
- **Amine Nomenclature**: Handles primary, secondary, tertiary amines with proper di-/tri- prefixes
- **Bilingual**: Generates both Swedish (sv) and English (en) systematic names

### Global Patterns

**Common across both modules:**
- All text content in Swedish
- Font Awesome icons for visual enhancement
- Vercel Analytics snippet: `window.va` tracking
- Footer credit: "Made by Vilmer Folcke"
- Mobile-first responsive design
- No external dependencies except CDN resources

## Important Implementation Notes

### Organisk Kemi Complexity
The chemical name generator (`organisk-kemi/script.js`) is the most complex part:
- Lines 1-321: Chemical generation logic with extensive IUPAC rules
- Lines 322-650: UI interaction logic
- Lines 651-811: JSmol 3D rendering integration
- Lines 812-926: Disclaimer popup system

**When modifying chemistry logic:**
1. Test edge cases: C1-C3 chains (special constraints)
2. Verify substituent positions don't create longer chains
3. Check that functional groups get priority in numbering
4. Ensure bilingual name generation stays synchronized

### Data Persistence
- **LocalStorage**: Only used for disclaimer acknowledgment in organisk-kemi
- **No backend**: All state is client-side and session-based

### External APIs
- **JSmol**: https://chemapps.stolaf.edu/jmol/jsmol/
- **NCI Resolver**: https://cactus.nci.nih.gov/chemical/structure/ (for SMILES lookup)
- **ChatGPT links**: Generated dynamically with pre-filled questions

## Git Workflow

Main branch: `master`

Recent development focused on:
- Adding guessing mode to chemistry trainer
- Integrating ChatGPT help links
- Improving IUPAC nomenclature accuracy
- Adding educational resource links (Magnus Ehinger)
