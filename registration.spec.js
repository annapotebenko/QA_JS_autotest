const { test, expect } = require('@playwright/test');

test.describe('Тестування форми реєстрації', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://diia.gov.ua/'); // сайт, який тестуємо
  });

  test('Реєстрація нового користувача пройшла успішно', async ({ page }) => {
    await page.fill('#email', 'testuser@example.com');
    await page.fill('#password', 'StrongPass123!');
    await page.fill('#confirmPassword', 'StrongPass123!');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('.welcome-message')).toContainText('Ласкаво просимо!');
  });

  test('Помилка: дуже короткий пароль', async ({ page }) => {
    await page.fill('#email', 'shortpass@example.com');
    await page.fill('#password', '123');
    await page.fill('#confirmPassword', '123');
    await page.click('button[type="submit"]');

    const error = page.locator('.error-password');
    await expect(error).toBeVisible();
    await expect(error).toHaveText(/Надто короткий пароль!/);
  });

  test('🚫 Поле email залишилось пустим', async ({ page }) => {
    await page.fill('#email', '');
    await page.fill('#password', 'StrongPass123!');
    await page.fill('#confirmPassword', 'StrongPass123!');
    await page.click('button[type="submit"]');

    const emailError = page.locator('.error-email');
    await expect(emailError).toBeVisible();
    await expect(emailError).toHaveText(/Email треба ввести обов'язково/);
  });

  test('⚠️ Помилка: паролі не співпадають', async ({ page }) => {
    await page.fill('#email', 'mismatch@example.com');
    await page.fill('#password', 'StrongPass123!');
    await page.fill('#confirmPassword', 'OtherPass456!');
    await page.click('button[type="submit"]');

    const confirmError = page.locator('.error-confirm');
    await expect(confirmError).toBeVisible();
    await expect(confirmError).toHaveText(/Паролі не співпадають/);
  });

});

