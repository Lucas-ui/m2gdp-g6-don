import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { ListFilter, Loader2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import CarteAnnonce from "@/components/CarteAnnonce.jsx";
import { EtatVide, ErreurChargement, ListeEnChargement } from "@/components/Etats.jsx";
import FeuilleFiltres, { FILTRES_VIDES } from "@/components/FeuilleFiltres.jsx";
import { chargerCategories, chercherAnnonces } from "@/lib/api.js";
import { LIBELLES_ETAT, formaterParticipation } from "@/lib/format.js";

const PAR_PAGE = 20;
/** Pause de frappe avant de lancer la recherche. */
const DELAI_SAISIE = 300;
const CLES_FILTRES = Object.keys(FILTRES_VIDES);

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

  // La saisie part dans l'URL apres une courte pause, sans recharger la page.
  useEffect(() => {
    if (saisie.trim() === q) return undefined;
    const minuteur = setTimeout(() => modifierCriteres({ q: saisie.trim() }), DELAI_SAISIE);
    return () => clearTimeout(minuteur);
  }, [saisie, q, modifierCriteres]);

  const criteres = useMemo(() => ({ q, ...filtres, tri: "recent", parPage: PAR_PAGE }), [q, filtres]);

  useEffect(() => {
    // Une frappe rapide lance plusieurs recherches : seule la derniere compte,
    // meme si une reponse plus ancienne arrive apres elle.
    let derniere = true;
    setErreur(null);
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
    setSuiteEnCours(true);
    try {
      const suivante = page + 1;
      const suite = await chercherAnnonces({ ...criteres, page: suivante });
      setResultat((r) => ({ ...r, annonces: [...r.annonces, ...suite.annonces] }));
      setPage(suivante);
    } catch (e) {
      setErreur(e.message);
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

      <div className="mt-5">
        {erreur && <ErreurChargement message={erreur} surReessayer={reessayer} />}
        {!erreur && !annonces && <ListeEnChargement />}

        {annonces && !erreur && (
          <p className="mb-3 flex items-center gap-2 font-semibold text-ardoise" aria-live="polite">
            <img src="/illustrations/objet-etoile.svg" alt="" aria-hidden="true" className="size-7" />
            {resultat.q ? `${pepites(total)} pour « ${resultat.q} »` : `${pepites(total)} à donner`}
          </p>
        )}

        {annonces?.length === 0 &&
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

        {annonces?.length > 0 && (
          <>
            <ul className="space-y-3">
              {annonces.map((a) => (
                <li key={a.id}>
                  <CarteAnnonce annonce={a} variante="recherche" />
                </li>
              ))}
            </ul>
            {annonces.length < total && (
              <Button
                variant="doneoSecondaire"
                size="pilule"
                className="mt-4 w-full"
                onClick={voirPlus}
                disabled={suiteEnCours}>
                {suiteEnCours && <Loader2 className="size-5 animate-spin" aria-hidden="true" />}
                Voir plus
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
