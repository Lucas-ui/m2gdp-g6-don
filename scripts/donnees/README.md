# Scripts de données

Chargent les référentiels et les données de démonstration dans Firestore.
Ils utilisent la clé de service Firebase : `GOOGLE_APPLICATION_CREDENTIALS`, ou
le fichier `doneo-3561b-firebase-adminsdk-*.json` posé à la racine du dépôt
(git-ignoré).

> ⚠️ Il n'y a **qu'une seule base** : ces scripts écrivent dans les données du
> site en ligne. Lancer d'abord avec `--simulation`, qui n'écrit rien.

| Script | Ce qu'il charge | Source |
| --- | --- | --- |
| `charger-categories.mjs` | Collection `categories` : 12 principales, 72 sous-catégories | [`specs/donnees/categories.json`](../../specs/donnees/categories.json) |

```bash
node scripts/donnees/charger-categories.mjs --simulation
node scripts/donnees/charger-categories.mjs
```

Les scripts sont **rejouables** : les identifiants sont stables, relancer met à
jour sans dupliquer.
