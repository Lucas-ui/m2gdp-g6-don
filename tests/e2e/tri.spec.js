/**
 * US-15 (issue #43) — Trier les annonces par date, participation ou creneau.
 * L'issue est en Draft : les scenarios suivent le comportement retenu.
 */
import { expect, test } from '@playwright/test';
import { PROFILS, ouvrirConnecte } from './outils.js';

const selecteur = (page) => page.getByRole('combobox', { name: 'Trier' });

/**
 * Choisit un tri et renvoie les annonces de LA reponse correspondante. On
 * attend cette reponse precise : en developpement, React monte l'ecran deux
 * fois, et une requete initiale peut arriver apres celle du tri.
 */
async function trierPar(page, libelle, valeur) {
  const reponse = page.waitForResponse((r) => r.url().includes('/api/annonces?') && r.url().includes(`tri=${valeur}`));
  await selecteur(page).selectOption({ label: libelle });
  const r = await reponse;
  await expect(page.getByRole('main').getByRole('listitem').first()).toBeVisible();
  return { url: r.url(), annonces: (await r.json()).annonces };
}

test('Par défaut, les plus récentes d’abord', async ({ page }) => {
  const reponse = page.waitForResponse((r) => r.url().includes('/api/annonces?') && r.url().includes('parPage=20'));
  await ouvrirConnecte(page, PROFILS.demandeurSeul, '/recherche');
  await expect(selecteur(page)).toHaveValue('recent');
  const { annonces } = await (await reponse).json();
  const dates = annonces.map((a) => a.creeLe);
  expect(dates.length).toBeGreaterThan(1);
  expect(dates).toEqual([...dates].sort().reverse());
});

test('Trier par participation, la plus basse d’abord', async ({ page }) => {
  await ouvrirConnecte(page, PROFILS.demandeurSeul, '/recherche');
  const { annonces } = await trierPar(page, 'Participation la plus basse', 'participation');
  const montants = annonces.map((a) => a.participation);
  expect(montants).toEqual([...montants].sort((a, b) => a - b));
  await expect(page).toHaveURL(/tri=participation/);
});

test('Trier par créneau, le plus proche d’abord', async ({ page }) => {
  await ouvrirConnecte(page, PROFILS.demandeurSeul, '/recherche');
  const { annonces } = await trierPar(page, 'Créneau le plus proche', 'creneau');
  const avenir = annonces.filter((a) => new Date(a.creneauRetrait.fin) > new Date());
  const debuts = avenir.map((a) => a.creneauRetrait.debut);
  expect(debuts).toEqual([...debuts].sort());
  // Le creneau est affiche sur la carte, pour lire l'ordre d'un coup d'oeil.
  await expect(page.getByRole('main').getByRole('listitem').first()).toContainText(/ · \d+ h/);
});

test('Le tri se combine aux filtres et au mot-clé', async ({ page }) => {
  await ouvrirConnecte(page, PROFILS.demandeurSeul, '/recherche?categorieId=mobilier&q=bois');
  const { url, annonces } = await trierPar(page, 'Participation la plus basse', 'participation');
  expect(url).toContain('categorieId=mobilier');
  expect(url).toContain('q=bois');
  for (const a of annonces) expect(a.categorie.id).toBe('mobilier');
});

test('Le tri est conservé au retour d’une fiche', async ({ page }) => {
  await ouvrirConnecte(page, PROFILS.demandeurSeul, '/recherche');
  await trierPar(page, 'Créneau le plus proche', 'creneau');
  await page.getByRole('main').getByRole('listitem').getByRole('link').first().click();
  await page.getByRole('button', { name: 'Retour' }).click();
  await expect(selecteur(page)).toHaveValue('creneau');
});
