import { healthRoute } from '../router';

export function Health() {
  const data = healthRoute.useLoaderData();
  return (
    <>
      <div>Message: {data.message}</div>
      <div>ok: {data.ok.toString()}</div>
      <div>Timestamp: {new Date(data.timestamp).toLocaleString()}</div>
    </>
  );
}
