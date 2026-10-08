/**
 * Outils communs aux tests.
 *
 * Connexion : le lien magique passe par une boite mail, inutilisable dans un
 * test. On signe donc un jeton personnalise Firebase avec la cle de service, et
 * le front le consomme par un crochet present en developpement seulement
 * (window.__doneoTest, voir public/src/lib/auth.js).
 */
import { createSign } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect } from '@playwright/test';

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

function cleDeService() {
  const chemin =
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    path.join(RACINE, readdirSync(RACINE).find((f) => /-adminsdk-.*\.json$/.test(f)) || '');
  return JSON.parse(readFileSync(chemin, 'utf8'));
}

const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');

/** Jeton personnalise Firebase pour l'identifiant donne. */
export function jetonPersonnalise(uid) {
  const cle = cleDeService();
  const maintenant = Math.floor(Date.now() / 1000);
  const corps = `${b64({ alg: 'RS256', typ: 'JWT' })}.${b64({
    iss: cle.client_email,
    sub: cle.client_email,
    aud: 'https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit',
    iat: maintenant,
    exp: maintenant + 3600,
    uid,
  })}`;
  return `${corps}.${createSign('RSA-SHA256').update(corps).sign(cle.private_key, 'base64url')}`;
}

/**
 * Profils de demonstration utilises par les tests (specs/donnees/demo) :
 * ils existent en base, mais personne ne peut s'y connecter autrement.
 */
export const PROFILS = {
  offrantEtDemandeur: 'demo-u-005', // Bastien, 8 annonces
  demandeurSeul: 'demo-u-001', // Fatou, aucune annonce
};

/** Ouvre l'app connecte sous ce profil, sur le chemin demande. */
export async function ouvrirConnecte(page, uid, chemin = '/') {
  await page.goto('/');
  await page.waitForFunction(() => window.__doneoTest);
  await page.evaluate((jeton) => window.__doneoTest.connecter(jeton), jetonPersonnalise(uid));
  await expect(page.getByRole('navigation', { name: 'Navigation principale' })).toBeVisible();
  if (chemin !== '/') {
    // Navigation interne, sans recharger : la session reste chargee.
    await page.evaluate((c) => {
      window.history.pushState({}, '', c);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }, chemin);
  }
}

/** Aucune barre de defilement horizontale (critere « affichage sur mobile »). */
export async function attendrePasDeDefilementHorizontal(page) {
  const debord = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(debord).toBeLessThanOrEqual(0);
}
