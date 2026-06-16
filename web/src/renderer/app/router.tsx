import { lazy, Suspense } from "react";
import { createHashRouter, Navigate } from "react-router-dom";

import { useI18n } from "@renderer/i18n/use-i18n";

const HomeRoute = lazy(async () => ({ default: (await import("@renderer/routes/home-route")).HomeRoute }));
const WelcomeRoute = lazy(async () => ({ default: (await import("@renderer/routes/welcome-route")).WelcomeRoute }));

function RouteFallback(): JSX.Element {
  const { t } = useI18n();

  return (
    <div className="grid min-h-screen place-items-center bg-background px-6 text-center text-sm text-muted">
      {t("common.loadingWorkspace")}
    </div>
  );
}

function withSuspense(element: JSX.Element): JSX.Element {
  return <Suspense fallback={<RouteFallback />}>{element}</Suspense>;
}

export const appRouter = createHashRouter([
  {
    path: "/",
    element: <Navigate replace to="/welcome" />
  },
  {
    path: "/welcome",
    element: withSuspense(<WelcomeRoute />)
  },
  {
    path: "/home",
    element: withSuspense(<HomeRoute />)
  }
]);
