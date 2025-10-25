import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function getContext() {
  const queryClient = new QueryClient()
  return {
    queryClient,
  }
}

export function Provider({
  children,
  queryClient,
}: {
  children: React.ReactNode
  queryClient: QueryClient
}) {
  return (
    <ChakraProvider value={defaultSystem}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ChakraProvider>
  )
}
