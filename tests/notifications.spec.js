const { test, expect } = require('@playwright/test');

test.describe('Уведомления', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://dev.profteam.su/');
    await page.getByRole('button', { name: 'Авторизация' }).click();
    await page.locator('input[autocomplete="username"]').fill('testerStudent');
    await page.locator('input[autocomplete="current-password"]').fill('Password1');
    await page.getByRole('button', { name: 'Войти' }).click();
  });

  test('Прочитать уведомления', async ({ page }) => {
    await page.getByRole('link', { name: 'Уведомления' }).click();
    await page.getByText('Прочитать все').first().click();
    await expect(page.locator('.notification-count').first()).toHaveText('0');
  });

  test('Просмотреть уведомление', async ({ page }) => {
    await page.getByRole('link', { name: 'Уведомления' }).click();

    const counter = page.locator('.notification-count').first();
    const startCount = parseInt((await counter.textContent()).trim(), 10);

    await page.getByRole('button', { name: 'Просмотреть' }).first().click();
    await expect(page).not.toHaveURL(/notifications/)
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');

    const endCount = parseInt((await counter.textContent()).trim(), 10);

    if (startCount > 0) {
      expect(endCount).toBe(startCount - 1);
    } else {
      expect(endCount).toBe(0);
    }
  });
});