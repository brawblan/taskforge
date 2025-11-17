import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './__root';
import Dashboard from './pages/Dashboard/Dashboard';
import LearnMore from './pages/LearnMore/LearnMore';
import Health from './pages/Health/Health';
import ActivityLog from './pages/ActivityLog/ActivityLog';
import ProjectPage from './pages/Project/Project';
import TaskPage from './pages/Task/Task';
import type { RouterContext } from '@/types/router';
import Landing from '@/routes/pages/Landing/Landing';
import { getHealthQueryOptions } from '@/queries/health';

export const ROUTES = Object.freeze({
  HOME: '/',
  DASHBOARD: '/dashboard',
  PROJECT_ID: '/project/$id',
  TASK_ID: '/task/$id',
  ACTIVITY_LOG: '/activity-log',
  LEARN_MORE: '/learn-more',
  HEALTH: '/health',
});

// rootRoute
// |_ Landing /home
// |_ LearnMore /learn-more
// |_ SignIn /signin
// |_ SignUp /signup
//
// authRoute
// |_ Dashboard /dashboard
// |_ Project /project
// |_ Task /task
// |_ Activity Log /activity-log

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

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.DASHBOARD,
  component: Dashboard,
});

const projectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.PROJECT_ID,
  component: ProjectPage,
});

const taskRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.TASK_ID,
  component: TaskPage,
});

const activityLogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.ACTIVITY_LOG,
  component: ActivityLog,
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
  dashboardRoute,
  projectRoute,
  taskRoute,
  activityLogRoute,
  healthRoute,
]);
