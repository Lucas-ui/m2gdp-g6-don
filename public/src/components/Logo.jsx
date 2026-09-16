/**
 * Logo Doneo.
 *
 * La charte definit deux formes : le logo vertical (mot seul, sur fond clair)
 * et la miniature (tuile violette au D blanc). On ne recree pas le mot en SVG :
 * il est compose en Fredoka, la substitution d'Asgard retenue pour tout le
 * produit (voir l'en-tete de index.css).
 */

/** Tuile violette au D blanc — favicon, en-tetes, avatar applicatif. */
export function Marque({ className = "size-9" }) {
  return (
    <img
      src="/icone.svg"
      alt=""
      aria-hidden="true"
      className={`${className} rounded-[28%]`}
    />
  );
}

/**
 * @param {"mot"|"complet"} variante  « mot » pour les ecrans d'accueil et de
 *   connexion (mot seul, centre), « complet » pour les en-tetes de navigation.
 */
export default function Logo({ variante = "complet", className = "" }) {
  const mot = (
    <span
      className="font-titre font-semibold tracking-[0.03em] text-primary"
      // Le nom de la marque est du texte : il doit rester selectionnable et
      // lisible par un lecteur d'ecran, d'ou l'absence d'aria-hidden.
    >
      DONÉO
    </span>
  );

  if (variante === "mot") {
    return (
      <p className={`text-[2.6rem] leading-none ${className}`}>
        <span className="sr-only">Donéo</span>
        <span aria-hidden="true">{mot}</span>
      </p>
    );
  }

  return (
    <p className={`flex items-center gap-2 text-xl leading-none ${className}`}>
      <Marque className="size-8" />
      <span className="sr-only">Donéo</span>
      <span aria-hidden="true">{mot}</span>
    </p>
  );
}
