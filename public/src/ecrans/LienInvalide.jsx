import { useEffect, useState } from "react";
import { CheckCircle2, Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import Champ from "@/components/Champ.jsx";
import { emailEnAttente, envoyerLienMagique } from "@/lib/auth.js";

const ATTENTE_SECONDES = 60;

/**
 * Lien expiré ou déjà consommé.
 *
 * Ce n'est pas une panne mais un cas nominal : les liens durent une heure et ne
 * servent qu'une fois. L'écran l'explique et propose de repartir, plutôt que
 * d'afficher un message technique et de laisser l'utilisateur bloqué.
 */
export default function LienInvalide({ expire }) {
  const [email, setEmail] = useState(emailEnAttente() || "");
  const [etat, setEtat] = useState("saisie"); // saisie | envoi | envoye
  const [erreur, setErreur] = useState(null);
  const [attente, setAttente] = useState(0);

  // Temporisation anti-abus : on ne peut pas redemander un lien en rafale.
  useEffect(() => {
    if (attente <= 0) return undefined;
    const t = setTimeout(() => setAttente((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [attente]);

  async function renvoyer(evenement) {
    evenement.preventDefault();
    setErreur(null);
    setEtat("envoi");
    try {
      await envoyerLienMagique(email.trim().toLowerCase());
      setEtat("envoye");
      setAttente(ATTENTE_SECONDES);
    } catch (e) {
      setErreur(e.message);
      setEtat("saisie");
    }
  }

  return (
    <section>
      <div className="flex flex-col items-center pt-4 text-center">
        <div className="doneo-pastille size-28">
          <img
            src="/illustrations/objet-piece.svg"
            alt=""
            aria-hidden="true"
            className="size-20"
          />
        </div>

        <h1 className="doneo-titre mt-6 text-[1.75rem] leading-tight text-pretty">
          {expire ? "Ce lien a expiré" : "Ce lien n’est plus valable"}
        </h1>
        <p className="mt-2.5 text-sm leading-6 text-muted-foreground text-pretty">
          {expire
            ? "Les liens de connexion sont valables une heure. Celui-ci est trop ancien."
            : "Ce lien a déjà servi, ou il est incomplet. Un lien ne fonctionne qu’une seule fois."}{" "}
          Demandez-en un nouveau, c’est immédiat.
        </p>
      </div>

      {etat === "envoye" ? (
        <div className="mt-7 space-y-3.5">
          <p className="doneo-carte flex items-start gap-3 p-4 text-sm">
            <CheckCircle2
              className="size-5 shrink-0 text-succes"
              aria-hidden="true"
            />
            <span className="text-muted-foreground">
              Nouveau lien envoyé à{" "}
              <strong className="font-semibold text-foreground">{email}</strong>
              .
            </span>
          </p>
          <Button
            variant="doneoSecondaire"
            size="pilule"
            className="w-full"
            disabled={attente > 0}
            onClick={() => setEtat("saisie")}>
            <Heart className="size-5" aria-hidden="true" />
            {attente > 0 ? `Renvoyer dans ${attente} s` : "Renvoyer un lien"}
          </Button>
        </div>
      ) : (
        <form onSubmit={renvoyer} className="mt-7 space-y-3.5" noValidate>
          <Champ
            id="email-renvoi"
            etiquette="Adresse e-mail"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder="prenom@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={erreur ? "true" : undefined}
          />

          {erreur && (
            <p role="alert" className="text-sm text-destructive">
              {erreur}
            </p>
          )}

          <Button
            type="submit"
            variant="doneo"
            size="pilule"
            className="w-full"
            disabled={etat === "envoi" || !email}>
            {etat === "envoi" ? (
              <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            ) : (
              <Heart className="size-5 fill-current" aria-hidden="true" />
            )}
            {etat === "envoi" ? "Envoi en cours…" : "Recevoir un nouveau lien"}
          </Button>
        </form>
      )}
    </section>
  );
}
