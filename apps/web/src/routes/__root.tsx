import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import Page404 from './pages/Page404/Page404';
import Header from '@/components/Header';
// import Footer from '@/components/Footer';

export const rootRoute = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
      {/* <Footer /> */}
      <TanStackRouterDevtools />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  ),
  notFoundComponent: Page404,
});
