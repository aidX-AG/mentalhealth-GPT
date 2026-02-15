// lib/pseudonymization/dictionary.ts
// ============================================================================
// SPEC-007 §5 — Mental Health Dictionary (Layer 3)
//
// Case-insensitive, longest-match-first, word-boundary matching.
// Terms organized by category and language (DE, FR, EN, ES).
// ============================================================================

import type { DetectedPII, DictionaryCategory } from "./types";

// ---------------------------------------------------------------------------
// Term data — organized by category
// ---------------------------------------------------------------------------

const DIAGNOSE_TERMS: string[] = [
  // German
  "Depression", "Major Depression", "rezidivierende Depression",
  "Manie", "Bipolare Störung", "bipolare affektive Störung", "Dysthymie",
  "Angststörung", "generalisierte Angststörung", "Panikstörung",
  "Agoraphobie", "soziale Phobie", "soziale Angststörung", "spezifische Phobie",
  "PTBS", "PTSD", "posttraumatische Belastungsstörung",
  "Anpassungsstörung", "akute Belastungsreaktion",
  "Anorexie", "Anorexia nervosa", "Bulimie", "Bulimia nervosa", "Binge-Eating",
  "Borderline", "Borderline-Persönlichkeitsstörung",
  "narzisstische Persönlichkeitsstörung", "dependente Persönlichkeitsstörung",
  "emotional instabile Persönlichkeitsstörung",
  "Alkoholabhängigkeit", "Suchterkrankung", "Substanzabhängigkeit",
  "ADHS", "ADS", "Aufmerksamkeitsdefizit", "Autismus-Spektrum", "Autismus",
  "Schizophrenie", "schizoaffektive Störung", "Psychose",
  "Zwangsstörung", "OCD", "Burnout", "Burnout-Syndrom",
  "Schlafstörung", "Insomnie", "Somatisierungsstörung",
  "dissoziative Störung", "Konversionsstörung",
  // French
  "dépression", "trouble bipolaire", "dysthymie",
  "trouble anxieux", "trouble panique", "agoraphobie", "phobie sociale",
  "trouble de stress post-traumatique", "TSPT",
  "anorexie", "boulimie", "trouble du comportement alimentaire",
  "trouble de la personnalité borderline", "trouble de la personnalité",
  "schizophrénie", "psychose",
  "trouble obsessionnel compulsif", "TOC",
  "insomnie", "trouble du sommeil",
  "trouble dissociatif",
  // English
  "depression", "major depression", "major depressive disorder",
  "bipolar disorder", "dysthymia",
  "anxiety disorder", "generalized anxiety disorder", "panic disorder",
  "agoraphobia", "social anxiety disorder", "social phobia",
  "PTSD", "post-traumatic stress disorder",
  "adjustment disorder", "acute stress reaction",
  "anorexia nervosa", "bulimia nervosa", "binge eating disorder",
  "borderline personality disorder", "narcissistic personality disorder",
  "schizophrenia", "schizoaffective disorder", "psychosis",
  "obsessive-compulsive disorder",
  "insomnia", "sleep disorder",
  "dissociative disorder",
  "ADHD", "attention deficit disorder", "autism spectrum disorder",
  // Spanish
  "depresión", "trastorno bipolar", "distimia",
  "trastorno de ansiedad", "trastorno de pánico", "agorafobia", "fobia social",
  "trastorno de estrés postraumático", "TEPT",
  "anorexia nerviosa", "bulimia nerviosa",
  "trastorno límite de la personalidad",
  "esquizofrenia", "psicosis",
  "trastorno obsesivo-compulsivo", "TOC",
  "insomnio", "trastorno del sueño",
  "TDAH", "trastorno del espectro autista",
];

const MEDIKAMENT_TERMS: string[] = [
  // SSRIs
  "Sertralin", "Zoloft",
  "Escitalopram", "Cipralex",
  "Citalopram",
  "Fluoxetin", "Prozac",
  "Paroxetin",
  "Fluvoxamin",
  // SNRIs
  "Venlafaxin", "Effexor",
  "Duloxetin", "Cymbalta",
  "Milnacipran",
  // Tricyclics
  "Amitriptylin",
  "Clomipramin",
  "Imipramin",
  "Nortriptylin",
  // Atypical
  "Mirtazapin", "Remeron",
  "Trazodon",
  "Bupropion", "Wellbutrin",
  "Agomelatin",
  // Benzodiazepines
  "Lorazepam", "Temesta", "Ativan",
  "Diazepam", "Valium",
  "Alprazolam", "Xanax",
  "Clonazepam", "Rivotril",
  "Oxazepam",
  "Bromazepam",
  // Z-drugs
  "Zolpidem", "Stilnox",
  "Zopiclon",
  // Antipsychotics
  "Quetiapin", "Seroquel",
  "Risperidon", "Risperdal",
  "Olanzapin", "Zyprexa",
  "Aripiprazol", "Abilify",
  "Haloperidol",
  "Clozapin",
  // Mood stabilizers
  "Lithium",
  "Valproat", "Depakine",
  "Lamotrigin",
  "Carbamazepin",
  // Stimulants
  "Methylphenidat", "Ritalin", "Concerta",
  "Lisdexamfetamin", "Elvanse",
  // Other
  "Pregabalin", "Lyrica",
  "Gabapentin",
  "Hydroxyzin",
];

