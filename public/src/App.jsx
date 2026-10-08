import { useEffect, useRef, useState } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import Champ from "@/components/Champ.jsx";
import Logo from "@/components/Logo.jsx";
import MenuBas from "@/components/MenuBas.jsx";
import Connexion from "@/ecrans/Connexion.jsx";
import Inscription from "@/ecrans/Inscription.jsx";
import Accueil from "@/ecrans/Accueil.jsx";
import Annuaire from "@/ecrans/Annuaire.jsx";
import Bientot from "@/ecrans/Bientot.jsx";
import FicheAnnonce from "@/ecrans/FicheAnnonce.jsx";
import LienInvalide from "@/ecrans/LienInvalide.jsx";
import Profil from "@/ecrans/Profil.jsx";
import Recherche from "@/ecrans/Recherche.jsx";
import { chargerProfil } from "@/lib/api.js";
import {
  estRetourDeLien,
  finaliserConnexion,
  surChangementAuth,
} from "@/lib/auth.js";

/**
 * Coque des ecrans connectes : colonne mobile centree, menu du bas fixe.
 * La marge basse laisse le dernier element visible au-dessus du menu.
 */
function CoqueConnectee() {
  return (
    <div className="doneo-coque">
      <main className="mx-auto min-h-dvh max-w-md px-5 pt-5 pb-[calc(var(--hauteur-menu)+2rem)]">
        <Outlet />
      </main>
      <MenuBas />
    </div>
  );
}

/**
 * Coque des ecrans plein cadre (fiche d'annonce) : pas de marge, pas de menu
 * du bas — l'ecran porte sa propre barre d'action, comme sur la maquette.
 */
function CoquePleinCadre() {
  return (
    <div className="doneo-coque">
      <main className="mx-auto min-h-dvh max-w-md">
        <Outlet />
      </main>
    </div>
  );
}

function Chargement({ children }) {
  return (
    <p className="flex items-center gap-2.5 pt-10 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      {children}
    </p>
  );
}

/**
 * Aiguillage du POC J2.
 *
 *   pas connecte              -> Connexion (saisie de l'email)
 *   retour de lien magique    -> finalisation, en redemandant l'adresse si
 *                                le lien est ouvert sur un autre appareil
 *   connecte sans profil      -> Inscription
 *   connecte avec profil      -> ecrans de l'app, sous le routeur
 *
 * Tant que la personne n'est pas connectee avec un profil complet, l'URL ne
 * compte pas : un visiteur qui ouvre /recherche voit l'ecran de connexion.
 */
