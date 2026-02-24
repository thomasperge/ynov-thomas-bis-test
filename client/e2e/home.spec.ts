import { test, expect } from "@playwright/test";

test("affiche la page d'accueil et le bouton Signup est présent", async ({ page }) => {
  await page.goto("/");
  const signupButton = page.getByRole("button", { name: "Signup" });
  await expect(signupButton).toBeVisible();
  await signupButton.click();
  await expect(page).toHaveURL(/\/signup/);
});
