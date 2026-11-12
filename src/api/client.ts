const BASE: string = import.meta.env.VITE_API_URL ?? '/api';

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;
  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export const tokenStore = {
  get: () => localStorage.getItem('token'),
  set: (t: string) => localStorage.setItem('token', t),
  clear: () => localStorage.removeItem('token'),
};

type Query = Record<string, string | number | boolean | null | undefined>;

interface Options {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  form?: FormData;
  query?: Query;
}

export async function api<T>(path: string, opts: Options = {}): Promise<T> {
  const url = new URL(BASE + path, window.location.origin);
  Object.entries(opts.query ?? {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
  });

  const headers: Record<string, string> = { Accept: 'application/json' };
  const token = tokenStore.get();
  if (token) headers.Authorization = `Bearer ${token}`;

  let body: BodyInit | undefined;
  if (opts.form) {
    body = opts.form; // a böngésző állítja be a multipart fejlécet
  } else if (opts.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(opts.body);
  }

  let res: Response;
  try {
    res = await fetch(url.toString(), { method: opts.method ?? 'GET', headers, body });
  } catch {
    throw new ApiError('A szerver nem érhető el. Ellenőrizd a kapcsolatot.', 0);
  }

  if (res.status === 204) return undefined as T;

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    /* nem JSON válasz */
  }

  if (!res.ok) {
    if (res.status === 401 && token) {
      tokenStore.clear();
      window.dispatchEvent(new Event('auth-expired'));
    }
    throw new ApiError(data?.message ?? `Hiba történt (${res.status}).`, res.status, data?.errors);
  }
  return data as T;
}

/** Felhasználóbarát hibaüzenet (422 esetén az első mezőhiba). */
export function errorMessage(e: unknown): string {
  if (e instanceof ApiError) {
    if (e.errors) {
      const first = Object.values(e.errors)[0];
      if (first?.length) return first[0];
    }
    return e.message;
  }
  return e instanceof Error ? e.message : 'Ismeretlen hiba.';
}
