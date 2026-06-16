import React from "react";
import { render, screen } from "@testing-library/react";

import { WelcomePage } from "@renderer/features/welcome/welcome-page";

test("renders welcome launcher heading", () => {
  render(
    <WelcomePage
      activeSection="quick-start"
      onOpenTask={() => undefined}
      onQuickStart={() => undefined}
      projects={[]}
      tasks={[]}
      tokenUsageSummary={{ cached: 0, input: 0, output: 0, total: 0 }}
    />
  );

  expect(screen.getByText(/Start from the project layer/i)).toBeInTheDocument();
});
