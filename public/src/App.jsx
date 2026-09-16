import { useEffect, useRef, useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import Champ from "@/components/Champ.jsx";
import Logo from "@/components/Logo.jsx";
import Connexion from "@/ecrans/Connexion.jsx";
import Inscription from "@/ecrans/Inscription.jsx";
import Accueil from "@/ecrans/Accueil.jsx";
import LienInvalide from "@/ecrans/LienInvalide.jsx";
import { chargerProfil } from "@/lib/api.js";
import {
  estRetourDeLien,
  finaliserConnexion,
  surChangementAuth,
} from "@/lib/auth.js";

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
 *   connecte avec profil      -> Accueil
 *
 * Pas de routeur : quatre etats suffisent, et la navigation par onglets
 * viendra avec les maquettes.
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
    ecran = <Accueil profil={profil} />;
    avecEnTete = false;
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
