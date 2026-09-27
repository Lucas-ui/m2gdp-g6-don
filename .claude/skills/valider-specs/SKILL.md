---
name: valider-specs
description: Valide les specs de Donéo — contrat OpenAPI (specs/openapi.yaml), schémas JSON, diagrammes Mermaid de specs/data-model.md, et règles de vocabulaire du projet. À utiliser après toute modification des specs, avant de les commiter, ou quand on demande si « le modèle / l'API est valide ».
---

# Valider les specs Donéo

Quatre vérifications, toutes à relancer après chaque modification de
`specs/openapi.yaml` ou `specs/data-model.md`.

## 0. Installer les outils (une fois par poste)

Les dépendances vont dans un dossier temporaire, **jamais dans le dépôt** :

```bash
DEPS="${TMPDIR:-/tmp}/doneo-specs-deps"
npm install --prefix "$DEPS" --no-save @apidevtools/swagger-parser ajv playwright
npx --prefix "$DEPS" playwright install chromium
```

Puis, pour chaque lancement : `export NODE_PATH="$DEPS/node_modules"`.
Les scripts sont dans `.claude/skills/valider-specs/scripts/`.

## 1. Contrat OpenAPI

```bash
node .claude/skills/valider-specs/scripts/valider-openapi.cjs specs/openapi.yaml
```

Attendu : `VALIDE — OpenAPI 3.0.3`, avec le nombre de chemins, d'opérations et
de schémas. Comparer ces nombres avant et après : une chute signale une route
supprimée par erreur.

## 2. Schémas

```bash
node .claude/skills/valider-specs/scripts/compiler-schemas.cjs specs/openapi.yaml
```

Compile chaque schéma avec Ajv. Utilise `bundle` et non `dereference` :
`Categorie` est récursif, le déréférencer produit une boucle infinie.

## 3. Diagrammes Mermaid

```bash
node .claude/skills/valider-specs/scripts/rendre-mermaid.cjs specs/data-model.md
```

Rend chaque bloc dans Chromium et dépose `diagramme-N.png` dans le dossier
temporaire. **Regarder les PNG** quand un diagramme de classes a changé : un
rendu « OK » peut rester illisible. Au-delà d'une dizaine de classes, scinder
le diagramme en vues.

## 4. Règles de vocabulaire (AGENTS.md)

Chercher avec l'outil Grep dans `specs/`, `workers/src/` et `public/src/` :

| Motif | Pourquoi |
| --- | --- |
| `\bprix\b`, `\bprice\b`, `title`, `createdAt`, `userId` | Tous les champs sont en français ; le montant s'appelle `participation` |
| `Acquisition`, `acqu[ée]reur`, `donat(eur\|rice)`, `b[ée]n[ée]ficiaire` | Ancien vocabulaire : les rôles s'appellent `offrant` et `demandeur` |
| `numeroRue`, `rue`, `complementAdresse` | Ne doivent sortir que d'une route réservée (réservation `confirmee`, ou édition par l'offrant). Toute réponse publique filtre par **liste blanche** |

## Pièges OpenAPI 3.0 déjà rencontrés

- `nullable: true` n'a d'effet que si `type` est dans le **même** schéma. À côté
  d'un `allOf` sans `type`, il est ignoré : omettre le champ plutôt que `null`.
- Avec une `enum`, `null` doit **figurer dans la liste**, `nullable` ne suffit pas.
- Pas de génériques : factoriser la pagination via `allOf` + schéma `Pagination`.
- Les erreurs 422 suivent le Worker : `{ erreurs: string[] }` (schéma
  `ErreursValidation`), pas `{ erreur, details }`.

## Rester simple

Le code n'est pas évalué, le fonctionnel l'est. Face à un cas limite soulevé par
une revue, préférer une action manuelle ou une règle d'une ligne à un mécanisme
automatique (tâche planifiée, délais calculés). La liste d'attente a été
simplifiée pour cette raison : c'est l'offrant qui passe au suivant.
