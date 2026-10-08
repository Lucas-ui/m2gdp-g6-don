/**
 * Objets des annonces de demonstration, par sous-categorie.
 *
 * Chaque entree donne une annonce : titre, description, etat et fourchette de
 * participation. La participation reste modeste — c'est une contribution a une
 * association, pas le prix de l'objet — et croit un peu avec l'encombrement de
 * l'objet. Aucune description ne contient d'adresse : elles sont publiques.
 */
export const CATALOGUE = {
  /* --- Mobilier ------------------------------------------------------------ */
  'mobilier-tables-bureaux': [
    { titre: 'Bureau bois clair 110 cm', etat: 'tres_bon_etat', participation: [3, 6],
      description: "Bureau en bois clair, 110 × 55 cm, avec un tiroir. Quelques traces d'usage sur le plateau, rien de gênant. Idéal pour un studio étudiant." },
    { titre: 'Table pliante 4 personnes', etat: 'bon_etat', participation: [2, 4],
      description: "Table pliante blanche, 80 × 80 cm, pieds en métal. Pratique pour un petit séjour ou un balcon. Se range à plat derrière une porte." },
    { titre: 'Bureau d\'angle avec étagère', etat: 'usage', participation: [2, 5],
      description: "Bureau d'angle en mélaminé gris avec une étagère haute. Un coin est un peu abîmé, mais il est stable. Démonté, notice et visserie fournies." },
  ],
  'mobilier-chaises-tabourets': [
    { titre: 'Lot de 4 chaises en bois', etat: 'bon_etat', participation: [4, 8],
      description: "Quatre chaises en hêtre, assises solides. Le vernis est un peu passé sur les dossiers. Je les donne ensemble de préférence." },
    { titre: 'Chaise de bureau grise', etat: 'tres_bon_etat', participation: [3, 5],
      description: "Chaise de bureau à roulettes, réglable en hauteur, tissu gris. Achetée il y a deux ans, très peu servie depuis que je travaille sur place." },
    { titre: 'Tabouret de bar noir', etat: 'bon_etat', participation: [1, 3],
      description: "Tabouret haut en métal noir, assise de 75 cm. Parfait pour un plan de travail ou un îlot de cuisine." },
  ],
  'mobilier-rangements-etageres': [
    { titre: 'Étagère bois 3 niveaux', etat: 'tres_bon_etat', participation: [2, 4],
      description: "Étagère en pin massif, trois niveaux, 80 × 30 × 90 cm. Structure parfaitement stable, démontable pour le transport, visserie fournie." },
    { titre: 'Bibliothèque blanche 5 cases', etat: 'bon_etat', participation: [3, 6],
      description: "Bibliothèque blanche à cinq cases, 180 cm de haut. Une tablette est légèrement marquée. À fixer au mur, les chevilles sont fournies." },
    { titre: 'Commode 3 tiroirs', etat: 'bon_etat', participation: [4, 8],
      description: "Commode en bois foncé, trois tiroirs qui coulissent bien. 80 cm de large. Je déménage dans un meublé et ne peux pas la garder." },
  ],
  'mobilier-lits-matelas': [
    { titre: 'Sommier 90 × 190 à lattes', etat: 'bon_etat', participation: [3, 6],
      description: "Sommier à lattes en bois pour lit une place, 90 × 190 cm. Aucune latte cassée. Pieds vissables fournis." },
    { titre: 'Lit mezzanine une place', etat: 'usage', participation: [5, 10],
      description: "Lit mezzanine en métal avec échelle, idéal pour gagner de la place sous le lit. Quelques éclats de peinture. Démonté, à transporter en voiture." },
  ],
  'mobilier-canapes-fauteuils': [
    { titre: 'Canapé 2 places gris', etat: 'bon_etat', participation: [8, 15],
      description: "Canapé deux places en tissu gris, 150 cm. Pas d'animaux, pas de fumeurs à la maison. Les coussins sont déhoussables. Prévoir deux personnes pour le porter." },
    { titre: 'Fauteuil en rotin', etat: 'tres_bon_etat', participation: [4, 8],
      description: "Fauteuil en rotin naturel avec son coussin écru. Léger, il se porte facilement. Joli dans une chambre ou sur un balcon couvert." },
  ],
  'mobilier-luminaires': [
    { titre: 'Lampadaire arc métal', etat: 'bon_etat', participation: [3, 6],
      description: "Lampadaire arc en métal brossé, 180 cm, ampoule E27 non fournie. Pied lourd et stable." },
    { titre: 'Suspension en papier blanc', etat: 'neuf', participation: [1, 2],
      description: "Suspension boule en papier de riz, 40 cm de diamètre. Jamais installée, encore dans son emballage." },
  ],

  /* --- Électroménager ------------------------------------------------------ */
  'electromenager-froid': [
    { titre: 'Réfrigérateur top 90 L', etat: 'bon_etat', participation: [10, 15],
      description: "Petit réfrigérateur table top, 90 litres, avec compartiment freezer. Fonctionne parfaitement, nettoyé et dégivré. Idéal en colocation ou en studio." },
    { titre: 'Mini-frigo de chambre', etat: 'tres_bon_etat', participation: [5, 10],
      description: "Mini-frigo de 45 litres, silencieux. Je l'utilisais en résidence étudiante. Câble d'alimentation fourni." },
  ],
  'electromenager-lavage': [
    { titre: 'Lave-linge 7 kg', etat: 'bon_etat', participation: [10, 15],
      description: "Lave-linge hublot 7 kg, classe énergétique A++. Il a six ans et tourne sans problème. Tuyaux fournis. Prévoir un diable et deux personnes." },
    { titre: 'Étendoir à linge pliant', etat: 'bon_etat', participation: [1, 2],
      description: "Étendoir à linge pliant, 18 mètres d'étendage. Une barre est un peu tordue mais il tient bien." },
  ],
  'electromenager-cuisson': [
    { titre: 'Micro-ondes 20 L', etat: 'tres_bon_etat', participation: [3, 6],
      description: "Micro-ondes 20 litres, 700 W, plateau tournant. Fonctionne très bien, je pars à l'étranger pour un an." },
    { titre: 'Mini-four 25 L', etat: 'bon_etat', participation: [4, 7],
      description: "Mini-four électrique 25 litres avec plaque et grille. Chauffe vite, parfait sans four encastré." },
    { titre: 'Plaque de cuisson induction', etat: 'tres_bon_etat', participation: [5, 8],
      description: "Plaque induction un feu, 2000 W. Idéale pour une petite cuisine. Fournie avec sa boîte." },
  ],
  'electromenager-petit-cuisine': [
    { titre: 'Blender 1,5 L', etat: 'tres_bon_etat', participation: [2, 4],
      description: "Blender avec bol en verre de 1,5 litre, deux vitesses et fonction pilage de glace. Lames en parfait état." },
    { titre: 'Robot pâtissier', etat: 'bon_etat', participation: [6, 10],
      description: "Robot pâtissier avec fouet, crochet et batteur. Le bol inox fait 4 litres. Il fait un peu de bruit mais fonctionne bien." },
  ],
  'electromenager-cafe': [
    { titre: 'Cafetière filtre programmable', etat: 'bon_etat', participation: [2, 3],
      description: "Cafetière filtre 12 tasses, programmable. Détartrée récemment. Verseuse sans éclat." },
    { titre: 'Bouilloire électrique inox', etat: 'tres_bon_etat', participation: [1, 2],
      description: "Bouilloire 1,7 litre en inox, arrêt automatique. Je l'ai remplacée par une bouilloire à température réglable." },
  ],
  'electromenager-chauffage': [
    { titre: 'Radiateur bain d\'huile', etat: 'bon_etat', participation: [4, 7],
      description: "Radiateur bain d'huile 2000 W, sept éléments, thermostat réglable. Très utile dans un logement mal chauffé." },
    { titre: 'Ventilateur sur pied', etat: 'tres_bon_etat', participation: [2, 4],
      description: "Ventilateur sur pied, trois vitesses, oscillation. Hauteur réglable jusqu'à 125 cm." },
  ],

  /* --- Cuisine et vaisselle ------------------------------------------------ */
  'cuisine-casseroles-poeles': [
    { titre: 'Lot de 3 casseroles inox', etat: 'bon_etat', participation: [2, 4],
      description: "Trois casseroles inox de 16, 18 et 20 cm, compatibles induction. Un couvercle pour la plus grande." },
    { titre: 'Poêle 28 cm antiadhésive', etat: 'tres_bon_etat', participation: [1, 2],
      description: "Poêle 28 cm, revêtement antiadhésif intact, tous feux dont induction." },
  ],
  'cuisine-vaisselle': [
    { titre: 'Lot de 6 assiettes + verres', etat: 'bon_etat', participation: [1, 2],
      description: "Six assiettes plates en verre bleuté et six verres assortis. Une assiette a un petit éclat sur le bord, je la laisse quand même." },
    { titre: 'Service de 12 assiettes blanches', etat: 'tres_bon_etat', participation: [2, 4],
      description: "Douze assiettes en porcelaine blanche : six plates, six creuses. Passent au lave-vaisselle et au micro-ondes." },
  ],
  'cuisine-verres-tasses': [
    { titre: 'Mugs dépareillés', etat: 'bon_etat', participation: [1, 1],
      description: "Huit mugs de toutes les couleurs, parfaits pour une colocation. Aucun ébréché." },
    { titre: 'Carafe et 4 verres', etat: 'neuf', participation: [1, 3],
      description: "Carafe en verre d'un litre et quatre verres assortis. Cadeau jamais utilisé." },
  ],
  'cuisine-ustensiles': [
    { titre: 'Lot d\'ustensiles de cuisine', etat: 'bon_etat', participation: [1, 2],
      description: "Spatule, louche, écumoire, fouet, économe et ouvre-boîte. De quoi équiper une première cuisine." },
    { titre: 'Couteaux de cuisine et bloc', etat: 'tres_bon_etat', participation: [2, 4],
      description: "Bloc de cinq couteaux avec un fusil à aiguiser. Lames encore bien affûtées." },
  ],
  'cuisine-patisserie': [
    { titre: 'Moules à gâteau en silicone', etat: 'tres_bon_etat', participation: [1, 2],
      description: "Moule à cake, moule à manqué et plaque à muffins en silicone. Démoulage facile." },
    { titre: 'Balance de cuisine électronique', etat: 'bon_etat', participation: [1, 2],
      description: "Balance électronique, précision 1 g, jusqu'à 5 kg. Pile neuve." },
  ],
  'cuisine-conservation': [
    { titre: 'Boîtes de conservation en verre', etat: 'tres_bon_etat', participation: [1, 3],
      description: "Huit boîtes en verre avec couvercles hermétiques, de 0,4 à 1,5 litre. Pratiques pour les repas à emporter." },
    { titre: 'Bocaux à vis', etat: 'bon_etat', participation: [1, 1],
      description: "Une quinzaine de bocaux en verre à couvercle vissé, toutes tailles. Pour le vrac ou les confitures." },
  ],

  /* --- Informatique et multimédia ------------------------------------------ */
  'informatique-ordinateurs': [
    { titre: 'Ordinateur portable 15 pouces', etat: 'bon_etat', participation: [10, 15],
      description: "Portable 15,6 pouces, 8 Go de mémoire, SSD 256 Go. Batterie qui tient environ 3 heures. Réinitialisé, chargeur fourni. Parfait pour la bureautique et les cours." },
    { titre: 'Unité centrale de bureau', etat: 'usage', participation: [5, 10],
      description: "Tour de bureau, 4 Go de mémoire, disque dur 500 Go. Lente mais fonctionnelle. Disque effacé, système à réinstaller." },
  ],
  'informatique-ecrans': [
    { titre: 'Écran 24 pouces Full HD', etat: 'tres_bon_etat', participation: [5, 10],
      description: "Écran 24 pouces Full HD, entrées HDMI et VGA, câble HDMI fourni. Aucun pixel mort." },
    { titre: 'Écran 22 pouces', etat: 'bon_etat', participation: [3, 6],
      description: "Écran 22 pouces, une légère rayure dans un coin, invisible allumé. Câble VGA fourni." },
  ],
  'informatique-claviers-souris': [
    { titre: 'Clavier et souris sans fil', etat: 'tres_bon_etat', participation: [2, 4],
      description: "Ensemble clavier AZERTY et souris sans fil avec leur récepteur USB. Piles neuves." },
    { titre: 'Support d\'ordinateur portable', etat: 'neuf', participation: [2, 3],
      description: "Support réglable en aluminium pour ordinateur portable, pour travailler l'écran à hauteur des yeux." },
  ],
  'informatique-telephones-tablettes': [
    { titre: 'Tablette 10 pouces', etat: 'bon_etat', participation: [8, 12],
      description: "Tablette 10 pouces, 32 Go, Wi-Fi. Écran sans rayure grâce à la protection. Chargeur fourni. Idéale pour lire ses cours." },
    { titre: 'Smartphone reconditionné', etat: 'bon_etat', participation: [8, 15],
      description: "Smartphone de 2021, 64 Go, débloqué tout opérateur. Batterie à 82 %. Réinitialisé, avec une coque." },
  ],
  'informatique-imprimantes': [
    { titre: 'Imprimante jet d\'encre multifonction', etat: 'bon_etat', participation: [4, 8],
      description: "Imprimante, scanner et copieur, Wi-Fi. Cartouches à moitié pleines. Pratique pour les dossiers administratifs." },
    { titre: 'Ramettes de papier A4', etat: 'neuf', participation: [1, 2],
      description: "Trois ramettes de 500 feuilles A4, 80 g, jamais ouvertes." },
  ],
  'informatique-audio': [
    { titre: 'Casque audio filaire', etat: 'tres_bon_etat', participation: [2, 4],
      description: "Casque circum-auriculaire filaire, très confortable pour les longues sessions de révision. Câble jack 3,5 mm." },
    { titre: 'Enceinte Bluetooth', etat: 'bon_etat', participation: [3, 5],
      description: "Enceinte Bluetooth portable, environ 8 heures d'autonomie. Câble de recharge fourni." },
  ],

  /* --- Matériel scolaire et étudiant --------------------------------------- */
  'scolaire-manuels': [
    { titre: 'Manuels de droit L1', etat: 'bon_etat', participation: [2, 5],
      description: "Droit constitutionnel, introduction au droit et histoire du droit, éditions de 2025. Quelques passages surlignés." },
    { titre: 'Livres de prépa maths', etat: 'bon_etat', participation: [3, 6],
      description: "Quatre livres de mathématiques de première année de prépa, avec exercices corrigés. Annotés au crayon." },
    { titre: 'Annales médecine PASS', etat: 'tres_bon_etat', participation: [2, 5],
      description: "Annales et QCM corrigés pour la première année de santé. Aucune réponse écrite dans les livres." },
  ],
  'scolaire-calculatrices': [
    { titre: 'Calculatrice graphique', etat: 'tres_bon_etat', participation: [5, 10],
      description: "Calculatrice graphique avec mode examen, câble USB et housse. Fonctionne parfaitement." },
    { titre: 'Calculatrice scientifique collège', etat: 'bon_etat', participation: [1, 3],
      description: "Calculatrice scientifique, idéale du collège au début de licence. Pile changée." },
  ],
  'scolaire-sacs': [
    { titre: 'Sac à dos ordinateur', etat: 'tres_bon_etat', participation: [2, 4],
      description: "Sac à dos avec compartiment rembourré pour ordinateur 15 pouces. Bretelles réglables, dos aéré." },
    { titre: 'Cartable enfant', etat: 'bon_etat', participation: [1, 3],
      description: "Cartable bleu pour l'école primaire, deux compartiments. Légères traces d'usure." },
  ],
  'scolaire-papeterie': [
    { titre: 'Lot de cahiers neufs', etat: 'neuf', participation: [1, 2],
      description: "Une dizaine de cahiers grands carreaux et petits carreaux, encore sous film." },
    { titre: 'Classeurs et intercalaires', etat: 'bon_etat', participation: [1, 1],
      description: "Six classeurs à levier avec leurs intercalaires. Parfaits pour ranger ses cours." },
  ],
  'scolaire-dessin': [
    { titre: 'Kit de dessin technique', etat: 'tres_bon_etat', participation: [2, 4],
      description: "Équerres, règles, compas et critérium dans leur trousse. Utilisé une année en école d'architecture." },
    { titre: 'Boîte de peinture acrylique', etat: 'bon_etat', participation: [2, 3],
      description: "Vingt-quatre tubes de peinture acrylique, la plupart presque pleins, avec cinq pinceaux." },
  ],
  'scolaire-laboratoire': [
    { titre: 'Blouse blanche de TP', etat: 'tres_bon_etat', participation: [1, 2],
      description: "Blouse en coton, taille M, portée quelques séances de travaux pratiques. Lavée." },
    { titre: 'Lunettes de protection', etat: 'neuf', participation: [1, 1],
      description: "Deux paires de lunettes de protection pour les TP de chimie, jamais portées." },
  ],

  /* --- Livres, musique et jeux --------------------------------------------- */
  'culture-romans': [
    { titre: 'Lot de 10 romans poche', etat: 'bon_etat', participation: [1, 3],
      description: "Dix romans en format poche, classiques et contemporains. Je vide ma bibliothèque avant un déménagement." },
    { titre: 'Saga fantasy en 5 tomes', etat: 'tres_bon_etat', participation: [3, 5],
      description: "Les cinq tomes d'une saga de fantasy, grand format. Lus une seule fois." },
  ],
  'culture-bd-mangas': [
    { titre: 'Mangas tomes 1 à 12', etat: 'bon_etat', participation: [3, 6],
      description: "Les douze premiers tomes d'une série de mangas d'aventure. Bon état général, couvertures un peu frottées." },
    { titre: 'Albums de BD jeunesse', etat: 'bon_etat', participation: [2, 4],
      description: "Huit albums de bande dessinée pour les 8–12 ans. Aucune page déchirée." },
  ],
  'culture-jeux-societe': [
    { titre: 'Jeu de société coopératif', etat: 'tres_bon_etat', participation: [2, 4],
      description: "Jeu coopératif pour 2 à 4 joueurs, complet, règles en français. Joué trois fois." },
    { titre: 'Lot de jeux de cartes', etat: 'bon_etat', participation: [1, 2],
      description: "Quatre jeux de cartes et d'ambiance, parfaits pour les soirées en colocation. Tous complets." },
  ],
  'culture-instruments': [
    { titre: 'Guitare classique', etat: 'bon_etat', participation: [8, 15],
      description: "Guitare classique taille adulte avec sa housse. Cordes changées il y a un mois. Idéale pour débuter." },
    { titre: 'Clavier électronique 61 touches', etat: 'bon_etat', participation: [6, 12],
      description: "Clavier 61 touches avec rythmes intégrés, alimentation et pupitre fournis." },
  ],
  'culture-cd-dvd-vinyles': [
    { titre: 'Lot de DVD de films', etat: 'bon_etat', participation: [1, 3],
      description: "Une vingtaine de DVD, comédies et films d'animation. Boîtiers parfois fendus, disques en bon état." },
    { titre: 'Vinyles de chanson française', etat: 'usage', participation: [2, 5],
      description: "Une quinzaine de 33 tours de chanson française des années 70. Pochettes usées, quelques craquements." },
  ],
  'culture-jeux-video': [
    { titre: 'Console de salon et 2 manettes', etat: 'bon_etat', participation: [10, 15],
      description: "Console de la génération précédente avec deux manettes et trois jeux. Fonctionne parfaitement." },
    { titre: 'Jeux vidéo pour console portable', etat: 'tres_bon_etat', participation: [2, 5],
      description: "Cinq jeux en boîte pour console portable, tous complets." },
  ],

  /* --- Vêtements et accessoires -------------------------------------------- */
  'vetements-femme': [
    { titre: 'Lot de pulls femme taille M', etat: 'tres_bon_etat', participation: [2, 4],
      description: "Quatre pulls en maille, taille M, couleurs neutres. Lavés et pliés." },
    { titre: 'Robe d\'hiver taille 38', etat: 'neuf', participation: [2, 3],
      description: "Robe en maille côtelée bordeaux, taille 38, jamais portée, étiquette encore attachée." },
  ],
  'vetements-homme': [
    { titre: 'Chemises homme taille L', etat: 'bon_etat', participation: [2, 4],
      description: "Cinq chemises taille L, coton, pour les entretiens ou le travail. Repassées." },
    { titre: 'Costume gris taille 48', etat: 'tres_bon_etat', participation: [5, 8],
      description: "Costume gris anthracite, veste et pantalon, taille 48. Porté deux fois." },
  ],
  'vetements-manteaux': [
    { titre: 'Doudoune femme taille S', etat: 'tres_bon_etat', participation: [3, 6],
      description: "Doudoune noire à capuche, taille S, très chaude. Fermeture éclair en parfait état." },
    { titre: 'Parka homme taille M', etat: 'bon_etat', participation: [3, 6],
      description: "Parka kaki doublée, taille M. Un bouton manque à la poche, sinon impeccable." },
  ],
  'vetements-chaussures': [
    { titre: 'Chaussures de randonnée 42', etat: 'bon_etat', participation: [3, 6],
      description: "Chaussures de randonnée montantes, pointure 42, imperméables. Semelles encore bien crantées." },
    { titre: 'Bottes de pluie 38', etat: 'tres_bon_etat', participation: [1, 3],
      description: "Bottes de pluie vert sapin, pointure 38. Portées un hiver." },
  ],
  'vetements-sacs': [
    { titre: 'Valise cabine 4 roues', etat: 'bon_etat', participation: [4, 8],
      description: "Valise cabine rigide, quatre roues, cadenas à code. Quelques rayures sur la coque." },
    { titre: 'Sac de voyage en toile', etat: 'tres_bon_etat', participation: [2, 4],
      description: "Grand sac de voyage en toile avec bandoulière, 50 litres. Parfait pour les week-ends." },
  ],
  'vetements-accessoires': [
    { titre: 'Écharpes et bonnets', etat: 'bon_etat', participation: [1, 2],
      description: "Trois écharpes et deux bonnets en laine. Lavés à la main." },
    { titre: 'Montre à aiguilles', etat: 'bon_etat', participation: [2, 4],
      description: "Montre à aiguilles, bracelet cuir marron. Pile changée récemment." },
  ],

  /* --- Enfance et puériculture --------------------------------------------- */
  'enfance-poussettes': [
    { titre: 'Poussette canne pliable', etat: 'bon_etat', participation: [4, 8],
      description: "Poussette canne légère, pliage en un geste, avec habillage pluie. Roues en bon état." },
    { titre: 'Poussette trois roues', etat: 'usage', participation: [5, 10],
      description: "Poussette tout-terrain trois roues. Le tissu est passé, mais les freins et le pliage fonctionnent parfaitement." },
  ],
  'enfance-sieges-auto': [
    { titre: 'Siège auto groupe 1', etat: 'bon_etat', participation: [5, 8],
      description: "Siège auto de 9 à 18 kg, fixation par ceinture. Jamais accidenté, housse lavée." },
    { titre: 'Rehausseur avec dossier', etat: 'tres_bon_etat', participation: [3, 5],
      description: "Rehausseur avec dossier réglable, de 15 à 36 kg. Très peu servi." },
  ],
  'enfance-lits-parcs': [
    { titre: 'Lit parapluie avec matelas', etat: 'bon_etat', participation: [4, 8],
      description: "Lit parapluie pliant avec son matelas et son sac de transport. Pratique en déplacement." },
    { titre: 'Parc bébé en bois', etat: 'bon_etat', participation: [5, 10],
      description: "Parc en bois naturel, fond réglable en hauteur, 100 × 100 cm." },
  ],
  'enfance-jouets': [
    { titre: 'Caisse de briques de construction', etat: 'bon_etat', participation: [3, 6],
      description: "Environ deux kilos de briques de construction en vrac, avec quelques personnages. Lavées." },
    { titre: 'Cuisine en bois pour enfant', etat: 'bon_etat', participation: [5, 10],
      description: "Cuisine de jeu en bois avec plaques, évier et ustensiles. Quelques marques de feutre." },
  ],
  'enfance-vetements': [
    { titre: 'Lot vêtements bébé 6 mois', etat: 'tres_bon_etat', participation: [2, 4],
      description: "Une vingtaine de pièces taille 6 mois : bodies, pyjamas, gilets. Lavées avec une lessive douce." },
    { titre: 'Manteau enfant 4 ans', etat: 'bon_etat', participation: [1, 3],
      description: "Manteau d'hiver à capuche, taille 4 ans, bleu marine." },
  ],
  'enfance-eveil': [
    { titre: 'Tapis d\'éveil', etat: 'bon_etat', participation: [2, 4],
      description: "Tapis d'éveil avec arche et jouets suspendus. Lavable en machine." },
    { titre: 'Livres pour tout-petits', etat: 'bon_etat', participation: [1, 2],
      description: "Une douzaine de livres cartonnés pour les 1–3 ans. Coins un peu mâchouillés." },
  ],

  /* --- Sport et loisirs ---------------------------------------------------- */
  'sport-velos': [
    { titre: 'Vélo de ville bleu', etat: 'bon_etat', participation: [10, 15],
      description: "Vélo de ville taille M, trois vitesses, panier avant et éclairage. Pneus regonflés, freins réglés." },
    { titre: 'Vélo enfant 16 pouces', etat: 'bon_etat', participation: [4, 7],
      description: "Vélo enfant 16 pouces avec petites roues amovibles, pour 4 à 6 ans." },
  ],
  'sport-glisse': [
    { titre: 'Trottinette pliable adulte', etat: 'bon_etat', participation: [4, 8],
      description: "Trottinette pliable non électrique, grandes roues, guidon réglable. Idéale pour aller au campus." },
    { titre: 'Rollers pointure 40', etat: 'tres_bon_etat', participation: [3, 6],
      description: "Rollers en ligne, pointure 40, avec genouillères et protège-poignets." },
  ],
  'sport-fitness': [
    { titre: 'Haltères et barre', etat: 'bon_etat', participation: [4, 8],
      description: "Deux haltères courts et une barre avec 20 kg de disques en fonte. Lourd, prévoir un sac solide." },
    { titre: 'Tapis de yoga', etat: 'tres_bon_etat', participation: [1, 3],
      description: "Tapis de yoga antidérapant, 6 mm d'épaisseur, avec sa sangle de transport." },
  ],
  'sport-camping': [
    { titre: 'Tente 2 places', etat: 'bon_etat', participation: [4, 8],
      description: "Tente igloo deux places, montage rapide, avec piquets et sac. Étanche, testée cet été." },
    { titre: 'Sac à dos de randonnée 40 L', etat: 'tres_bon_etat', participation: [3, 6],
      description: "Sac à dos de randonnée de 40 litres, dos réglable, housse de pluie intégrée." },
  ],
  'sport-collectifs': [
    { titre: 'Raquettes de badminton', etat: 'bon_etat', participation: [1, 3],
      description: "Quatre raquettes de badminton avec un tube de volants. Parfait pour le parc." },
    { titre: 'Ballon de basket et pompe', etat: 'bon_etat', participation: [1, 2],
      description: "Ballon de basket taille 7, bien gonflé, avec sa pompe à main." },
  ],
  'sport-hiver': [
    { titre: 'Combinaison de ski 10 ans', etat: 'bon_etat', participation: [3, 5],
      description: "Combinaison de ski taille 10 ans, chaude et imperméable. Portée deux saisons." },
    { titre: 'Luge en plastique', etat: 'bon_etat', participation: [1, 2],
      description: "Luge en plastique rouge avec frein à main. Pour les sorties neige en famille." },
  ],

  /* --- Maison et décoration ------------------------------------------------ */
  'maison-linge': [
    { titre: 'Housse de couette 140 × 200', etat: 'tres_bon_etat', participation: [1, 3],
      description: "Housse de couette en coton et deux taies assorties, motif géométrique. Lavées." },
    { titre: 'Lot de serviettes de bain', etat: 'bon_etat', participation: [1, 2],
      description: "Quatre serviettes et deux draps de bain en éponge. Un peu délavés mais très absorbants." },
  ],
  'maison-rideaux-stores': [
    { titre: 'Paire de rideaux occultants', etat: 'tres_bon_etat', participation: [2, 4],
      description: "Deux rideaux occultants gris, 140 × 260 cm, à œillets. Parfaits pour une chambre côté rue." },
    { titre: 'Store enrouleur blanc', etat: 'neuf', participation: [1, 2],
      description: "Store enrouleur tamisant, 90 cm de large, encore emballé. Visserie fournie." },
  ],
  'maison-cadres-miroirs': [
    { titre: 'Grand miroir sur pied', etat: 'bon_etat', participation: [3, 6],
      description: "Miroir sur pied, 160 × 40 cm, cadre en bois clair. Aucune tache sur la glace." },
    { titre: 'Lot de cadres photo', etat: 'bon_etat', participation: [1, 2],
      description: "Six cadres photo noirs, de 10 × 15 à 30 × 40 cm, pour composer un mur." },
  ],
  'maison-plantes': [
    { titre: 'Monstera en pot', etat: 'tres_bon_etat', participation: [2, 5],
      description: "Monstera de 80 cm en pleine forme, avec son cache-pot. Je pars et ne peux pas l'emmener." },
    { titre: 'Boutures de pothos', etat: 'neuf', participation: [1, 1],
      description: "Trois boutures de pothos déjà racinées, dans des petits pots. Plante très facile à vivre." },
  ],
  'maison-lampes': [
    { titre: 'Lampe de bureau LED', etat: 'tres_bon_etat', participation: [2, 3],
      description: "Lampe de bureau LED à bras articulé, trois intensités, port USB pour recharger son téléphone." },
    { titre: 'Lampe de chevet en céramique', etat: 'bon_etat', participation: [1, 3],
      description: "Lampe de chevet avec pied en céramique blanche et abat-jour en lin." },
  ],
  'maison-salle-de-bain': [
    { titre: 'Meuble de salle de bain colonne', etat: 'bon_etat', participation: [3, 6],
      description: "Colonne de rangement blanche, quatre étagères derrière une porte. 170 cm de haut." },
    { titre: 'Sèche-cheveux', etat: 'tres_bon_etat', participation: [1, 3],
      description: "Sèche-cheveux 2000 W avec embout concentrateur. Fonctionne parfaitement." },
  ],

  /* --- Bricolage et jardin ------------------------------------------------- */
  'bricolage-outillage-main': [
    { titre: 'Caisse à outils garnie', etat: 'bon_etat', participation: [4, 8],
      description: "Caisse à outils avec marteau, tournevis, pinces, mètre et clés plates. De quoi monter ses meubles." },
    { titre: 'Jeu de tournevis', etat: 'tres_bon_etat', participation: [1, 2],
      description: "Douze tournevis plats et cruciformes dans leur support mural." },
  ],
  'bricolage-outillage-electrique': [
    { titre: 'Perceuse visseuse sans fil', etat: 'bon_etat', participation: [5, 10],
      description: "Perceuse visseuse 18 V avec deux batteries, chargeur et coffret de forets." },
    { titre: 'Ponceuse vibrante', etat: 'bon_etat', participation: [3, 6],
      description: "Ponceuse vibrante avec une dizaine de feuilles abrasives. Idéale pour rénover un meuble." },
  ],
  'bricolage-quincaillerie': [
    { titre: 'Boîte de vis et chevilles', etat: 'neuf', participation: [1, 2],
      description: "Coffret de vis, chevilles et crochets assortis, rangés par taille. Presque plein." },
    { titre: 'Rallonges électriques', etat: 'bon_etat', participation: [1, 2],
      description: "Deux rallonges de 5 mètres et une multiprise à interrupteur." },
  ],
  'bricolage-peinture': [
    { titre: 'Pots de peinture blanche', etat: 'bon_etat', participation: [2, 4],
      description: "Deux pots de 2,5 litres de peinture blanche mate pour murs, entamés au quart." },
    { titre: 'Kit rouleaux et bâches', etat: 'tres_bon_etat', participation: [1, 2],
      description: "Rouleaux, bac, pinceaux et bâches de protection, lavés après un seul chantier." },
  ],
  'bricolage-jardinage': [
    { titre: 'Outils de jardin', etat: 'bon_etat', participation: [2, 4],
      description: "Bêche, râteau, binette et transplantoir. Manches en bois solides." },
    { titre: 'Jardinière de balcon', etat: 'tres_bon_etat', participation: [1, 2],
      description: "Trois jardinières de 60 cm avec leurs soucoupes, pour un balcon fleuri." },
  ],
  'bricolage-rangement': [
    { titre: 'Établi pliant', etat: 'bon_etat', participation: [4, 7],
      description: "Établi pliant avec étau intégré, se range contre un mur." },
    { titre: 'Boîtes de rangement plastique', etat: 'bon_etat', participation: [1, 2],
      description: "Six boîtes transparentes empilables de 30 litres avec couvercles. Parfaites pour une cave." },
  ],

  /* --- Animaux ------------------------------------------------------------- */
  'animaux-chiens': [
    { titre: 'Laisse et harnais chien moyen', etat: 'tres_bon_etat', participation: [1, 3],
      description: "Harnais réglable taille M et laisse de 2 mètres. Notre chien a grandi plus que prévu." },
    { titre: 'Caisse de transport chien', etat: 'bon_etat', participation: [4, 7],
      description: "Caisse de transport en plastique pour chien de taille moyenne, porte métallique." },
  ],
  'animaux-chats': [
    { titre: 'Arbre à chat 120 cm', etat: 'bon_etat', participation: [3, 6],
      description: "Arbre à chat de 120 cm avec griffoir, niche et plateforme. Quelques griffures, évidemment." },
    { titre: 'Bac à litière couvert', etat: 'tres_bon_etat', participation: [1, 3],
      description: "Bac à litière couvert avec filtre et pelle. Nettoyé et désinfecté." },
  ],
  'animaux-rongeurs': [
    { titre: 'Cage pour lapin', etat: 'bon_etat', participation: [3, 6],
      description: "Cage de 100 cm avec mangeoire, biberon et maisonnette en bois." },
    { titre: 'Cage hamster avec roue', etat: 'bon_etat', participation: [2, 4],
      description: "Cage pour hamster sur deux étages, avec roue silencieuse et tunnel." },
  ],
  'animaux-aquariums': [
    { titre: 'Aquarium 60 L équipé', etat: 'bon_etat', participation: [5, 10],
      description: "Aquarium de 60 litres avec filtre, chauffage et éclairage LED. Vidé et nettoyé." },
    { titre: 'Petit aquarium 20 L', etat: 'tres_bon_etat', participation: [2, 4],
      description: "Aquarium de 20 litres avec couvercle et filtre, pour crevettes ou un poisson combattant." },
  ],
  'animaux-oiseaux': [
    { titre: 'Cage à oiseaux', etat: 'bon_etat', participation: [2, 5],
      description: "Cage pour canaris ou perruches, 60 cm, avec perchoirs et mangeoires." },
    { titre: 'Mangeoires de balcon', etat: 'neuf', participation: [1, 1],
      description: "Deux mangeoires à suspendre pour les mésanges, jamais installées." },
  ],
  'animaux-couchage': [
    { titre: 'Panier pour chien', etat: 'bon_etat', participation: [1, 3],
      description: "Panier ovale 70 cm avec coussin déhoussable, lavé." },
    { titre: 'Coussin pour chat', etat: 'tres_bon_etat', participation: [1, 2],
      description: "Coussin moelleux rond de 50 cm, très apprécié des chats frileux." },
  ],
};
