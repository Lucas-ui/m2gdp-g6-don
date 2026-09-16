# Pré-J3 DEV — Donéo

## Livrables attendus

Le Pré-J3 DEV demande deux artefacts pour le scénario minimal :

- [Modèle de données](data-model.md) : entités, attributs, relations et règles
  de visibilité de l'adresse ;
- [Spécification OpenAPI](openapi.yaml) : routes, corps de requête, réponses,
  authentification et cas d'erreur.

## Scénario minimal

| Étape                  | Acteur                      | Résultat attendu                                                  |
| ---------------------- | --------------------------- | ----------------------------------------------------------------- |
| 1. Créer son profil    | Donateur et/ou bénéficiaire | Compte identifié, rôles cumulables                                |
| 2. Publier une annonce | Donateur                    | Objet, participation, association, créneau et adresse enregistrés |
| 3. Rechercher          | Bénéficiaire                | Annonces filtrables par texte, ville ou code postal               |
| 4. Consulter           | Bénéficiaire                | Participation, créneau et lieu approximatif visibles              |
| 5. Contacter           | Bénéficiaire                | Conversation liée à l'annonce                                     |
| 6. Réserver            | Bénéficiaire                | Paiement validé en mode test et réservation confirmée             |
| 7. Retirer             | Donateur et bénéficiaire    | Adresse exacte révélée uniquement après validation                |

## Règles structurantes

- La participation est fixée par le donateur et revient à l'association choisie.
- Le donateur ne reçoit pas l'argent ; il remet l'objet au bénéficiaire.
- `codePostal` et `ville` sont publics avant paiement.
- `numeroRue`, `rue` et `complementAdresse` sont privés et ne sortent qu'après
  une réservation payée.
- Le paiement est démontré en environnement de test :
  `participationDemandee` est affichée, `montantDebite` vaut `0`.
- Les fonctions favorites, distance, calendrier, avis, fichiers et
  notifications restent hors du périmètre minimal Pré-J3.

## Correspondance avec les slides

- **Plan from Code** : le parcours ci-dessus définit le Happy Path et les cas
  limites principaux (`401`, `404`, `409`, `422`).
- **Data as Code** : le modèle Mermaid décrit les objets et cardinalités.
- **Test as Code** : chaque route principale possède un contrat de réponse
  permettant de préparer les tests du parcours nominal et des erreurs.
- **Architecture** : le front appelle le Worker ; le Worker vérifie le jeton et
  accède aux services Firebase/Cloudflare.
