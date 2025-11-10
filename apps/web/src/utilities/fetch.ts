const BASE_URL =
  import.meta.env.ENV !== 'development'
    ? import.meta.env.VITE_API_URL
    : 'http://localhost:3000';

const getToken = (): string | null => {
  const token = sessionStorage.getItem('placeholder') || null;
  return token;
};

const publicHeaders = {
  'Content-Type': 'application/json',
};

const privateHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

export const GET = async <T>(
  endpoint: string,
  isProtected = false,
): Promise<T> => {
  const token = getToken();

  if (isProtected && !token) throw new Error('No token found');

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: isProtected ? privateHeaders(token!) : publicHeaders,
    });
    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch data');
  }
};

/**
 * @private Always requires authentication
 *
 * @param endpoint
 * @param body
 * @returns
 */
export const PATCH = async <T>(endpoint: string, body: T): Promise<T> => {
  const token = getToken();

  if (!token) throw new Error('No token found');

  return fetch(`${BASE_URL}${endpoint}`, {
    method: 'PATCH',
    headers: privateHeaders(token),
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .catch((error) => {
      throw new Error(error.message || 'An error occurred');
    });
};

export const POST = async <T>(
  endpoint: string,
  body?: T,
  isProtected = false,
): Promise<T> => {
  const token = getToken();

  if (isProtected && !token) throw new Error('No token found');

  try {
    const payload = {
      method: 'POST',
      headers: isProtected ? privateHeaders(token!) : publicHeaders,
    };

    if (body) {
      Object.assign(payload, { body: JSON.stringify(body) });
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, payload);

    const data = await response.json();

    return data;
  } catch (error: any) {
    throw new Error(error.message || 'An error occurred');
  }
};

export const PUT = async <T>(
  endpoint: string,
  body: T,
  isProtected = false,
): Promise<T> => {
  const token = getToken();

  if (isProtected && !token) throw new Error('No token found');

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: isProtected ? privateHeaders(token!) : publicHeaders,
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'An error occurred');
  }
};

/**
 * @private Always requires authentication
 *
 * @param endpoint
 * @returns
 */
export const DELETE = async <T>(endpoint: string): Promise<T> => {
  const token = getToken();

  if (!token) throw new Error('No token found');

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers: privateHeaders(token),
  });
  return await response.json();
};