const THERAPIE_TERMS: string[] = [
  // German
  "kognitive Verhaltenstherapie", "KVT",
  "Verhaltenstherapie",
  "dialektisch-behaviorale Therapie", "DBT",
  "EMDR", "Eye Movement Desensitization",
  "Psychoanalyse", "psychoanalytische Therapie",
  "psychodynamische Therapie", "tiefenpsychologische Therapie",
  "Schematherapie",
  "Akzeptanz- und Commitmenttherapie", "ACT",
  "Interpersonelle Therapie", "IPT",
  "Systemische Therapie", "systemische Familientherapie",
  "Gesprächstherapie", "klientenzentrierte Therapie",
  "Expositionstherapie",
  "Traumatherapie",
  "Gruppentherapie",
  "Ergotherapie",
  "Kunsttherapie",
  "Musiktherapie",
  // French
  "thérapie cognitivo-comportementale", "TCC",
  "thérapie comportementale",
  "psychanalyse",
  "thérapie systémique",
  "thérapie de groupe",
  "thérapie interpersonnelle",
  // English
  "cognitive behavioral therapy", "CBT",
  "behavioral therapy",
  "dialectical behavior therapy",
  "psychoanalysis", "psychodynamic therapy",
  "schema therapy",
  "acceptance and commitment therapy",
  "interpersonal therapy",
  "systemic therapy",
  "exposure therapy",
  "group therapy",
  "trauma therapy",
  // Spanish
  "terapia cognitivo-conductual",
  "terapia conductual",
  "terapia dialéctico-conductual",
  "psicoanálisis", "terapia psicodinámica",
  "terapia de esquemas",
  "terapia de aceptación y compromiso",
  "terapia interpersonal",
  "terapia sistémica",
  "terapia de exposición",
  "terapia de grupo",
];

// ---------------------------------------------------------------------------
// Build indexed structure (sorted by length descending for longest-match-first)
// ---------------------------------------------------------------------------

interface DictionaryEntry {
  term: string;
  termLower: string;
  category: DictionaryCategory;
}

function buildEntries(
  terms: string[],
  category: DictionaryCategory,
): DictionaryEntry[] {
  return terms.map((term) => ({
    term,
    termLower: term.toLowerCase(),
    category,
  }));
}

const ALL_ENTRIES: DictionaryEntry[] = [
  ...buildEntries(DIAGNOSE_TERMS, "DIAGNOSE"),
  ...buildEntries(MEDIKAMENT_TERMS, "MEDIKAMENT"),
  ...buildEntries(THERAPIE_TERMS, "THERAPIE"),
].sort((a, b) => b.termLower.length - a.termLower.length); // Longest first

// ---------------------------------------------------------------------------
// Word boundary check
// ---------------------------------------------------------------------------

function isWordChar(ch: number): boolean {
  if (ch >= 0x41 && ch <= 0x5A) return true; // A-Z
  if (ch >= 0x61 && ch <= 0x7A) return true; // a-z
  if (ch >= 0x30 && ch <= 0x39) return true; // 0-9
  if (ch === 0x2D) return true; // hyphen
  if (ch >= 0xC0 && ch <= 0xFF && ch !== 0xD7 && ch !== 0xF7) return true; // Latin-1 accented
  if (ch >= 0x100 && ch <= 0x24F) return true; // Latin Extended
  return false;
}

/**
 * Check if there's a word boundary at position `pos` in text.
 * A boundary exists between text[pos-1] and text[pos] when they
 * belong to different character classes, or at start/end of text.
 */
function hasWordBoundaryAt(text: string, pos: number): boolean {
  if (pos <= 0 || pos >= text.length) return true;
  const before = isWordChar(text.charCodeAt(pos - 1));
  const after = isWordChar(text.charCodeAt(pos));
  return before !== after;
}

// ---------------------------------------------------------------------------
// Detection (§5.2 — longest-match-first, case-insensitive, word boundary)
// ---------------------------------------------------------------------------

/**
 * Detect dictionary terms in text.
 * Returns DetectedPII[] with source="dictionary", confidence=1.0.
 *
 * Strategy: scan text for each term (longest first).
 * Track occupied positions to prevent overlapping matches.
 */
export function detectDictionary(text: string): DetectedPII[] {
  const textLower = text.toLowerCase();
  const results: DetectedPII[] = [];
  const occupied = new Set<number>(); // Track occupied character positions

  for (const entry of ALL_ENTRIES) {
    let searchFrom = 0;

    while (searchFrom < textLower.length) {
      const idx = textLower.indexOf(entry.termLower, searchFrom);
      if (idx === -1) break;

      const end = idx + entry.termLower.length;
      searchFrom = idx + 1;

      // Word boundary check
      if (!hasWordBoundaryAt(text, idx) || !hasWordBoundaryAt(text, end)) continue;

      // Check no overlap with already accepted matches
      let overlaps = false;
      for (let i = idx; i < end; i++) {
        if (occupied.has(i)) {
          overlaps = true;
          break;
        }
      }
      if (overlaps) continue;

      // Mark positions as occupied
      for (let i = idx; i < end; i++) {
        occupied.add(i);
      }

      results.push({
        category: entry.category,
        original: text.slice(idx, end), // Preserve original casing
        start: idx,
        end,
        confidence: 1.0,
        source: "dictionary",
        defaultAccepted: true,
      });
    }
  }

  return results;
}
