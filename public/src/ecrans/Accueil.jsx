import { useEffect, useState } from 'react';
import { LogOut, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { listerUtilisateurs } from '@/lib/api.js';
import { seDeconnecter } from '@/lib/auth.js';

const LIBELLE_ROLE = {
  donateur: 'Donateur',
  beneficiaire: 'Bénéficiaire',
};

/** « Donateur », « Bénéficiaire », ou « Donateur et bénéficiaire ». */
function libelleRoles(roles = []) {
  const noms = roles.map((r) => LIBELLE_ROLE[r] || r);
  if (noms.length === 0) return 'Rôle non précisé';
  if (noms.length === 1) return noms[0];
  return `${noms[0]} et ${noms.slice(1).join(', ').toLowerCase()}`;
}

/**
 * « 69002 Lyon ». Renvoie une chaine vide si le profil ne porte ni l'un ni
 * l'autre : les comptes crees avant l'ajout de la ville n'en ont pas, et mieux
 * vaut masquer la ligne que d'afficher un lieu a moitie vide.
 */
function libelleLieu({ codePostal, ville }) {
  return [codePostal, ville].filter(Boolean).join(' ');
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
    listerUtilisateurs().then(setUtilisateurs).catch((e) => setErreur(e.message));
  }, []);

  // CA3 : connecte, on figure forcement dans l'annuaire — la liste n'est donc
  // jamais vide. Le cas limite reel est « je suis le seul inscrit », et il
  // merite d'etre dit plutot que de laisser une carte isolee sans explication.
  const seulInscrit =
    utilisateurs?.length === 1 && utilisateurs[0].id === profil.id;

  return (
    <section className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Bonjour {profil.prenom}
          </h1>
          <p className="text-sm text-muted-foreground">
            {libelleRoles(profil.roles)} · {profil.adressePostale}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={seDeconnecter}>
          <LogOut className="size-4" aria-hidden="true" />
          Quitter
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="size-4" aria-hidden="true" />
            Inscrits
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
            <p className="text-sm text-muted-foreground">Aucun inscrit pour le moment.</p>
          )}
          {utilisateurs && utilisateurs.length > 0 && (
            <ul className="divide-y">
              {utilisateurs.map((u) => (
                <li key={u.id} className="flex items-center gap-3 py-3">
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium"
                    aria-hidden="true"
                  >
                    {(u.prenom?.[0] || '?').toUpperCase()}
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
                        <MapPin className="size-3 shrink-0" aria-hidden="true" />
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

      <p className="text-sm text-muted-foreground">
        POC J2 — inscription et connexion. Les écrans de dons et de demandes
        arrivent avec les maquettes.
      </p>
    </section>
  );
}
