import { apiClient } from "@/lib/api/client";

function mapUser(u) {
  if (!u) return u;
  return {
    id: String(u.id ?? ""),
    name: u.name ?? `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim() || u.username || u.email,
    email: u.email ?? "",
    role: u.role ?? "citizen",
    nationalId: u.national_id ?? u.nationalId ?? "",
    createdAt: u.date_joined ?? u.created_at ?? new Date().toISOString(),
  };
}

export const userService = {
  async list() {
    const data = await apiClient.get("/api/users/");
    const items = Array.isArray(data) ? data : data.results ?? [];
    return items.map(mapUser).sort((a, b) => a.name.localeCompare(b.name));
  },

  async findByNationalId(nationalId) {
    const data = await apiClient.get(`/api/users/?national_id=${encodeURIComponent(nationalId)}`);
    const items = Array.isArray(data) ? data : data.results ?? [];
    return items[0] ? mapUser(items[0]) : null;
  },

  async setRole(userId, role) {
    return mapUser(await apiClient.patch(`/api/users/${userId}/`, { role }));
  },

  async remove(userId) {
    await apiClient.delete(`/api/users/${userId}/`);
  },
};
