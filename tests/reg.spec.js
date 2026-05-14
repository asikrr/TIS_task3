const { test, expect } = require('@playwright/test');

function generateRandomString(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateRandomEmail() {
  return `test${generateRandomString()}@example.com`;
}

test.describe('Регистрация: позитивные тесты', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://dev.profteam.su/');
    await page.getByRole('button', { name: 'Регистрация' }).click();
  });

  test('Успешная регистрация без фото', async ({ page }) => {
    const randomLogin = `testuser${generateRandomString()}`;
    const randomEmail = generateRandomEmail();
    const password = 'Password1';
    
    await page.locator('input[autocomplete="username"]').fill(randomLogin);
    await page.locator('input[autocomplete="email"]').fill(randomEmail);
    await page.locator('input[autocomplete="new-password"]').first().fill(password);
    await page.locator('input[autocomplete="new-password"]').last().fill(password);
    await page.getByRole('button', { name: 'Далее' }).click();

    await page.locator('input[autocomplete="family-name"]').fill('Олегов');
    await page.locator('input[autocomplete="given-name"]').fill('Олег');
    await page.locator('input[autocomplete="additional-name"]').fill('Олегович');
    
    await page.getByRole('button', { name: 'Создать аккаунт' }).click();
    await expect(page.locator('body')).toContainText(/выйти/i);
  });

  test('Успешная регистрация с фото', async ({ page }) => {
    const randomLogin = `testuser${generateRandomString()}`;
    const randomEmail = generateRandomEmail();
    const password = 'Password1';
    
    await page.locator('input[autocomplete="username"]').fill(randomLogin);
    await page.locator('input[autocomplete="email"]').fill(randomEmail);
    await page.locator('input[autocomplete="new-password"]').first().fill(password);
    await page.locator('input[autocomplete="new-password"]').last().fill(password);
    await page.getByRole('button', { name: 'Далее' }).click();

    await page.locator('input[autocomplete="family-name"]').fill('Олегов');
    await page.locator('input[autocomplete="given-name"]').fill('Олег');
    await page.locator('input[autocomplete="additional-name"]').fill('Олегович');
    
    await page.locator('input[autocomplete="photo"]').setInputFiles('test-data/test-image.jpg');
    await page.getByRole('button', { name: 'Создать аккаунт' }).click();
    await expect(page.locator('body')).toContainText(/выйти/i);
  });
});

test.describe('Регистрация: негативные тесты', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://dev.profteam.su/');
    await page.getByRole('button', { name: 'Регистрация' }).click();
  });

  test('Регистрация с логином на кириллице', async ({ page }) => {
    await page.locator('input[autocomplete="username"]').fill('тестюзер');
    await page.locator('input[autocomplete="email"]').fill('test@example.com');
    await page.locator('input[autocomplete="new-password"]').first().fill('Password1');
    await page.locator('input[autocomplete="new-password"]').last().fill('Password1');

    await expect(page.getByRole('button', { name: 'Далее' })).toBeDisabled();
  });

  test('Регистрация с существующим логином', async ({ page }) => {
    await page.locator('input[autocomplete="username"]').fill('testerStudent');
    await page.locator('input[autocomplete="email"]').fill('uniqueemail@example.com');
    await page.locator('input[autocomplete="new-password"]').first().fill('Password1');
    await page.locator('input[autocomplete="new-password"]').last().fill('Password1');

    await page.getByRole('button', { name: 'Далее' }).click();

    await expect(page.locator('body')).toContainText('уже существует');
    await expect(page.locator('input[autocomplete="username"]')).toBeVisible();
  });

  test('Регистрация с некорректным email', async ({ page }) => {
    const randomLogin = `testuser_${generateRandomString()}`;
    
    await page.locator('input[autocomplete="username"]').fill(randomLogin);
    await page.locator('input[autocomplete="email"]').fill('notanemail');
    await page.locator('input[autocomplete="new-password"]').first().fill('Password1');
    await page.locator('input[autocomplete="new-password"]').last().fill('Password1');
    
    await expect(page.getByRole('button', { name: 'Далее' })).toBeDisabled();
  });

  test('Регистрация с неподходящим паролем', async ({ page }) => {
    const randomLogin = generateRandomString();
    const randomEmail = generateRandomEmail();
    
    await page.locator('input[autocomplete="username"]').fill(randomLogin);
    await page.locator('input[autocomplete="email"]').fill(randomEmail);
    await page.locator('input[autocomplete="new-password"]').first().fill('Password');
    await page.locator('input[autocomplete="new-password"]').last().fill('Password');

    await expect(page.getByRole('button', { name: 'Далее' })).toBeDisabled();
  });

  test('Регистрация с несовпадающими паролями', async ({ page }) => {
    const randomLogin = generateRandomString();
    const randomEmail = generateRandomEmail();

    await page.locator('input[autocomplete="username"]').fill(randomLogin);
    await page.locator('input[autocomplete="email"]').fill(randomEmail);
    await page.locator('input[autocomplete="new-password"]').first().fill('Password123');
    await page.locator('input[autocomplete="new-password"]').last().fill('OtherPassword123');

    await expect(page.getByRole('button', { name: 'Далее' })).toBeDisabled();
  });

  test('Загрузка аватара неправильного формата', async ({ page }) => {
    const randomLogin = `testuser${generateRandomString()}`;
    const randomEmail = generateRandomEmail();
    const password = 'Password1';
    
    await page.locator('input[autocomplete="username"]').fill(randomLogin);
    await page.locator('input[autocomplete="email"]').fill(randomEmail);
    await page.locator('input[autocomplete="new-password"]').first().fill(password);
    await page.locator('input[autocomplete="new-password"]').last().fill(password);
    await page.getByRole('button', { name: 'Далее' }).click();

    await page.locator('input[autocomplete="family-name"]').fill('Олегов');
    await page.locator('input[autocomplete="given-name"]').fill('Олег');
    await page.locator('input[autocomplete="additional-name"]').fill('Олегович');
    
    await page.locator('input[autocomplete="photo"]').setInputFiles('test-data/test-file.txt');
    
    await expect(page.locator('body')).toContainText(/jpg|jpeg|png|формат|изображение/i);
    await expect(page.locator('input[autocomplete="photo"]')).toBeVisible();
  });
});