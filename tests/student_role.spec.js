const { test, expect } = require('@playwright/test');

test.describe('Добавление роли студента', () => {
  test('Успешное добавление роли студента', async ({ page }) => {
    await page.goto('https://dev.profteam.su/');
    await page.getByRole('button', { name: 'Авторизация' }).click();
    await page.locator('input[autocomplete="username"]').fill('qwertyuiop');
    await page.locator('input[autocomplete="current-password"]').fill('Password1');
    await page.getByRole('button', { name: 'Войти' }).click();
    await expect(page.getByText('Личный кабинет')).toBeVisible();

    await page.getByRole('button', { name: 'Выбрать роль' }).waitFor({ state: 'visible' });
    await page.getByRole('button', { name: 'Выбрать роль' }).click();
    await page.getByText('Я являюсь студентом').click();
    await expect(page.locator('.desktop-modal')).not.toBeVisible();
    await expect(page.getByText('Студент').first()).toBeVisible();

    await page.getByRole('button', { name: 'Сбросить роль' }).click();
    await expect(page.getByRole('button', { name: 'Авторизация' })).toBeVisible();
  });
});