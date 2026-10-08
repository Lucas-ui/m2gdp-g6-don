import { useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";

/**
 * En-tete d'un ecran secondaire : bouton retour carre, titre et sous-titre,
 * comme la messagerie et les preferences de la maquette. Le retour suit
 * l'historique, pour retrouver l'ecran precedent tel qu'on l'avait laisse.
 */
export default function EnTeteRetour({ titre, sousTitre, apres = "/" }) {
  const naviguer = useNavigate();
  const revenir = () => (window.history.length > 1 ? naviguer(-1) : naviguer(apres));

  return (
    <header className="flex items-center gap-3">
      <button
        type="button"
        onClick={revenir}
        aria-label="Retour"
        className="grid size-11 shrink-0 place-items-center rounded-2xl border border-primary/10 bg-white text-ardoise shadow-sm">
        <ChevronLeft className="size-5" aria-hidden="true" />
      </button>
      <div className="min-w-0">
        <h1 className="doneo-titre truncate text-2xl leading-tight">{titre}</h1>
        {sousTitre && <p className="truncate text-sm text-muted-foreground">{sousTitre}</p>}
      </div>
    </header>
  );
}
