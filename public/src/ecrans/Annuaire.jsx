import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import EnTeteRetour from "@/components/EnTeteRetour.jsx";
import { listerUtilisateurs } from "@/lib/api.js";
import { initiale, libelleRoles, teinteDe } from "@/lib/membres.js";

/** « 69002 Lyon », ou rien si le profil ne porte ni l'un ni l'autre. */
const libelleLieu = ({ codePostal, ville }) => [codePostal, ville].filter(Boolean).join(" ");

/**
 * Annuaire des membres — l'accueil du POC J2, deplace ici quand l'accueil est
 * devenu la liste des objets. La J2 demandait « l'inscription pas a pas ET
 * l'affichage des utilisateurs » : l'annuaire reste la preuve visible que les
 * profils sont bien ecrits en base. Ne montre que la liste blanche publique.
 */
export default function Annuaire({ profil }) {
  const [utilisateurs, setUtilisateurs] = useState(null);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    listerUtilisateurs()
      .then(setUtilisateurs)
      .catch((e) => setErreur(e.message));
  }, []);

  return (
    <section className="lg:mx-auto lg:max-w-4xl">
      <EnTeteRetour titre="Membres" sousTitre={utilisateurs && `${utilisateurs.length} inscrits`} />

      {erreur && (
        <p role="alert" className="mt-4 rounded-2xl bg-destructive/10 p-4 text-sm text-destructive">
          {erreur}
        </p>
      )}
      {!erreur && !utilisateurs && <p className="mt-4 text-sm text-muted-foreground">Chargement…</p>}

      {utilisateurs && (
        <ul className="mt-4 space-y-2.5 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
          {utilisateurs.map((u) => (
            <li key={u.id} className="doneo-carte flex items-center gap-3.5 p-3">
              <span
                className={`grid size-12 shrink-0 place-items-center rounded-2xl ${teinteDe(u.prenom)} font-titre text-lg font-semibold text-ardoise`}
                aria-hidden="true">
                {initiale(u.prenom)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">
                  {u.prenom} {u.nom}
                  {u.id === profil.id && (
                    <span className="ml-2 align-middle text-[0.65rem] font-semibold tracking-wide text-primary uppercase">
                      Vous
                    </span>
                  )}
                </span>
                <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                  {libelleRoles(u.roles)}
                </span>
                {libelleLieu(u) && (
                  <span className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3 shrink-0" aria-hidden="true" />
                    <span className="truncate">{libelleLieu(u)}</span>
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
