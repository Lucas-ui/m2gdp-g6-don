import { useEffect, useState } from "react";

/**
 * En-tete qui reste en haut de l'ecran quand la page defile : la recherche et
 * les filtres restent a portee de pouce. Il deborde sur les marges de la
 * coque pour couvrir toute la largeur, et une ombre legere apparait des
 * qu'il passe au-dessus du contenu.
 */
export default function EnTeteCollant({ children, className = "" }) {
  const [decolle, setDecolle] = useState(false);

  useEffect(() => {
    const suivre = () => setDecolle(window.scrollY > 4);
    suivre();
    window.addEventListener("scroll", suivre, { passive: true });
    return () => window.removeEventListener("scroll", suivre);
  }, []);

  return (
    <div
      className={`sticky top-0 z-20 -mx-5 -mt-5 bg-lilas/92 px-5 pt-5 pb-3 backdrop-blur-md transition-shadow ${
        decolle ? "shadow-[0_10px_24px_-18px_rgb(47_79_92/45%)]" : ""
      } ${className}`}>
      {children}
    </div>
  );
}
