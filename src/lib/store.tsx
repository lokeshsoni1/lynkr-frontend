import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  SEED_LINKS,
  randomSlug,
  expiryFromOption,
  type LinkRecord,
} from "./mock-data";

type User = { name: string; email: string };

type Store = {
  user: User | null;
  login: (email: string) => void;
  register: (name: string, email: string) => void;
  logout: () => void;
  links: LinkRecord[];
  createLink: (input: {
    original: string;
    alias?: string;
    expiration?: string;
  }) => LinkRecord;
  deleteLink: (id: string) => void;
};

const StoreContext = createContext<Store | null>(null);

const USER_KEY = "lynkr.user";
const LINKS_KEY = "lynkr.links";

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [links, setLinks] = useState<LinkRecord[]>(SEED_LINKS);

  useEffect(() => {
    try {
      const u = localStorage.getItem(USER_KEY);
      if (u) setUser(JSON.parse(u));
      const l = localStorage.getItem(LINKS_KEY);
      if (l) setLinks(JSON.parse(l));
    } catch {
      /* ignore */
    }
  }, []);

  const persistLinks = useCallback((next: LinkRecord[]) => {
    setLinks(next);
    try {
      localStorage.setItem(LINKS_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const persistUser = useCallback((next: User | null) => {
    setUser(next);
    try {
      if (next) localStorage.setItem(USER_KEY, JSON.stringify(next));
      else localStorage.removeItem(USER_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<Store>(
    () => ({
      user,
      login: (email) =>
        persistUser({ name: email.split("@")[0] || "User", email }),
      register: (name, email) => persistUser({ name, email }),
      logout: () => persistUser(null),
      links,
      createLink: ({ original, alias, expiration = "never" }) => {
        const link: LinkRecord = {
          id: `${Date.now()}`,
          slug: alias?.trim() || randomSlug(),
          original,
          clicks: 0,
          createdAt: new Date().toISOString(),
          expiresAt: expiryFromOption(expiration),
        };
        persistLinks([link, ...links]);
        return link;
      },
      deleteLink: (id) => persistLinks(links.filter((l) => l.id !== id)),
    }),
    [user, links, persistLinks, persistUser],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within AppStoreProvider");
  return ctx;
}
