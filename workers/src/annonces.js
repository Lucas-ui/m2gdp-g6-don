/**
 * Annonces : lecture, filtres et forme publique.
 *
 * Les volumes du projet — quelques centaines d'annonces — tiennent en memoire :
 * on lit la collection, puis on filtre, trie et pagine dans le Worker. C'est
 * plus simple que des index composites Firestore, et Firestore ne sait de
 * toute facon pas chercher du texte sans accents.
 */
import { listerCollection } from './firestore.js';
import { associations, categoriesAPlat } from './referentiels.js';

/** Statuts visibles par defaut : une annonce reservee accepte encore la file d'attente. */
const STATUTS_VISIBLES = ['disponible', 'reserve'];

/** Tout ce qu'il faut pour presenter une annonce : referentiels et offrants. */
export async function chargerContexte(jeton, projectId) {
  const [annonces, categories, listeAssociations, utilisateurs] = await Promise.all([
    listerCollection(jeton, projectId, 'annonces'),
    categoriesAPlat(jeton, projectId),
    associations(jeton, projectId),
    listerCollection(jeton, projectId, 'utilisateurs'),
  ]);
  const parId = (liste) => new Map(liste.map((x) => [x.id, x]));
  return {
    annonces,
    categories: parId(categories),
    associations: parId(listeAssociations),
    utilisateurs: parId(utilisateurs),
  };
}

/**
 * Ce qu'on montre d'un membre a cote de son annonce : prenom et initiale du
 * nom (« Claire M. »), comme sur les maquettes. Jamais l'adresse ni l'e-mail.
 */
function versProfilResume(utilisateur) {
  if (!utilisateur) return { id: '', prenom: 'Membre' };
  return {
    id: utilisateur.id,
    prenom: utilisateur.prenom,
    initialeNom: utilisateur.nom ? `${utilisateur.nom[0].toUpperCase()}.` : '',
    photoUrl: utilisateur.photoUrl || null,
  };
}

const resume = (entree) => (entree ? { id: entree.id, libelle: entree.libelle } : undefined);

/**
 * Forme PUBLIQUE d'une annonce. Liste blanche : numeroRue, rue,
 * complementAdresse, latitude et longitude n'y entrent jamais, quel que soit
 * l'appelant. Voir AGENTS.md et le schema AnnoncePublique.
 */
export function versAnnoncePublique(annonce, contexte) {
  const association = contexte.associations.get(annonce.associationId);
  return {
    id: annonce.id,
    titre: annonce.titre,
    description: annonce.description,
    categorie: resume(contexte.categories.get(annonce.categorieId)),
    sousCategorie: resume(contexte.categories.get(annonce.sousCategorieId)),
    etat: annonce.etat,
    participation: annonce.participation,
    association: association ? { id: association.id, nom: association.nom } : undefined,
    offrant: versProfilResume(contexte.utilisateurs.get(annonce.offrantId)),
    creneauRetrait: annonce.creneauRetrait,
    codePostal: annonce.codePostal,
    ville: annonce.ville,
    quartier: annonce.quartier || null,
    latitudeApprochee: annonce.latitudeApprochee,
    longitudeApprochee: annonce.longitudeApprochee,
    medias: [],
    statut: annonce.statut,
    assisteeParIA: Boolean(annonce.assisteeParIA),
    creeLe: annonce.creeLe,
    misAJourLe: annonce.misAJourLe,
  };
}

/** Lit un entier de la requete, borne ; la valeur par defaut si absent. */
function entier(parametres, nom, defaut, min, max) {
  const brut = parametres.get(nom);
  if (brut === null || brut === '') return { valeur: defaut };
  const n = Number(brut);
  if (!Number.isInteger(n) || n < min || n > max) {
    return { erreur: `« ${nom} » doit être un entier entre ${min} et ${max}.` };
  }
  return { valeur: n };
}

/**
 * GET /api/annonces : filtre, trie et pagine. Renvoie { erreurs } si un
 * parametre est invalide, sinon la page au format PageAnnonces.
 */
export function rechercherAnnonces(contexte, parametres) {
  const erreurs = [];
  const page = entier(parametres, 'page', 1, 1, 10000);
  const parPage = entier(parametres, 'parPage', 20, 1, 50);
  if (page.erreur) erreurs.push(page.erreur);
  if (parPage.erreur) erreurs.push(parPage.erreur);
  if (erreurs.length) return { erreurs };

  const categorieId = parametres.get('categorieId');

  const retenues = contexte.annonces
    .filter((a) => STATUTS_VISIBLES.includes(a.statut))
    .filter((a) => !categorieId || a.categorieId === categorieId)
    // Tri par defaut : les plus recentes d'abord.
    .sort((a, b) => (b.creeLe || '').localeCompare(a.creeLe || ''));

  const debut = (page.valeur - 1) * parPage.valeur;
  return {
    total: retenues.length,
    page: page.valeur,
    parPage: parPage.valeur,
    annonces: retenues
      .slice(debut, debut + parPage.valeur)
      .map((a) => versAnnoncePublique(a, contexte)),
  };
}
