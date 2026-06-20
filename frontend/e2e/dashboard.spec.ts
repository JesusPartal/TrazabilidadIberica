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

test.describe('Dashboard', () => {
  test('shows dashboard with user email and stats section', async ({ page }) => {
    await login(page);
    await expect(page.locator('h1')).toHaveText('Trazabilidad Ibérica');
    await expect(page.locator('.user-badge')).toContainText('test@example.com');
    await expect(page.locator('.stats')).toBeVisible();
  });

  test('shows navigation cards', async ({ page }) => {
    await login(page);
    const cards = ['Animales', 'Fincas', 'Lotes', 'Movimientos', 'Ganaderos', 'Veterinarios', 'Bajas', 'Campañas', 'Tratamientos', 'Actividad'];
    for (const name of cards) {
      await expect(page.getByText(name).first()).toBeVisible();
    }
  });

  test('shows logout button', async ({ page }) => {
    await login(page);
    await expect(page.getByRole('button', { name: 'Salir' })).toBeVisible();
  });

  test('logout redirects to login', async ({ page }) => {
    await login(page);
    await page.getByRole('button', { name: 'Salir' }).click();
    await expect(page).toHaveURL('/login');
  });
});
