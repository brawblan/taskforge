import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx';
import './styles.css';
import { Provider as ChakraProvider } from './components/ui/provider.tsx';
import { ROUTES, routeTree } from './routes/routeTree.ts';
import InternalLink from '@/components/InternalLink';

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export const TanStackQueryProviderContext = TanStackQueryProvider.getContext();

export const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProviderContext,
  },
  defaultErrorComponent: ({ error }) => (
    <div>
      <h1>Error loading data!</h1>
      <p>{error.message}</p>
      <InternalLink href={ROUTES.HOME} fontWeight="medium">
        ← Back to Home
      </InternalLink>
    </div>
  ),
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
  notFoundMode: 'root',
});

const rootElement = document.getElementById('app');
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
        <ChakraProvider>
          <RouterProvider router={router} />
        </ChakraProvider>
      </TanStackQueryProvider.Provider>
    </StrictMode>,
  );
}
