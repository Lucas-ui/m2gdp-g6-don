/**
 * Genere les donnees de demonstration : 110 profils et une annonce par objet du
 * catalogue (149), ecrits dans specs/donnees/demo/*.json.
 *
 *   node scripts/donnees/generer-donnees-demo.mjs
 *
 * La generation est DETERMINISTE (graine fixe) : relancer produit les memes
 * personnes et les memes annonces. Seul le geocodage passe par le reseau ; il
 * valide chaque adresse aupres de la Geoplateforme (data.geopf.fr), le service
 * national qui a pris la suite de l'API Adresse. Une adresse inconnue est
 * ecartee et une autre est tiree : toutes les adresses des donnees existent.
 *
 * Le resultat est versionne : on relit des JSON dans une revue de code, et le
 * chargement en base (charger-donnees-demo.mjs) n'a plus besoin du reseau.
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { CATALOGUE } from './catalogue-objets.mjs';
import { RACINE_DEPOT } from './chemins.mjs';

/* --- Hasard reproductible ---------------------------------------------------- */

// mulberry32 : petit generateur pseudo-aleatoire a graine, suffisant ici.
function generateur(graine) {
  let a = graine >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const hasard = generateur(2026);
const entre = (min, max) => min + Math.floor(hasard() * (max - min + 1));
const parmi = (liste) => liste[Math.floor(hasard() * liste.length)];
const melanger = (liste) => {
  const copie = [...liste];
  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(hasard() * (i + 1));
    [copie[i], copie[j]] = [copie[j], copie[i]];
  }
  return copie;
};

/* --- Personnes ---------------------------------------------------------------- */

// Prenoms et noms varies, a l'image de la population lyonnaise.
const PRENOMS = [
  'Léa', 'Lucas', 'Camille', 'Hugo', 'Chloé', 'Nathan', 'Manon', 'Théo', 'Inès', 'Louis',
  'Sarah', 'Yanis', 'Emma', 'Mohamed', 'Jade', 'Adam', 'Lina', 'Rayan', 'Zoé', 'Gabriel',
  'Yasmine', 'Mathis', 'Anaïs', 'Karim', 'Clara', 'Malik', 'Juliette', 'Ibrahim', 'Louise', 'Sofiane',
  'Margaux', 'Ethan', 'Nour', 'Paul', 'Aïcha', 'Tom', 'Fatou', 'Antoine', 'Mei', 'Bastien',
  'Salomé', 'Mamadou', 'Élise', 'Yacine', 'Charlotte', 'Thomas', 'Amira', 'Julien', 'Océane', 'Kevin',
  'Pauline', 'Ousmane', 'Lucie', 'Alexandre', 'Nina', 'Samuel', 'Rania', 'Victor', 'Maëlle', 'Enzo',
  'Claire', 'Ali', 'Sofia', 'Martin', 'Awa', 'Romain', 'Linh', 'Benjamin', 'Ambre', 'Nicolas',
  'Hélène', 'Bilal', 'Marie', 'Dylan', 'Kenza', 'Florian', 'Agathe', 'Jules', 'Myriam', 'Arthur',
];
const NOMS = [
  'Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau',
  'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David', 'Bertrand', 'Roux', 'Vincent', 'Fournier',
  'Morel', 'Girard', 'André', 'Mercier', 'Dupont', 'Lambert', 'Bonnet', 'François', 'Martinez', 'Legrand',
  'Benali', 'Haddad', 'Nguyen', 'Diallo', 'Traoré', 'Mansouri', 'Benhamou', 'Tran', 'Kone', 'Belkacem',
  'Rolland', 'Chevalier', 'Gauthier', 'Perrin', 'Morin', 'Clément', 'Guerin', 'Boyer', 'Garnier', 'Chabert',
  'Faure', 'Rousseau', 'Blanc', 'Guillot', 'Mathieu', 'Brun', 'Colin', 'Fabre', 'Masson', 'Marchand',
  'Ferreira', 'Rodrigues', 'Lopez', 'Sanchez', 'Rossi', 'Ziani', 'Cissé', 'Pham', 'Ouali', 'Amrani',
];

