import { Outlet, createRootRoute, createRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { RouterContext } from '@/types/router';
import Header from '@/components/Header/Header.tsx';
import { App } from '@/routes/App/App.tsx';
import { Health } from '@/routes/Health/Health.tsx';
import { getHealthQueryOptions } from '@/queries/health';

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
      <TanStackRouterDevtools />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: App,
});

export const healthRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/health',
  component: Health,
  loader: async (ctx) => {
    const { queryClient } = ctx.context as RouterContext;
    return queryClient.ensureQueryData(getHealthQueryOptions());
  },
});

export const routeTree = rootRoute.addChildren([indexRoute, healthRoute]);
