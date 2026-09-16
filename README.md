# Donéo — Don caritatif par la vente d'objets

Projet Gestion de Projet M2CIM 2026/2027 — Groupe 6.

Plateforme de **don caritatif par la vente d'objets**. Un **donateur** cède ce
dont il n'a plus l'usage — mobilier, électroménager, matériel scolaire,
vêtements — fixe une **participation solidaire** et choisit une **association**.
Un **bénéficiaire** — étudiant, ou personne dans le besoin — verse cette
participation et vient récupérer l'objet en main propre.

**Le donateur ne touche pas l'argent** : la totalité va à l'association qu'il a
choisie. C'est ce qui fait de la vente un don. Le bénéficiaire, lui, repart avec
l'objet **à petit prix**.

La participation n'est pas un prix de marché. Elle reste **modeste** : ce qu'elle
achète, ce n'est pas la valeur de l'objet, c'est le geste de soutenir une
association. Pas d'enchère non plus — le montant est fixé une fois pour toutes
par le donateur.

Le donateur définit aussi un **créneau de retrait**, et l'**adresse exacte n'est
révélée qu'une fois la participation validée** — avant, le bénéficiaire ne voit
qu'un lieu approximatif (code postal et ville). Les rôles `donateur` et
`beneficiaire` sont **cumulables** sur un même compte.

> ⚠️ Le **paiement est simulé** : interface front uniquement, aucune transaction
> ni aucun reversement réels.

## Structure du dépôt

| Répertoire   | Contenu                                                        |
|--------------|----------------------------------------------------------------|
| `/landing`   | Site vitrine statique (HTML/CSS/img). URL : site.web.app       |
| `/public`    | Application web frontend (PWA). URL : app.site.web.app         |
| `/workers`   | Logique métier backend (Cloudflare Workers)                    |
| `/docs`      | Documentation technique et guides                              |
| `/design`    | Artefacts UX en HTML (charte graphique, maquettes)             |
| `/specs`     | Artefacts PO (specs OpenAPI, diagrammes Mermaid, données JSON) |
| `/tests`     | Tests automatisés Playwright (scripts, résultats)              |
| `agents.md`  | Instructions générales pour l'IA                               |

## Stack technique

- **Frontend** : PWA, framework Material Design (Shadcn), LeafletJS (carte),
  Google Places API (géolocalisation)
- **Backend** : Cloudflare Workers (logique métier)
- **Auth** : Firebase Authentication (lien magique, sans mot de passe)
- **Données** : Firestore (NoSQL) + Firebase Realtime DB (messages)
- **Fichiers** : Cloudflare R2
- **Sessions** : Cloudflare D1 (SQL)
- **Hébergement** : Firebase Hosting

## Démarrage

Voir [`docs/SETUP.md`](docs/SETUP.md) pour l'installation et la configuration.

## Équipe

- PO : _à compléter_
- UX : _à compléter_
- DEV : Guillaume
- Sponsor / Manager : @quangfr
