import { useEffect, useState } from "react";
import { Heart, Home, LogOut, MapPin, Plus, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import Logo from "@/components/Logo.jsx";
import { listerUtilisateurs } from "@/lib/api.js";
import { seDeconnecter } from "@/lib/auth.js";

const LIBELLE_ROLE = {
  donateur: "Donateur",
  beneficiaire: "Bénéficiaire",
};

/** Teinte d'accompagnement de la pastille, choisie d'apres le prenom pour que
 *  l'annuaire soit colore sans etre aleatoire d'un affichage a l'autre. */
const TONS = ["bg-lavande", "bg-menthe", "bg-pervenche", "bg-citron"];
const ton = (graine = "") =>
  TONS[[...graine].reduce((n, c) => n + c.charCodeAt(0), 0) % TONS.length];

/** « Donateur », « Bénéficiaire », ou « Donateur et bénéficiaire ». */
function libelleRoles(roles = []) {
  const noms = roles.map((r) => LIBELLE_ROLE[r] || r);
  if (noms.length === 0) return "Rôle non précisé";
  if (noms.length === 1) return noms[0];
  return `${noms[0]} et ${noms.slice(1).join(", ").toLowerCase()}`;
}

/**
 * « 69002 Lyon ». Renvoie une chaine vide si le profil ne porte ni l'un ni
 * l'autre : les comptes crees avant l'ajout de la ville n'en ont pas, et mieux
 * vaut masquer la ligne que d'afficher un lieu a moitie vide.
 */
function libelleLieu({ codePostal, ville }) {
  return [codePostal, ville].filter(Boolean).join(" ");
}

/** Onglets de la barre du bas. Seul l'accueil existe a ce stade du POC. */
const ONGLETS = [
  { cle: "accueil", libelle: "Accueil", Icone: Home },
  { cle: "recherche", libelle: "Recherche", Icone: Search },
  { cle: "creer", libelle: "Créer", Icone: Plus, central: true },
  { cle: "favoris", libelle: "Favoris", Icone: Heart },
  { cle: "profil", libelle: "Profil", Icone: User },
];

/**
 * Ecran 4 des maquettes, adapte au perimetre reellement livre.
 *
 * L'annuaire des inscrits n'est pas du decor : la J2 demande « l'inscription
 * pas a pas ET l'affichage des utilisateurs ». C'est la preuve visible que le
 * profil a bien ete ecrit dans Firestore par le Worker.
 *
 * Ni barre de recherche ni filtres par categorie, contrairement aux maquettes :
 * l'US-3 (issue #9) les exclut du MVP, et une commande qui ne commande rien
 * dessert plus la demonstration qu'elle ne la sert. Les onglets absents du
 * perimetre restent visibles mais desactives, pour montrer la suite du produit
 * sans faire croire qu'elle fonctionne.
 */
export default function Accueil({ profil }) {
  const [utilisateurs, setUtilisateurs] = useState(null);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    listerUtilisateurs()
      .then(setUtilisateurs)
      .catch((e) => setErreur(e.message));
  }, []);

  // CA3 : connecte, on figure forcement dans l'annuaire — la liste n'est donc
  // jamais vide. Le cas limite reel est « je suis le seul inscrit », et il
  // merite d'etre dit plutot que de laisser une carte isolee sans explication.
  const seulInscrit =
    utilisateurs?.length === 1 && utilisateurs[0].id === profil.id;

  return (
    <section className="pb-28">
      <header className="flex items-center justify-between gap-4">
        <Logo />
        <Button
          variant="ghost"
          size="icon-lg"
          className="rounded-2xl border border-primary/15 bg-white text-muted-foreground hover:text-foreground"
          aria-label="Se déconnecter"
          onClick={seDeconnecter}>
          <LogOut className="size-4.5" aria-hidden="true" />
        </Button>
      </header>

      <h1 className="doneo-titre mt-6 text-[2rem] leading-tight">
        Bonjour, {profil.prenom}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {libelleRoles(profil.roles)}
        {libelleLieu(profil) && ` · ${libelleLieu(profil)}`}
      </p>

      {/* Banniere de marque : le violet porte l'identite, l'illustration
          apporte la chaleur du geste. */}
      <div className="mt-5 flex items-center gap-4 rounded-[1.75rem] bg-primary p-5 text-white shadow-lg shadow-primary/25">
        <div className="min-w-0 flex-1">
          <p className="font-titre text-xl leading-tight font-semibold">
            Donné, pas jeté.
          </p>
          <p className="mt-1.5 text-[0.8rem] leading-5 text-white/85 text-pretty">
            Des objets utiles pour les étudiants, près de chez vous.
          </p>
        </div>
        <div className="grid size-24 shrink-0 place-items-center rounded-[1.75rem] bg-white/95">
          <img
            src="/illustrations/objet-cadeau.svg"
            alt=""
            aria-hidden="true"
            className="size-16"
          />
        </div>
      </div>

      <div className="mt-7 flex items-baseline justify-between gap-3">
        <h2 className="doneo-titre text-xl">Membres de la communauté</h2>
        {utilisateurs && (
          <span className="text-violet-fonce text-sm font-semibold">
            {utilisateurs.length}
          </span>
        )}
      </div>

      {erreur && (
        <p
          role="alert"
          className="mt-3 rounded-2xl bg-destructive/10 p-4 text-sm text-destructive">
          {erreur}
        </p>
      )}

      {!erreur && !utilisateurs && (
        <p className="mt-3 text-sm text-muted-foreground">Chargement…</p>
      )}

      {/* CA3 : la communaute se resume a soi-meme. On le dit clairement, et on
          affiche quand meme sa propre carte pour que le compteur et la liste
          restent coherents. */}
      {seulInscrit && (
        <div className="doneo-carte mt-3 flex items-start gap-3 p-4">
          <img
            src="/illustrations/objet-etoile.svg"
            alt=""
            aria-hidden="true"
            className="size-9 shrink-0"
          />
          <p className="text-[0.8rem] leading-5 text-muted-foreground text-pretty">
            Vous êtes le premier inscrit ! Il n’y a pas encore d’autres membres
            — revenez bientôt, ou parlez-en autour de vous.
          </p>
        </div>
      )}

      {utilisateurs && utilisateurs.length > 0 && (
        <ul className="mt-3 space-y-2.5">
          {utilisateurs.map((u) => (
            <li key={u.id} className="doneo-carte flex items-center gap-3.5 p-3">
              <span
                className={`grid size-14 shrink-0 place-items-center rounded-2xl ${ton(u.prenom)} font-titre text-xl font-semibold text-ardoise`}
                aria-hidden="true">
                {(u.prenom?.[0] || "?").toUpperCase()}
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

      <nav
        aria-label="Navigation principale"
        className="fixed inset-x-0 bottom-0 z-10 mx-auto flex max-w-md items-start justify-around rounded-t-[1.75rem] border-t border-primary/10 bg-white px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-10px_30px_-14px_rgb(155_77_219/30%)]">
        {ONGLETS.map(({ cle, libelle, Icone, central }) => {
          const actif = cle === "accueil";

          if (central) {
            return (
              <button
                key={cle}
                type="button"
                disabled
                aria-label="Créer une annonce — bientôt disponible"
                className="-mt-6 grid size-14 place-items-center rounded-3xl bg-primary text-white shadow-lg shadow-primary/40 disabled:opacity-45">
                <Plus className="size-6" aria-hidden="true" />
              </button>
            );
          }

          return (
            <button
              key={cle}
              type="button"
              disabled={!actif}
              aria-current={actif ? "page" : undefined}
              aria-label={actif ? libelle : `${libelle} — bientôt disponible`}
              className={`flex flex-1 flex-col items-center gap-1 disabled:opacity-40 ${
                actif ? "text-primary" : "text-ardoise"
              }`}>
              <Icone
                className="size-5.5"
                strokeWidth={2}
                fill={actif ? "currentColor" : "none"}
                aria-hidden="true"
              />
              <span className="text-[0.625rem] font-semibold">{libelle}</span>
            </button>
          );
        })}
      </nav>
    </section>
  );
}
