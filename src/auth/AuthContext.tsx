import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, tokenStore } from '../api/client';
import type { Felhasznalo } from '../types';

export interface RegisterData {
  email: string;
  felhasznalonev: string;
  jelszo: string;
  jelszo_confirmation: string;
  telefonszam?: string;
  anyja_neve?: string;
  szuletesi_ido?: string;
  szig_szam?: string;
  lakcim?: { iranyitoszam?: string; varos?: string; utca?: string; hazszam?: number };
}

interface AuthCtx {
  user: Felhasznalo | null;
  loading: boolean;
  isAdmin: boolean;
  login: (azonosito: string, jelszo: string) => Promise<Felhasznalo>;
  register: (data: RegisterData) => Promise<Felhasznalo>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

interface AuthResponse {
  user: Felhasznalo;
  token: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Felhasznalo | null>(null);
  const [loading, setLoading] = useState<boolean>(!!tokenStore.get());

  useEffect(() => {
    if (!tokenStore.get()) return;
    api<Felhasznalo>('/profil')
      .then(setUser)
      .catch(() => tokenStore.clear())
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onExpired = () => setUser(null);
    window.addEventListener('auth-expired', onExpired);
    return () => window.removeEventListener('auth-expired', onExpired);
  }, []);

  const login = useCallback(async (azonosito: string, jelszo: string) => {
    const r = await api<AuthResponse>('/bejelentkezes', { method: 'POST', body: { azonosito, jelszo } });
    tokenStore.set(r.token);
    setUser(r.user);
    return r.user;
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const r = await api<AuthResponse>('/regisztracio', { method: 'POST', body: data });
    tokenStore.set(r.token);
    setUser(r.user);
    return r.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api('/kijelentkezes', { method: 'POST' });
    } catch {
      /* a token így is törlődik */
    }
    tokenStore.clear();
    setUser(null);
  }, []);

  return (
    <Ctx.Provider value={{ user, loading, isAdmin: user?.jogosultsag === 'admin', login, register, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth(): AuthCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth az AuthProvideren belül használható');
  return c;
}
