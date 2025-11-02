import { useLoaderData } from '@tanstack/react-router';
import { ROUTES } from '@/routes/routeTree';

export default function Health() {
  const data = useLoaderData({ from: ROUTES.HEALTH });
  return (
    <>
      <div>Message: {data.message}</div>
      <div>ok: {data.ok.toString()}</div>
      <div>Timestamp: {new Date(data.timestamp).toLocaleString()}</div>
    </>
  );
}
