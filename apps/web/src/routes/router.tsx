import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import * as TanStackQueryProvider from '../integrations/tanstack-query/root-provider.tsx';
import Page404 from './Page404/Page404.tsx';
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
  notFoundComponent: Page404,
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

const routeTree = rootRoute.addChildren([indexRoute, healthRoute]);

export const TanStackQueryProviderContext = TanStackQueryProvider.getContext();

export const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProviderContext,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
  notFoundMode: 'root',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
