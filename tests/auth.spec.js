const { test, expect } = require('@playwright/test');

test.describe('Авторизация: позитивные тесты', () => {
  test('Успешный вход', async ({ page }) => {
    await page.goto('https://dev.profteam.su/');
    await page.getByRole('button', { name: 'Авторизация' }).click();
    await page.locator('input[autocomplete="username"]').fill('testerStudent');
    await page.locator('input[autocomplete="current-password"]').fill('Password1');
    await page.getByRole('button', { name: 'Войти' }).click();
    await expect(page.locator('body')).toContainText(/выйти/i);
  });
});

test.describe('Авторизация: негативные тесты', () => {
  test('Вход не выполнен', async ({ page }) => {
    await page.goto('https://dev.profteam.su/');
    await page.getByRole('button', { name: 'Авторизация' }).click();
    await page.locator('input[autocomplete="username"]').fill('testerStudent');
    await page.locator('input[autocomplete="current-password"]').fill('wrong');
    await page.getByRole('button', { name: 'Войти' }).click();
    await expect(page).toHaveURL(/login/);
  });

  test('Вход не выполнен (Сетевой город)', async ({ page }) => {
    await page.goto('https://dev.profteam.su/');
    await page.getByRole('button', { name: 'Авторизация' }).click();
    await page.getByRole('button', { name: 'Вход через «Сетевой Город»' }).click();
    await page.locator('input[autocomplete="username"]').last().fill('testerStudent');
    await page.locator('input[autocomplete="current-password"]').last().fill('Password1');
    await page.getByRole('button', { name: 'Войти' }).last().click();
    await expect(page).toHaveURL(/login/);
  })
});