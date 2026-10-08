/**
 * Genere une illustration par categorie et par sous-categorie : l'image qu'on
 * affiche a la place d'une photo quand l'annonce n'en a pas (US-12).
 *
 *   cd scripts && npm install && npm run illustrations
 *
 * Chaque illustration reprend le langage des illustrations de la charte
 * (design/illustrations) : un trait ardoise epais sur des aplats pastel. Le
 * motif central est une icone Lucide — la bibliotheque d'icones deja retenue
 * par la charte, sous licence ISC — et la teinte de fond est celle de la
 * categorie principale, pour qu'une famille d'objets se reconnaisse d'un coup
 * d'oeil dans une liste.
 *
 * Sortie : public/static/illustrations/categories/<id>.svg (4:3, 320 x 240).
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { RACINE_DEPOT } from './chemins.mjs';

const require = createRequire(import.meta.url);
const DOSSIER_ICONES = path.join(path.dirname(require.resolve('lucide-static/package.json')), 'icons');
const SORTIE = path.join(RACINE_DEPOT, 'public/static/illustrations/categories');

// Couleurs exactes de la charte (public/src/index.css).
const TEINTES = {
  lavande: { fond: '#E7D6F5', soutenu: '#C6A3EC' },
  menthe: { fond: '#BFE9E1', soutenu: '#8FD6C8' },
  pervenche: { fond: '#C6CAF6', soutenu: '#A3A9EE' },
  citron: { fond: '#EDF5B3', soutenu: '#D9E77A' },
};
const ARDOISE = '#2F4F5C';
const VIOLET = '#9B4DDB';
const ROSE = '#E23C8E';

/** Contenu d'une icone Lucide, sans l'enveloppe <svg>. */
function traitsIcone(nom) {
  const svg = readFileSync(path.join(DOSSIER_ICONES, `${nom}.svg`), 'utf8');
  return svg
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<svg[\s\S]*?>/, '')
    .replace('</svg>', '')
    .trim();
}

/** Petite etoile a quatre branches, comme sur les illustrations de la charte. */
const etincelle = (x, y, r, couleur) =>
  `<path d="M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z" fill="${couleur}"/>`;

function illustration({ libelle, icone, teinte }) {
  const t = TEINTES[teinte];
  // L'icone fait 24 unites ; on la met a l'echelle 4 et on la centre dans la
  // pastille. Le trait est fixe en unites d'icone pour rester epais apres
  // agrandissement, comme le trait de 2,4 des illustrations de la charte.
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" width="320" height="240" role="img" aria-label="${libelle}">
  <rect width="320" height="240" fill="${t.fond}"/>
  <circle cx="44" cy="206" r="58" fill="${t.soutenu}" fill-opacity=".45"/>
  <circle cx="292" cy="30" r="44" fill="#FFFFFF" fill-opacity=".35"/>
  <circle cx="160" cy="120" r="78" fill="#FFFFFF" stroke="${ARDOISE}" stroke-width="3"/>
  <ellipse cx="160" cy="176" rx="40" ry="6" fill="${t.soutenu}" fill-opacity=".7"/>
  <g transform="translate(112 72) scale(4)" fill="none" stroke="${ARDOISE}" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round">
    ${traitsIcone(icone)}
  </g>
  <path d="M226 64 216.5 54.5a6.4 6.4 0 0 1 9.05-9.05L226 46l.45-.55a6.4 6.4 0 0 1 9.05 9.05z" fill="${VIOLET}" stroke="${ARDOISE}" stroke-width="2.4" stroke-linejoin="round"/>
  ${etincelle(84, 62, 9, ARDOISE)}
  ${etincelle(246, 172, 7, VIOLET)}
  <circle cx="96" cy="182" r="4" fill="${ROSE}" fill-opacity=".55"/>
  <circle cx="236" cy="96" r="3.4" fill="${ARDOISE}"/>
</svg>
`;
}

const { categories } = JSON.parse(
  readFileSync(path.join(RACINE_DEPOT, 'specs/donnees/categories.json'), 'utf8'),
);

mkdirSync(SORTIE, { recursive: true });
let n = 0;
for (const principale of categories) {
  writeFileSync(path.join(SORTIE, `${principale.id}.svg`), illustration(principale));
  n++;
  for (const sous of principale.sousCategories) {
    writeFileSync(
      path.join(SORTIE, `${sous.id}.svg`),
      illustration({ ...sous, teinte: principale.teinte }),
    );
    n++;
  }
}
console.log(`${n} illustrations dans ${path.relative(RACINE_DEPOT, SORTIE)}`);
