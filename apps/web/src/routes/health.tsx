import { createFileRoute } from '@tanstack/react-router'

const getHealthOptions = () => ({
  queryKey: ['health'],
  queryFn: async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/health`)
      if (!res.ok) {
      throw new Error('Failed to fetch post');
    }
    return res.json()
  },
})

export const Route = createFileRoute('/health')({
  component: RouteComponent,
  loader: async ({ context: { queryClient }}) => {
    return await queryClient.ensureQueryData(getHealthOptions());
  }
})

export function RouteComponent() {
  const data = Route.useLoaderData()
  return (
    <>
      <div>Message: {data.message}</div>
      <div>ok: {data.ok.toString()}</div>
      <div>Timestamp: {new Date(data.timestamp).toLocaleString()}</div>
    </>
  )
}
