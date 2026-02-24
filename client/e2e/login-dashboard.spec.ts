import { test, expect } from "@playwright/test";

test("connexion au compte créé et affichage du Dashboard", async ({ page }) => {
  await page.goto("/signup");
  await page.getByTestId("signup-email").fill("dashboard@test.com");
  await page.getByTestId("signup-password").fill("dashboard123");
  await page.getByTestId("signup-submit").click();

  await expect(page.getByTestId("toast")).toBeVisible({ timeout: 5000 });
  await page.waitForURL(/\/login/, { timeout: 5000 });

  await page.getByTestId("login-email").fill("dashboard@test.com");
  await page.getByTestId("login-password").fill("dashboard123");
  await page.getByTestId("login-submit").click();

  await expect(page).toHaveURL(/\/dashboard/, { timeout: 5000 });
  await expect(page.getByTestId("dashboard")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
});
