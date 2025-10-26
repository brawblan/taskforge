import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx';
import './styles.css';
import { Provider as ChakraProvider } from './components/ui/provider.tsx';
import { TanStackQueryProviderContext, router } from './routes/router.tsx';

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