export default function App() {
  const [utilisateur, setUtilisateur] = useState(undefined); // undefined = inconnu
  const [profil, setProfil] = useState(undefined);
  const [emailRedemande, setEmailRedemande] = useState(false);
  const [saisieEmail, setSaisieEmail] = useState("");
  const [lienInvalide, setLienInvalide] = useState(null); // { expire: bool }
  const [erreur, setErreur] = useState(null);

  // Le code du lien ne sert qu'une fois. En developpement, StrictMode monte le
  // composant deux fois : sans ce garde-fou, les deux effets consomment le meme
  // code, l'un reussit, l'autre recoit `invalid-action-code` — et l'ecran
  // « lien invalide » s'affiche alors que la connexion a abouti.
  const lienTraite = useRef(false);

  // 1. Retour de lien magique : a traiter avant tout le reste.
  useEffect(() => {
    if (lienTraite.current || !estRetourDeLien()) return;
    lienTraite.current = true;
    finaliserConnexion().catch((e) => {
      if (e.message === "EMAIL_MANQUANT") setEmailRedemande(true);
      else if (e.message === "LIEN_INVALIDE")
        setLienInvalide({ expire: e.expire });
      else setErreur(e.message);
    });
  }, []);

  // 2. Etat de connexion.
  useEffect(() => surChangementAuth((u) => setUtilisateur(u)), []);

  // 3. Profil, des qu'on sait qui est connecte.
  useEffect(() => {
    if (utilisateur === undefined) return;
    if (utilisateur === null) {
      setProfil(undefined);
      return;
    }
    chargerProfil()
      .then(setProfil)
      .catch((e) => setErreur(e.message));
  }, [utilisateur]);

  async function confirmerEmail(evenement) {
    evenement.preventDefault();
    setErreur(null);
    try {
      await finaliserConnexion(saisieEmail.trim().toLowerCase());
      setEmailRedemande(false);
    } catch (e) {
      if (e.message === "LIEN_INVALIDE") {
        setEmailRedemande(false);
        setLienInvalide({ expire: e.expire });
      } else {
        setErreur("Ce lien ne correspond pas à cette adresse.");
      }
    }
  }

  // La connexion et l'accueil portent deja le logo dans leur propre mise en
  // page : leur ajouter l'en-tete de la coque le ferait apparaitre deux fois.
  let avecEnTete = true;
  let ecran;

  if (lienInvalide) {
    ecran = <LienInvalide expire={lienInvalide.expire} />;
  } else if (emailRedemande) {
    // Lien ouvert sur un autre appareil que celui de la demande.
    ecran = (
      <form onSubmit={confirmerEmail} className="space-y-4">
        <h1 className="doneo-titre text-[2rem] leading-tight">
          Confirmez votre e-mail
        </h1>
        <p className="text-sm leading-6 text-muted-foreground text-pretty">
          Ce lien a été demandé depuis un autre appareil. Saisissez l’adresse
          utilisée pour terminer la connexion.
        </p>
        <Champ
          id="confirmation"
          etiquette="Adresse e-mail"
          type="email"
          required
          autoComplete="email"
          placeholder="prenom@email.com"
          value={saisieEmail}
          onChange={(e) => setSaisieEmail(e.target.value)}
        />
        <Button
          type="submit"
          variant="doneo"
          size="pilule"
          className="w-full"
          disabled={!saisieEmail}>
          <Heart className="size-5 fill-current" aria-hidden="true" />
          Confirmer
        </Button>
      </form>
    );
  } else if (utilisateur === undefined) {
    ecran = <Chargement>Chargement…</Chargement>;
  } else if (utilisateur === null) {
    ecran = <Connexion />;
    avecEnTete = false;
  } else if (profil === undefined) {
    ecran = <Chargement>Chargement de votre profil…</Chargement>;
  } else if (profil === null) {
    ecran = <Inscription email={utilisateur.email} surTermine={setProfil} />;
  } else {
    return (
      <Routes>
        <Route element={<CoqueConnectee />}>
          <Route index element={<Accueil />} />
          <Route path="recherche" element={<Recherche />} />
          <Route
            path="creer"
            element={
              <Bientot titre="Créer une annonce" illustration="/illustrations/objet-cadeau.svg">
                La publication d’un objet arrive avec la prochaine version.
              </Bientot>
            }
          />
          <Route
            path="favoris"
            element={
              <Bientot titre="Favoris" illustration="/illustrations/objet-coeur.svg">
                Vous pourrez bientôt garder de côté les objets qui vous plaisent.
              </Bientot>
            }
          />
          <Route path="profil" element={<Profil profil={profil} />} />
          <Route path="membres" element={<Annuaire profil={profil} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        <Route element={<CoquePleinCadre />}>
          <Route path="annonces/:id" element={<FicheAnnonce profil={profil} />} />
        </Route>
      </Routes>
    );
  }

  return (
    <div className="doneo-coque">
      <div className="mx-auto flex min-h-dvh max-w-md flex-col px-6 py-6 sm:px-8">
        {avecEnTete && (
          <div className="mb-8">
            <Logo />
          </div>
        )}

        <main className="flex flex-1 flex-col">
          {erreur && (
            <p
              role="alert"
              className="mb-4 rounded-2xl bg-destructive/10 p-4 text-sm text-destructive">
              {erreur}
            </p>
          )}
          {ecran}
        </main>
      </div>
    </div>
  );
}
