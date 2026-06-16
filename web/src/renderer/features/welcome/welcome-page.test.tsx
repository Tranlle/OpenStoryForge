import React from "react";
import { render, screen } from "@testing-library/react";

import { WelcomePage } from "@renderer/features/welcome/welcome-page";
import { LocaleStateProvider } from "@renderer/i18n/locale-state";
import { ShortcutStateProvider } from "@renderer/shortcuts/shortcut-state";

test("renders welcome quick start heading aligned with home composer", () => {
  render(
    <LocaleStateProvider>
      <ShortcutStateProvider>
        <WelcomePage
          activeSection="quick-start"
          onOpenTask={() => undefined}
          onQuickStart={() => undefined}
          projects={[]}
          tasks={[]}
          tokenUsageSummary={{ cached: 0, input: 0, output: 0, total: 0 }}
        />
      </ShortcutStateProvider>
    </LocaleStateProvider>
  );

  expect(screen.getByText(/Where should we begin|我们从哪里开始|どこから始めましょうか/i)).toBeInTheDocument();
});
