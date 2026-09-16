import { useEffect, useState } from "react";
import { Heart, LogOut, MapPin, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { listerUtilisateurs } from "@/lib/api.js";
import { seDeconnecter } from "@/lib/auth.js";

const LIBELLE_ROLE = {
  donateur: "Donateur",
  beneficiaire: "Bénéficiaire",
};

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

/**
 * Ecran d'arrivee une fois connecte et inscrit.
 *
 * L'annuaire des inscrits n'est pas du decor : la J2 demande « l'inscription
 * pas a pas ET l'affichage des utilisateurs ». C'est la preuve visible que le
 * profil a bien ete ecrit dans Firestore par le Worker.
 *
 * Pas de champ de recherche : l'US-3 (issue #9) l'exclut du MVP.
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
    <section className="space-y-5 pb-24">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
            Bienvenue sur Donéo
          </p>
          <h1 className="doneo-title mt-1 text-3xl tracking-tight">
            Bonjour, {profil.prenom}
          </h1>
          <p className="text-sm text-muted-foreground">
            {libelleRoles(profil.roles)}
            {libelleLieu(profil) && ` · ${libelleLieu(profil)}`}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-muted-foreground"
          aria-label="Se déconnecter"
          onClick={seDeconnecter}>
          <LogOut className="size-4" aria-hidden="true" />
        </Button>
      </header>

      <div className="rounded-3xl bg-primary p-5 text-primary-foreground shadow-lg shadow-primary/20">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-lg font-extrabold">Donné, pas jeté.</p>
            <p className="mt-1 max-w-56 text-sm leading-5 text-primary-foreground/80">
              Des objets utiles pour les étudiants, au bon endroit.
            </p>
          </div>
          <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-white/90 text-primary">
            <Heart className="size-8 fill-current" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3 shadow-sm">
        <Search className="size-5 text-primary" aria-hidden="true" />
        <span className="text-sm text-muted-foreground">
          Chercher une pépite...
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {["Tout", "Antiquités", "Cosmétiques", "Vêtements"].map(
          (categorie, index) => (
            <span
              key={categorie}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${index === 0 ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}>
              {categorie}
            </span>
          ),
        )}
      </div>

      <Card className="gap-4 rounded-3xl border-0 py-5 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="size-4" aria-hidden="true" />
            Membres de la communauté
            {utilisateurs && (
              <span className="font-normal text-muted-foreground">
                ({utilisateurs.length})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {erreur && (
            <p role="alert" className="text-sm text-destructive">
              {erreur}
            </p>
          )}
          {!erreur && !utilisateurs && (
            <p className="text-sm text-muted-foreground">Chargement…</p>
          )}

          {/* CA3 : la communaute se resume a soi-meme. On le dit clairement,
              et on affiche quand meme sa propre carte pour que le compteur et
              la liste restent coherents. */}
          {seulInscrit && (
            <p className="mb-3 rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">
              Vous êtes le premier inscrit ! Il n’y a pas encore d’autres
              membres — revenez bientôt, ou parlez-en autour de vous.
            </p>
          )}

          {utilisateurs && utilisateurs.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Aucun inscrit pour le moment.
            </p>
          )}
          {utilisateurs && utilisateurs.length > 0 && (
            <ul className="divide-y">
              {utilisateurs.map((u) => (
                <li key={u.id} className="flex items-center gap-3 py-3">
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium"
                    aria-hidden="true">
                    {(u.prenom?.[0] || "?").toUpperCase()}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">
                      {u.prenom} {u.nom}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {libelleRoles(u.roles)}
                    </span>
                    {libelleLieu(u) && (
                      <span className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin
                          className="size-3 shrink-0"
                          aria-hidden="true"
                        />
                        <span className="truncate">{libelleLieu(u)}</span>
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <nav className="fixed inset-x-0 bottom-0 z-10 mx-auto flex max-w-md items-center justify-around border-t border-primary/10 bg-white/95 px-3 py-3 shadow-[0_-8px_30px_rgb(47_79_92/8%)] backdrop-blur">
        <span className="flex flex-col items-center gap-1 text-[0.65rem] font-bold text-primary">
          <Heart className="size-5 fill-current" />
          Accueil
        </span>
        <span className="flex flex-col items-center gap-1 text-[0.65rem] font-semibold text-muted-foreground">
          <Search className="size-5" />
          Rechercher
        </span>
        <span className="grid size-12 -translate-y-4 place-items-center rounded-full bg-primary text-2xl text-white shadow-lg shadow-primary/30">
          +
        </span>
        <span className="flex flex-col items-center gap-1 text-[0.65rem] font-semibold text-muted-foreground">
          <Heart className="size-5" />
          Favoris
        </span>
        <span className="flex flex-col items-center gap-1 text-[0.65rem] font-semibold text-muted-foreground">
          <Users className="size-5" />
          Profil
        </span>
      </nav>
    </section>
  );
}
