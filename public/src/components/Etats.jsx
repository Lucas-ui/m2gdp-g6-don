import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";

/** Squelettes de cartes pendant le chargement d'une liste. */
export function ListeEnChargement({ nombre = 3 }) {
  return (
    <ul className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 lg:block lg:space-y-3" aria-label="Chargement en cours" aria-busy="true">
      {Array.from({ length: nombre }, (_, i) => (
        <li key={i} className="doneo-carte flex animate-pulse gap-3.5 p-3">
          <div className="size-28 shrink-0 rounded-2xl bg-lavande" />
          <div className="flex-1 space-y-2.5 py-1">
            <div className="h-4 w-4/5 rounded-full bg-lavande" />
            <div className="h-3 w-2/5 rounded-full bg-muted" />
            <div className="h-5 w-1/4 rounded-full bg-lavande" />
            <div className="h-3 w-3/5 rounded-full bg-muted" />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Erreur de chargement, avec de quoi reessayer. */
export function ErreurChargement({ message, surReessayer }) {
  return (
    <div role="alert" className="doneo-carte flex flex-col items-center p-6 text-center">
      <img src="/illustrations/objet-carton.svg" alt="" aria-hidden="true" className="size-16" />
      <p className="mt-3 font-semibold text-ardoise">Le chargement a échoué</p>
      <p className="mt-1 text-sm text-muted-foreground text-pretty">
        {message || "Le service ne répond pas pour le moment."}
      </p>
      <Button variant="doneoSecondaire" className="mt-4 h-11 rounded-2xl px-5" onClick={surReessayer}>
        <RotateCw className="size-4" aria-hidden="true" />
        Réessayer
      </Button>
    </div>
  );
}

/** Liste vide : une illustration, un message et, si utile, une action. */
export function EtatVide({ illustration = "/illustrations/objet-etoile.svg", titre, children, action }) {
  return (
    <div className="doneo-carte flex flex-col items-center p-6 text-center">
      <div className="doneo-pastille size-20">
        <img src={illustration} alt="" aria-hidden="true" className="size-12" />
      </div>
      <p className="mt-3 font-titre text-lg font-semibold text-ardoise">{titre}</p>
      {children && <p className="mt-1 text-sm text-muted-foreground text-pretty">{children}</p>}
      {action && <div className="mt-4 w-full">{action}</div>}
    </div>
  );
}
