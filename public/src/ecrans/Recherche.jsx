import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { ChevronDown, ListFilter, Loader2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import CarteAnnonce from "@/components/CarteAnnonce.jsx";
import { EtatVide, ErreurChargement, ListeEnChargement } from "@/components/Etats.jsx";
import FeuilleFiltres, { FILTRES_VIDES } from "@/components/FeuilleFiltres.jsx";
import { chargerCategories, chercherAnnonces } from "@/lib/api.js";
import { LIBELLES_ETAT, formaterParticipation } from "@/lib/format.js";

// La carte et Leaflet (~150 ko) ne se chargent qu'a la premiere ouverture.
const CarteResultats = lazy(() => import("@/components/CarteResultats.jsx"));

const PAR_PAGE = 20;
/** Sur la carte, une seule page, la plus grande que l'API accepte. */
const PAR_PAGE_CARTE = 50;
/** Pause de frappe avant de lancer la recherche. */
const DELAI_SAISIE = 300;
const CLES_FILTRES = Object.keys(FILTRES_VIDES);

/** Tris proposes (US-15, issue #43). */
const TRIS = [
  { valeur: "recent", libelle: "Plus récents" },
  { valeur: "participation", libelle: "Participation la plus basse" },
  { valeur: "creneau", libelle: "Créneau le plus proche" },
];

/** « 1 pépite », « 12 pépites ». */
const pepites = (n) => `${n} ${n > 1 ? "pépites" : "pépite"}`;

/**
 * Recherche en liste (US-13 et US-14, issues #41 et #42), d'apres les ecrans
 * 05 et 07 de la maquette.
 *
 * Mot-cle et filtres vivent dans l'URL : en revenant d'une fiche, on retrouve
 * exactement la meme recherche, et on peut la partager.
 */
export default function Recherche() {
  const [parametres, setParametres] = useSearchParams();
  const q = parametres.get("q") || "";
  const surCarte = parametres.get("vue") === "carte";
  const tri = TRIS.some((t) => t.valeur === parametres.get("tri")) ? parametres.get("tri") : "recent";
  const cleFiltres = CLES_FILTRES.map((c) => parametres.get(c) || "").join("|");
  const filtres = useMemo(
    () => Object.fromEntries(CLES_FILTRES.map((c, i) => [c, cleFiltres.split("|")[i]])),
    [cleFiltres],
  );

  const [saisie, setSaisie] = useState(q);
  // Les resultats gardent les criteres qui les ont produits : le compteur ne
  // doit jamais associer un nouveau mot a l'ancien total.
  const [resultat, setResultat] = useState(null); // { q, annonces, total }
  const [tentative, setTentative] = useState(0);
  const [page, setPage] = useState(1);
  const [suiteEnCours, setSuiteEnCours] = useState(false);
  const [erreur, setErreur] = useState(null);
  // Echec de « Voir plus » : distinct de l'erreur de chargement, pour ne pas
  // effacer les resultats deja affiches.
  const [erreurSuite, setErreurSuite] = useState(null);
  const [categories, setCategories] = useState([]);
  const [feuilleOuverte, setFeuilleOuverte] = useState(false);
  const champ = useRef(null);

  useEffect(() => {
    chargerCategories().then(setCategories).catch(() => {});
  }, []);

  /** Remplace des criteres dans l'URL ; une valeur vide retire le critere. */
  const modifierCriteres = useCallback(
    (changements) =>
      setParametres(
        (actuels) => {
          const suivants = new URLSearchParams(actuels);
          for (const [cle, valeur] of Object.entries(changements)) {
            if (valeur === "" || valeur === null || valeur === undefined) suivants.delete(cle);
            else suivants.set(cle, String(valeur));
          }
          return suivants;
        },
        { replace: true },
      ),
    [setParametres],
  );

  // Dernier mot-cle que la saisie a ecrit dans l'URL. Il permet de distinguer
  // nos propres mises a jour d'un changement venu d'ailleurs.
  const qEcrit = useRef(q);

  // La saisie part dans l'URL apres une courte pause, sans recharger la page.
  useEffect(() => {
    if (saisie.trim() === q) return undefined;
    const minuteur = setTimeout(() => {
      qEcrit.current = saisie.trim();
      modifierCriteres({ q: saisie.trim() });
    }, DELAI_SAISIE);
    return () => clearTimeout(minuteur);
  }, [saisie, q, modifierCriteres]);

  // Le mot-cle a change sans passer par la saisie — onglet « Recherche » du
  // menu, retour arriere : le champ suit l'URL. Sans cela, la saisie restee a
  // l'ancien mot le reecrirait dans l'URL a la pause suivante.
  useEffect(() => {
    if (q !== qEcrit.current) {
      qEcrit.current = q;
      setSaisie(q);
    }
  }, [q]);

  const criteres = useMemo(
    () => ({ q, ...filtres, tri, parPage: surCarte ? PAR_PAGE_CARTE : PAR_PAGE }),
    [q, filtres, tri, surCarte],
  );
  // Criteres en vigueur, lus par « Voir plus » une fois sa reponse arrivee.
  const criteresCourants = useRef(criteres);
  criteresCourants.current = criteres;

  useEffect(() => {
    // Une frappe rapide lance plusieurs recherches : seule la derniere compte,
    // meme si une reponse plus ancienne arrive apres elle.
    let derniere = true;
    setErreur(null);
    setErreurSuite(null);
    setResultat(null);
    setPage(1);
    chercherAnnonces({ ...criteres, page: 1 })
      .then((r) => derniere && setResultat({ q: criteres.q, annonces: r.annonces, total: r.total }))
      .catch((e) => derniere && setErreur(e.message));
    return () => {
      derniere = false;
    };
  }, [criteres, tentative]);

  const reessayer = useCallback(() => setTentative((n) => n + 1), []);
  const fermerFeuille = useCallback(() => setFeuilleOuverte(false), []);
  const annonces = resultat?.annonces ?? null;
  const total = resultat?.total ?? 0;

  async function voirPlus() {
    const demandes = criteres;
    const suivante = page + 1;
    setSuiteEnCours(true);
    setErreurSuite(null);
    try {
      const suite = await chercherAnnonces({ ...demandes, page: suivante });
      // Les criteres ont change pendant l'attente (tri, filtre, mot-cle) :
      // cette page appartient a l'ancienne recherche, on l'ignore.
      if (criteresCourants.current !== demandes) return;
      setResultat((r) => (r ? { ...r, annonces: [...r.annonces, ...suite.annonces] } : r));
      setPage(suivante);
    } catch (e) {
      if (criteresCourants.current === demandes) setErreurSuite(e.message);
    } finally {
      setSuiteEnCours(false);
    }
  }

  function effacer() {
    setSaisie("");
    champ.current?.focus();
  }

  // Puces des filtres actifs, chacune avec sa croix.
  const categorie = categories.find((c) => c.id === filtres.categorieId);
  const sousCategorie = categorie?.sousCategories.find((s) => s.id === filtres.sousCategorieId);
  const actifs = [
    filtres.categorieId && { cle: "categorieId", libelle: categorie?.libelle || "Catégorie", retirer: { categorieId: "", sousCategorieId: "" } },
    filtres.sousCategorieId && { cle: "sousCategorieId", libelle: sousCategorie?.libelle || "Sous-catégorie", retirer: { sousCategorieId: "" } },
    filtres.etat && { cle: "etat", libelle: LIBELLES_ETAT[filtres.etat] || filtres.etat, retirer: { etat: "" } },
    filtres.participationMax && {
      cle: "participationMax",
      libelle: `≤ ${formaterParticipation(Number(filtres.participationMax))}`,
      retirer: { participationMax: "" },
    },
  ].filter(Boolean);

  return (
    <section>
      <h1 className="sr-only">Recherche</h1>

      <div className="flex gap-3">
        <div role="search" className="relative flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-ardoise"
            aria-hidden="true"
          />
          <input
            ref={champ}
            type="search"
            inputMode="search"
            enterKeyHint="search"
            aria-label="Rechercher un objet"
            placeholder="Chercher une pépite…"
            value={saisie}
            onChange={(e) => setSaisie(e.target.value)}
            maxLength={100}
            className="h-13 w-full rounded-2xl border border-primary/10 bg-white pr-12 pl-12 text-base text-ardoise shadow-[0_6px_18px_-12px_rgb(155_77_219/35%)] outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/15 [&::-webkit-search-cancel-button]:hidden"
          />
          {saisie && (
            <button
              type="button"
              onClick={effacer}
              aria-label="Effacer la recherche"
              className="absolute top-1/2 right-3 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-lavande text-violet-fonce">
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setFeuilleOuverte(true)}
          aria-label={actifs.length ? `Filtres, ${actifs.length} actifs` : "Filtres"}
          className="relative grid size-13 shrink-0 place-items-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/30">
          <ListFilter className="size-5.5" aria-hidden="true" />
          {actifs.length > 0 && (
            <span
              aria-hidden="true"
              className="absolute -top-1.5 -right-1.5 grid size-5.5 place-items-center rounded-full border-2 border-lilas bg-rose text-[0.6875rem] font-bold">
              {actifs.length}
            </span>
          )}
        </button>
      </div>

      {actifs.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Filtres actifs">
          {actifs.map((f) => (
            <li key={f.cle}>
              <button
                type="button"
                onClick={() => modifierCriteres(f.retirer)}
                aria-label={`Retirer le filtre ${f.libelle}`}
                className="flex h-9 items-center gap-1.5 rounded-full border-[1.5px] border-primary/40 bg-white pr-2.5 pl-3.5 text-sm font-medium text-violet-fonce">
                {f.libelle}
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Bascule Carte / Liste, d'apres les ecrans 05 et 06 de la maquette. */}
      <div role="group" aria-label="Affichage" className="mt-3 grid grid-cols-2 gap-1 rounded-2xl bg-lavande p-1">
        {[
          { carte: true, libelle: "Carte" },
          { carte: false, libelle: "Liste" },
        ].map((v) => (
          <button
            key={v.libelle}
            type="button"
            aria-pressed={surCarte === v.carte}
            onClick={() => modifierCriteres({ vue: v.carte ? "carte" : "" })}
            className={`h-10 rounded-xl text-sm font-semibold transition-colors ${
              surCarte === v.carte ? "bg-white text-ardoise shadow-sm" : "text-violet-fonce"
            }`}>
            {v.libelle}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <div className="mb-3 flex min-h-9 flex-wrap items-center justify-between gap-x-3 gap-y-2">
          {annonces && !erreur ? (
            <p className="flex items-center gap-2 font-semibold text-ardoise" aria-live="polite">
              <img src="/illustrations/objet-etoile.svg" alt="" aria-hidden="true" className="size-7" />
              {resultat.q ? `${pepites(total)} pour « ${resultat.q} »` : `${pepites(total)} à donner`}
            </p>
          ) : (
            <span />
          )}
          {/* Pas de tri sur la carte : l'ordre n'y a pas de sens. */}
          {!surCarte && (
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              Trier
              <span className="relative">
                <select
                  value={tri}
                  onChange={(e) => modifierCriteres({ tri: e.target.value === "recent" ? "" : e.target.value })}
                  className="h-9 appearance-none rounded-full border border-primary/15 bg-white pr-8 pl-3.5 text-sm font-medium text-violet-fonce outline-none focus-visible:ring-4 focus-visible:ring-primary/15">
                  {TRIS.map((t) => (
                    <option key={t.valeur} value={t.valeur}>
                      {t.libelle}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-violet-fonce"
                  aria-hidden="true"
                />
              </span>
            </label>
          )}
        </div>

        {erreur && <ErreurChargement message={erreur} surReessayer={reessayer} />}
        {!erreur && !annonces && !surCarte && <ListeEnChargement />}

        {surCarte && !erreur && (
          <>
            {annonces && total > annonces.length && (
              <p className="mb-2 text-sm text-muted-foreground">
                La carte montre {annonces.length} pépites sur {total} : précisez la recherche pour voir les autres.
              </p>
            )}
            <Suspense fallback={<div className="-mx-5 h-[calc(100dvh-21rem)] min-h-72 animate-pulse bg-menthe/40" />}>
              <CarteResultats annonces={annonces} />
            </Suspense>
          </>
        )}

        {!surCarte && annonces?.length === 0 &&
          (actifs.length > 0 ? (
            <EtatVide
              illustration="/illustrations/objet-carton.svg"
              titre="Aucun objet avec ces filtres"
              action={
                <Button variant="doneoSecondaire" size="pilule" className="w-full" onClick={() => modifierCriteres(FILTRES_VIDES)}>
                  Réinitialiser les filtres
                </Button>
              }>
              Élargissez vos critères pour voir plus d’objets.
            </EtatVide>
          ) : (
            <EtatVide
              illustration="/illustrations/objet-carton.svg"
              titre="Aucun objet ne correspond à votre recherche"
              action={
                <Button variant="doneoSecondaire" size="pilule" className="w-full" onClick={effacer}>
                  <X className="size-5" aria-hidden="true" />
                  Effacer la recherche
                </Button>
              }>
              Essayez un autre mot, plus court ou plus général.
            </EtatVide>
          ))}

        {!surCarte && annonces?.length > 0 && (
          <>
            <ul className="space-y-3">
              {annonces.map((a) => (
                <li key={a.id}>
                  <CarteAnnonce annonce={a} variante="recherche" />
                </li>
              ))}
            </ul>
            {erreurSuite && (
              <p role="alert" className="mt-4 text-center text-sm text-destructive">
                La suite n’a pas pu être chargée. Vos résultats sont conservés : réessayez.
              </p>
            )}
            {annonces.length < total && (
              <Button
                variant="doneoSecondaire"
                size="pilule"
                className="mt-4 w-full"
                onClick={voirPlus}
                disabled={suiteEnCours}>
                {suiteEnCours && <Loader2 className="size-5 animate-spin" aria-hidden="true" />}
                {erreurSuite ? "Réessayer" : "Voir plus"}
              </Button>
            )}
          </>
        )}
      </div>

      <FeuilleFiltres
        ouverte={feuilleOuverte}
        categories={categories}
        filtres={filtres}
        surFermer={fermerFeuille}
        surAppliquer={(nouveaux) => {
          modifierCriteres(nouveaux);
          setFeuilleOuverte(false);
        }}
      />
    </section>
  );
}
