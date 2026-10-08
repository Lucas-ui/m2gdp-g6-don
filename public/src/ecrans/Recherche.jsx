import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { Loader2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import CarteAnnonce from "@/components/CarteAnnonce.jsx";
import { EtatVide, ErreurChargement, ListeEnChargement } from "@/components/Etats.jsx";
import { chercherAnnonces } from "@/lib/api.js";

const PAR_PAGE = 20;
/** Pause de frappe avant de lancer la recherche. */
const DELAI_SAISIE = 300;

/** « 1 pépite », « 12 pépites ». */
const pepites = (n) => `${n} ${n > 1 ? "pépites" : "pépite"}`;

/**
 * Recherche en liste (US-13, issue #41), d'apres l'ecran 05 de la maquette.
 *
 * Les criteres vivent dans l'URL (?q=...) : en revenant d'une fiche, on
 * retrouve exactement la meme recherche, et on peut la partager.
 */
export default function Recherche() {
  const [parametres, setParametres] = useSearchParams();
  const q = parametres.get("q") || "";

  const [saisie, setSaisie] = useState(q);
  // Les resultats gardent la recherche qui les a produits : le compteur ne
  // doit jamais associer le nouveau mot a l'ancien total.
  const [resultat, setResultat] = useState(null); // { q, annonces, total }
  const [tentative, setTentative] = useState(0);
  const [page, setPage] = useState(1);
  const [suiteEnCours, setSuiteEnCours] = useState(false);
  const [erreur, setErreur] = useState(null);
  const champ = useRef(null);

  // La saisie part dans l'URL apres une courte pause, sans recharger la page.
  useEffect(() => {
    if (saisie.trim() === q) return undefined;
    const minuteur = setTimeout(() => {
      setParametres(
        (actuels) => {
          const suivants = new URLSearchParams(actuels);
          if (saisie.trim()) suivants.set("q", saisie.trim());
          else suivants.delete("q");
          return suivants;
        },
        { replace: true },
      );
    }, DELAI_SAISIE);
    return () => clearTimeout(minuteur);
  }, [saisie, q, setParametres]);

  useEffect(() => {
    // Une frappe rapide lance plusieurs recherches : seule la derniere compte,
    // meme si une reponse plus ancienne arrive apres elle.
    let derniere = true;
    setErreur(null);
    setResultat(null);
    setPage(1);
    chercherAnnonces({ q, tri: "recent", page: 1, parPage: PAR_PAGE })
      .then((r) => derniere && setResultat({ q, annonces: r.annonces, total: r.total }))
      .catch((e) => derniere && setErreur(e.message));
    return () => {
      derniere = false;
    };
  }, [q, tentative]);

  const reessayer = useCallback(() => setTentative((n) => n + 1), []);
  const annonces = resultat?.annonces ?? null;
  const total = resultat?.total ?? 0;

  async function voirPlus() {
    setSuiteEnCours(true);
    try {
      const suivante = page + 1;
      const suite = await chercherAnnonces({ q, tri: "recent", page: suivante, parPage: PAR_PAGE });
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

  return (
    <section>
      <h1 className="sr-only">Recherche</h1>

      <div role="search" className="relative">
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

      <div className="mt-5">
        {erreur && <ErreurChargement message={erreur} surReessayer={reessayer} />}
        {!erreur && !annonces && <ListeEnChargement />}

        {annonces && !erreur && (
          <p className="mb-3 flex items-center gap-2 font-semibold text-ardoise" aria-live="polite">
            <img src="/illustrations/objet-etoile.svg" alt="" aria-hidden="true" className="size-7" />
            {resultat.q ? `${pepites(total)} pour « ${resultat.q} »` : `${pepites(total)} à donner`}
          </p>
        )}

        {annonces?.length === 0 && (
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
        )}

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
    </section>
  );
}
