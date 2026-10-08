import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import ImageAnnonce from "@/components/ImageAnnonce.jsx";
import { formaterParticipation } from "@/lib/format.js";

/** Centre de Lyon, vue par defaut quand il n'y a rien a montrer. */
const LYON = [45.7578, 4.832];

/**
 * Epingle en forme de coeur, comme sur l'ecran 06 de la maquette. En SVG dans
 * une divIcon : nette a toutes les densites d'ecran, sans fichier image.
 */
const epingle = (active) =>
  L.divIcon({
    className: "",
    iconSize: [38, 46],
    iconAnchor: [19, 44],
    html: `<svg viewBox="0 0 38 46" width="38" height="46" aria-hidden="true">
      <path d="M19 44C19 44 3 28 3 17a16 16 0 0 1 32 0c0 11-16 27-16 27Z"
        fill="${active ? "#8538C6" : "#9B4DDB"}" stroke="#2F4F5C" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M19 25.5 13.4 20a3.6 3.6 0 0 1 5.1-5.1l.5.5.5-.5a3.6 3.6 0 0 1 5.1 5.1Z" fill="#fff"/>
    </svg>`,
  });

/**
 * Carte des resultats (US-16, issue #44).
 *
 * Les epingles sont posees sur la position APPROCHEE de chaque annonce — la
 * position exacte decalee de 200 a 500 m, seule a sortir de l'API. La carte
 * situe un objet dans son quartier, jamais sur un immeuble.
 */
export default function CarteResultats({ annonces }) {
  const conteneur = useRef(null);
  const carte = useRef(null);
  const calque = useRef(null);
  const [choisie, setChoisie] = useState(null);

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
    return () => {
      carte.current.remove();
      carte.current = null;
    };
  }, []);

  // Epingles, recalculees a chaque nouvelle liste.
  useEffect(() => {
    calque.current.clearLayers();
    setChoisie(null);
    const situees = annonces.filter((a) => Number.isFinite(a.latitudeApprochee) && Number.isFinite(a.longitudeApprochee));
    for (const a of situees) {
      L.marker([a.latitudeApprochee, a.longitudeApprochee], {
        icon: epingle(false),
        title: a.titre,
        alt: a.titre,
        keyboard: true,
      })
        .on("click", () => setChoisie(a))
        .addTo(calque.current);
    }
    if (situees.length) {
      carte.current.fitBounds(
        situees.map((a) => [a.latitudeApprochee, a.longitudeApprochee]),
        { padding: [40, 40], maxZoom: 15 },
      );
    } else {
      carte.current.setView(LYON, 12);
    }
  }, [annonces]);

  return (
    <div className="relative isolate -mx-5 overflow-hidden">
      <div
        ref={conteneur}
        role="region"
        aria-label="Carte des objets"
        className="z-0 h-[calc(100dvh-21rem)] min-h-72 w-full bg-menthe/40"
      />

      {choisie && (
        <div className="absolute inset-x-5 bottom-5 z-500">
          <div className="doneo-carte flex gap-3.5 p-3">
            <ImageAnnonce annonce={choisie} className="size-24 shrink-0 rounded-2xl" />
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 leading-snug font-semibold text-ardoise">{choisie.titre}</p>
              <p className="mt-1 flex items-baseline gap-1.5">
                <span className="font-titre text-lg leading-none font-semibold text-primary">
                  {formaterParticipation(choisie.participation)}
                </span>
                <span className="text-xs text-muted-foreground">participation</span>
              </p>
              {choisie.association && (
                <p className="mt-1 flex items-center gap-1.5 text-xs text-ardoise">
                  <Heart className="size-3.5 shrink-0 fill-primary text-primary" aria-hidden="true" />
                  <span className="truncate">Reversé à {choisie.association.nom}</span>
                </p>
              )}
              <Button asChild variant="doneo" className="mt-2 h-9 rounded-full px-4 text-sm">
                <Link to={`/annonces/${choisie.id}`}>Voir l’annonce</Link>
              </Button>
            </div>
            <button
              type="button"
              onClick={() => setChoisie(null)}
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
