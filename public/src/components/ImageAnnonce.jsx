/**
 * Visuel d'une annonce : sa premiere photo, ou a defaut un fond raye lavande,
 * celui des emplacements photo de la maquette.
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

  return (
    <div
      aria-hidden="true"
      className={`bg-[repeating-linear-gradient(135deg,#efe4fa_0_10px,#e3d2f5_10px_20px)] ${className}`}
    />
  );
}
