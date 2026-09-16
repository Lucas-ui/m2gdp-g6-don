# Tickets — EPIC-0 et EPIC-1

> ## ⚠️ État au 16/09/2026 — à lire avant d'utiliser ce fichier
>
> Ce document servait à préparer des corps de tickets à coller dans GitHub. Ce
> rôle est terminé.
>
> **Il ne reste que quatre issues sur GitHub, toutes fermées :** #1 (EPIC),
> #2 (inscription), #3 (connexion) et #9 (annuaire). **Les douze tickets TASK
> ont été supprimés** du dépôt. Les sections `[TASK-n]` ci-dessous ne
> correspondent donc plus à rien sur GitHub — elles ne sont conservées que
> comme trace du découpage réalisé.
>
> **En cas de divergence, les issues GitHub font foi**, pas ce fichier.
>
> Deux arbitrages proposés ici ont été repris dans les issues : les rôles
> cumulables, et l'abandon de toute condition d'âge (#2 CA5).

## Arbitrages actés

1. **Les rôles sont cumulables** — donateur *et/ou* bénéficiaire. Un même compte
   peut donner ce dont il n'a plus l'usage tout en cherchant autre chose : c'est
   le cas courant entre étudiants, pas l'exception. Le champ devient une liste
   `roles[]`.
2. **La photo sort du périmètre MVP** de l'US-1. Le CA2 la listait parmi les
   champs requis, mais téléverser un fichier vers R2 est un travail à part
   entière, et le stockage de fichiers est classé SHOULD dans la priorisation du
   cours. Le formulaire garde l'emplacement visuel ; `photoUrl` reste vide.
   *(À confirmer par le PO.)*
3. **La déconnexion rejoint l'US-2** — l'EPIC parle d'identité *et d'accès*,
   sortir en fait partie.
4. **L'annuaire des inscrits obtient sa propre US** (US-3) : la J2 l'exige, mais
   aucune des deux US existantes ne le justifiait.

## Arborescence cible

Les tâches ayant été supprimées de GitHub, il ne reste que deux niveaux :

```
EPIC-0 · Socle technique et mise en ligne          (pas d'issue dédiée)

EPIC-1 · Authentification et profil utilisateur    #1  (fermée)
├── US-1 Inscription et création de profil         #2  (fermée)
├── US-2 Connexion utilisateur existant            #3  (fermée)
└── US-3 Consulter les membres inscrits            #9  (fermée)
```

---
---

# 🆕 [EPIC-0] Socle technique et mise en ligne

***

### Objectif de l'EPIC
Disposer d'une chaîne complète et vérifiée — front, backend, bases de données, stockage, hébergement — avant d'écrire la moindre fonctionnalité métier, et pouvoir la redéployer à volonté.

### Périmètre fonctionnel
- Architecture serverless imposée : Firebase (Auth, Firestore, Realtime Database, Hosting) et Cloudflare (Workers, D1, R2).
- Le front n'accède jamais aux services directement : il passe par le Worker, seul détenteur de la clé de service.
- Application front sous forme de PWA installable.
- Outillage de développement assisté par IA (MCP, skills projet) versionné dans le dépôt.

### Hors périmètre
- Toute logique métier (dons, demandes, messagerie) : voir les EPIC suivants.
- Sécurité, performance et scalabilité de production, explicitement hors barème.

### Réalisé
- [x] Firebase Auth (lien magique) et Firestore initialisés.
- [x] Cloudflare provisionné : D1 `doneo-sessions`, R2 `doneo-fichiers`, Worker et secrets.
- [x] Squelette PWA (Vite + React), `publicDir` sur `static/`, build vers `public/dist`.
- [x] Service worker : **réseau d'abord** sur la navigation, `/api/` **jamais** mis en cache.
- [x] Outillage agentique versionné : `.mcp.json`, skills `deployer` et `verif-infra`.
- [x] Deux sites Hosting (`landing`, `app`) déployés et vérifiés de bout en bout.

> **Deux pièges à ne pas réapprendre.** R2 exige une **activation préalable** du
> service sur le compte (erreur `code: 10042` sinon). Et un site Hosting
> nouvellement créé n'est **pas** ajouté automatiquement aux domaines autorisés
> de Firebase Auth : tout lien magique pointant dessus est rejeté sans
> explication.

---

# ✏️ #1 · [EPIC-1] Authentification et profil utilisateur

***

### Objectif de l'EPIC
Gérer l'identité et l'accès des utilisateurs à la plateforme de dons de manière fluide et sécurisée, sans utiliser de mots de passe, à travers un lien magique.

### Périmètre fonctionnel
- Inscription et connexion via e-mail avec un "Lien magique".
- Création du profil obligatoire pour les nouveaux utilisateurs après le clic sur le lien.
- Champs du profil : nom, prénom, date de naissance, **rôles (donateur et/ou bénéficiaire, cumulables)**, numéro de rue, rue, complément (facultatif), code postal, ville.
- Déconnexion.
- Consultation des membres inscrits.
- **Passerelle backend** : le front n'accède jamais à Firestore directement. Il présente son jeton d'identité, le Worker Cloudflare le vérifie, puis agit avec la clé de service.

### User Stories associées
- [ ] US-1 : Inscription et création de profil
- [ ] US-2 : Connexion utilisateur existant
- [ ] US-3 : Consulter les membres inscrits

***

---

# ✏️ #2 · [US-1] Inscription et création de profil

***

### Titre
En tant que nouveau visiteur, je veux m'inscrire via un lien magique envoyé par e-mail sans avoir à créer de mot de passe, afin d'accéder de manière fluide et sécurisée à la plateforme de dons.

### Spécifications fonctionnelles
**Contexte :** Pour maximiser le taux de conversion, l'utilisateur n'a pas besoin de retenir un mot de passe. Il renseigne son e-mail.
**Happy Path :**
- L'utilisateur saisit son e-mail sur la page d'inscription.
- Le système indique si l'adresse a déjà un compte, puis envoie le lien magique. **Le lien est le même dans les deux cas ; seul le message affiché diffère.**
- L'utilisateur clique sur le lien dans sa boîte mail. Firebase crée le compte à la consommation du lien.
- Il est redirigé vers un formulaire pour compléter son profil : nom, prénom, rôles (donateur et/ou bénéficiaire), numéro de rue, rue, complément (facultatif), code postal, ville, date de naissance.
- Validation et redirection vers la page d'accueil en mode connecté.

### Critères d'acceptation
- [ ] **CA1 (Happy Path) :** Le champ e-mail possède une validation syntaxique en temps réel. Un message de confirmation est affiché après l'envoi du lien.
- [ ] **CA2 (Happy Path) :** Après avoir cliqué sur le lien, le formulaire d'inscription affiche bien les champs requis (nom, prénom, **rôles — plusieurs choix possibles**, numéro de rue, rue, complément (facultatif), code postal, ville, date de naissance). La soumission crée le compte.
- [ ] **CA3 (Erreur gérée) :** Si le format de l'e-mail est invalide, le bouton de soumission est bloqué et un message d'aide apparaît.
- [ ] **CA4 (Erreur gérée) :** Si le lien magique est expiré, une page d'erreur propose de renvoyer un nouveau lien.
- [x] ~~**CA5 (Erreur gérée) :** Si l'utilisateur n'est pas majeur, le bouton de soumission est bloqué et un message d'aide apparaît.~~ **Abandonné sur décision produit :** la plateforme s'adresse en priorité aux jeunes dans le besoin, mineurs compris. La date de naissance reste obligatoire et validée, mais sans seuil d'âge.
- [ ] **CA6 (Erreur gérée) :** Les champs sont validés côté serveur, pas seulement dans le navigateur. Une requête forgée est rejetée en `422`.

### Spécifications techniques
- **ST1 :** Implémentation de Firebase Auth avec _sendSignInLinkToEmail_.
- **ST2 :** Validation et consommation du lien via _signInWithEmailLink_.
- **ST3 :** À la complétion du profil, écriture d'un document dans la collection `utilisateurs` de Cloud Firestore **via le Worker** (`PUT /api/profil`), jamais depuis le front. Champs : `id`, `email`, `nom`, `prenom`, `photoUrl`, `numeroRue`, `rue`, `complementAdresse`, `codePostal`, `ville`, `dateNaissance`, `roles[]`, `creeLe`, `misAJourLe`.
- **ST4 :** L'e-mail stocké est **repris du jeton d'identité vérifié, jamais du formulaire** : sinon n'importe qui pourrait s'enregistrer sous l'adresse d'un autre.

### Exclusions (Hors scope MVP)
- Pas de connexion via les réseaux sociaux (Google, Facebook) pour le moment.
- Pas de vérification d'identité poussée ou par SMS lors de l'inscription.
- **Pas de téléversement de photo de profil.** L'emplacement est affiché dans le formulaire, mais l'envoi vers Cloudflare R2 relève du lot « Stockage des photos et documents », classé SHOULD. `photoUrl` reste vide.
- Pas de modification ni de suppression du profil après création.

***

---

# ✏️ #3 · [US-2] Connexion utilisateur existant

***

### Titre
En tant qu'utilisateur déjà inscrit (donateur, bénéficiaire, ou les deux), je veux me connecter via un lien magique envoyé sur mon e-mail, afin de retrouver mon profil, mes dons et mes demandes.

### Spécifications fonctionnelles
**Contexte :** Fluidifier le retour de l'utilisateur sur l'application.
**Happy Path :**
- L'utilisateur saisit son e-mail sur la page de connexion.
- Le système reconnaît l'e-mail et envoie le lien magique. *(Même lien que pour une inscription — voir US-1.)*
- L'utilisateur clique sur le lien et est instantanément authentifié et redirigé vers l'accueil.

### Critères d'acceptation
- [ ] **CA1 (Happy Path) :** L'écran de confirmation invite clairement l'utilisateur à aller consulter sa boîte mail.
- [ ] **CA2 (Happy Path) :** Le clic sur le lien connecte l'utilisateur sans lui redemander son profil (reconnaissance).
- [ ] **CA3 (Erreur gérée) :** Si l'utilisateur clique sur le lien depuis un autre navigateur/appareil (cross-device), le système lui demande de resaisir son e-mail pour confirmer par sécurité.
- [ ] **CA4 (Happy Path) :** L'utilisateur peut se déconnecter depuis l'accueil et revient à l'écran de saisie d'e-mail.
- [ ] **CA5 (Erreur gérée) :** Un lien déjà consommé ne rouvre pas de session : le code à usage unique est retiré de l'URL après connexion, et un rafraîchissement de la page ne le rejoue pas.

### Spécifications techniques
- **ST1 :** Suivi en continu de l'état de connexion de l'utilisateur afin de mettre à jour automatiquement le contexte client dans le front-end.
- **ST2 :** Paramétrage de _ActionCodeSettings_ dans Firebase pour définir l'URL cible de redirection sécurisée. Le domaine cible doit figurer dans les **domaines autorisés** de Firebase Auth, sinon le retour est rejeté.

### Exclusions (Hors scope MVP)
- Pas de gestion du multi-sessions complexe.
- Aucun filtre anti-spam intégré (si l'e-mail arrive dans les indésirables, c'est hors de notre contrôle front).

***

---

# 🆕 [US-3] Consulter les membres inscrits — issue #9

> **Cette copie reflète l'issue GitHub #9, qui fait foi.** Toute divergence se
> corrige ici, pas sur GitHub.

***

### Titre
Consulter la liste des membres inscrits depuis l'accueil

### Spécifications fonctionnelles
**Contexte :** Sur une plateforme de dons entre inconnus, la confiance est le premier frein. Voir d'autres membres réels lève ce frein. C'est également une exigence du POC pour prouver la remontée de données.
**Happy Path :**
- Une fois connecté et son profil complété, l'utilisateur arrive sur l'accueil.
- L'accueil charge et affiche la liste des membres inscrits avec leur prénom, nom, rôles et adresse (ville/code postal).
- Un compteur indique le nombre total d'inscrits.

### Critères d'acceptation
- [x] **CA1 (Happy Path) :** La liste affiche prénom, nom, rôles et adresse (ville/code postal) de chaque inscrit, avec le total.
- [x] **CA2 (Sécurité) :** Les adresses e-mail ne sont **jamais** exposées dans la réponse de l'API.
- [x] **CA3 (Cas limite) :** Si la base ne contient que l'utilisateur actuel, un message l'informant qu'il est le premier (ou qu'il n'y a pas d'autres membres) s'affiche.
- [x] **CA4 (Erreur gérée) :** Si le chargement échoue, un message d'erreur est affiché sans casser le reste de l'accueil.

