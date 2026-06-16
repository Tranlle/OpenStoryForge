import { expect, test } from "@playwright/test";

test("welcome route renders", async ({ page }) => {
  await page.goto("/#/welcome");
  await expect(page.getByText("Project-first quick start")).toBeVisible();
});
