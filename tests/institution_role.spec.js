const { test, expect } = require('@playwright/test');

test.describe.serial('Подача заявки на роль образовательной организации: позитивные тесты', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://dev.profteam.su/');
    await page.getByRole('button', { name: 'Авторизация' }).click();
    await page.locator('input[autocomplete="username"]').fill('qwertyuiop');
    await page.locator('input[autocomplete="current-password"]').fill('Password1');
    await page.getByRole('button', { name: 'Войти' }).click();
  });

  test('Успешная подача заявки', async ({ page }) => {
    await page.getByRole('button', { name: 'Выбрать роль' }).click();
    await page.getByText('Я являюсь представителем образовательной организации').click();
    await page.getByText('Создание нового личного кабинета ОУ').click();
    await page.locator('input[placeholder="Название вашей организации"]').fill('Тест ВУЗ');
    await page.locator('input[placeholder="Адрес вашей организации"]').fill('Адрес 1');
    await page.locator('textarea[placeholder="Описание вашей организации"]').fill('Описание 1');

    await page.getByRole('button', { name: 'Добавить' }).click();
    await page.locator('.desktop-modal__close').click();
    await page.getByText('Заявки').click();
    await page.getByRole('button', { name: 'Удалить' }).first().click();
  });
});

test.describe.serial('Подача заявки на роль образовательной организации: негативные тесты', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://dev.profteam.su/');
    await page.getByRole('button', { name: 'Авторизация' }).click();
    await page.locator('input[autocomplete="username"]').fill('qwertyuiop');
    await page.locator('input[autocomplete="current-password"]').fill('Password1');
    await page.getByRole('button', { name: 'Войти' }).click();
  });

  test('Подача заявки без заполнения всех полей формы', async ({ page }) => {
    await page.getByRole('button', { name: 'Выбрать роль' }).click();
    await page.getByText('Я являюсь представителем образовательной организации').click();
    await page.getByText('Создание нового личного кабинета ОУ').click();
    await expect(page.getByRole('button', { name: 'Добавить' })).toBeDisabled();
  });

  test('Подача заявки без заполнения одного поля формы', async ({ page }) => {
    await page.getByRole('button', { name: 'Выбрать роль' }).click();
    await page.getByText('Я являюсь представителем образовательной организации').click();
    await page.getByText('Создание нового личного кабинета ОУ').click();
    await page.locator('input[placeholder="Название вашей организации"]').fill('Тест');
    await page.locator('input[placeholder="Адрес вашей организации"]').fill('Тест');
    await expect(page.getByRole('button', { name: 'Добавить' })).toBeDisabled();
  });

  test('Невозможно подать повторную заявку', async ({ page }) => {
    await page.getByRole('button', { name: 'Выбрать роль' }).click();
    await page.getByText('Я являюсь представителем образовательной организации').click();
    await page.getByText('Создание нового личного кабинета ОУ').click();
    await page.getByRole('textbox', { name: 'Название вашей организации' }).fill('Первый ВУЗ');
    await page.getByRole('textbox', { name: 'Адрес вашей организации' }).fill('Адрес 1');
    await page.getByRole('textbox', { name: 'Описание вашей организации' }).fill('Описание 1');

    await page.getByRole('button', { name: 'Добавить' }).click();
    await page.locator('.desktop-modal__close').click();

    await page.getByRole('button', { name: 'Выбрать роль' }).click();
    await page.getByText('Я являюсь представителем образовательной организации').click();
    await page.getByText('Создание нового личного кабинета ОУ').click();
    await page.getByRole('textbox', { name: 'Название вашей организации' }).fill('Второй ВУЗ');
    await page.getByRole('textbox', { name: 'Адрес вашей организации' }).fill('Адрес 2');
    await page.getByRole('textbox', { name: 'Описание вашей организации' }).fill('Описание 2');

    await page.getByRole('button', { name: 'Добавить' }).click();
    await page.locator('.desktop-modal__close').click();
    await page.getByText('Заявки').click();
    await page.getByRole('button', { name: 'Удалить' }).first().click();
  });
});