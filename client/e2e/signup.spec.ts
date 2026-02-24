import { test, expect } from "@playwright/test";

test("remplit le formulaire d'inscription et soumet, vérifie le toast de succès", async ({
  page,
}) => {
  await page.goto("/signup");

  await page.getByTestId("signup-email").fill("e2e@test.com");
  await page.getByTestId("signup-password").fill("e2epassword123");
  await page.getByTestId("signup-submit").click();

  const toast = page.getByTestId("toast");
  await expect(toast).toBeVisible({ timeout: 5000 });
  await expect(toast).toContainText("succès");
});
