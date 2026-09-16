# Instructions IA — Donéo

Ce fichier guide les agents IA (IDE, Copilot, etc.) qui travaillent sur ce dépôt.

## Contexte projet

**Donéo** — plateforme de **don caritatif via la vente d'objets**. Trois
acteurs :

- **Donateur** : cède un objet, **fixe un prix** et **choisit une association**
  dans une liste. Définit un créneau de retrait. Il ne touche pas l'argent —
  c'est ce qui fait de la vente un don.
- **Bénéficiaire** : paie le prix et repart avec **l'objet** ; il vient le
  récupérer sur place.
- **Association** : reçoit **l'argent** versé par le bénéficiaire.

Les rôles `donateur` et `beneficiaire` sont **cumulables** sur un même compte.

Spécificités métier :

- Le **prix est fixé par le donateur** (obligatoire) et **versé à l'association**
  choisie. Pas d'enchère, pas d'offre montante : prix fixe.
- Le donateur définit un **créneau ponctuel** (tranche horaire de disponibilité
  pour le retrait).
- **Adresse à deux niveaux** : le bénéficiaire voit un **lieu approximatif**
  (code postal, ville) et le créneau avant paiement ; l'**adresse exacte n'est
  révélée qu'après paiement**.
- Le **paiement passe par un vrai prestataire, en mode test uniquement**. Il est
  réellement validé (tunnel, confirmation, référence de transaction), mais le
  **montant affiché est le vrai prix tandis que le montant débité est 0** :
  aucune transaction réelle, aucun reversement réel à l'association. C'est le
  passage à `statutPaiement = paye` qui débloque l'adresse exacte.

## Périmètre d'évaluation

- ✅ Évalué : engagement (roadmap réalisée), ergonomie (navigation claire,
  responsive, mobile-first), fonctionnel (scénario nominal + cas à la marge),
  réalisme des données (90+ annonces, 30+ profils, 10+ conversations, 10+
  acquisitions).
- ❌ Non évalué : architecture et qualité du code, sécurité, infra, performance.
  Le back est délégué à des services auto-gérés (Firebase, Cloudflare).

> Ne pas travailler sur ce qui n'est pas demandé.

## Conventions

- Frontend **mobile-first**, en **Tailwind CSS v4 + shadcn/ui** (et non Material
  Design : arbitrage acté le 16/09/2026).
- Données fictives **variées et réalistes**, vocabulaire français sans faute.
- Le backend (Workers) délègue aux services auto-gérés ; les secrets Firebase
  restent dans le Worker, jamais exposés côté public.
- Front public déployé via Firebase Hosting ; Workers déployés via
  `wrangler deploy`.

## Ce que l'IA ne doit pas faire

- Ne jamais committer de secrets (service account key Firebase, tokens
  Cloudflare, `.env`). Voir `.gitignore`.
- Ne pas gérer les problèmes de production (volumétrie, scalabilité).
- Ne **jamais** exposer `numeroRue`, `rue` ni `complementAdresse` sur une route
  publique : ces trois champs forment l'adresse exacte, révélée seulement après
  paiement. Filtrer par liste blanche (ne laisser sortir que les champs
  explicitement publics), jamais par liste noire.
- **Nommer tous les champs en français**, y compris les clés étrangères
  (`donateurId`, `associationId`, `beneficiaireId`) et les valeurs
  d'énumération. Pas de `title`, `price` ni `createdAt`.
