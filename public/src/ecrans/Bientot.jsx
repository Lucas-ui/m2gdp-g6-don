import { Link } from "react-router";
import { Button } from "@/components/ui/button.jsx";
import { EtatVide } from "@/components/Etats.jsx";

/**
 * Ecran d'une fonctionnalite pas encore livree. Mieux vaut le dire que de
 * laisser un onglet du menu mener a une page blanche.
 */
export default function Bientot({ titre, illustration, children }) {
  return (
    <section className="lg:mx-auto lg:max-w-xl">
      <h1 className="doneo-titre text-[2rem]">{titre}</h1>
      <div className="mt-5">
        <EtatVide
          illustration={illustration}
          titre="Bientôt disponible"
          action={
            <Button asChild variant="doneoSecondaire" size="pilule" className="w-full">
              <Link to="/">Retour à l’accueil</Link>
            </Button>
          }>
          {children}
        </EtatVide>
      </div>
    </section>
  );
}
