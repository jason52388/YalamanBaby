// Automatic origin/meaning lookup for a given name.
//
//   1. Bundled dictionary (instant, ~200 common names).
//   2. Wikipedia REST summary fallback (covers thousands of names), parsed
//      for origin + meaning. Best-effort: obscure names may return nothing.
//
// Wikipedia's REST API is CORS-enabled, so this works from the static site
// with no key and no backend.

import { lookupMeaning } from '../data/nameMeanings.js';

function cap(s) {
  const t = s.trim();
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
}

// Common etymological origins, scanned in the summary text.
const ORIGINS = [
  'Latin', 'Greek', 'Hebrew', 'Arabic', 'Aramaic', 'Germanic', 'Old English',
  'English', 'Scandinavian', 'Norse', 'Old Norse', 'Irish', 'Gaelic', 'Welsh',
  'Scottish', 'Slavic', 'Russian', 'Sanskrit', 'Persian', 'Italian', 'Spanish',
  'French', 'Hawaiian', 'Japanese', 'Turkish', 'Polish', 'Dutch', 'Hungarian',
  'Egyptian', 'Native American', 'Hindi', 'Korean', 'Chinese',
];

function parseOrigin(text) {
  // Prefer an explicit "...of X origin" phrasing, else the first known origin
  // word that appears in the summary.
  const m = text.match(/of\s+([A-Z][a-zA-Z]+)\s+origin/);
  if (m && ORIGINS.includes(m[1])) return m[1];
  for (const o of ORIGINS) {
    if (new RegExp(`\\b${o}\\b`).test(text)) return o;
  }
  return '';
}

// Boilerplate first sentences we don't want as the "meaning".
const GENERIC = /^[\w'’ -]+ (?:is|are|was) (?:a|an|the)[\w' -]*\b(?:given |first |masculine |feminine |unisex )?name\b[^.]*\.?$/i;

function parseMeaning(text) {
  // Best: an explicit meaning clause anywhere in the text.
  const m =
    text.match(/mean(?:s|ing)\s+["“']([^"”']+)["”']/i) ||
    text.match(/mean(?:s|ing)\s+([a-z][a-z\s,'-]+?)[.;]/i);
  if (m) return m[1].trim();

  // Otherwise pick the first sentence that isn't the generic
  // "X is a given name" boilerplate — that's usually the etymology line.
  const sentences = text.split(/(?<=\.)\s/).map((s) => s.trim()).filter(Boolean);
  const meaningful = sentences.find((s) => !GENERIC.test(s));
  const chosen = meaningful || sentences[0] || text;
  return chosen.length > 160 ? chosen.slice(0, 157) + '…' : chosen;
}

// Heuristic: does this summary actually describe a given name?
function looksLikeName(extract, title) {
  return (
    /\(given name\)|\(name\)/i.test(title) ||
    /\b(given name|first name|feminine name|masculine name|unisex name|name of)\b/i.test(extract)
  );
}

async function fetchSummary(title) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) return null;
  return res.json();
}

/**
 * Resolve { origin, meaning } for a name.
 * Returns null if nothing useful is found.
 */
export async function lookupNameAuto(name) {
  // 1. Instant local dictionary.
  const local = lookupMeaning(name);
  if (local) return { origin: local.origin, meaning: local.meaning, source: 'dictionary' };

  // 2. Wikipedia, trying name-disambiguated titles first.
  const c = cap(name);
  const variants = [`${c}_(given_name)`, `${c}_(name)`, c];
  for (const title of variants) {
    try {
      const data = await fetchSummary(title);
      if (!data || data.type === 'disambiguation') continue;
      const extract = data.extract || '';
      if (!extract) continue;
      if (!looksLikeName(extract, data.title || title)) continue;
      return {
        origin: parseOrigin(extract),
        meaning: parseMeaning(extract),
        source: 'wikipedia',
      };
    } catch {
      // network/CORS hiccup — try the next variant
    }
  }
  return null;
}