### Prérequis
* Les profils doivent être créés en base via l'US (Inscription).

### Spécifications techniques
- **ST1 :** `GET /api/utilisateurs` sur le Worker, qui lit la collection `utilisateurs` et retire le champ `email` avant de répondre.

### Exclusions (Hors scope MVP)
- Pas de pagination ni de recherche dans l'annuaire.
- Pas de fiche profil détaillée par membre.
- Pas de photo dans la liste tant que le téléversement n'est pas fait.

### Écart assumé par rapport à ST1

ST1 décrit une **liste noire** (« retire le champ `email` »). Le Worker applique
une **liste blanche** : il ne recopie que `id`, `prenom`, `nom`, `roles`,
`photoUrl`, `codePostal` et `ville`.

C'est plus strict, et cela satisfait CA2. Une liste noire exposerait
`numeroRue`, `rue` et `dateNaissance` — l'adresse du domicile et la date de
naissance de chaque inscrit, sur un annuaire lisible sans être connecté. Et
chaque champ ajouté au profil plus tard s'y retrouverait automatiquement.
**CA2 est la fin, ST1 n'était qu'un moyen : on garde la fin.**

---
---

## 🔴 Note à retenir : il n'existe qu'un seul type de lien

L'US-1 disait que le système envoie « un lien d'**inscription** unique » si
l'e-mail n'existe pas, par opposition à un lien de **connexion** s'il existe.
**Firebase ne fonctionne pas ainsi.** `sendSignInLinkToEmail` envoie toujours le
même lien ; à sa consommation, Firebase crée le compte s'il n'existait pas, ou
ouvre la session s'il existait.

