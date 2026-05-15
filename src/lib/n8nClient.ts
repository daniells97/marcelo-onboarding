const BASE_URL = import.meta.env.VITE_N8N_BASE_URL as string;

async function n8nPost<T>(endpoint: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  const clean = text.trim().replace(/^=/, '');
  return JSON.parse(clean) as T;
}

async function n8nGet<T>(endpoint: string, params: Record<string, string>): Promise<T> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/${endpoint}?${qs}`);
  const text = await res.text();
  const clean = text.trim().replace(/^=/, '');
  return JSON.parse(clean) as T;
}

export const n8nClient = { post: n8nPost, get: n8nGet };