// Rues reelles de la Metropole de Lyon. Le geocodage confirme chaque adresse.
const RUES = [
  ['Rue Paul Chenavard', '69001', 'Lyon'], ['Rue d\'Algérie', '69001', 'Lyon'],
  ['Rue Burdeau', '69001', 'Lyon'], ['Rue des Capucins', '69001', 'Lyon'],
  ['Rue Mercière', '69002', 'Lyon'], ['Rue de Brest', '69002', 'Lyon'],
  ['Rue Victor Hugo', '69002', 'Lyon'], ['Rue Sala', '69002', 'Lyon'],
  ['Rue Paul Bert', '69003', 'Lyon'], ['Rue Moncey', '69003', 'Lyon'],
  ['Avenue Félix Faure', '69003', 'Lyon'], ['Rue Servient', '69003', 'Lyon'],
  ['Cours Gambetta', '69003', 'Lyon'], ['Boulevard de la Croix-Rousse', '69004', 'Lyon'],
  ['Rue d\'Austerlitz', '69004', 'Lyon'], ['Rue Dumenge', '69004', 'Lyon'],
  ['Rue Commandant Charcot', '69005', 'Lyon'], ['Avenue du Point du Jour', '69005', 'Lyon'],
  ['Rue Saint-Jean', '69005', 'Lyon'], ['Cours Vitton', '69006', 'Lyon'],
  ['Rue Tronchet', '69006', 'Lyon'], ['Boulevard des Belges', '69006', 'Lyon'],
  ['Rue de Marseille', '69007', 'Lyon'], ['Avenue Jean Jaurès', '69007', 'Lyon'],
  ['Rue Béchevelin', '69007', 'Lyon'], ['Rue Chevreul', '69007', 'Lyon'],
  ['Grande Rue de la Guillotière', '69007', 'Lyon'], ['Rue de Gerland', '69007', 'Lyon'],
  ['Avenue des Frères Lumière', '69008', 'Lyon'], ['Rue Marius Berliet', '69008', 'Lyon'],
  ['Avenue Paul Santy', '69008', 'Lyon'], ['Rue de Bourgogne', '69009', 'Lyon'],
  ['Rue Marietton', '69009', 'Lyon'], ['Quai Arloing', '69009', 'Lyon'],
  ['Cours Émile Zola', '69100', 'Villeurbanne'], ['Rue Francis de Pressensé', '69100', 'Villeurbanne'],
  ['Avenue Henri Barbusse', '69100', 'Villeurbanne'], ['Rue Anatole France', '69100', 'Villeurbanne'],
  ['Boulevard Laurent Gérin', '69200', 'Vénissieux'], ['Avenue Franklin Roosevelt', '69500', 'Bron'],
  ['Avenue Gabriel Péri', '69120', 'Vaulx-en-Velin'], ['Rue Jean Moulin', '69300', 'Caluire-et-Cuire'],
];

const COMPLEMENTS = ['', '', '', '', 'Bâtiment B', 'Appartement 12', '3e étage', 'Résidence étudiante, chambre 214', 'Digicode à l\'entrée'];

/* --- Geocodage ---------------------------------------------------------------- */

const pause = (ms) => new Promise((r) => setTimeout(r, ms));

/** Geocode une adresse ; renvoie null si elle n'existe pas a ce numero. */
async function geocoder(numero, rue, codePostal, ville) {
  const url = new URL('https://data.geopf.fr/geocodage/search');
  url.searchParams.set('q', `${numero} ${rue} ${codePostal} ${ville}`);
  url.searchParams.set('postcode', codePostal);
  url.searchParams.set('limit', '1');
  for (let essai = 0; essai < 3; essai++) {
    const reponse = await fetch(url);
    if (reponse.status === 429) {
      await pause(1000);
      continue;
    }
    const { features = [] } = await reponse.json();
    const f = features[0];
    await pause(60); // reste sous la limite de 50 requetes par seconde
    if (!f || f.properties.type !== 'housenumber' || f.properties.score < 0.7) return null;
    if (f.properties.housenumber !== String(numero)) return null;
    const [longitude, latitude] = f.geometry.coordinates;
    return {
      latitude,
      longitude,
      // « Lyon 7e Arrondissement » devient « Lyon 7e » ; hors Lyon, la commune.
      quartier: (f.properties.district || f.properties.city).replace(/ Arrondissement$/, ''),
    };
  }
  throw new Error('Geoplateforme indisponible');
}

/** Tire une adresse reelle, en reessayant tant que le numero n'existe pas. */
async function adresseValide() {
  for (let essai = 0; essai < 12; essai++) {
    const [rue, codePostal, ville] = parmi(RUES);
    const numero = String(entre(1, essai < 6 ? 60 : 20));
    const geo = await geocoder(numero, rue, codePostal, ville);
    if (geo) return { numeroRue: numero, rue, codePostal, ville, ...geo };
  }
  throw new Error('Aucune adresse valide trouvee');
}

