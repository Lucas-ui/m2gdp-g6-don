// Configuration Firebase cote client (app web « doneo »).
//
// Ces valeurs sont PUBLIQUES par conception : elles sont livrees dans le bundle
// navigateur. La securite repose sur les regles Firestore / Realtime Database
// et sur les restrictions de la cle API, jamais sur le secret de ces valeurs.
// La service account key (acces admin) ne doit JAMAIS apparaitre ici : elle vit
// dans les secrets du Worker Cloudflare.
export const firebaseConfig = {
  apiKey: 'AIzaSyB1ytKre2fhGKDnkUNHeudFxsTeQrEWm6g',
  authDomain: 'doneo-3561b.firebaseapp.com',
  projectId: 'doneo-3561b',
  storageBucket: 'doneo-3561b.firebasestorage.app',
  messagingSenderId: '544412739021',
  appId: '1:544412739021:web:a3d850d11354ccc6b91084',
  measurementId: 'G-7R1MW55Z09',
  // Pas de databaseURL : la Realtime Database n'est pas creee sur ce projet.
  // Le front ne s'en sert pas — seul le script de verification d'infra la
  // sollicitait. A rajouter ici le jour ou elle est provisionnee.
};

/** URL du backend Cloudflare Workers. */
export const API_BASE = 'https://doneo-api.guillaume-lorel.workers.dev';
