/**
 * US-16 (issue #44) — Basculer entre la vue liste et la vue carte.
 * L'issue est en Draft : les scenarios suivent le comportement retenu.
 */
import { expect, test } from '@playwright/test';
import { PROFILS, attendrePasDeDefilementHorizontal, ouvrirConnecte } from './outils.js';

// Les tuiles de la carte viennent d'OpenStreetMap : on les remplace par une
// image vide, pour ne pas solliciter leurs serveurs a chaque test.
test.beforeEach(async ({ page }) => {
  await page.route('https://tile.openstreetmap.org/**', (route) =>
    route.fulfill({ status: 200, contentType: 'image/png', body: Buffer.alloc(0) }),
  );
});

const epingles = (page) => page.locator('.leaflet-marker-icon');

test('Basculer de la liste à la carte, puis revenir', async ({ page }) => {
  await ouvrirConnecte(page, PROFILS.demandeurSeul, '/recherche');
  await expect(page.getByRole('button', { name: 'Liste' })).toHaveAttribute('aria-pressed', 'true');

  await page.getByRole('button', { name: 'Carte' }).click();
  await expect(page.getByRole('region', { name: 'Carte des objets' })).toBeVisible();
  await expect(epingles(page).first()).toBeVisible();
  await expect(page).toHaveURL(/vue=carte/);

  await page.getByRole('button', { name: 'Liste' }).click();
  await expect(page.getByRole('region', { name: 'Carte des objets' })).toHaveCount(0);
  await expect(page.getByRole('main').getByRole('listitem').first()).toBeVisible();
});

test('Les filtres s’appliquent aussi à la carte', async ({ page }) => {
  const reponse = page.waitForResponse((r) => r.url().includes('/api/annonces?') && r.url().includes('categorieId=animaux'));
  await ouvrirConnecte(page, PROFILS.demandeurSeul, '/recherche?vue=carte&categorieId=animaux');
  const { annonces } = await (await reponse).json();
  await expect(epingles(page)).toHaveCount(annonces.length);
});

test('Toucher une épingle ouvre un aperçu, puis la fiche', async ({ page }) => {
  await ouvrirConnecte(page, PROFILS.demandeurSeul, '/recherche?vue=carte&categorieId=mobilier');
  const epingle = epingles(page).last();
  const titre = await epingle.getAttribute('title');
  await epingle.click();
  await expect(page.getByText(titre).last()).toBeVisible();
  await page.getByRole('link', { name: 'Voir l’annonce' }).click();
  await expect(page.getByRole('heading', { level: 1, name: titre })).toBeVisible();

  // Au retour, on retrouve la carte.
  await page.getByRole('button', { name: 'Retour' }).click();
  await expect(page.getByRole('region', { name: 'Carte des objets' })).toBeVisible();
});

test('Seules les positions approchées sont utilisées', async ({ page }) => {
  const reponse = page.waitForResponse((r) => r.url().includes('/api/annonces?') && r.url().includes('parPage=50'));
  await ouvrirConnecte(page, PROFILS.demandeurSeul, '/recherche?vue=carte');
  const texte = await (await reponse).text();
  expect(texte).not.toContain('"latitude"');
  expect(texte).not.toContain('"longitude"');
  expect(texte).toContain('latitudeApprochee');
});

test('Affichage sur mobile', async ({ page }) => {
  await ouvrirConnecte(page, PROFILS.demandeurSeul, '/recherche?vue=carte');
  await expect(epingles(page).first()).toBeVisible();
  await attendrePasDeDefilementHorizontal(page);
  // La carte s'arrete au-dessus du menu du bas.
  const carte = await page.getByRole('region', { name: 'Carte des objets' }).boundingBox();
  const menu = await page.getByRole('navigation', { name: 'Navigation principale' }).boundingBox();
  expect(carte.y + carte.height).toBeLessThanOrEqual(menu.y + 1);
});
