/**
 * US-12 (issue #40) — Illustrer une annonce sans photo par l'image de sa
 * categorie. L'issue est encore en Draft : les scenarios suivent le
 * fonctionnement retenu (sous-categorie, puis categorie, puis fond neutre).
 */
import { expect, test } from '@playwright/test';
import { PROFILS, ouvrirConnecte } from './outils.js';

const annonce = (surcharge) => ({
  id: 'test-1',
  titre: 'Objet de test',
  participation: 2,
  etat: 'bon_etat',
  statut: 'disponible',
  codePostal: '69007',
  ville: 'Lyon',
  quartier: 'Lyon 7e',
  medias: [],
  offrant: { id: 'x', prenom: 'Léa', initialeNom: 'R.' },
  association: { id: 'a', nom: 'Envie Rhône' },
  ...surcharge,
});

const servir = (page, annonces) =>
  page.route('**/api/annonces?*', (route) =>
    route.fulfill({ json: { annonces, total: annonces.length, page: 1, parPage: 10 } }),
  );

test('Annonce sans photo : illustration de sa catégorie', async ({ page }) => {
  await ouvrirConnecte(page, PROFILS.demandeurSeul);
  // Donnees reelles : aucune annonce de demonstration n'a de photo.
  const illustration = page.locator('img[data-illustration="categorie"]').first();
  await expect(illustration).toBeVisible();
  await expect(illustration).toHaveAttribute('src', /^\/illustrations\/categories\/.+\.svg$/);
  // L'image est bien servie, pas un lien casse.
  expect(await illustration.evaluate((img) => img.naturalWidth)).toBeGreaterThan(0);
});

test('Une photo, quand il y en a une, passe avant l’illustration', async ({ page }) => {
  await servir(page, [
    annonce({
      illustrationUrl: '/illustrations/categories/mobilier.svg',
      medias: [{ id: 'm', type: 'photo', url: '/icone-192.png' }],
    }),
  ]);
  await ouvrirConnecte(page, PROFILS.demandeurSeul);
  await expect(page.locator('main img[src="/icone-192.png"]')).toBeVisible();
  await expect(page.locator('img[data-illustration="categorie"]')).toHaveCount(0);
});

test('Catégorie sans illustration : fond neutre, sans image cassée', async ({ page }) => {
  await servir(page, [annonce({ illustrationUrl: undefined })]);
  await ouvrirConnecte(page, PROFILS.demandeurSeul);
  const carte = page.getByRole('link', { name: /Objet de test/ });
  await expect(carte).toBeVisible();
  await expect(carte.locator('img')).toHaveCount(0);
});
