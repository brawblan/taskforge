import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './__root';
import Dashboard from './pages/Dashboard/Dashboard';
import LearnMore from './pages/LearnMore/LearnMore';
import Health from './pages/Health/Health';
import Projects from './pages/Projects/Projects';
import Tasks from './pages/Tasks/Tasks';
import ActivityLog from './pages/ActivityLog/ActivityLog';
import ProjectPage from './pages/Project/Project';
import TaskPage from './pages/Task/Task';
import type { RouterContext } from '@/types/router';
import Landing from '@/routes/pages/Landing/Landing';
import { getHealthQueryOptions } from '@/queries/health';

export const ROUTES = Object.freeze({
  HOME: '/',
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  PROJECT: '/project',
  TASKS: '/tasks',
  TASK: '/task',
  ACTIVITY_LOG: '/activity-log',
  LEARN_MORE: '/learn-more',
  HEALTH: '/health',
});

// rootRoute
// |_ Landing /home
// |_ LearnMore /learn-more
// |_ SignIn/signin
// |_ SignUp/signup
//
// authRoute
// |_ Dashboard /dashboard
// |_ Projects /projects

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

const projectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.PROJECTS,
  component: Projects,
});

const projectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${ROUTES.PROJECT}/$id`,
  component: ProjectPage,
});

const tasksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.TASKS,
  component: Tasks,
});

const taskRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${ROUTES.TASK}/$id`,
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
  projectsRoute,
  projectRoute,
  tasksRoute,
  taskRoute,
  activityLogRoute,
  healthRoute,
]);