Croire à deux liens différents conduirait à chercher une API qui n'existe pas.
Ce qui diffère est **uniquement le message affiché** — d'où `statut-email`.

## Couverture des critères

Les tâches ayant été supprimées de GitHub, la couverture se lit directement
critère par critère.

| Issue | Critère | État du code |
|---|---|---|
| #2 US-1 | CA1, CA3 | ✅ validation e-mail et message de confirmation |
| #2 US-1 | CA2 | ✅ nom, prénom, rôles, n° de rue, rue, complément, code postal, ville, date de naissance |
| #2 US-1 | CA4 | ✅ écran dédié, distingue lien expiré et lien déjà consommé |
| #2 US-1 | CA5 | ✅ date validée, **sans condition d'âge** |
| #2 US-1 | CA6, ST3, ST4 | ✅ validation serveur, e-mail repris du jeton |
| #2 US-1 | ST1, ST2 | ✅ |
| #3 US-2 | CA1 → CA5, ST1, ST2 | ✅ dont cross-device et lien déjà consommé |
| #9 US-3 | CA1 → CA4, ST1 | ✅ (ST1 durci en liste blanche, cf. ci-dessus) |
| #1 EPIC | — | ✅ socle déployé, passerelle backend en place |

**Les trois US sont couvertes par le code.**

> ⚠️ **Le Worker déployé est en retard sur ce tableau** : il valide encore
> `adressePostale`. Tant qu'il n'est pas redéployé, toute nouvelle inscription
> est rejetée en `422`.

---
