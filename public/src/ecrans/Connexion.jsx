import { useState } from "react";
import { Mail, Loader2, CheckCircle2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { envoyerLienMagique } from "@/lib/auth.js";
import { statutEmail } from "@/lib/api.js";

/**
 * Ecran 1 du wireframe : « Se connecter avec votre e-mail ».
 *
 * Une seule saisie, pas de mot de passe. On interroge le backend pour savoir si
 * l'adresse a deja un compte : cela ne change rien au lien envoye (Firebase
 * gere les deux cas), mais cela permet d'annoncer honnetement ce qui va se
 * passer — « lien de connexion » ou « lien d'inscription ».
 */
export default function Connexion() {
  const [email, setEmail] = useState("");
  const [etat, setEtat] = useState("saisie"); // saisie | envoi | envoye
  const [dejaInscrit, setDejaInscrit] = useState(false);
  const [erreur, setErreur] = useState(null);

  async function soumettre(evenement) {
    evenement.preventDefault();
    setErreur(null);
    setEtat("envoi");

    try {
      const existe = await statutEmail(email.trim().toLowerCase());
      await envoyerLienMagique(email.trim().toLowerCase());
      setDejaInscrit(existe);
      setEtat("envoye");
    } catch (e) {
      setErreur(e.message);
      setEtat("saisie");
    }
  }

  if (etat === "envoye") {
    return (
      <section className="space-y-5">
        <div className="doneo-logo">
          <CheckCircle2 className="size-8" aria-hidden="true" />
        </div>
        <h1 className="doneo-title text-3xl tracking-tight">
          Consultez vos e-mails
        </h1>
        <p className="text-muted-foreground">
          {dejaInscrit
            ? "Un lien de connexion vient d’être envoyé à "
            : "Un lien pour créer votre compte vient d’être envoyé à "}
          <strong className="text-foreground">{email}</strong>.
        </p>
        <p className="text-sm text-muted-foreground">
          Le lien est valable une heure et ne fonctionne qu’une fois. Pensez à
          regarder vos indésirables.
        </p>
        <Button
          variant="outline"
          className="h-12 w-full rounded-2xl border-primary/20 bg-transparent font-bold text-primary"
          onClick={() => setEtat("saisie")}>
          Utiliser une autre adresse
        </Button>
      </section>
    );
  }

  return (
    <section className="space-y-7 pb-6">
      <div className="flex flex-col items-center gap-5 pb-2 text-center">
        <div className="doneo-logo">
          <Heart className="size-10 fill-current" aria-hidden="true" />
        </div>
        <header className="space-y-2">
          <h1 className="doneo-title text-3xl tracking-tight">Connexion</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Entrez votre e-mail pour recevoir un lien de connexion.
          </p>
        </header>
      </div>

      <form onSubmit={soumettre} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder="prenom@email.com"
            className="doneo-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-describedby={erreur ? "erreur-email" : undefined}
            aria-invalid={erreur ? "true" : undefined}
          />
        </div>

        {erreur && (
          <p
            id="erreur-email"
            role="alert"
            className="text-sm text-destructive">
            {erreur}
          </p>
        )}

        <Button
          type="submit"
          className="doneo-primary-button w-full"
          disabled={etat === "envoi" || !email}>
          {etat === "envoi" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Envoi en cours…
            </>
          ) : (
            <>
              <Mail className="size-4" aria-hidden="true" />
              Envoyer le lien magique
            </>
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Pas de mot de passe à retenir · Donnez simplement.
        </p>
      </form>
    </section>
  );
}
