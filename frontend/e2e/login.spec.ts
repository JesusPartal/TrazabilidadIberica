import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/login');
  });

  test('renders login form with all fields', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1')).toHaveText('Iniciar Sesión');
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();
  });

  test('submit button is disabled when form is empty', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('button', { name: 'Entrar' })).toBeDisabled();
  });

  test('submit button is enabled when form is valid', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#password').fill('password123');
    await expect(page.getByRole('button', { name: 'Entrar' })).toBeEnabled();
  });

  test('navigates to dashboard on successful login', async ({ page }) => {
    await page.route('**/api/auth/login', async (route) => {
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
    });
    await page.route(/localhost:5001\//, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: [], totalCount: 0, page: 1, pageSize: 50, totalPages: 0 }),
      });
    });
    await page.goto('/login');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#password').fill('correctpassword');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page).toHaveURL('/', { timeout: 15000 });
    await expect(page.locator('h1')).toHaveText('Trazabilidad Ibérica');
  });

  test('has link to register page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('Regístrate')).toBeVisible();
    await page.getByText('Regístrate').click();
    await expect(page).toHaveURL('/register');
  });
});
