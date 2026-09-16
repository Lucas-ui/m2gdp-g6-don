import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Checkbox } from "@/components/ui/checkbox.jsx";
import { enregistrerProfil } from "@/lib/api.js";

/** Aujourd'hui, borne haute du champ : on ne naît pas dans le futur. */
const aujourdhui = () => new Date().toISOString().slice(0, 10);

const ROLES = [
  {
    valeur: "donateur",
    titre: "Donateur",
    detail: "Je donne des objets dont je n’ai plus l’usage",
  },
  {
    valeur: "beneficiaire",
    titre: "Bénéficiaire",
    detail: "Je cherche des objets dont j’ai besoin",
  },
];

/**
 * Ecran 3 du wireframe : « Formulaire d'inscription ».
 *
 * L'email n'est pas saisi ici : il est deja prouve par le lien magique, et le
 * Worker le reprend du jeton verifie. Le laisser modifiable ouvrirait la porte
 * a une usurpation d'adresse.
 */
export default function Inscription({ email, surTermine }) {
  const [champs, setChamps] = useState({
    nom: "",
    prenom: "",
    dateNaissance: "",
    roles: [],
    numeroRue: "",
    rue: "",
    complementAdresse: "",
    codePostal: "",
    ville: "",
  });
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState(null);

  const codePostalValide = /^\d{5}$/.test(champs.codePostal);

  const complet =
    champs.nom.trim() &&
    champs.prenom.trim() &&
    champs.dateNaissance &&
    champs.roles.length &&
    champs.numeroRue.trim() &&
    champs.rue.trim().length >= 2 &&
    codePostalValide &&
    champs.ville.trim();

  const modifier = (cle) => (e) =>
    setChamps((precedent) => ({ ...precedent, [cle]: e.target.value }));

  const basculerRole = (valeur) => (coche) =>
    setChamps((precedent) => ({
      ...precedent,
      roles: coche
        ? [...precedent.roles, valeur]
        : precedent.roles.filter((r) => r !== valeur),
    }));

  async function soumettre(evenement) {
    evenement.preventDefault();
    setErreur(null);
    setEnvoi(true);
    try {
      surTermine(await enregistrerProfil(champs));
    } catch (e) {
      setErreur(e.message);
      setEnvoi(false);
    }
  }

  return (
    <section className="space-y-6 pb-6">
      <header className="space-y-2">
        <div className="mb-5 flex items-center justify-between text-xs font-bold text-muted-foreground">
          <span className="text-primary">Profil</span>
          <span>2/3</span>
        </div>
        <h1 className="doneo-title text-3xl tracking-tight">
          Finalisez votre profil
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Vous êtes identifié(e) comme{" "}
          <strong className="text-foreground">{email}</strong>. Complétez votre
          profil pour terminer.
        </p>
      </header>

      <form onSubmit={soumettre} className="space-y-4" noValidate>
        {/* Emplacement photo : l'envoi de fichier vers R2 viendra plus tard. */}
        <div className="flex justify-center">
          <div className="doneo-logo" aria-hidden="true">
            <Heart className="size-9 fill-current" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="nom">Nom</Label>
          <Input
            id="nom"
            required
            autoComplete="family-name"
            placeholder="Dupont"
            className="doneo-input"
            value={champs.nom}
            onChange={modifier("nom")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="prenom">Prénom</Label>
          <Input
            id="prenom"
            required
            autoComplete="given-name"
            placeholder="Marie"
            className="doneo-input"
            value={champs.prenom}
            onChange={modifier("prenom")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="naissance">Date de naissance</Label>
          <Input
            id="naissance"
            type="date"
            required
            autoComplete="bday"
            max={aujourdhui()}
            value={champs.dateNaissance}
            onChange={modifier("dateNaissance")}
          />
        </div>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium leading-none">
            Que souhaitez-vous faire ?
          </legend>
          <p className="text-xs text-muted-foreground">
            Les deux sont possibles : on peut donner ce dont on n’a plus l’usage
            et chercher autre chose.
          </p>

          {ROLES.map((role) => (
            <label
              key={role.valeur}
              htmlFor={role.valeur}
              className="flex cursor-pointer items-start gap-3 rounded-2xl border bg-card/70 p-4 transition-colors has-checked:border-primary has-checked:bg-primary/5">
              <Checkbox
                id={role.valeur}
                checked={champs.roles.includes(role.valeur)}
                onCheckedChange={basculerRole(role.valeur)}
                className="mt-0.5"
              />
              <span>
                <span className="block text-sm font-medium">{role.titre}</span>
                <span className="block text-xs text-muted-foreground">
                  {role.detail}
                </span>
              </span>
            </label>
          ))}
        </fieldset>

        {/* Numero et rue sur une meme ligne : c'est ainsi qu'on ecrit une
            adresse, et le numero n'a pas besoin de toute la largeur. */}
        <div className="grid grid-cols-[6rem_1fr] gap-3">
          <div className="space-y-2">
            <Label htmlFor="numeroRue">N°</Label>
            <Input
              id="numeroRue"
              required
              maxLength={10}
              placeholder="12 bis"
              className="doneo-input"
              value={champs.numeroRue}
              onChange={modifier("numeroRue")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rue">Rue</Label>
            <Input
              id="rue"
              required
              autoComplete="street-address"
              placeholder="rue de la République"
              className="doneo-input"
              value={champs.rue}
              onChange={modifier("rue")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="complement">
            Complément d’adresse{" "}
            <span className="font-normal normal-case">(facultatif)</span>
          </Label>
          <Input
            id="complement"
            maxLength={100}
            placeholder="Bât. B, appt 12"
            className="doneo-input"
            value={champs.complementAdresse}
            onChange={modifier("complementAdresse")}
          />
        </div>

        {/* Code postal et ville vont ensemble : les separer sur deux lignes
            donnerait un formulaire plus long sans rien clarifier. */}
        <div className="space-y-2">
          <div className="grid grid-cols-[7rem_1fr] gap-3">
            <div className="space-y-2">
              <Label htmlFor="codePostal">Code postal</Label>
              <Input
                id="codePostal"
                required
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={5}
                placeholder="69002"
                className="doneo-input"
                value={champs.codePostal}
                onChange={(e) =>
                  setChamps((p) => ({
                    ...p,
                    codePostal: e.target.value.replace(/\D/g, "").slice(0, 5),
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ville">Ville</Label>
              <Input
                id="ville"
                required
                autoComplete="address-level2"
                placeholder="Lyon"
                className="doneo-input"
                value={champs.ville}
                onChange={modifier("ville")}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Les objets se récupèrent en main propre : votre ville et votre code
            postal sont visibles par les autres membres. Votre adresse exacte,
            elle, reste privée.
          </p>
        </div>

        {erreur && (
          <p role="alert" className="text-sm text-destructive">
            {erreur}
          </p>
        )}

        <Button
          type="submit"
          className="doneo-primary-button w-full"
          disabled={envoi || !complet}>
          {envoi && (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          )}
          {envoi ? "Enregistrement…" : "S’inscrire"}
        </Button>
      </form>
    </section>
  );
}
