---
name: charte-doneo
description: Charte graphique et conventions d'écran de Donéo (Tailwind v4 + shadcn/ui, mobile-first) — couleurs, typographies, boutons, champs, cartes, logo, illustrations. À utiliser avant de créer ou de modifier un écran ou un composant de public/src, et pour vérifier qu'un écran respecte la charte.
---

# Charte Donéo

Tout est déjà en place dans `public/src/index.css` et `public/src/components/`.
**Réutiliser, ne rien réinventer** : pas de nouvelle couleur en dur, pas de
nouveau style de bouton, et jamais de Material Design (arbitrage du 16/09/2026).

## Couleurs

Utilitaires Tailwind disponibles : `bg-violet`, `text-rose`, `bg-menthe`…

| Jeton | Hex | Emploi |
| --- | --- | --- |
| `violet` / `primary` | `#9B4DDB` | Identité, actions principales |
| `violet-fonce` | `#8538C6` | Survol des boutons ; **texte violet de petite taille** (le violet seul ne donne que 4,28:1 sur le lilas) |
| `lavande` | `#E7D6F5` | Aplats doux, pastilles |
| `rose` | `#E23C8E` | Émotion (cœur, favori). **Jamais une erreur** |
| `ardoise` / `foreground` | `#2F4F5C` | Texte |
| `lilas` / `background` | `#F7F2FC` | Fond d'application |
| `menthe`, `pervenche`, `citron` | `#BFE9E1`, `#C6CAF6`, `#EDF5B3` | Catégories, cartes, illustrations |
| `destructive` | `#D92D4E` | Erreurs — un rouge, pas le rose |
| `succes`, `alerte` | `#2E8B6E`, `#B8860B` | États |

Les jetons shadcn sont en **hex** : des triplets OKLCH nus rendent la charte
invisible.

## Typographie

- Titres : **Fredoka** (`font-titre`, ou `h1`–`h3`, ou `.doneo-titre`) — il
  remplace Asgard, qui n'existe pas en webfont.
- Texte : **Inter**.
- Intitulé de champ : `.doneo-etiquette` (petites capitales).
- Saisie en `text-base` minimum : sous 16 px, iOS zoome à la saisie.

## Composants

| Besoin | Utiliser |
| --- | --- |
| Action principale | `<Button variant="doneo" size="pilule" className="w-full">` avec une icône `Heart` (`fill-current`) |
| Action secondaire | `<Button variant="doneoSecondaire" size="pilule">` |
| Champ de formulaire | `<Champ id etiquette aide …/>` (`components/Champ.jsx`) ; `CLASSES_CHAMP` pour un `Select` |
| Bloc, carte | `.doneo-carte` (rayon 24 px, fond blanc, ombre violette légère) |
| Illustration ronde | `.doneo-pastille` + une image de `/illustrations/` |
| Logo | `<Logo variante="mot" />` sur les écrans d'accueil ; `variante="complet"` dans les en-têtes ; `<Marque />` pour la tuile seule |
| Icônes | `lucide-react`, `size-5` dans les boutons |

Illustrations disponibles dans `public/static/illustrations/` : `objet-coeur`,
`objet-cadeau`, `objet-carton`, `objet-etoile`, `objet-piece`,
`expression-heureux`, `expression-celebration`. Toujours `alt=""` et
`aria-hidden="true"` : elles sont décoratives.

## Mise en page (mobile-first)

- Écran = `<section className="flex flex-1 flex-col">` : en-tête centré en haut
  (logo, titre, sous-titre en `text-muted-foreground`, illustration), puis
  actions **poussées en bas** avec `mt-auto` — à portée de pouce, comme sur les
  maquettes.
- Concevoir à 375 px de large d'abord ; vérifier aussi à 320 px, sans
  défilement horizontal.
- Pas de surcharge de `--radius-2xl` / `--radius-3xl` : cela arrondissait les
  pastilles jusqu'au cercle.

## Vérifier un écran

1. `cd public && npm run dev`, puis ouvrir l'écran avec Playwright en 375×812.
2. Faire une capture et la comparer aux maquettes : couleurs, rayons,
   bouton pleine largeur en bas, titre en Fredoka.
3. Contraste : tout texte violet de petite taille doit être en `violet-fonce`.
4. Vocabulaire : français sans faute, « participation » et jamais « prix »,
   « offrant » / « demandeur » / « association ».
