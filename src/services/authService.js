import { apiClient } from "@/lib/api/client";
import { tokenStorage } from "@/lib/api/tokenStorage";

// Fetches the authenticated user's profile from the Django backend.
// Adjust this endpoint if your backend exposes a different path.
async function fetchMe() {
  // Try the canonical "me" endpoint first; fall back to /api/users/me/
  try {
    return await apiClient.get("/api/users/me/");
  } catch (err) {
    if (err.status === 404) return await apiClient.get("/api/auth/me/");
    throw err;
  }
}

export const authService = {
  async login({ email, password }) {
    // Django SimpleJWT typically uses `username`. We send both for compatibility.
    const data = await apiClient.post(
      "/api/token/",
      { username: email, email, password },
      { auth: false },
    );
    tokenStorage.setTokens({ access: data.access, refresh: data.refresh });
    const user = await fetchMe();
    tokenStorage.setUser(user);
    return { token: data.access, user };
  },

  async register(payload) {
    // Backend route assumed: POST /api/users/  (adjust to your endpoint)
    await apiClient.post(
      "/api/users/register/",
      {
        name: payload.name,
        email: payload.email,
        password: payload.password,
        national_id: payload.nationalId,
        role: payload.role,
      },
      { auth: false },
    );
    return await this.login({ email: payload.email, password: payload.password });
  },

  async getSession() {
    const access = tokenStorage.getAccess();
    if (!access) return null;
    let user = tokenStorage.getUser();
    if (!user) {
      try {
        user = await fetchMe();
        tokenStorage.setUser(user);
      } catch {
        tokenStorage.clear();
        return null;
      }
    }
    return { token: access, user };
  },

  logout() {
    tokenStorage.clear();
  },

  hasRole(session, roles) {
    if (!session) return false;
    const arr = Array.isArray(roles) ? roles : [roles];
    return arr.includes(session.user.role);
  },
};
