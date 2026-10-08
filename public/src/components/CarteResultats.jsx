import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ChevronRight, Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import ImageAnnonce from "@/components/ImageAnnonce.jsx";
import { formaterParticipation } from "@/lib/format.js";

/** Centre de Lyon, vue par defaut quand il n'y a rien a montrer. */
const LYON = [45.7578, 4.832];

/**
 * Epingle en forme de coeur, comme sur l'ecran 06 de la maquette. En SVG dans
 * une divIcon : nette a toutes les densites d'ecran, sans fichier image.
 * Au-dela d'un objet, une pastille rose donne leur nombre.
 */
const epingle = (active, nombre = 1) =>
  L.divIcon({
    className: active ? "epingle-choisie" : "",
    iconSize: [38, 46],
    iconAnchor: [19, 44],
    html: `<svg viewBox="0 0 38 46" width="38" height="46" aria-hidden="true">
      <path d="M19 44C19 44 3 28 3 17a16 16 0 0 1 32 0c0 11-16 27-16 27Z"
        fill="${active ? "#8538C6" : "#9B4DDB"}" stroke="#2F4F5C" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M19 25.5 13.4 20a3.6 3.6 0 0 1 5.1-5.1l.5.5.5-.5a3.6 3.6 0 0 1 5.1 5.1Z" fill="#fff"/>
    </svg>${
      nombre > 1
        ? `<span style="position:absolute;top:-6px;right:-8px;min-width:20px;height:20px;padding:0 5px;border-radius:999px;background:#E23C8E;color:#fff;border:2px solid #fff;font:700 11px/16px Inter,sans-serif;text-align:center">${nombre}</span>`
        : ""
    }`,
  });

/**
 * Regroupe les annonces qui partagent la meme position publique. C'est le cas
 * de toutes les annonces d'une meme adresse : la position approchee est
 * derivee de l'adresse, pour qu'on ne puisse pas la trianguler. Sans
 * regroupement, leurs epingles s'empileraient et seule celle du dessus serait
 * accessible.
 */
function regrouper(annonces) {
  const groupes = new Map();
  for (const a of annonces) {
    if (!Number.isFinite(a.latitudeApprochee) || !Number.isFinite(a.longitudeApprochee)) continue;
    const cle = `${a.latitudeApprochee},${a.longitudeApprochee}`;
    if (!groupes.has(cle)) groupes.set(cle, { cle, position: [a.latitudeApprochee, a.longitudeApprochee], annonces: [] });
    groupes.get(cle).annonces.push(a);
  }
  return [...groupes.values()];
}

/** Apercu d'une seule annonce, d'apres l'ecran 06 de la maquette. */
function ApercuAnnonce({ annonce }) {
  return (
    <>
      <ImageAnnonce annonce={annonce} className="size-24 shrink-0 rounded-2xl" />
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 leading-snug font-semibold text-ardoise">{annonce.titre}</p>
        <p className="mt-1 flex items-baseline gap-1.5">
          <span className="font-titre text-lg leading-none font-semibold text-primary">
            {formaterParticipation(annonce.participation)}
          </span>
          <span className="text-xs text-muted-foreground">participation</span>
        </p>
        {annonce.association && (
          <p className="mt-1 flex items-center gap-1.5 text-xs text-ardoise">
            <Heart className="size-3.5 shrink-0 fill-primary text-primary" aria-hidden="true" />
            <span className="truncate">Reversé à {annonce.association.nom}</span>
          </p>
        )}
        <Button asChild variant="doneo" className="mt-2 h-9 rounded-full px-4 text-sm">
          <Link to={`/annonces/${annonce.id}`}>Voir l’annonce</Link>
        </Button>
      </div>
    </>
  );
}

