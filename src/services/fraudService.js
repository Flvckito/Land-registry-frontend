import { apiClient } from "@/lib/api/client";

export const fraudService = {
  async list() {
    const data = await apiClient.get("/api/fraud-logs/");
    return Array.isArray(data) ? data : data.results ?? [];
  },
};
