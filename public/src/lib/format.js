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

/** « Lyon 7e », ou la ville a defaut de quartier. */
export const lieuAnnonce = (annonce) => annonce.quartier || annonce.ville;
