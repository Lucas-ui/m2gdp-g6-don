import { useEffect, useState } from 'react';

/**
 * Seuil du grand ecran : 1024 px, le point `lg` de Tailwind. En dessous,
 * l'app garde l'affichage mobile des maquettes.
 */
const REQUETE = '(min-width: 1024px)';

/**
 * Vrai sur grand ecran. A reserver aux cas ou CSS ne suffit pas — monter une
 * seule carte Leaflet au lieu de deux, par exemple. Pour le reste, les
 * classes `lg:` de Tailwind font le travail sans JavaScript.
 */
export function useGrandEcran() {
  const [grand, setGrand] = useState(() => window.matchMedia(REQUETE).matches);

  useEffect(() => {
    const media = window.matchMedia(REQUETE);
    const suivre = () => setGrand(media.matches);
    media.addEventListener('change', suivre);
    return () => media.removeEventListener('change', suivre);
  }, []);

  return grand;
}
