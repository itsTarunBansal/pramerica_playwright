// ─────────────────────────────────────────────────────────────
// Auth Service
// Current: static credentials (dev only)
// Future:  swap authenticateUser() body for AD/LDAP/OAuth call
// ─────────────────────────────────────────────────────────────

export interface AuthUser {
  username: string;
  role: "admin" | "user";
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

// TODO: Replace this function body with AD authentication call
export async function authenticateUser(
  username: string,
  password: string
): Promise<AuthResult> {
  await new Promise((r) => setTimeout(r, 600)); // simulate async

  if (username === "admin" && password === "admin123456") {
    return { success: true, user: { username: "admin", role: "admin" } };
  }
  return { success: false, error: "Invalid username or password." };
}

const SESSION_KEY = "tu_auth_user";

export function saveSession(user: AuthUser): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function getSession(): AuthUser | null {
  const raw = sessionStorage.getItem(SESSION_KEY);
  return raw ? (JSON.parse(raw) as AuthUser) : null;
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
