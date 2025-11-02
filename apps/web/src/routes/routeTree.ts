import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './__root';
import Dashboard from './pages/Dashboard/Dashboard';
import LearnMore from './pages/LearnMore/LearnMore';
import Health from './pages/Health/Health';
import type { RouterContext } from '@/types/router';
import Landing from '@/routes/pages/Landing/Landing';
import { getHealthQueryOptions } from '@/queries/health';

export const ROUTES = Object.freeze({
  HOME: '/',
  DASHBOARD: '/dashboard',
  LEARN_MORE: '/learn-more',
  HEALTH: '/health',
});

// rootRoute
// |_ Landing /home
// |_ LearnMore /learn-more
// |_ SignInPage /signin
// |_ SignUpPage /signup
//
// authRoute
// |_ DashboardPage /dashboard

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.HOME,
  component: Landing,
});

const learnMoreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.LEARN_MORE,
  component: LearnMore,
});

const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.DASHBOARD,
  component: Dashboard,
});

const healthRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.HEALTH,
  loader: async (ctx) => {
    const { queryClient } = ctx.context as RouterContext;
    try {
      const data = await queryClient.ensureQueryData(getHealthQueryOptions());
      return data;
    } catch (error) {
      throw Error('Data not available');
    }
  },
  component: Health,
});

export const routeTree = rootRoute.addChildren([
  indexRoute,
  learnMoreRoute,
  protectedRoute,
  healthRoute,
]);
