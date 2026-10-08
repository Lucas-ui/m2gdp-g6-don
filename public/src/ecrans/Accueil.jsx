import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { Heart, Search } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import CarteAnnonce from "@/components/CarteAnnonce.jsx";
import { EtatVide, ErreurChargement, ListeEnChargement } from "@/components/Etats.jsx";
import { Marque } from "@/components/Logo.jsx";
import { chargerCategories, chercherAnnonces } from "@/lib/api.js";

/** Nombre d'objets de la section « Derniers objets ajoutes ». */
const NOMBRE_DERNIERS = 10;

/**
 * Accueil (US-4, issue #32) : la barre de recherche, les puces de categories,
 * l'accroche, puis les derniers objets ajoutes.
 *
 * La barre de recherche ouvre l'ecran Recherche, elle ne filtre pas l'accueil ;
 * les puces, elles, filtrent la liste sur place. Pas de cloche de
 * notifications : les notifications sont hors perimetre (WON'T).
 */
export default function Accueil() {
  const [categories, setCategories] = useState([]);
  const [categorieId, setCategorieId] = useState("");
  const [annonces, setAnnonces] = useState(null);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    // Sans categories, on garde la puce « Tout » : la liste reste utilisable.
    chargerCategories().then(setCategories).catch(() => {});
  }, []);

  const charger = useCallback(() => {
    setErreur(null);
    setAnnonces(null);
    chercherAnnonces({ tri: "recent", parPage: NOMBRE_DERNIERS, categorieId })
      .then((page) => setAnnonces(page.annonces))
      .catch((e) => setErreur(e.message));
  }, [categorieId]);

  useEffect(charger, [charger]);

  const puces = [{ id: "", libelle: "Tout" }, ...categories];

  return (
    <section>
      <header className="flex items-center gap-3">
        <Link to="/" aria-label="Donéo — accueil">
          <Marque className="size-10" />
        </Link>
        <Link
          to="/recherche"
          className="flex h-12 flex-1 items-center gap-2.5 rounded-2xl border border-primary/10 bg-white px-4 text-[0.95rem] text-muted-foreground shadow-[0_6px_18px_-12px_rgb(155_77_219/35%)]">
          <Search className="size-5 text-ardoise" aria-hidden="true" />
          Chercher une pépite…
        </Link>
      </header>

      {/* Puces de categories, defilement horizontal jusqu'aux bords. */}
      <div
        role="group"
        aria-label="Filtrer par catégorie"
        className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none]">
        {puces.map((c) => {
          const active = c.id === categorieId;
          return (
            <button
              key={c.id || "tout"}
              type="button"
              aria-pressed={active}
              onClick={() => setCategorieId(c.id)}
              className={`h-10 shrink-0 rounded-full px-4 text-sm font-medium whitespace-nowrap transition-colors ${
                active
                  ? "bg-primary text-white shadow-md shadow-primary/30"
                  : "border border-primary/10 bg-white text-ardoise"
              }`}>
              {c.libelle}
            </button>
          );
        })}
      </div>

      {/* Accroche. Elle ne promet pas que « la totalite » de la participation
          va a l'association : la formulation reste a valider par l'UX. */}
      <div className="mt-5 flex items-center gap-4 rounded-[1.75rem] bg-gradient-to-br from-primary to-[#b066e6] p-5 text-white shadow-lg shadow-primary/25">
        <div className="min-w-0 flex-1">
          <p className="font-titre text-[1.45rem] leading-tight font-semibold">1 objet, 1 don.</p>
          <p className="mt-1.5 text-[0.8rem] leading-5 text-white/90 text-pretty">
            Votre participation soutient l’association choisie par l’offrant.
          </p>
        </div>
        <div className="relative grid size-24 shrink-0 place-items-center rounded-[1.6rem] bg-white">
          <img src="/illustrations/expression-heureux.svg" alt="" aria-hidden="true" className="size-14" />
          <img
            src="/illustrations/objet-coeur.svg"
            alt=""
            aria-hidden="true"
            className="absolute -top-3 -right-2 size-9 rotate-12"
          />
        </div>
      </div>

      <div className="mt-7 flex items-baseline justify-between gap-3">
        <h1 className="doneo-titre text-xl">Derniers objets ajoutés</h1>
        <Link to="/recherche" className="text-sm font-semibold text-violet-fonce">
          Tout voir
        </Link>
      </div>

      <div className="mt-3">
        {erreur && <ErreurChargement message={erreur} surReessayer={charger} />}
        {!erreur && !annonces && <ListeEnChargement />}
        {annonces?.length === 0 && (
          <EtatVide
            illustration="/illustrations/objet-cadeau.svg"
            titre={categorieId ? "Rien dans cette catégorie" : "Aucun objet pour le moment"}
            action={
              <Button asChild variant="doneo" size="pilule" className="w-full">
                <Link to="/creer">
                  <Heart className="size-5 fill-current" aria-hidden="true" />
                  Créer une annonce
                </Link>
              </Button>
            }>
            Soyez le premier à donner un objet : il trouvera vite preneur.
          </EtatVide>
        )}
        {annonces?.length > 0 && (
          <ul className="space-y-3">
            {annonces.map((a) => (
              <li key={a.id}>
                <CarteAnnonce annonce={a} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
