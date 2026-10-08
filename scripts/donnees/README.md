# Scripts de données

Chargent les référentiels et les données de démonstration dans Firestore.
Ils utilisent la clé de service Firebase : `GOOGLE_APPLICATION_CREDENTIALS`, ou
le fichier `doneo-3561b-firebase-adminsdk-*.json` posé à la racine du dépôt
(git-ignoré).

> ⚠️ Il n'y a **qu'une seule base** : ces scripts écrivent dans les données du
> site en ligne. Lancer d'abord avec `--simulation`, qui n'écrit rien.

| Script | Ce qu'il charge | Source |
| --- | --- | --- |
| `generer-illustrations.mjs` | 84 illustrations SVG dans `public/static/illustrations/categories/`, une par catégorie et sous-catégorie. N'écrit pas dans Firestore | `categories.json` : icône Lucide et teinte de chaque catégorie |
| `charger-categories.mjs` | Collection `categories` : 12 principales, 72 sous-catégories, avec leur `illustrationUrl` | [`specs/donnees/categories.json`](../../specs/donnees/categories.json) |

```bash
cd scripts && npm install                 # une fois : installe lucide-static
npm run illustrations                     # regenere les SVG
node donnees/charger-categories.mjs --simulation
node donnees/charger-categories.mjs
```

Les illustrations reprennent le langage de la charte (`design/illustrations`) :
trait ardoise épais, aplats pastel, et la teinte de la catégorie principale en
fond, pour qu'une famille d'objets se reconnaisse dans une liste.

Les scripts sont **rejouables** : les identifiants sont stables, relancer met à
jour sans dupliquer.
