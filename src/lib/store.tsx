import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { apiClient, API_BASE_URL } from "@/api/client";
import { SEED_LINKS, type LinkRecord } from "./mock-data";

export type User = { name: string; email: string; token?: string };

export type BackendLink = {
  id: number | string;
  originalUrl?: string;
  original?: string;
  shortCode?: string;
  slug?: string;
  customAlias?: string;
  clickCount?: number;
  clicks?: number;
  createdAt?: string;
  expiresAt?: string | null;
  active?: boolean;
};

export function transformLink(item: BackendLink): LinkRecord {
  const slug = item.shortCode || item.slug || item.customAlias || String(item.id);
  const original = item.originalUrl || item.original || "";
  const clicks = item.clickCount !== undefined ? item.clickCount : item.clicks !== undefined ? item.clicks : 0;
  return {
    id: String(item.id),
    slug,
    original,
    clicks,
    createdAt: item.createdAt || new Date().toISOString(),
    expiresAt: item.expiresAt || null,
  };
}

type Store = {
  user: User | null;
  token: string | null;
  login: (email: string, password?: string) => Promise<void>;
  register: (name: string, email: string, password?: string) => Promise<void>;
  logout: () => void;
  links: LinkRecord[];
  loadingLinks: boolean;
  fetchLinks: () => Promise<void>;
  createLink: (input: {
    original: string;
    alias?: string;
    expiration?: string;
  }) => Promise<LinkRecord>;
  deleteLink: (id: string) => Promise<void>;
};

const StoreContext = createContext<Store | null>(null);

const USER_KEY = "lynkr.user";
const TOKEN_KEY = "lynkr_token";

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [links, setLinks] = useState<LinkRecord[]>([]);
  const [loadingLinks, setLoadingLinks] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      const savedUser = localStorage.getItem(USER_KEY);
      if (savedToken) setToken(savedToken);
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch {
      /* ignore */
    }
  }, []);

  const fetchLinks = useCallback(async () => {
    setLoadingLinks(true);
    try {
      const res = await apiClient.get("/api/links");
      const rawData = Array.isArray(res.data) ? res.data : res.data.content || [];
      const transformed = rawData.map(transformLink);
      setLinks(transformed);
    } catch (err) {
      console.warn("Could not fetch links from backend, fallbacking to local state", err);
    } finally {
      setLoadingLinks(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchLinks();
    } else {
      setLinks([]);
    }
  }, [token, fetchLinks]);

  const login = useCallback(async (email: string, password = "password123") => {
    try {
      const res = await apiClient.post("/api/auth/login", { email, password });
      const authData = res.data;
      const jwtToken = authData.token || authData.jwt || authData.accessToken;
      const userObj = {
        name: authData.name || authData.username || email.split("@")[0] || "User",
        email: authData.email || email,
        token: jwtToken,
      };

      if (jwtToken) {
        localStorage.setItem(TOKEN_KEY, jwtToken);
        setToken(jwtToken);
      }
      localStorage.setItem(USER_KEY, JSON.stringify(userObj));
      setUser(userObj);
    } catch (err) {
      console.warn("Backend auth/login failed, setting client session", err);
      const fallbackToken = "demo-jwt-token";
      const fallbackUser = { name: email.split("@")[0] || "User", email, token: fallbackToken };
      localStorage.setItem(TOKEN_KEY, fallbackToken);
      localStorage.setItem(USER_KEY, JSON.stringify(fallbackUser));
      setToken(fallbackToken);
      setUser(fallbackUser);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password = "password123") => {
    try {
      const res = await apiClient.post("/api/auth/register", { name, email, password });
      const authData = res.data;
      const jwtToken = authData.token || authData.jwt || authData.accessToken;
      const userObj = {
        name: authData.name || name,
        email: authData.email || email,
        token: jwtToken,
      };

      if (jwtToken) {
        localStorage.setItem(TOKEN_KEY, jwtToken);
        setToken(jwtToken);
      }
      localStorage.setItem(USER_KEY, JSON.stringify(userObj));
      setUser(userObj);
    } catch (err) {
      console.warn("Backend auth/register failed, setting client session", err);
      const fallbackToken = "demo-jwt-token";
      const fallbackUser = { name, email, token: fallbackToken };
      localStorage.setItem(TOKEN_KEY, fallbackToken);
      localStorage.setItem(USER_KEY, JSON.stringify(fallbackUser));
      setToken(fallbackToken);
      setUser(fallbackUser);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setLinks([]);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  const createLink = useCallback(
    async ({ original, alias, expiration }: { original: string; alias?: string; expiration?: string }): Promise<LinkRecord> => {
      const payload: any = {
        originalUrl: original,
        customAlias: alias?.trim() || undefined,
        expiration: expiration || "never",
      };

      try {
        const res = await apiClient.post("/api/links", payload);
        const newLink = transformLink(res.data);
        setLinks((prev) => [newLink, ...prev.filter((l) => l.id !== newLink.id)]);
        return newLink;
      } catch (err) {
        console.warn("Backend create link failed, creating locally", err);
        const fallbackSlug = alias?.trim() || Math.random().toString(36).substring(2, 8);
        const fallbackLink: LinkRecord = {
          id: `${Date.now()}`,
          slug: fallbackSlug,
          original,
          clicks: 0,
          createdAt: new Date().toISOString(),
          expiresAt: null,
        };
        setLinks((prev) => [fallbackLink, ...prev]);
        return fallbackLink;
      }
    },
    []
  );

  const deleteLink = useCallback(async (id: string) => {
    try {
      await apiClient.delete(`/api/links/${id}`);
    } catch (err) {
      console.warn(`Backend delete link ${id} failed`, err);
    } finally {
      setLinks((prev) => prev.filter((l) => l.id !== id));
    }
  }, []);

  const value = useMemo<Store>(
    () => ({
      user,
      token,
      login,
      register,
      logout,
      links,
      loadingLinks,
      fetchLinks,
      createLink,
      deleteLink,
    }),
    [user, token, login, register, logout, links, loadingLinks, fetchLinks, createLink, deleteLink]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within AppStoreProvider");
  return ctx;
}

