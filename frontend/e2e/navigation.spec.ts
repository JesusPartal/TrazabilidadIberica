import { test, expect } from '@playwright/test';

const API_URL = 'https://localhost:5001/api';

async function login(page: import('@playwright/test').Page) {
  await page.route(`*${API_URL}*/**`, async (route) => {
    const url = route.request().url();
    if (url.includes('/auth/login')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'fake-token',
          refreshToken: 'fake-refresh',
          email: 'test@example.com',
          ganaderoId: 'ganadero-1',
        }),
      });
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: [], totalCount: 0, page: 1, pageSize: 50, totalPages: 0 }),
      });
    }
  });

  await page.goto('/login');
  await page.locator('#email').fill('test@example.com');
  await page.locator('#password').fill('Test123!');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page).toHaveURL('/', { timeout: 15000 });
}

test.describe('Navigation', () => {
  test('navigates to animals list page', async ({ page }) => {
    await login(page);
    await page.goto('/animals/list');
    await expect(page).toHaveURL(/\/animals\/list/);
  });

  test('navigates to fincas list page', async ({ page }) => {
    await login(page);
    await page.goto('/fincas/list');
    await expect(page).toHaveURL(/\/fincas\/list/);
  });

  test('navigates to lotes list page', async ({ page }) => {
    await login(page);
    await page.goto('/lotes/list');
    await expect(page).toHaveURL(/\/lotes\/list/);
  });

  test('navigates to movimientos list page', async ({ page }) => {
    await login(page);
    await page.goto('/movements/list');
    await expect(page).toHaveURL(/\/movements\/list/);
  });

  test('navigates to ganaderos list page', async ({ page }) => {
    await login(page);
    await page.goto('/ganaderos/list');
    await expect(page).toHaveURL(/\/ganaderos\/list/);
  });

  test('navigates to veterinarios list page', async ({ page }) => {
    await login(page);
    await page.goto('/veterinarios/list');
    await expect(page).toHaveURL(/\/veterinarios\/list/);
  });

  test('navigates to bajas list page', async ({ page }) => {
    await login(page);
    await page.goto('/bajas/list');
    await expect(page).toHaveURL(/\/bajas\/list/);
  });

  test('navigates to campanias list page', async ({ page }) => {
    await login(page);
    await page.goto('/campanias/list');
    await expect(page).toHaveURL(/\/campanias\/list/);
  });

  test('navigates to tratamientos list page', async ({ page }) => {
    await login(page);
    await page.goto('/tratamientos/list');
    await expect(page).toHaveURL(/\/tratamientos\/list/);
  });

  test('navigates to activity log page', async ({ page }) => {
    await login(page);
    await page.goto('/activity-log');
    await expect(page).toHaveURL(/\/activity-log/);
  });

  test('redirects to login for unknown routes', async ({ page }) => {
    await page.goto('/nonexistent');
    await expect(page).toHaveURL('/login');
  });
});
