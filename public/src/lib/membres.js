/** Presentation des membres : roles, pastille d'initiale. */

const LIBELLE_ROLE = { offrant: "Offrant", demandeur: "Demandeur" };

/** « Offrant », « Demandeur », ou « Offrant et demandeur ». */
export function libelleRoles(roles = []) {
  const noms = roles.map((r) => LIBELLE_ROLE[r] || r);
  if (noms.length === 0) return "Rôle non précisé";
  if (noms.length === 1) return noms[0];
  return `${noms[0]} et ${noms.slice(1).join(", ").toLowerCase()}`;
}

/** Teinte d'accompagnement de la pastille, stable pour un meme prenom. */
const TEINTES = ["bg-lavande", "bg-menthe", "bg-pervenche", "bg-citron"];
export const teinteDe = (graine = "") =>
  TEINTES[[...graine].reduce((n, c) => n + c.charCodeAt(0), 0) % TEINTES.length];

export const initiale = (prenom) => (prenom?.[0] || "?").toUpperCase();