/**
 * Position approchee, publique : la position exacte decalee de 200 a 500 m.
 * Assez pres pour situer l'objet dans son quartier, assez loin pour ne pas
 * designer un immeuble.
 *
 * Le decalage est DERIVE DE L'ADRESSE (empreinte SHA-256), et non tire a
 * chaque annonce : toutes les annonces d'une meme adresse partagent le meme
 * point. Avec un tirage par annonce, les huit annonces d'un offrant
 * formeraient un cercle autour de chez lui, et la moyenne de leurs positions
 * retomberait sur son domicile.
 */
function positionApprochee(latitude, longitude, adresse) {
  const empreinte = createHash('sha256')
    .update(`${adresse.numeroRue}|${adresse.rue}|${adresse.codePostal}`.toLowerCase())
    .digest();
  const distance = 200 + (empreinte.readUInt32BE(0) / 2 ** 32) * 300;
  const angle = (empreinte.readUInt32BE(4) / 2 ** 32) * 2 * Math.PI;
  const arrondi = (x) => Math.round(x * 1e5) / 1e5;
  return {
    latitudeApprochee: arrondi(latitude + (distance * Math.cos(angle)) / 111320),
    longitudeApprochee: arrondi(
      longitude + (distance * Math.sin(angle)) / (111320 * Math.cos((latitude * Math.PI) / 180)),
    ),
  };
}

/* --- Dates -------------------------------------------------------------------- */

/** Date ISO (UTC) d'une heure locale a Lyon. L'heure d'hiver commence le 25/10/2026. */
function heureDeLyon(annee, mois, jour, heure) {
  const decalage = Date.UTC(annee, mois - 1, jour) >= Date.UTC(2026, 9, 25) ? 1 : 2;
  return new Date(Date.UTC(annee, mois - 1, jour, heure - decalage)).toISOString();
}

/** Creneau de retrait entre le 20/10 et le 15/12/2026, plutot le soir ou le week-end. */
function creneau() {
  const jour = new Date(Date.UTC(2026, 9, 20) + entre(0, 56) * 86400000);
  const weekEnd = [0, 6].includes(jour.getUTCDay());
  const debut = weekEnd ? parmi([10, 11, 14, 15, 16]) : parmi([12, 17, 18, 18, 19]);
  const duree = weekEnd ? parmi([2, 2, 3]) : parmi([1, 2]);
  const [a, m, j] = [jour.getUTCFullYear(), jour.getUTCMonth() + 1, jour.getUTCDate()];
  return { debut: heureDeLyon(a, m, j, debut), fin: heureDeLyon(a, m, j, debut + duree) };
}

/** Instant aleatoire entre deux dates ISO. */
const instantEntre = (de, a) =>
  new Date(Date.parse(de) + hasard() * (Date.parse(a) - Date.parse(de))).toISOString();

/* --- Associations par famille d'objets ---------------------------------------- */

const { associations } = JSON.parse(
  readFileSync(path.join(RACINE_DEPOT, 'specs/donnees/associations.json'), 'utf8'),
);
const idsAssociations = associations.map((a) => a.id);

// Un offrant choisit souvent une cause en lien avec ce qu'il donne. Ces
// preferences pesent sur le tirage, sans l'imposer.
const AFFINITES = {
  electromenager: ['envie-rhone', 'atelier-emmaus'],
  mobilier: ['atelier-emmaus', 'habitat-humanisme', 'foyer-notre-dame-sans-abri'],
  scolaire: ['gaelis', 'solidarite-etudiante-lyon'],
  informatique: ['gaelis', 'solidarite-etudiante-lyon', 'envie-rhone'],
  enfance: ['le-toucan', 'secours-populaire-rhone'],
  sport: ['sport-dans-la-ville'],
  cuisine: ['restos-du-coeur-rhone', 'banque-alimentaire-rhone', 'epicerie-arc-en-ciel'],
  vetements: ['secours-populaire-rhone', 'association-le-mas', 'foyer-notre-dame-sans-abri'],
};
const associationPour = (categorieId) =>
  hasard() < 0.6 && AFFINITES[categorieId] ? parmi(AFFINITES[categorieId]) : parmi(idsAssociations);

/* --- Generation --------------------------------------------------------------- */

const NOMBRE_PROFILS = 110;
const MAINTENANT = '2026-10-08T09:00:00.000Z';
const sansAccent = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

