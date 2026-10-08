/** Mise en forme des valeurs affichees, en francais. */

const euros = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/** « 2 € », « 1,50 € ». */
export function formaterParticipation(montant) {
  // Un demi-euro s'ecrit « 1,50 € » et non « 1,5 € ».
  const centimes = Math.round(montant * 100) % 100;
  return centimes
    ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(montant)
    : euros.format(montant);
}

/** Libelles des valeurs d'etat de l'API. */
export const LIBELLES_ETAT = {
  neuf: 'Neuf',
  tres_bon_etat: 'Très bon état',
  bon_etat: 'Bon état',
  usage: 'Usagé',
};

/** « Claire M. » */
export const nomOffrant = (offrant) =>
  [offrant?.prenom, offrant?.initialeNom].filter(Boolean).join(' ') || 'Un membre';

const jourLong = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'Europe/Paris',
});
const jourCourt = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  timeZone: 'Europe/Paris',
});
const heures = new Intl.DateTimeFormat('fr-FR', {
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'Europe/Paris',
});

/** « 14 h », « 14 h 30 » : la notation francaise des heures. */
function heure(date) {
  const [h, m] = heures.format(date).split(':');
  return m === '00' ? `${Number(h)} h` : `${Number(h)} h ${m}`;
}

/**
 * Creneau de retrait, a l'heure de Lyon quel que soit le fuseau de l'appareil :
 * « samedi 14 novembre · 14 h – 16 h ». `court` donne « sam. 14 nov. ».
 */
export function formaterCreneau(creneau, { court = false } = {}) {
  if (!creneau?.debut) return '';
  const debut = new Date(creneau.debut);
  const fin = new Date(creneau.fin);
  const jour = (court ? jourCourt : jourLong).format(debut);
  return `${jour.charAt(0).toUpperCase()}${jour.slice(1)} · ${heure(debut)} – ${heure(fin)}`;
}

/** Vrai si le creneau est deja termine. */
export const creneauPasse = (creneau) => Boolean(creneau?.fin) && new Date(creneau.fin) < new Date();

/** « Lyon 7e », ou la ville a defaut de quartier. */
export const lieuAnnonce = (annonce) => annonce.quartier || annonce.ville;
