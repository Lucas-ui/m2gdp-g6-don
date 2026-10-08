/**
 * Visuel d'une annonce, par ordre de preference :
 *  1. sa premiere photo ;
 *  2. sinon l'illustration de sa categorie (US-12), fournie par l'API ;
 *  3. en dernier recours, le fond raye lavande des emplacements photo de la
 *     maquette — une categorie sans illustration ne doit pas laisser de trou.
 */
export default function ImageAnnonce({ annonce, className = "" }) {
  const photo = annonce.medias?.find((m) => m.type === "photo");

  if (photo) {
    return (
      <img
        src={photo.miniatureUrl || photo.url}
        alt=""
        loading="lazy"
        className={`object-cover ${className}`}
      />
    );
  }

  if (annonce.illustrationUrl) {
    // Decorative : le titre de l'annonce, juste a cote, dit deja de quoi il
    // s'agit. La lire en plus ferait doublon pour un lecteur d'ecran.
    return (
      <img
        src={annonce.illustrationUrl}
        alt=""
        loading="lazy"
        data-illustration="categorie"
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`bg-[repeating-linear-gradient(135deg,#efe4fa_0_10px,#e3d2f5_10px_20px)] ${className}`}
    />
  );
}
