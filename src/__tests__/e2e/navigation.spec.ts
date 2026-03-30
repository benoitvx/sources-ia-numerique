import { test, expect } from '@playwright/test';

test('homepage loads and shows sources', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Sources de données');
  const cards = page.locator('.fr-card');
  await expect(cards.first()).toBeVisible();
});

test('click a source card navigates to detail page', async ({ page }) => {
  await page.goto('/');
  const firstCard = page.locator('.fr-card').first();
  const title = await firstCard.locator('.fr-card__title').textContent();
  await firstCard.click();
  await expect(page.locator('h1')).toContainText(title!.trim());
  await expect(page.locator('table')).toBeVisible();
});

test('en savoir plus navigation works', async ({ page }) => {
  await page.goto('/');
  await page.click('text=En savoir plus');
  await expect(page.locator('h1')).toContainText('En savoir plus');
});

test('demander une source button is visible', async ({ page }) => {
  await page.goto('/');
  const button = page.locator('text=Demander une source de données');
  await expect(button).toBeVisible();
});
