import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { cn } from "@/lib/utils.js";

/**
 * Classes du champ de saisie de la charte : 56 px de haut, coins tres
 * arrondis, filet lavande qui devient violet au focus.
 *
 * `md:text-base` neutralise le `md:text-sm` de shadcn : le produit est
 * mobile-first, et sous 16 px iOS zoome automatiquement a la saisie.
 */
export const CLASSES_CHAMP =
  "h-14 w-full rounded-[1.25rem] border-[1.5px] border-primary/20 bg-white px-[1.125rem] text-base md:text-base shadow-none " +
  "focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/15 " +
  "aria-invalid:border-destructive aria-invalid:ring-destructive/15";

/**
 * Paire etiquette + saisie, telle qu'elle apparait sur toutes les maquettes.
 *
 * @param {string} etiquette  intitule en petites capitales
 * @param {string} [aide]     precision affichee sous le champ
 */
export default function Champ({ id, etiquette, aide, className, ...props }) {
  const idAide = aide ? `${id}-aide` : undefined;

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="doneo-etiquette">
        {etiquette}
      </Label>
      <Input
        id={id}
        className={cn(CLASSES_CHAMP, className)}
        aria-describedby={idAide}
        {...props}
      />
      {aide && (
        <p id={idAide} className="text-xs leading-5 text-muted-foreground">
          {aide}
        </p>
      )}
    </div>
  );
}