/** Apercu de plusieurs annonces au meme endroit : une liste a parcourir. */
function ApercuGroupe({ annonces }) {
  return (
    <div className="min-w-0 flex-1">
      <p className="font-semibold text-ardoise">{annonces.length} objets à cet endroit</p>
      <ul className="mt-2 max-h-44 divide-y divide-primary/10 overflow-y-auto">
        {annonces.map((a) => (
          <li key={a.id}>
            <Link to={`/annonces/${a.id}`} className="flex items-center gap-3 py-2">
              <ImageAnnonce annonce={a} className="size-11 shrink-0 rounded-xl" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-ardoise">{a.titre}</span>
                <span className="text-xs font-semibold text-primary">{formaterParticipation(a.participation)}</span>
              </span>
              <ChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Carte des resultats (US-16, issue #44).
 *
 * Les epingles sont posees sur la position APPROCHEE de chaque annonce — la
 * position exacte decalee de 200 a 500 m, seule a sortir de l'API. La carte
 * situe un objet dans son quartier, jamais sur un immeuble.
 *
 * `annonces` vaut null pendant un chargement : la carte reste alors telle
 * quelle, sans revenir sur Lyon a chaque frappe.
 */
export default function CarteResultats({ annonces }) {
  const conteneur = useRef(null);
  const carte = useRef(null);
  const calque = useRef(null);
  const marqueurs = useRef(new Map()); // cle de groupe -> marqueur Leaflet
  const [choisi, setChoisi] = useState(null); // groupe dont l'apercu est ouvert

  // Creation de la carte, une seule fois.
  useEffect(() => {
    carte.current = L.map(conteneur.current, { zoomControl: false, attributionControl: true }).setView(LYON, 12);
    L.control.zoom({ position: "topright" }).addTo(carte.current);
    // Tuiles OpenStreetMap : gratuites et sans cle, avec attribution
    // obligatoire. (Les fonds CARTO, plus pales, exigent desormais une cle.)
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(carte.current);
    calque.current = L.layerGroup().addTo(carte.current);
    // Le conteneur change de taille (en-tete qui grandit, rotation) : Leaflet
    // doit recalculer ses tuiles, sinon des bandes grises apparaissent.
    const observateur = new ResizeObserver(() => carte.current?.invalidateSize());
    observateur.observe(conteneur.current);
    return () => {
      observateur.disconnect();
      carte.current.remove();
      carte.current = null;
    };
  }, []);

  // Epingles, recalculees a chaque nouvelle liste.
  useEffect(() => {
    if (annonces === null) return;
    calque.current.clearLayers();
    marqueurs.current.clear();
    setChoisi(null);

    const groupes = regrouper(annonces);
    for (const groupe of groupes) {
      const n = groupe.annonces.length;
      const libelle = n > 1 ? `${n} objets à cet endroit` : groupe.annonces[0].titre;
      const marqueur = L.marker(groupe.position, { icon: epingle(false, n), title: libelle, alt: libelle, keyboard: true })
        .on("click", () => setChoisi(groupe))
        .addTo(calque.current);
      marqueurs.current.set(groupe.cle, marqueur);
    }

    if (groupes.length) {
      carte.current.fitBounds(
        groupes.map((g) => g.position),
        { padding: [40, 40], maxZoom: 15 },
      );
    } else {
      carte.current.setView(LYON, 12);
    }
  }, [annonces]);

  // L'epingle de l'apercu ouvert passe en violet fonce et au premier plan :
  // on voit a quel endroit l'apercu correspond.
  useEffect(() => {
    if (!choisi) return undefined;
    const marqueur = marqueurs.current.get(choisi.cle);
    const n = choisi.annonces.length;
    marqueur?.setIcon(epingle(true, n)).setZIndexOffset(1000);
    return () => marqueur?.setIcon(epingle(false, n)).setZIndexOffset(0);
  }, [choisi]);

  return (
    <div className="carte-doneo relative isolate h-full overflow-hidden">
      <div
        ref={conteneur}
        role="region"
        aria-label="Carte des objets"
        className="z-0 h-full w-full bg-menthe/40"
      />

      {/* Apercu au-dessus des coins arrondis du menu, qui recouvrent le bas de la carte. */}
      {choisi && (
        <div className="absolute inset-x-4 bottom-11 z-500">
          <div className="doneo-carte flex gap-3.5 p-3">
            {choisi.annonces.length === 1 ? (
              <ApercuAnnonce annonce={choisi.annonces[0]} />
            ) : (
              <ApercuGroupe annonces={choisi.annonces} />
            )}
            <button
              type="button"
              onClick={() => setChoisi(null)}
              aria-label="Fermer l’aperçu"
              className="grid size-8 shrink-0 place-items-center rounded-full bg-lavande text-violet-fonce">
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