console.log('Profils : geocodage des adresses...');
const utilisateurs = [];
const prenomsNoms = new Set();
for (let i = 1; i <= NOMBRE_PROFILS; i++) {
  let prenom;
  let nom;
  do {
    prenom = parmi(PRENOMS);
    nom = parmi(NOMS);
  } while (prenomsNoms.has(prenom + nom));
  prenomsNoms.add(prenom + nom);

  // 40 % offrants, 35 % demandeurs, 25 % les deux.
  const tirage = hasard();
  const roles = tirage < 0.4 ? ['offrant'] : tirage < 0.75 ? ['demandeur'] : ['offrant', 'demandeur'];
  // Les demandeurs sont surtout des etudiants : 18 a 27 ans. Les offrants, de tout age.
  const age = roles.includes('offrant') && roles.length === 1 ? entre(24, 72) : entre(18, 27);
  const naissance = new Date(Date.UTC(2026 - age, entre(0, 11), entre(1, 28)));

  const { latitude, longitude, quartier, ...adresse } = await adresseValide();
  const creeLe = instantEntre('2026-09-01T08:00:00Z', '2026-10-05T20:00:00Z');
  utilisateurs.push({
    id: `demo-u-${String(i).padStart(3, '0')}`,
    // Adresse en example.org : un domaine reserve, qui ne recevra jamais d'e-mail.
    email: `${sansAccent(prenom)}.${sansAccent(nom).replace(/[^a-z]/g, '')}${i}@example.org`,
    prenom,
    nom,
    roles,
    ...adresse,
    complementAdresse: parmi(COMPLEMENTS),
    dateNaissance: naissance.toISOString().slice(0, 10),
    photoUrl: '',
    creeLe,
    misAJourLe: creeLe,
    _position: { latitude, longitude, quartier }, // retire avant ecriture
  });
  if (i % 10 === 0) console.log(`  ${i}/${NOMBRE_PROFILS}`);
}

console.log('Annonces...');
const offrants = utilisateurs.filter((u) => u.roles.includes('offrant'));
const objets = melanger(
  Object.entries(CATALOGUE).flatMap(([sousCategorieId, liste]) =>
    liste.map((objet) => ({ ...objet, sousCategorieId })),
  ),
);

const annonces = [];
for (const [i, objet] of objets.entries()) {
  // Quelques offrants tres actifs, beaucoup d'occasionnels : la moitie des
  // annonces vient du premier quart des offrants.
  const offrant = hasard() < 0.5 ? offrants[entre(0, Math.floor(offrants.length / 4))] : parmi(offrants);
  const categorieId = objet.sousCategorieId.split('-')[0];

  // Neuf fois sur dix, l'objet se retire chez l'offrant ; sinon ailleurs
  // (chez un proche, au travail).
  let lieu;
  if (hasard() < 0.9) {
    const { numeroRue, rue, complementAdresse, codePostal, ville, _position } = offrant;
    lieu = { numeroRue, rue, complementAdresse, codePostal, ville, ..._position };
  } else {
    lieu = { ...(await adresseValide()), complementAdresse: '' };
  }

  const [min, max] = objet.participation;
  // Des euros ronds le plus souvent, parfois un demi-euro.
  const participation = hasard() < 0.15 && max > min ? min + 0.5 : entre(min, max);
  const creeLe = instantEntre(offrant.creeLe, MAINTENANT);
  const tirageStatut = hasard();

  annonces.push({
    id: `demo-a-${String(i + 1).padStart(3, '0')}`,
    offrantId: offrant.id,
    associationId: associationPour(categorieId),
    categorieId,
    sousCategorieId: objet.sousCategorieId,
    titre: objet.titre,
    description: objet.description,
    etat: objet.etat,
    participation,
    creneauRetrait: creneau(),
    numeroRue: lieu.numeroRue,
    rue: lieu.rue,
    complementAdresse: lieu.complementAdresse,
    codePostal: lieu.codePostal,
    ville: lieu.ville,
    latitude: lieu.latitude,
    longitude: lieu.longitude,
    ...positionApprochee(lieu.latitude, lieu.longitude, lieu),
    quartier: lieu.quartier,
    mediaIds: [],
    statut: tirageStatut < 0.86 ? 'disponible' : tirageStatut < 0.97 ? 'reserve' : 'remis',
    assisteeParIA: false,
    creeLe,
    misAJourLe: creeLe,
  });
}

const sortie = path.join(RACINE_DEPOT, 'specs/donnees/demo');
mkdirSync(sortie, { recursive: true });
const ecrire = (nom, donnees) =>
  writeFileSync(path.join(sortie, nom), `${JSON.stringify(donnees, null, 2)}\n`);

ecrire('utilisateurs.json', utilisateurs.map(({ _position, ...u }) => u));
ecrire('annonces.json', annonces);

const parStatut = annonces.reduce((n, a) => ({ ...n, [a.statut]: (n[a.statut] || 0) + 1 }), {});
console.log(`${utilisateurs.length} profils (${offrants.length} offrants), ${annonces.length} annonces`, parStatut);
