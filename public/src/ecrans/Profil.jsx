import { Link } from "react-router";
import { ChevronRight, Users } from "lucide-react";
import { seDeconnecter } from "@/lib/auth.js";
import { libelleRoles } from "@/lib/membres.js";

const mois = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" });

/**
 * Profil, version J4 : identite, roles et acces a l'annuaire. Les statistiques,
 * annonces et reservations de la maquette arriveront avec leurs US.
 */
export default function Profil({ profil }) {
  const initiales = `${profil.prenom?.[0] || ""}${profil.nom?.[0] || ""}`.toUpperCase();

  return (
    <section>
      <header className="flex items-center gap-4">
        <span
          aria-hidden="true"
          className="grid size-18 shrink-0 place-items-center rounded-full border-4 border-white bg-lavande font-titre text-2xl font-semibold text-violet-fonce shadow-sm">
          {initiales}
        </span>
        <div className="min-w-0">
          <h1 className="doneo-titre truncate text-2xl">
            {profil.prenom} {profil.nom}
          </h1>
          <p className="text-sm text-muted-foreground">
            {libelleRoles(profil.roles)}
            {profil.creeLe && ` · membre depuis ${mois.format(new Date(profil.creeLe))}`}
          </p>
        </div>
      </header>

      <ul className="doneo-carte mt-6 divide-y divide-primary/10 overflow-hidden">
        <li>
          <Link to="/membres" className="flex items-center gap-3 px-4 py-4 font-medium text-ardoise">
            <Users className="size-5 text-primary" aria-hidden="true" />
            <span className="flex-1">Membres de la communauté</span>
            <ChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />
          </Link>
        </li>
        <li>
          {/* Rose, comme sur la maquette : la deconnexion n'est pas une erreur,
              mais elle doit se distinguer des autres entrees. */}
          <button
            type="button"
            onClick={seDeconnecter}
            className="flex w-full items-center gap-3 px-4 py-4 text-left font-medium text-rose">
            <span className="flex-1">Se déconnecter</span>
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </li>
      </ul>
    </section>
  );
}
